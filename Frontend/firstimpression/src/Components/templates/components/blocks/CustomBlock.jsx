import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function CustomBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const bindPath = config.bind || 'custom';
  const customData = resolve(bindPath);
  if (!customData) return null;

  const sectionTitle = title || config.title || 'Additional Information';

  return (
    <div className="block-custom">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      {typeof customData === 'string' ? (
        <p className="custom-text">{customData}</p>
      ) : Array.isArray(customData) ? (
        <ul className="custom-list">
          {customData.map((item, idx) => (
            <li key={idx}>
              {typeof item === 'string' ? item : item.title || JSON.stringify(item)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="custom-content">
          {JSON.stringify(customData)}
        </div>
      )}
    </div>
  );
}
