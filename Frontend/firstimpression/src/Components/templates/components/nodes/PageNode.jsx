import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function PageNode({ node, renderChildren }) {
  const { slug } = useTemplateContext();
  const scopeClass = slug ? `template-${slug}` : '';
  const classNames = `resume-page ${scopeClass} ${node.classNames || ''}`.trim();

  return (
    <div id={node.id} className={classNames} data-node-type="page">
      {renderChildren(node.children)}
    </div>
  );
}
