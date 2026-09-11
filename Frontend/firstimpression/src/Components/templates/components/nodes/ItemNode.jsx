import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function ItemNode({ node, renderChildren }) {
  const { resolve, interpolate } = useTemplateContext();
  const classNames = `resume-item ${node.classNames || ''}`.trim();

  let content = node.text || '';
  if (node.bind) {
    const boundVal = resolve(node.bind);
    if (boundVal !== null && boundVal !== undefined) {
      content = boundVal;
    }
  } else if (content.includes('{')) {
    content = interpolate(content);
  }

  return (
    <li id={node.id} className={classNames} data-node-type="item">
      {content || renderChildren(node.children)}
    </li>
  );
}
