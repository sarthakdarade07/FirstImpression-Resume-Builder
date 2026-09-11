import { TemplateNode } from './TemplateNode';

/**
 * Template Model
 * Represents a complete resume template containing metadata, structure tree, and scoped CSS.
 */
export class Template {
  /**
   * @param {Object} props
   * @param {string|number} [props.id]
   * @param {string} props.slug - Unique identifier slug (e.g. "modern-sidebar", "classic-single-column")
   * @param {string} props.name - Display name (e.g. "Modern Two-Column")
   * @param {string} [props.description]
   * @param {string} [props.thumbnailUrl]
   * @param {string} [props.category] - Professional, Creative, Minimal, etc.
   * @param {string} [props.layoutType] - single_column, two_column, sidebar, etc.
   * @param {boolean} [props.isActive]
   * @param {boolean} [props.isPremium]
   * @param {Object|TemplateNode} props.structure - Root node of layout tree
   * @param {string} props.css - Scoped stylesheet for the template
   */
  constructor({
    id = null,
    slug = '',
    name = '',
    description = '',
    thumbnailUrl = '',
    category = 'General',
    layoutType = 'single_column',
    isActive = true,
    isPremium = false,
    structure = null,
    css = ''
  } = {}) {
    this.id = id;
    this.slug = slug;
    this.name = name;
    this.description = description;
    this.thumbnailUrl = thumbnailUrl;
    this.category = category;
    this.layoutType = layoutType;
    this.isActive = isActive;
    this.isPremium = isPremium;
    this.structure = structure instanceof TemplateNode
      ? structure
      : (structure ? TemplateNode.fromJSON(structure) : null);
    this.css = css || '';
  }

  /**
   * Factory from backend API response
   * @param {Object} json
   * @returns {Template}
   */
  static fromJSON(json) {
    if (!json) return null;
    let parsedStructure = json.structure || json.structureJson;
    if (typeof parsedStructure === 'string') {
      try {
        parsedStructure = JSON.parse(parsedStructure);
      } catch (e) {
        console.error('Failed to parse template structure JSON string:', e);
      }
    }

    return new Template({
      id: json.id,
      slug: json.slug,
      name: json.name,
      description: json.description,
      thumbnailUrl: json.thumbnailUrl,
      category: json.category,
      layoutType: json.layoutType,
      isActive: json.isActive ?? json.status ?? true,
      isPremium: json.isPremium ?? false,
      structure: parsedStructure,
      css: json.css || json.cssText || ''
    });
  }

  /**
   * Root CSS class name used for styling scoping
   * @returns {string}
   */
  getScopeClass() {
    return `template-${this.slug}`;
  }
}

export default Template;
