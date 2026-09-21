/**
 * Local fallback templates providing immediate offline rendering and instant previews.
 * Stored as pure HTML code with Handlebars-style data tokens + scoped CSS.
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
  htmlCode: `
<div class="resume-page template-modern-sidebar">
  <div class="modern-columns-layout">
    <!-- Left Dark Sidebar -->
    <aside class="modern-sidebar">
      <div class="sidebar-header-block">
        {{#if personal.photoUrl}}
          <div class="candidate-avatar">
            <img src="{{personal.photoUrl}}" alt="{{personal.name}}" class="avatar-img" />
          </div>
        {{/if}}
        <h1 class="candidate-name">{{personal.name}}</h1>
        {{#if personal.title}}
          <div class="candidate-title">{{personal.title}}</div>
        {{/if}}
        <div class="candidate-contact">
          {{#if personal.email}}
            <span class="contact-item">
              <a href="mailto:{{personal.email}}">{{personal.email}}</a>
            </span>
          {{/if}}
          {{#if personal.phone}}
            <span class="contact-item">
              <a href="tel:{{personal.phone}}">{{personal.phone}}</a>
            </span>
          {{/if}}
          {{#if personal.location}}
            <span class="contact-item">{{personal.location}}</span>
          {{/if}}
          {{#if personal.linkedin}}
            <span class="contact-item">
              <a href="{{personal.linkedin}}" target="_blank" rel="noopener noreferrer">{{personal.linkedin}}</a>
            </span>
          {{/if}}
          {{#if personal.github}}
            <span class="contact-item">
              <a href="{{personal.github}}" target="_blank" rel="noopener noreferrer">{{personal.github}}</a>
            </span>
          {{/if}}
          {{#if personal.website}}
            <span class="contact-item">
              <a href="{{personal.website}}" target="_blank" rel="noopener noreferrer">{{personal.website}}</a>
            </span>
          {{/if}}
        </div>
      </div>

      {{#if skills.length}}
        <div class="sidebar-skills-block">
          <h2 class="block-section-title">Skills & Tools</h2>
          <div class="skills-grouped">
            {{#each skills}}
              <div class="skill-group">
                {{#if category}}<div class="skill-group-name">{{category}}</div>{{/if}}
                <ul class="skills-list">
                  {{#each items}}
                    <li class="skill-badge">{{this}}</li>
                  {{/each}}
                </ul>
              </div>
            {{/each}}
          </div>
        </div>
      {{/if}}

      {{#if education.length}}
        <div class="sidebar-education-block">
          <h2 class="block-section-title">Education</h2>
          {{#each education}}
            <div class="timeline-item">
              <div class="timeline-title">{{degree}} {{#if fieldOfStudy}}in {{fieldOfStudy}}{{/if}}</div>
              <div class="timeline-subtitle">{{institution}}</div>
              <div class="timeline-meta">{{startDate}} – {{endDate}} {{#if location}}| {{location}}{{/if}}</div>
              {{#if gpa}}<div class="education-gpa">GPA: {{gpa}}</div>{{/if}}
            </div>
          {{/each}}
        </div>
      {{/if}}

      {{#if languages.length}}
        <div class="sidebar-languages-block">
          <h2 class="block-section-title">Languages</h2>
          <ul class="languages-list">
            {{#each languages}}
              <li class="language-item">{{name}} {{#if level}}({{level}}){{/if}}</li>
            {{/each}}
          </ul>
        </div>
      {{/if}}
    </aside>

    <!-- Right Content Area -->
    <main class="modern-main-content">
      {{#if summary}}
        <section class="main-summary-block">
          <h2 class="block-section-title">Profile Summary</h2>
          <p class="summary-text">{{summary}}</p>
        </section>
      {{/if}}

      {{#if experience.length}}
        <section class="main-experience-block">
          <h2 class="block-section-title">Professional Experience</h2>
          {{#each experience}}
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="timeline-title">{{role}}</span>
                  {{#if company}}<span class="timeline-subtitle"> • {{company}}</span>{{/if}}
                </div>
                <div class="timeline-meta">
                  <span class="timeline-date">{{startDate}} – {{endDate}}</span>
                  {{#if location}}<span class="timeline-location"> | {{location}}</span>{{/if}}
                </div>
              </div>
              {{#if description}}
                <p class="timeline-description">{{description}}</p>
              {{/if}}
              {{#if highlights.length}}
                <ul class="timeline-highlights">
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              {{/if}}
            </div>
          {{/each}}
        </section>
      {{/if}}

      {{#if projects.length}}
        <section class="main-projects-block">
          <h2 class="block-section-title">Key Projects</h2>
          {{#each projects}}
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="timeline-title">
                    {{#if link}}
                      <a href="{{link}}" target="_blank" rel="noopener noreferrer" class="project-link">{{name}}</a>
                    {{else}}
                      {{name}}
                    {{/if}}
                  </span>
                  {{#if technologies.length}}
                    <span class="timeline-subtitle"> | {{#each technologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</span>
                  {{/if}}
                </div>
              </div>
              {{#if description}}
                <p class="timeline-description">{{description}}</p>
              {{/if}}
              {{#if highlights.length}}
                <ul class="timeline-highlights">
                  {{#each highlights}}
                    <li>{{this}}</li>
                  {{/each}}
                </ul>
              {{/if}}
            </div>
          {{/each}}
        </section>
      {{/if}}

      {{#if certifications.length}}
        <section class="main-certifications-block">
          <h2 class="block-section-title">Certifications</h2>
          {{#each certifications}}
            <div class="timeline-item">
              <div class="timeline-header">
                <span class="timeline-title">
                  {{#if url}}
                    <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="cert-link">{{name}}</a>
                  {{else}}
                    {{name}}
                  {{/if}}
                </span>
                {{#if issuer}}<span class="timeline-subtitle"> • {{issuer}}</span>{{/if}}
                {{#if date}}<span class="timeline-date"> ({{date}})</span>{{/if}}
              </div>
            </div>
          {{/each}}
        </section>
      {{/if}}
    </main>
  </div>
</div>
`,
  cssText: `
.template-modern-sidebar.resume-page,
.template-modern-sidebar .resume-page {
  background-color: #ffffff;
  color: #1e293b;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
}

.template-modern-sidebar .modern-columns-layout {
  min-height: 297mm;
  display: flex;
}

.template-modern-sidebar .modern-sidebar {
  width: 32%;
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
  margin: 0 0 4px 0;
}

.template-modern-sidebar .modern-sidebar .candidate-title {
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  margin-bottom: 16px;
}

.template-modern-sidebar .modern-sidebar .candidate-contact {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 11.5px;
  color: #cbd5e1;
}

.template-modern-sidebar .modern-sidebar .contact-item a {
  color: #cbd5e1;
  text-decoration: none;
  word-break: break-all;
}

.template-modern-sidebar .modern-sidebar .contact-item a:hover {
  color: #38bdf8;
  text-decoration: underline;
}

.template-modern-sidebar .skill-group {
  margin-bottom: 12px;
}

.template-modern-sidebar .skill-group-name {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.template-modern-sidebar .skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.template-modern-sidebar .skill-badge {
  background-color: #1e293b;
  color: #e2e8f0;
  font-size: 10.5px;
  padding: 2px 8px;
  border-radius: 4px;
}

.template-modern-sidebar .languages-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 11.5px;
  color: #cbd5e1;
}

.template-modern-sidebar .languages-list li {
  margin-bottom: 4px;
}

.template-modern-sidebar .modern-main-content {
  width: 68%;
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
  margin: 0 0 16px 0;
}

.template-modern-sidebar .timeline-item {
  margin-bottom: 16px;
  page-break-inside: avoid;
}

.template-modern-sidebar .timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
}

.template-modern-sidebar .timeline-title {
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 600;
}

.template-modern-sidebar .timeline-title a,
.template-modern-sidebar .project-link,
.template-modern-sidebar .cert-link {
  color: #0284c7;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  cursor: pointer;
  transition: color 0.15s ease;
}

.template-modern-sidebar .timeline-title a:hover,
.template-modern-sidebar .project-link:hover,
.template-modern-sidebar .cert-link:hover {
  color: #0369a1;
}

.template-modern-sidebar .timeline-subtitle {
  color: #0284c7;
  font-weight: 500;
}

.template-modern-sidebar .timeline-meta {
  color: #64748b;
  font-size: 11.5px;
}

.template-modern-sidebar .timeline-description {
  font-size: 12px;
  color: #475569;
  margin: 4px 0 0 0;
  line-height: 1.5;
}

.template-modern-sidebar .timeline-highlights {
  margin: 6px 0 0 0;
  padding-left: 18px;
}

.template-modern-sidebar .timeline-highlights li {
  font-size: 12px;
  color: #334155;
  margin-bottom: 3px;
  line-height: 1.45;
}

@media print {
  .template-modern-sidebar.resume-page {
    width: 210mm !important;
  }
  .template-modern-sidebar .timeline-item {
    page-break-inside: avoid;
  }
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
  htmlCode: `
<div class="resume-page template-classic-single-column">
  <div class="classic-body">
    <!-- Header -->
    <header class="classic-header-block">
      <h1 class="candidate-name">{{personal.name}}</h1>
      {{#if personal.title}}<div class="candidate-title">{{personal.title}}</div>{{/if}}
      <div class="candidate-contact">
        {{#if personal.email}}<span class="contact-item"><a href="mailto:{{personal.email}}">{{personal.email}}</a></span>{{/if}}
        {{#if personal.phone}}<span class="contact-item"><a href="tel:{{personal.phone}}">{{personal.phone}}</a></span>{{/if}}
        {{#if personal.location}}<span class="contact-item">{{personal.location}}</span>{{/if}}
        {{#if personal.linkedin}}<span class="contact-item"><a href="{{personal.linkedin}}" target="_blank" rel="noopener noreferrer">{{personal.linkedin}}</a></span>{{/if}}
        {{#if personal.github}}<span class="contact-item"><a href="{{personal.github}}" target="_blank" rel="noopener noreferrer">{{personal.github}}</a></span>{{/if}}
        {{#if personal.website}}<span class="contact-item"><a href="{{personal.website}}" target="_blank" rel="noopener noreferrer">{{personal.website}}</a></span>{{/if}}
      </div>
    </header>

    <hr class="classic-divider-heavy" />

    {{#if summary}}
      <section class="classic-summary-block">
        <h2 class="block-section-title">Summary of Qualifications</h2>
        <p class="summary-text">{{summary}}</p>
      </section>
      <hr class="resume-divider" />
    {{/if}}

    {{#if experience.length}}
      <section class="classic-experience-block">
        <h2 class="block-section-title">Professional Experience</h2>
        {{#each experience}}
          <div class="timeline-item">
            <div class="timeline-header">
              <span class="timeline-title">{{role}}</span>
              {{#if company}}<span class="timeline-subtitle"> — {{company}}</span>{{/if}}
              <span class="timeline-meta">{{startDate}} – {{endDate}} {{#if location}}| {{location}}{{/if}}</span>
            </div>
            {{#if description}}<p class="timeline-description">{{description}}</p>{{/if}}
            {{#if highlights.length}}
              <ul class="timeline-highlights">
                {{#each highlights}}
                  <li>{{this}}</li>
                {{/each}}
              </ul>
            {{/if}}
          </div>
        {{/each}}
      </section>
      <hr class="resume-divider" />
    {{/if}}

    {{#if education.length}}
      <section class="classic-education-block">
        <h2 class="block-section-title">Education</h2>
        {{#each education}}
          <div class="timeline-item">
            <div class="timeline-header">
              <span class="timeline-title">{{degree}} {{#if fieldOfStudy}}in {{fieldOfStudy}}{{/if}}</span>
              {{#if institution}}<span class="timeline-subtitle"> — {{institution}}</span>{{/if}}
              <span class="timeline-meta">{{startDate}} – {{endDate}} {{#if location}}| {{location}}{{/if}}</span>
            </div>
            {{#if gpa}}<div class="education-gpa">GPA: {{gpa}}</div>{{/if}}
          </div>
        {{/each}}
      </section>
      <hr class="resume-divider" />
    {{/if}}

    {{#if skills.length}}
      <section class="classic-skills-block">
        <h2 class="block-section-title">Technical Skills</h2>
        <div class="skills-grouped">
          {{#each skills}}
            <div class="skill-group">
              {{#if category}}<strong>{{category}}: </strong>{{/if}}
              {{#each items}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
            </div>
          {{/each}}
        </div>
      </section>
      <hr class="resume-divider" />
    {{/if}}

    {{#if projects.length}}
      <section class="classic-projects-block">
        <h2 class="block-section-title">Notable Projects</h2>
        {{#each projects}}
          <div class="timeline-item">
            <div class="timeline-header">
              <span class="timeline-title">
                {{#if link}}
                  <a href="{{link}}" target="_blank" rel="noopener noreferrer" class="project-link">{{name}}</a>
                {{else}}
                  {{name}}
                {{/if}}
              </span>
              {{#if technologies.length}}
                <span class="timeline-subtitle"> | {{#each technologies}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}</span>
              {{/if}}
            </div>
            {{#if description}}<p class="timeline-description">{{description}}</p>{{/if}}
            {{#if highlights.length}}
              <ul class="timeline-highlights">
                {{#each highlights}}<li>{{this}}</li>{{/each}}
              </ul>
            {{/if}}
          </div>
        {{/each}}
      </section>
    {{/if}}
  </div>
</div>
`,
  cssText: `
.template-classic-single-column.resume-page,
.template-classic-single-column .resume-page {
  background-color: #ffffff;
  color: #111827;
  font-family: 'Georgia', 'Cambria', 'Times New Roman', serif;
  width: 210mm;
  min-height: 297mm;
  padding: 40px 48px;
  box-sizing: border-box;
  margin: 0 auto;
}

.template-classic-single-column .classic-body {
  width: 100%;
}

.template-classic-single-column .classic-header-block {
  text-align: center;
  margin-bottom: 8px;
}

.template-classic-single-column .candidate-name {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin: 0 0 4px 0;
}

.template-classic-single-column .candidate-title {
  font-size: 13.5px;
  font-style: italic;
  color: #4b5563;
  margin-bottom: 6px;
}

.template-classic-single-column .candidate-contact {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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
  cursor: pointer;
}

.template-classic-single-column .contact-item a:hover {
  text-decoration: underline;
  color: #1d4ed8;
}

.template-classic-single-column .classic-divider-heavy {
  border: none;
  border-top: 2px solid #111827;
  margin: 10px 0 14px 0;
}

.template-classic-single-column .resume-divider {
  border: none;
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
  margin: 0;
}

.template-classic-single-column .timeline-item {
  margin-bottom: 12px;
  page-break-inside: avoid;
}

.template-classic-single-column .timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
}

.template-classic-single-column .timeline-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.template-classic-single-column .timeline-title a,
.template-classic-single-column .project-link,
.template-classic-single-column .cert-link {
  color: #1d4ed8;
  text-decoration: underline;
  cursor: pointer;
}

.template-classic-single-column .timeline-subtitle {
  font-size: 12.5px;
  font-style: italic;
  color: #374151;
}

.template-classic-single-column .timeline-meta {
  font-size: 11.5px;
  font-weight: 600;
  color: #374151;
}

.template-classic-single-column .timeline-description {
  font-size: 12px;
  color: #374151;
  margin: 3px 0 0 0;
}

.template-classic-single-column .timeline-highlights {
  margin: 4px 0 0 0;
  padding-left: 18px;
}

.template-classic-single-column .timeline-highlights li {
  font-size: 12px;
  color: #374151;
  margin-bottom: 2px;
  line-height: 1.45;
}

.template-classic-single-column .skill-group {
  font-size: 12px;
  color: #374151;
  margin-bottom: 4px;
}
`
};

export const fallbackTemplates = [
  modernSidebarTemplate,
  classicSingleColumnTemplate
];

export default fallbackTemplates;
