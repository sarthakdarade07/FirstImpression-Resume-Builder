import React from 'react';
import { getBlockComponent } from '../../registry/templateRegistry';

export default function BlockNode({ node }) {
  const blockType = node.config?.blockType || node.block || node.config?.block || node.id;
  const BlockComponent = getBlockComponent(blockType);

  if (!BlockComponent) {
    console.warn(`[TemplateRenderer] Unrecognized blockType: '${blockType}' in node '${node.id}'`);
    return null;
  }

  return (
    <div id={node.id} className={`resume-block block-${blockType} ${node.classNames || ''}`.trim()} data-block-type={blockType}>
      <BlockComponent config={node.config} title={node.config?.title} />
    </div>
  );
}
