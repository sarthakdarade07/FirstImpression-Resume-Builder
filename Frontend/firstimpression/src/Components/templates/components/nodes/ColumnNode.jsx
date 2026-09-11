import React from 'react';

export default function ColumnNode({ node, renderChildren }) {
  const classNames = `resume-column ${node.classNames || ''}`.trim();
  const style = {};
  if (node.config?.width) {
    style.width = node.config.width;
    style.flex = `0 0 ${node.config.width}`;
  } else if (node.config?.flex) {
    style.flex = node.config.flex;
  }

  return (
    <div id={node.id} className={classNames} style={style} data-node-type="column">
      {renderChildren(node.children)}
    </div>
  );
}
