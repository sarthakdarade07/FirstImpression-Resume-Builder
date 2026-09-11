import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function HeaderBlock({ config = {} }) {
  const { resolve } = useTemplateContext();

  const name = resolve('personal.name') || resolve('personal.fullName') || 'Your Name';
  const title = resolve('personal.title') || resolve('personal.jobTitle') || '';
  const email = resolve('personal.email');
  const phone = resolve('personal.phone');
  const location = resolve('personal.location') || [resolve('personal.city'), resolve('personal.country')].filter(Boolean).join(', ');
  const linkedin = resolve('personal.linkedin');
  const github = resolve('personal.github');
  const website = resolve('personal.website') || resolve('personal.portfolio');
  const photoUrl = resolve('personal.photoUrl') || resolve('personal.avatar');

  const showPhoto = config.showPhoto !== false && photoUrl;

  return (
    <div className="block-header header-container">
      {showPhoto && (
        <div className="candidate-avatar header-photo-container">
          <img src={photoUrl} alt={name} className="avatar-img header-photo" />
        </div>
      )}
      <div className="header-text-group">
        <h1 className="candidate-name header-name">{name}</h1>
        {title && <div className="candidate-title header-role">{title}</div>}
        <div className="candidate-contact header-contacts">
          {email && (
            <span className="contact-item header-contact-item contact-email">
              <a href={`mailto:${email}`}>{email}</a>
            </span>
          )}
          {phone && (
            <span className="contact-item header-contact-item contact-phone">
              <a href={`tel:${phone}`}>{phone}</a>
            </span>
          )}
          {location && (
            <span className="contact-item header-contact-item contact-location">
              {location}
            </span>
          )}
          {linkedin && (
            <span className="contact-item header-contact-item contact-linkedin">
              <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noreferrer">
                {linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </a>
            </span>
          )}
          {github && (
            <span className="contact-item header-contact-item contact-github">
              <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noreferrer">
                {github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </a>
            </span>
          )}
          {website && (
            <span className="contact-item header-contact-item contact-website">
              <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noreferrer">
                {website.replace(/^https?:\/\//, '')}
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
