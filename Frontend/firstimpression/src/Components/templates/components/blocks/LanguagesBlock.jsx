import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function LanguagesBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const languages = resolve('languages') || [];
  if (!Array.isArray(languages) || languages.length === 0) return null;

  const sectionTitle = title || config.title || 'Languages';

  return (
    <div className="block-languages">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      <ul className="languages-list">
        {languages.map((lang, idx) => {
          const name = typeof lang === 'string' ? lang : (lang.name || lang.language || '');
          const level = typeof lang === 'object' ? (lang.level || lang.proficiency || '') : '';

          return (
            <li key={idx} className="language-item">
              <span className="language-name">{name}</span>
              {level && <span className="language-level"> ({level})</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
