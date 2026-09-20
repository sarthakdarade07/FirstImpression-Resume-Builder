import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function ExperienceBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const experiences = resolve('workExperiences') || resolve('experience') || resolve('experiences') || resolve('workExperience') || [];
  if (!Array.isArray(experiences) || experiences.length === 0) return null;

  const sectionTitle = title || config.title || 'Work Experience';

  return (
    <div className="block-experience">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      <div className="experience-list">
        {experiences.map((exp, index) => {
          const role = exp.jobTitle || exp.role || exp.title || exp.position || '';
          const company = exp.companyName || exp.company || exp.employer || '';
          const location = exp.location || '';
          const startDate = exp.joinDate || exp.startDate || '';
          const endDate = exp.endDate ? exp.endDate : (exp.current ? 'Present' : '');
          const dateRange = [startDate, endDate].filter(Boolean).join(' – ');
          const description = exp.description || '';
          const highlights = (Array.isArray(exp.technologies) && exp.technologies.length > 0)
            ? exp.technologies
            : (exp.highlights || exp.bullets || exp.responsibilities || []);

          return (
            <div key={exp.id || index} className="timeline-item experience-item">
              <div className="timeline-header item-header">
                <div>
                  <span className="timeline-title item-title">{role}</span>
                  {company && (
                    <>
                      <span className="timeline-separator"> • </span>
                      <span className="timeline-subtitle item-subtitle">{company}</span>
                    </>
                  )}
                </div>
                <div className="timeline-meta">
                  {dateRange && <span className="timeline-date item-date">{dateRange}</span>}
                  {location && (
                    <>
                      <span className="timeline-separator"> | </span>
                      <span className="timeline-location item-location">{location}</span>
                    </>
                  )}
                </div>
              </div>

              {description && <p className="timeline-description item-description">{description}</p>}

              {Array.isArray(highlights) && highlights.length > 0 && (
                <ul className="timeline-highlights bullet-list">
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
