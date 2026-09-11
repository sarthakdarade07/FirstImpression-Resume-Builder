/**
 * TemplateNode Model
 * Defines the structure and properties of a node in the template layout tree.
 */
export class TemplateNode {
  /**
   * @param {Object} props
   * @param {string} props.id - Unique node ID (e.g. "main-page", "header-container")
   * @param {string} props.type - Node type (page, container, row, columns, column, section, text, heading, image, list, item, divider, spacer, block)
   * @param {string} [props.bind] - Path in resume data to bind (e.g. "personal.name", "summary", "experience")
   * @param {string} [props.text] - Static or fallback text content
   * @param {string|Array<string>} [props.classNames] - CSS class names for styling hooks
   * @param {Object} [props.config] - Functional configurations (e.g. blockType, level, src, alt, gap, columnsCount)
   * @param {Array<TemplateNode|Object>} [props.children] - Child nodes
   */
  constructor({
    id = '',
    type = 'container',
    bind = null,
    text = null,
    classNames = '',
    config = {},
    children = []
  } = {}) {
    this.id = id || `node-${Math.random().toString(36).substring(2, 9)}`;
    this.type = type;
    this.bind = bind;
    this.text = text;
    this.classNames = Array.isArray(classNames) ? classNames.join(' ') : (classNames || '');
    this.config = config || {};
    this.children = Array.isArray(children)
      ? children.map(child => (child instanceof TemplateNode ? child : new TemplateNode(child)))
      : [];
  }

  /**
   * Create a TemplateNode from raw JSON
   * @param {Object} json
   * @returns {TemplateNode}
   */
  static fromJSON(json) {
    if (!json) return null;
    const config = { ...(json.config || {}) };
    if (json.block) {
      config.blockType = config.blockType || json.block;
    }
    const classNames = json.classNames || json.className || '';

    return new TemplateNode({
      id: json.id || `${json.type || 'node'}-${Math.random().toString(36).substring(2, 8)}`,
      type: json.type || 'container',
      bind: json.bind,
      text: json.text,
      classNames,
      config,
      children: Array.isArray(json.children)
        ? json.children.map(child => TemplateNode.fromJSON(child))
        : []
    });
  }

  /**
   * Converts TemplateNode back to plain JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      bind: this.bind || undefined,
      text: this.text || undefined,
      classNames: this.classNames || undefined,
      config: Object.keys(this.config).length > 0 ? this.config : undefined,
      children: this.children.map(child => child.toJSON())
    };
  }
}

export default TemplateNode;
