import React from 'react';

export default function SpacerNode({ node }) {
  const height = node.config?.height || '16px';
  return (
    <div
      id={node.id}
      className={`resume-spacer ${node.classNames || ''}`.trim()}
      style={{ height }}
      data-node-type="spacer"
    />
  );
}
