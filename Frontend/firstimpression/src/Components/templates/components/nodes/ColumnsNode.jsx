import React from 'react';

export default function ColumnsNode({ node, renderChildren }) {
  const classNames = `resume-columns ${node.classNames || ''}`.trim();

  return (
    <div id={node.id} className={classNames} data-node-type="columns">
      {renderChildren(node.children)}
    </div>
  );
}
