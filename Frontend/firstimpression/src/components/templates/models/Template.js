/**
 * Template Model
 * Represents a resume template containing metadata, HTML template code, and scoped CSS.
 */
export class Template {
  constructor({
    id = null,
    slug = '',
    name = '',
    description = '',
    thumbnailUrl = '',
    category = 'General',
    layoutType = 'custom',
    isActive = true,
    isPremium = false,
    htmlCode = '',
    cssText = ''
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
    this.htmlCode = htmlCode;
    this.html = htmlCode;
    this.cssText = cssText;
    this.css = cssText;
  }

  static fromJSON(json) {
    if (!json) return null;
    const htmlCode = json.htmlCode || json.htmlContent || json.html || '';
    const cssText = json.cssText || json.css || '';

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
      htmlCode,
      cssText
    });
  }

  getScopeClass() {
    return `template-${this.slug}`;
  }
}

export default Template;
