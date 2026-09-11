import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function SummaryBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const summary = resolve('summary') || resolve('personal.summary') || resolve('about') || '';
  if (!summary) return null;

  const sectionTitle = title || config.title || 'Professional Summary';

  return (
    <div className="block-summary">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      <p className="summary-text">{summary}</p>
    </div>
  );
}
