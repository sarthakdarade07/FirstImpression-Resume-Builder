import React from 'react';

export default function UnknownNode({ node, renderChildren }) {
  console.warn(`[TemplateRenderer] Unknown node type: '${node.type}' (id: '${node.id}')`);

  return (
    <div
      id={node.id}
      className={`resume-unknown ${node.classNames || ''}`.trim()}
      data-node-type={node.type}
    >
      {renderChildren(node.children)}
    </div>
  );
}
