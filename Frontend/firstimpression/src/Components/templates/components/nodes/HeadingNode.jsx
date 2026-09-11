import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function HeadingNode({ node }) {
  const { resolve, interpolate } = useTemplateContext();
  const classNames = `resume-heading ${node.classNames || ''}`.trim();
  const level = node.config?.level || 2;
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;

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

  return React.createElement(Tag, { id: node.id, className: classNames, 'data-node-type': 'heading' }, content);
}
