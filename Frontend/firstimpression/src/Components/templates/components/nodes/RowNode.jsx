import React from 'react';

export default function RowNode({ node, renderChildren }) {
  const classNames = `resume-row ${node.classNames || ''}`.trim();

  return (
    <div id={node.id} className={classNames} data-node-type="row">
      {renderChildren(node.children)}
    </div>
  );
}
