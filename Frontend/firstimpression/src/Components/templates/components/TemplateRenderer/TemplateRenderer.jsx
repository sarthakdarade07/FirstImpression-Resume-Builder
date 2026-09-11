import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Template } from '../../models/Template';
import { TemplateEngine } from '../../engine/TemplateEngine';
import { TemplateCssManager } from '../../engine/TemplateCssManager';
import { TemplateProvider } from './TemplateContext';
import TemplateNode from './TemplateNode';

// Import base resets & print styles
import '../../styles/template-base.css';
import '../../styles/template-print.css';

/**
 * Generic Template Renderer
 * Accepts any valid template structure and resume data, mounts scoped CSS,
 * and renders the full recursive component hierarchy.
 */
export function TemplateRenderer({ template: templateProp, resumeData = {}, className = '' }) {
  // Normalize template
  const template = useMemo(() => {
    if (!templateProp) return null;
    return templateProp instanceof Template
      ? templateProp
      : TemplateEngine.parse(templateProp);
  }, [templateProp]);

  // Inject scoped CSS dynamically into DOM
  useEffect(() => {
    if (!template?.slug || !template?.css) return;

    TemplateCssManager.applyTemplateCss(template.slug, template.css, true);

    return () => {
      // Keep style mounted for smooth transition, or clean up if switching
    };
  }, [template?.slug, template?.css]);

  if (!template || !template.structure) {
    return (
      <div className="resume-placeholder p-8 text-center text-slate-400">
        <p>No template structure available to render.</p>
      </div>
    );
  }

  return (
    <TemplateProvider template={template} resumeData={resumeData}>
      <div className={`resume-viewport template-${template.slug} ${className}`.trim()}>
        <TemplateNode node={template.structure} />
      </div>
    </TemplateProvider>
  );
}

TemplateRenderer.propTypes = {
  template: PropTypes.oneOfType([PropTypes.object, PropTypes.instanceOf(Template)]),
  resumeData: PropTypes.object,
  className: PropTypes.string,
};

export default TemplateRenderer;
