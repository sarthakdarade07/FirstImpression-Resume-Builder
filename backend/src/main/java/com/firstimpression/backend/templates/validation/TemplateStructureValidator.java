package com.firstimpression.backend.templates.validation;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.firstimpression.backend.Exception.ServiceException;

@Component
public class TemplateStructureValidator {

	private static final int MAX_DEPTH = 20;

	private static final Set<String> ALLOWED_NODE_TYPES = new HashSet<>(Arrays.asList(
			"page", "container", "row", "columns", "column", "header",
			"section", "text", "heading", "image", "list", "item",
			"divider", "spacer", "block"
	));

	private static final Set<String> ALLOWED_BLOCKS = new HashSet<>(Arrays.asList(
			"header", "summary", "experience", "education", "skills",
			"projects", "certifications", "languages", "custom"
	));

	private final ObjectMapper objectMapper = new ObjectMapper();

	public void validate(String structureJson) {
		if (structureJson == null || structureJson.trim().isEmpty()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template structureJson cannot be empty");
		}

		JsonNode rootNode;
		try {
			rootNode = objectMapper.readTree(structureJson);
		} catch (Exception e) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template structureJson is not valid JSON: " + e.getMessage());
		}

		if (!rootNode.isObject()) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Root node of structureJson must be a JSON object");
		}

		validateNode(rootNode, 1);
	}

	private void validateNode(JsonNode node, int currentDepth) {
		if (currentDepth > MAX_DEPTH) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Template structure exceeds maximum nesting depth of " + MAX_DEPTH);
		}

		if (!node.hasNonNull("type")) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Every node in structure must have a 'type' attribute");
		}

		String type = node.get("type").asText().toLowerCase();
		if (!ALLOWED_NODE_TYPES.contains(type)) {
			throw new ServiceException(HttpStatus.BAD_REQUEST, "Unsupported node type: '" + type + "'. Allowed types: " + ALLOWED_NODE_TYPES);
		}

		if ("block".equals(type) && node.hasNonNull("block")) {
			String blockName = node.get("block").asText().toLowerCase();
			if (!ALLOWED_BLOCKS.contains(blockName)) {
				throw new ServiceException(HttpStatus.BAD_REQUEST, "Unsupported block name: '" + blockName + "'. Allowed blocks: " + ALLOWED_BLOCKS);
			}
		}

		if (node.has("children")) {
			JsonNode children = node.get("children");
			if (!children.isArray()) {
				throw new ServiceException(HttpStatus.BAD_REQUEST, "Node 'children' property must be an array");
			}
			for (JsonNode child : children) {
				if (!child.isObject()) {
					throw new ServiceException(HttpStatus.BAD_REQUEST, "Child node must be a JSON object");
				}
				validateNode(child, currentDepth + 1);
			}
		}
	}
}
