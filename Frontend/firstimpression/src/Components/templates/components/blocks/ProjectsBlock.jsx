import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function ProjectsBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const projects = resolve('projects') || [];
  if (!Array.isArray(projects) || projects.length === 0) return null;

  const sectionTitle = title || config.title || 'Projects';

  return (
    <div className="block-projects">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      <div className="projects-list">
        {projects.map((proj, index) => {
          const name = proj.title || proj.name || '';
          const link = proj.projectLink || proj.link || proj.url || '';
          const technologies = proj.technologies || proj.techStack || proj.tools || [];
          const techString = Array.isArray(technologies) ? technologies.join(', ') : technologies;
          const description = proj.description || '';
          const highlights = proj.highlights || proj.bullets || [];

          return (
            <div key={proj.id || index} className="timeline-item project-item">
              <div className="timeline-header">
                <div>
                  <span className="timeline-title">
                    {link ? (
                      <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noreferrer">
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </span>
                  {techString && (
                    <span className="timeline-subtitle"> | {techString}</span>
                  )}
                </div>
              </div>

              {description && <p className="timeline-description">{description}</p>}

              {Array.isArray(highlights) && highlights.length > 0 && (
                <ul className="timeline-highlights">
                  {highlights.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
