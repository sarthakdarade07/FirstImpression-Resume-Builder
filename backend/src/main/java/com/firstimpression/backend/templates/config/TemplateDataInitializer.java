package com.firstimpression.backend.templates.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.firstimpression.backend.templates.entity.Template;
import com.firstimpression.backend.templates.repository.TemplateRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class TemplateDataInitializer implements CommandLineRunner {

	private final TemplateRepository templateRepository;

	@Override
	public void run(String... args) {
		log.info("Checking default resume templates initialization...");

		if (!templateRepository.existsBySlug("modern-sidebar")) {
			seedModernSidebarTemplate();
		}

		if (!templateRepository.existsBySlug("classic-single-column")) {
			seedClassicSingleColumnTemplate();
		}
	}

	private void seedModernSidebarTemplate() {
		log.info("Seeding modern-sidebar template...");

		String structureJson = """
		{
		  "type": "page",
		  "className": "resume-page",
		  "children": [
		    {
		      "type": "header",
		      "className": "resume-header",
		      "children": [
		        {
		          "type": "block",
		          "block": "header"
		        }
		      ]
		    },
		    {
		      "type": "columns",
		      "className": "resume-body-columns",
		      "children": [
		        {
		          "type": "column",
		          "className": "sidebar-column",
		          "children": [
		            {
		              "type": "section",
		              "className": "sidebar-section",
		              "children": [{ "type": "block", "block": "summary" }]
		            },
		            {
		              "type": "section",
		              "className": "sidebar-section",
		              "children": [{ "type": "block", "block": "skills" }]
		            },
		            {
		              "type": "section",
		              "className": "sidebar-section",
		              "children": [{ "type": "block", "block": "languages" }]
		            }
		          ]
		        },
		        {
		          "type": "column",
		          "className": "main-column",
		          "children": [
		            {
		              "type": "section",
		              "className": "main-section",
		              "children": [{ "type": "block", "block": "experience" }]
		            },
		            {
		              "type": "section",
		              "className": "main-section",
		              "children": [{ "type": "block", "block": "education" }]
		            },
		            {
		              "type": "section",
		              "className": "main-section",
		              "children": [{ "type": "block", "block": "projects" }]
		            },
		            {
		              "type": "section",
		              "className": "main-section",
		              "children": [{ "type": "block", "block": "certifications" }]
		            }
		          ]
		        }
		      ]
		    }
		  ]
		}
		""".trim();

		String cssText = """
		/* Modern Sidebar Template Styles */
		.template-modern-sidebar {
		  --primary: #1e293b;
		  --primary-light: #334155;
		  --accent: #2563eb;
		  --accent-light: #eff6ff;
		  --text-main: #0f172a;
		  --text-muted: #64748b;
		  --border-color: #e2e8f0;
		  --sidebar-bg: #f8fafc;
		  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
		  color: var(--text-main);
		  background-color: #ffffff;
		  line-height: 1.5;
		}

		.template-modern-sidebar .resume-page {
		  width: 210mm;
		  min-height: 297mm;
		  box-sizing: border-box;
		  padding: 0;
		  margin: 0 auto;
		  background: #ffffff;
		  display: flex;
		  flex-direction: column;
		}

		/* Header Styling */
		.template-modern-sidebar .resume-header {
		  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
		  color: #ffffff;
		  padding: 28px 36px;
		}

		.template-modern-sidebar .header-container {
		  display: flex;
		  align-items: center;
		  gap: 24px;
		}

		.template-modern-sidebar .header-photo {
		  width: 88px;
		  height: 88px;
		  border-radius: 16px;
		  object-fit: cover;
		  border: 3px solid rgba(255, 255, 255, 0.2);
		}

		.template-modern-sidebar .header-name {
		  font-size: 28px;
		  font-weight: 800;
		  letter-spacing: -0.5px;
		  color: #ffffff;
		  margin: 0;
		}

		.template-modern-sidebar .header-role {
		  font-size: 15px;
		  font-weight: 500;
		  color: #93c5fd;
		  margin-top: 4px;
		  margin-bottom: 12px;
		}

		.template-modern-sidebar .header-contacts {
		  display: flex;
		  flex-wrap: wrap;
		  gap: 16px;
		  font-size: 12px;
		  color: #cbd5e1;
		}

		.template-modern-sidebar .header-contact-item {
		  display: inline-flex;
		  align-items: center;
		  gap: 6px;
		}

		/* Two Column Grid */
		.template-modern-sidebar .resume-body-columns {
		  display: grid;
		  grid-template-columns: 34% 66%;
		  flex: 1;
		}

		.template-modern-sidebar .sidebar-column {
		  background-color: var(--sidebar-bg);
		  padding: 28px 24px;
		  border-right: 1px solid var(--border-color);
		  display: flex;
		  flex-direction: column;
		  gap: 22px;
		}

		.template-modern-sidebar .main-column {
		  padding: 28px 32px;
		  display: flex;
		  flex-direction: column;
		  gap: 24px;
		}

		/* Section Headings */
		.template-modern-sidebar .section-title {
		  font-size: 13px;
		  font-weight: 700;
		  text-transform: uppercase;
		  letter-spacing: 1px;
		  color: var(--accent);
		  margin-bottom: 12px;
		  display: flex;
		  align-items: center;
		  gap: 8px;
		  border-bottom: 2px solid var(--accent-light);
		  padding-bottom: 4px;
		}

		/* Skills Badges */
		.template-modern-sidebar .skills-list {
		  display: flex;
		  flex-wrap: wrap;
		  gap: 6px;
		}

		.template-modern-sidebar .skill-badge {
		  background: #ffffff;
		  border: 1px solid #cbd5e1;
		  color: #1e293b;
		  padding: 3px 9px;
		  border-radius: 6px;
		  font-size: 11px;
		  font-weight: 600;
		}

		/* Items (Experience & Education) */
		.template-modern-sidebar .timeline-item {
		  margin-bottom: 16px;
		}

		.template-modern-sidebar .item-header {
		  display: flex;
		  justify-content: space-between;
		  align-items: baseline;
		  margin-bottom: 2px;
		}

		.template-modern-sidebar .item-title {
		  font-size: 14px;
		  font-weight: 700;
		  color: var(--primary);
		}

		.template-modern-sidebar .item-subtitle {
		  font-size: 13px;
		  font-weight: 600;
		  color: var(--accent);
		}

		.template-modern-sidebar .item-date {
		  font-size: 11px;
		  color: var(--text-muted);
		  font-weight: 500;
		}

		.template-modern-sidebar .item-description {
		  font-size: 12px;
		  color: #334155;
		  margin-top: 4px;
		}

		.template-modern-sidebar .bullet-list {
		  margin: 6px 0 0 16px;
		  padding: 0;
		  font-size: 12px;
		  color: #334155;
		}

		.template-modern-sidebar .bullet-list li {
		  margin-bottom: 4px;
		}
		""".trim();

		String configJson = """
		{
		  "pageSize": "A4",
		  "orientation": "portrait",
		  "margins": { "top": "0mm", "right": "0mm", "bottom": "0mm", "left": "0mm" }
		}
		""".trim();

		Template template = Template.builder()
				.name("Modern Sidebar")
				.slug("modern-sidebar")
				.description("Contemporary two-column layout featuring an executive dark header, left sidebar for skills and overview, and spacious right column for professional experience.")
				.thumbnailUrl("https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60")
				.category("Modern")
				.structureJson(structureJson)
				.cssText(cssText)
				.configJson(configJson)
				.version(1)
				.status(true)
				.build();

		templateRepository.save(template);
		log.info("Saved modern-sidebar template.");
	}

	private void seedClassicSingleColumnTemplate() {
		log.info("Seeding classic-single-column template...");

		String structureJson = """
		{
		  "type": "page",
		  "className": "resume-page",
		  "children": [
		    {
		      "type": "header",
		      "className": "resume-header-classic",
		      "children": [
		        {
		          "type": "block",
		          "block": "header"
		        }
		      ]
		    },
		    {
		      "type": "container",
		      "className": "resume-content-classic",
		      "children": [
		        {
		          "type": "section",
		          "className": "classic-section",
		          "children": [{ "type": "block", "block": "summary" }]
		        },
		        {
		          "type": "divider",
		          "className": "classic-divider"
		        },
		        {
		          "type": "section",
		          "className": "classic-section",
		          "children": [{ "type": "block", "block": "experience" }]
		        },
		        {
		          "type": "divider",
		          "className": "classic-divider"
		        },
		        {
		          "type": "section",
		          "className": "classic-section",
		          "children": [{ "type": "block", "block": "education" }]
		        },
		        {
		          "type": "divider",
		          "className": "classic-divider"
		        },
		        {
		          "type": "section",
		          "className": "classic-section",
		          "children": [{ "type": "block", "block": "projects" }]
		        },
		        {
		          "type": "divider",
		          "className": "classic-divider"
		        },
		        {
		          "type": "section",
		          "className": "classic-section",
		          "children": [{ "type": "block", "block": "skills" }]
		        },
		        {
		          "type": "divider",
		          "className": "classic-divider"
		        },
		        {
		          "type": "section",
		          "className": "classic-section",
		          "children": [{ "type": "block", "block": "certifications" }]
		        }
		      ]
		    }
		  ]
		}
		""".trim();

		String cssText = """
		/* Classic Single Column Template Styles */
		.template-classic-single-column {
		  --primary: #111827;
		  --secondary: #374151;
		  --accent: #4b5563;
		  --border-color: #111827;
		  font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
		  color: var(--primary);
		  background-color: #ffffff;
		  line-height: 1.45;
		}

		.template-classic-single-column .resume-page {
		  width: 210mm;
		  min-height: 297mm;
		  box-sizing: border-box;
		  padding: 18mm 20mm;
		  margin: 0 auto;
		  background: #ffffff;
		}

		/* Centered Traditional Header */
		.template-classic-single-column .resume-header-classic {
		  text-align: center;
		  margin-bottom: 20px;
		}

		.template-classic-single-column .header-name {
		  font-size: 26px;
		  font-weight: 700;
		  letter-spacing: 1.5px;
		  text-transform: uppercase;
		  color: var(--primary);
		  margin: 0 0 4px 0;
		}

		.template-classic-single-column .header-role {
		  font-size: 14px;
		  font-style: italic;
		  color: var(--secondary);
		  margin-bottom: 8px;
		}

		.template-classic-single-column .header-contacts {
		  display: flex;
		  justify-content: center;
		  flex-wrap: wrap;
		  gap: 12px;
		  font-size: 12px;
		  color: #4b5563;
		}

		.template-classic-single-column .header-contact-item {
		  display: inline-flex;
		  align-items: center;
		  gap: 4px;
		}

		.template-classic-single-column .header-photo {
		  display: none; /* Classic format typically omits photo for ATS elegance */
		}

		/* Section Headings with Full Horizontal Rule */
		.template-classic-single-column .section-title {
		  font-size: 13px;
		  font-weight: 700;
		  text-transform: uppercase;
		  letter-spacing: 2px;
		  color: var(--primary);
		  border-bottom: 1.5px solid var(--border-color);
		  padding-bottom: 3px;
		  margin-top: 14px;
		  margin-bottom: 10px;
		}

		.template-classic-single-column .classic-divider {
		  display: none; /* Handled by section title border */
		}

		/* Items Styling */
		.template-classic-single-column .timeline-item {
		  margin-bottom: 12px;
		}

		.template-classic-single-column .item-header {
		  display: flex;
		  justify-content: space-between;
		  align-items: baseline;
		}

		.template-classic-single-column .item-title {
		  font-size: 13.5px;
		  font-weight: 700;
		}

		.template-classic-single-column .item-subtitle {
		  font-size: 13px;
		  font-style: italic;
		  color: var(--secondary);
		}

		.template-classic-single-column .item-date {
		  font-size: 12px;
		  font-style: italic;
		  color: #6b7280;
		}

		.template-classic-single-column .item-description {
		  font-size: 12px;
		  color: #374151;
		  margin-top: 3px;
		}

		.template-classic-single-column .bullet-list {
		  margin: 4px 0 0 18px;
		  padding: 0;
		  font-size: 12px;
		}

		.template-classic-single-column .bullet-list li {
		  margin-bottom: 3px;
		}

		/* Skills inline presentation */
		.template-classic-single-column .skills-list {
		  display: flex;
		  flex-wrap: wrap;
		  gap: 8px;
		  font-size: 12px;
		}

		.template-classic-single-column .skill-badge {
		  background: none;
		  border: none;
		  padding: 0;
		  font-weight: 500;
		}

		.template-classic-single-column .skill-badge::after {
		  content: " •";
		  color: #9ca3af;
		  margin-left: 8px;
		}

		.template-classic-single-column .skill-badge:last-child::after {
		  content: "";
		}
		""".trim();

		String configJson = """
		{
		  "pageSize": "A4",
		  "orientation": "portrait",
		  "margins": { "top": "18mm", "right": "20mm", "bottom": "18mm", "left": "20mm" }
		}
		""".trim();

		Template template = Template.builder()
				.name("Classic Single Column")
				.slug("classic-single-column")
				.description("Traditional single-column executive resume with refined serif typography, centered contact header, and clean horizontal section dividers.")
				.thumbnailUrl("https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format&fit=crop&q=60")
				.category("Classic")
				.structureJson(structureJson)
				.cssText(cssText)
				.configJson(configJson)
				.version(1)
				.status(true)
				.build();

		templateRepository.save(template);
		log.info("Saved classic-single-column template.");
	}
}
