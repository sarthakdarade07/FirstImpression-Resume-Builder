package com.firstimpression.backend.templates.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateStructureDto {

	private String id;
	private String slug;
	private String structureJson;
	private String configJson;
}
