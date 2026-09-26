/**
 * TemplateCssManager
 * Injects, scopes, and manages dynamic template CSS in the DOM.
 */
export class TemplateCssManager {
  static STYLE_PREFIX = 'resume-template-style-';

  /**
   * Scopes CSS rules to ensure all selectors are prefixed by the template scope class
   * @param {string} css
   * @param {string} scopeClass - e.g. "template-modern-sidebar"
   * @returns {string}
   */
  static scopeCss(css, scopeClass) {
    if (!css || !scopeClass) return '';

    const prefix = `.${scopeClass}`;

    // If CSS already contains the prefix, return directly to avoid double-scoping
    if (css.includes(prefix)) {
      return css;
    }

    // Process CSS rules, taking care of media queries
    // Split by blocks or prefix selectors
    return css.replace(/(^|}|;)\s*([^{}@]+)\{/g, (match, p1, selector) => {
      const trimmedSelector = selector.trim();
      if (!trimmedSelector || trimmedSelector.startsWith('@') || trimmedSelector.startsWith(':root')) {
        return match;
      }

      // Split multiple selectors like: .classA, .classB
      const scopedSelectors = trimmedSelector
        .split(',')
        .map(s => {
          const sTrim = s.trim();
          if (!sTrim) return '';
          if (sTrim === 'body' || sTrim === 'html') return prefix;
          if (sTrim.startsWith(prefix)) return sTrim;
          return `${prefix} ${sTrim}`;
        })
        .filter(Boolean)
        .join(', ');

      return `${p1} ${scopedSelectors} {`;
    });
  }

  /**
   * Injects or updates a scoped style tag in document.head
   * @param {string} slug - Unique template slug
   * @param {string} css - Raw CSS content
   * @param {boolean} [shouldScope=true]
   * @returns {HTMLStyleElement}
   */
  static applyTemplateCss(slug, css, shouldScope = true) {
    if (typeof document === 'undefined' || !slug) return null;

    const styleId = `${this.STYLE_PREFIX}${slug}`;
    let styleElement = document.getElementById(styleId);

    const scopeClass = `template-${slug}`;
    const processedCss = shouldScope ? this.scopeCss(css, scopeClass) : css;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.setAttribute('data-template-slug', slug);
      document.head.appendChild(styleElement);
    }

    if (styleElement.textContent !== processedCss) {
      styleElement.textContent = processedCss;
    }

    return styleElement;
  }

  /**
   * Removes the style tag associated with a specific template slug
   * @param {string} slug
   */
  static removeTemplateCss(slug) {
    if (typeof document === 'undefined' || !slug) return;
    const styleId = `${this.STYLE_PREFIX}${slug}`;
    const styleElement = document.getElementById(styleId);
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  }

  /**
   * Removes all active template style tags injected by TemplateCssManager
   */
  static clearAllTemplateStyles() {
    if (typeof document === 'undefined') return;
    const styles = document.querySelectorAll(`style[id^="${this.STYLE_PREFIX}"]`);
    styles.forEach(style => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    });
  }
}

export default TemplateCssManager;
