import React from 'react';

export default function DividerNode({ node }) {
  const classNames = `resume-divider ${node.classNames || ''}`.trim();
  return <hr id={node.id} className={classNames} data-node-type="divider" />;
}
