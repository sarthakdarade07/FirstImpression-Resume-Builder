import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function EducationBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const education = resolve('education') || resolve('educations') || [];
  if (!Array.isArray(education) || education.length === 0) return null;

  const sectionTitle = title || config.title || 'Education';

  return (
    <div className="block-education">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      <div className="education-list">
        {education.map((edu, index) => {
          const degree = edu.degree || '';
          const major = edu.fieldOfStudy || edu.major || '';
          const degreeMajor = [degree, major].filter(Boolean).join(' in ');
          const school = edu.institution || edu.school || edu.college || '';
          const startDate = edu.startDate || '';
          const endDate = edu.endDate || '';
          const dateRange = [startDate, endDate].filter(Boolean).join(' – ');
          const gpa = edu.gpa ? `GPA: ${edu.gpa}` : '';
          const location = edu.location || '';

          return (
            <div key={edu.id || index} className="timeline-item education-item">
              <div className="timeline-header">
                <div>
                  <span className="timeline-title">{degreeMajor || degree}</span>
                  {school && (
                    <>
                      <span className="timeline-separator"> • </span>
                      <span className="timeline-subtitle">{school}</span>
                    </>
                  )}
                </div>
                <div className="timeline-meta">
                  {dateRange && <span className="timeline-date">{dateRange}</span>}
                  {location && (
                    <>
                      <span className="timeline-separator"> | </span>
                      <span className="timeline-location">{location}</span>
                    </>
                  )}
                </div>
              </div>

              {gpa && <div className="education-gpa">{gpa}</div>}

              {Array.isArray(edu.highlights) && edu.highlights.length > 0 && (
                <ul className="timeline-highlights">
                  {edu.highlights.map((bullet, bIdx) => (
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
