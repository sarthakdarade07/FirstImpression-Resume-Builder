import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function TextNode({ node }) {
  const { resolve, interpolate } = useTemplateContext();
  const classNames = `resume-text ${node.classNames || ''}`.trim();
  const Tag = node.config?.as || 'p';

  let content = node.text || '';
  if (node.bind) {
    const boundVal = resolve(node.bind);
    if (boundVal !== null && boundVal !== undefined) {
      content = boundVal;
    }
  } else if (content.includes('{')) {
    content = interpolate(content);
  }

  if (!content) return null;

  return React.createElement(Tag, { id: node.id, className: classNames, 'data-node-type': 'text' }, content);
}
