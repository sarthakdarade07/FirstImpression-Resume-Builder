import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function CertificationsBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const certifications = resolve('certifications') || resolve('certificates') || [];
  if (!Array.isArray(certifications) || certifications.length === 0) return null;

  const sectionTitle = title || config.title || 'Certifications';

  return (
    <div className="block-certifications">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      <div className="certifications-list">
        {certifications.map((cert, index) => {
          const name = cert.name || cert.title || '';
          const issuer = cert.issuer || cert.organization || '';
          const date = cert.date || cert.issueDate || '';
          const url = cert.url || cert.link || '';

          return (
            <div key={cert.id || index} className="timeline-item cert-item">
              <div className="timeline-header">
                <div>
                  <span className="timeline-title">
                    {url ? (
                      <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noreferrer">
                        {name}
                      </a>
                    ) : (
                      name
                    )}
                  </span>
                  {issuer && (
                    <>
                      <span className="timeline-separator"> • </span>
                      <span className="timeline-subtitle">{issuer}</span>
                    </>
                  )}
                </div>
                {date && (
                  <div className="timeline-meta">
                    <span className="timeline-date">{date}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
