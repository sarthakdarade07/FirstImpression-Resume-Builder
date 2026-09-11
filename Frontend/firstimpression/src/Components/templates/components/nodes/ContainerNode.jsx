import React from 'react';

export default function ContainerNode({ node, renderChildren }) {
  const classNames = `resume-container ${node.classNames || ''}`.trim();

  return (
    <div id={node.id} className={classNames} data-node-type="container">
      {renderChildren(node.children)}
    </div>
  );
}
