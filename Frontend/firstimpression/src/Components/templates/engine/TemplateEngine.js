import { Template } from '../models/Template';
import { TemplateNode } from '../models/TemplateNode';

/**
 * TemplateEngine
 * Core orchestrator for parsing, validating, and normalizing template trees.
 */
export class TemplateEngine {
  /**
   * Parses and normalizes a template structure from any source (object, JSON string, or Template instance)
   * @param {Object|string|Template} templateSource
   * @returns {Template}
   */
  static parse(templateSource) {
    if (!templateSource) {
      throw new Error('Template source cannot be null or undefined');
    }

    if (templateSource instanceof Template) {
      return templateSource;
    }

    let parsed = templateSource;
    if (typeof templateSource === 'string') {
      try {
        parsed = JSON.parse(templateSource);
      } catch (e) {
        throw new Error(`Invalid template JSON: ${e.message}`);
      }
    }

    return Template.fromJSON(parsed);
  }

  /**
   * Traverses a node tree and executes a visitor callback
   * @param {TemplateNode} rootNode
   * @param {Function} callback - fn(node, parent, depth)
   */
  static traverse(rootNode, callback, parent = null, depth = 0) {
    if (!rootNode) return;

    callback(rootNode, parent, depth);

    if (Array.isArray(rootNode.children)) {
      rootNode.children.forEach(child => {
        this.traverse(child, callback, rootNode, depth + 1);
      });
    }
  }

  /**
   * Validates that the template tree has a valid page root and reasonable structure
   * @param {TemplateNode} rootNode
   * @returns {{isValid: boolean, errors: Array<string>}}
   */
  static validateStructure(rootNode) {
    const errors = [];

    if (!rootNode) {
      errors.push('Root node is missing');
      return { isValid: false, errors };
    }

    if (rootNode.type !== 'page') {
      errors.push(`Root node must be of type 'page', but got '${rootNode.type}'`);
    }

    const seenIds = new Set();
    this.traverse(rootNode, (node) => {
      if (!node.id) {
        errors.push(`Found node without an 'id' (type: ${node.type})`);
      } else if (seenIds.has(node.id)) {
        errors.push(`Duplicate node id detected: '${node.id}'`);
      } else {
        seenIds.add(node.id);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default TemplateEngine;
