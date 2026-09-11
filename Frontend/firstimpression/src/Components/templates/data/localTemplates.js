/**
 * Local fallback templates providing immediate offline rendering and instant previews.
 */
export const modernSidebarTemplate = {
  id: "tpl-modern-sidebar",
  slug: "modern-sidebar",
  name: "Modern Sidebar",
  description: "A contemporary two-column layout featuring an elegant dark sidebar and structured main timeline.",
  thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=560&fit=crop",
  category: "Modern",
  layoutType: "two_column",
  isActive: true,
  isPremium: false,
  structure: {
    id: "page-root",
    type: "page",
    children: [
      {
        id: "main-columns",
        type: "columns",
        classNames: "modern-columns-layout",
        children: [
          {
            id: "sidebar-column",
            type: "column",
            classNames: "modern-sidebar",
            config: { width: "32%" },
            children: [
              {
                id: "sidebar-header",
                type: "block",
                classNames: "sidebar-header-block",
                config: { blockType: "header", showPhoto: true }
              },
              {
                id: "sidebar-skills",
                type: "block",
                classNames: "sidebar-skills-block",
                config: { blockType: "skills", title: "Skills & Tools" }
              },
              {
                id: "sidebar-education",
                type: "block",
                classNames: "sidebar-education-block",
                config: { blockType: "education", title: "Education" }
              },
              {
                id: "sidebar-languages",
                type: "block",
                classNames: "sidebar-languages-block",
                config: { blockType: "languages", title: "Languages" }
              }
            ]
          },
          {
            id: "content-column",
            type: "column",
            classNames: "modern-main-content",
            config: { width: "68%" },
            children: [
              {
                id: "main-summary",
                type: "block",
                classNames: "main-summary-block",
                config: { blockType: "summary", title: "Profile Summary" }
              },
              {
                id: "main-experience",
                type: "block",
                classNames: "main-experience-block",
                config: { blockType: "experience", title: "Professional Experience" }
              },
              {
                id: "main-projects",
                type: "block",
                classNames: "main-projects-block",
                config: { blockType: "projects", title: "Key Projects" }
              },
              {
                id: "main-certifications",
                type: "block",
                classNames: "main-certifications-block",
                config: { blockType: "certifications", title: "Certifications" }
              }
            ]
          }
        ]
      }
    ]
  },
  css: `
.template-modern-sidebar {
  background-color: #ffffff;
  color: #1e293b;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.template-modern-sidebar .modern-columns-layout {
  min-height: 297mm;
  display: flex;
}

.template-modern-sidebar .modern-sidebar {
  background-color: #0f172a;
  color: #f8fafc;
  padding: 32px 24px;
  box-sizing: border-box;
}

.template-modern-sidebar .modern-sidebar .block-section-title {
  color: #38bdf8;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  border-bottom: 1px solid #334155;
  padding-bottom: 6px;
  margin-top: 24px;
  margin-bottom: 12px;
}

.template-modern-sidebar .candidate-avatar {
  text-align: center;
  margin-bottom: 16px;
}

.template-modern-sidebar .avatar-img {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 3px solid #38bdf8;
  object-fit: cover;
  display: inline-block;
}

.template-modern-sidebar .modern-sidebar .candidate-name {
  font-size: 22px;
  color: #ffffff;
  font-weight: 800;
  text-align: center;
}

.template-modern-sidebar .modern-sidebar .candidate-title {
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 16px;
}

.template-modern-sidebar .modern-sidebar .candidate-contact {
  flex-direction: column;
  gap: 8px;
  font-size: 11.5px;
  color: #cbd5e1;
}

.template-modern-sidebar .modern-sidebar .candidate-contact a {
  color: #38bdf8;
}

.template-modern-sidebar .modern-sidebar .skill-tag {
  background-color: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
  font-size: 11px;
}

.template-modern-sidebar .modern-sidebar .timeline-title {
  color: #f1f5f9;
  font-size: 12.5px;
}

.template-modern-sidebar .modern-sidebar .timeline-subtitle {
  color: #94a3b8;
  font-size: 11.5px;
}

.template-modern-sidebar .modern-sidebar .timeline-date,
.template-modern-sidebar .modern-sidebar .timeline-location {
  color: #64748b;
  font-size: 11px;
}

.template-modern-sidebar .modern-sidebar .language-item {
  font-size: 11.5px;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.template-modern-sidebar .modern-sidebar .language-level {
  color: #94a3b8;
}

.template-modern-sidebar .modern-main-content {
  padding: 36px 32px;
  box-sizing: border-box;
}

.template-modern-sidebar .modern-main-content .block-section-title {
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 6px;
  margin-top: 20px;
  margin-bottom: 14px;
}

.template-modern-sidebar .modern-main-content .block-section-title:first-child {
  margin-top: 0;
}

.template-modern-sidebar .summary-text {
  font-size: 12.5px;
  line-height: 1.6;
  color: #334155;
}

.template-modern-sidebar .timeline-item {
  margin-bottom: 16px;
}

.template-modern-sidebar .timeline-title {
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 600;
}

.template-modern-sidebar .timeline-title a {
  color: #0284c7;
  text-decoration: none;
}

.template-modern-sidebar .timeline-subtitle {
  color: #0284c7;
  font-weight: 500;
}

.template-modern-sidebar .timeline-date {
  color: #64748b;
  font-size: 11.5px;
}

.template-modern-sidebar .timeline-description {
  font-size: 12px;
  color: #475569;
  margin-top: 4px;
  line-height: 1.5;
}

.template-modern-sidebar .timeline-highlights li {
  font-size: 12px;
  color: #334155;
}
`
};

export const classicSingleColumnTemplate = {
  id: "tpl-classic-single-column",
  slug: "classic-single-column",
  name: "Classic Single-Column",
  description: "Traditional, elegant single-column resume design favored by universities, finance, and enterprise recruiters.",
  thumbnailUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=560&fit=crop",
  category: "Classic",
  layoutType: "single_column",
  isActive: true,
  isPremium: false,
  structure: {
    id: "page-root",
    type: "page",
    children: [
      {
        id: "classic-container",
        type: "container",
        classNames: "classic-body",
        children: [
          {
            id: "classic-header",
            type: "block",
            classNames: "classic-header-block",
            config: { blockType: "header", showPhoto: false }
          },
          {
            id: "header-divider",
            type: "divider",
            classNames: "classic-divider-heavy"
          },
          {
            id: "classic-summary",
            type: "block",
            classNames: "classic-summary-block",
            config: { blockType: "summary", title: "Summary of Qualifications" }
          },
          {
            id: "summary-divider",
            type: "divider"
          },
          {
            id: "classic-experience",
            type: "block",
            classNames: "classic-experience-block",
            config: { blockType: "experience", title: "Professional Experience" }
          },
          {
            id: "experience-divider",
            type: "divider"
          },
          {
            id: "classic-education",
            type: "block",
            classNames: "classic-education-block",
            config: { blockType: "education", title: "Education" }
          },
          {
            id: "education-divider",
            type: "divider"
          },
          {
            id: "classic-skills",
            type: "block",
            classNames: "classic-skills-block",
            config: { blockType: "skills", title: "Technical Skills" }
          },
          {
            id: "skills-divider",
            type: "divider"
          },
          {
            id: "classic-projects",
            type: "block",
            classNames: "classic-projects-block",
            config: { blockType: "projects", title: "Notable Projects" }
          }
        ]
      }
    ]
  },
  css: `
.template-classic-single-column {
  background-color: #ffffff;
  color: #111827;
  font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
  padding: 40px 48px;
  box-sizing: border-box;
}

.template-classic-single-column .classic-body {
  width: 100%;
}

.template-classic-single-column .block-header {
  text-align: center;
  align-items: center;
  margin-bottom: 8px;
}

.template-classic-single-column .candidate-name {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.template-classic-single-column .candidate-title {
  font-size: 13.5px;
  font-style: italic;
  color: #4b5563;
  margin-bottom: 6px;
}

.template-classic-single-column .candidate-contact {
  justify-content: center;
  gap: 8px;
  font-size: 11.5px;
  color: #374151;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.template-classic-single-column .contact-item:not(:last-child)::after {
  content: "•";
  margin-left: 8px;
  color: #9ca3af;
}

.template-classic-single-column .contact-item a {
  color: #111827;
  text-decoration: none;
}

.template-classic-single-column .contact-item a:hover {
  text-decoration: underline;
}

.template-classic-single-column .classic-divider-heavy {
  border-top: 2px solid #111827;
  margin: 10px 0 14px 0;
}

.template-classic-single-column .resume-divider {
  border-top: 1px solid #d1d5db;
  margin: 12px 0 14px 0;
}

.template-classic-single-column .block-section-title {
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #111827;
  border-bottom: 1px solid #111827;
  padding-bottom: 3px;
  margin-bottom: 10px;
  margin-top: 4px;
}

.template-classic-single-column .summary-text {
  font-size: 12px;
  line-height: 1.55;
  color: #374151;
  text-align: justify;
}

.template-classic-single-column .timeline-item {
  margin-bottom: 12px;
}

.template-classic-single-column .timeline-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.template-classic-single-column .timeline-subtitle {
  font-size: 12.5px;
  font-style: italic;
  color: #374151;
}

.template-classic-single-column .timeline-date {
  font-size: 11.5px;
  font-weight: 600;
  color: #374151;
}

.template-classic-single-column .timeline-location {
  font-size: 11.5px;
  font-style: italic;
  color: #4b5563;
}

.template-classic-single-column .timeline-description {
  font-size: 12px;
  color: #374151;
  margin-top: 3px;
}

.template-classic-single-column .timeline-highlights li {
  font-size: 12px;
  color: #374151;
  margin-bottom: 2px;
  line-height: 1.45;
}

.template-classic-single-column .skill-tag {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 2px;
  padding: 1px 6px;
  font-size: 11px;
  color: #374151;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
`
};

export const fallbackTemplates = [
  modernSidebarTemplate,
  classicSingleColumnTemplate
];

export default fallbackTemplates;
