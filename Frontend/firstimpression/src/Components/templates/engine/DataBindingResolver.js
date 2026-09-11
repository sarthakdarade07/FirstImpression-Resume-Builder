/**
 * DataBindingResolver
 * Safely resolves property paths, collections, and template expressions against resume data.
 */
export class DataBindingResolver {
  /**
   * Resolves a value from data using dot/bracket path notation (e.g., 'personal.name', 'experience.0.company')
   * @param {Object} data - Source resume data
   * @param {string} path - Property path
   * @param {*} [defaultValue=null]
   * @returns {*}
   */
  static getValue(data, path, defaultValue = null) {
    if (!data || !path || typeof path !== 'string') {
      return defaultValue;
    }

    // Support paths like 'personal.name' or 'experience[0].company'
    const normalizedPath = path
      .replace(/\[(\w+)\]/g, '.$1')
      .replace(/^\./, '');

    const keys = normalizedPath.split('.');
    let current = data;

    for (const key of keys) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[key];
    }

    return current !== undefined && current !== null ? current : defaultValue;
  }

  /**
   * Resolves template strings like "Hi {personal.name} from {personal.city}"
   * If string contains no braces, returns direct getValue result if it's a path, or raw string.
   * @param {Object} data
   * @param {string} templateString
   * @returns {string}
   */
  static interpolate(data, templateString) {
    if (!templateString || typeof templateString !== 'string') return '';
    
    // Check if it matches "{path}" format
    return templateString.replace(/\{([\w\.\d]+)\}/g, (match, path) => {
      const val = DataBindingResolver.getValue(data, path);
      return val !== null && val !== undefined ? String(val) : '';
    });
  }

  /**
   * Checks if bound field or expression has non-empty content
   * @param {Object} data
   * @param {string} path
   * @returns {boolean}
   */
  static hasContent(data, path) {
    const val = DataBindingResolver.getValue(data, path);
    if (val === null || val === undefined) return false;
    if (typeof val === 'string') return val.trim().length > 0;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') return Object.keys(val).length > 0;
    return true;
  }
}

export default DataBindingResolver;
