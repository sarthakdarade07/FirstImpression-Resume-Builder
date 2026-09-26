import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { HtmlTemplateEngine } from '../../engine/HtmlTemplateEngine';
import { TemplateCssManager } from '../../engine/TemplateCssManager';

// Import base resets & print styles
import '../../styles/template-base.css';
import '../../styles/template-print.css';

/**
 * Single Component Template Renderer
 * Compiles stored template HTML with dynamic resumeData and mounts scoped pure CSS.
 * Re-renders reactively in 0ms whenever resumeData or template changes.
 */
export function TemplateRenderer({ template, resumeData = {}, className = '' }) {
  const slug = template?.slug || 'default';
  const htmlCode = template?.htmlCode || template?.htmlContent || template?.html || '';
  const cssText = template?.cssText || template?.css || '';

  // Inject scoped CSS dynamically into DOM
  useEffect(() => {
    if (!slug || !cssText) return;
    TemplateCssManager.applyTemplateCss(slug, cssText, true);
  }, [slug, cssText]);

  // Reactive HTML compilation with resume data
  const compiledHtml = useMemo(() => {
    if (!htmlCode) return '';
    return HtmlTemplateEngine.compile(htmlCode, resumeData);
  }, [htmlCode, resumeData]);

  if (!template || !htmlCode) {
    return (
      <div className="resume-placeholder p-8 text-center text-slate-400">
        <p>No template HTML available to render.</p>
      </div>
    );
  }

  const handleLinkClick = (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    if (href.startsWith('tel:')) {
      const cleanNumber = href.replace(/^tel:/, '').replace(/[^\d+]/g, '');
      if (cleanNumber) {
        window.location.href = `tel:${cleanNumber}`;
      }
    }
  };

  return (
    <div
      className={`resume-viewport template-${slug} ${className}`.trim()}
      onClick={handleLinkClick}
      dangerouslySetInnerHTML={{ __html: compiledHtml }}
    />
  );
}

TemplateRenderer.propTypes = {
  template: PropTypes.shape({
    slug: PropTypes.string,
    htmlCode: PropTypes.string,
    htmlContent: PropTypes.string,
    html: PropTypes.string,
    cssText: PropTypes.string,
    css: PropTypes.string,
  }),
  resumeData: PropTypes.object,
  className: PropTypes.string,
};

export default TemplateRenderer;
