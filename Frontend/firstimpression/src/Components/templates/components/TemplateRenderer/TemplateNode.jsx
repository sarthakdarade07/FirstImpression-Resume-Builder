import React from 'react';
import { getNodeComponent } from '../../registry/templateRegistry';

export default function TemplateNode({ node }) {
  if (!node) return null;

  const NodeComponent = getNodeComponent(node.type);

  const renderChildren = (children) => {
    if (!Array.isArray(children) || children.length === 0) return null;
    return children.map((childNode, index) => (
      <TemplateNode
        key={childNode.id || `${node.id}-child-${index}`}
        node={childNode}
      />
    ));
  };

  return <NodeComponent node={node} renderChildren={renderChildren} />;
}
