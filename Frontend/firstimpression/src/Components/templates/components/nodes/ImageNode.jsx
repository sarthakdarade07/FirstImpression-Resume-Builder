import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function ImageNode({ node }) {
  const { resolve } = useTemplateContext();
  const classNames = `resume-image-container ${node.classNames || ''}`.trim();

  let src = node.config?.src || '';
  if (node.bind) {
    const boundVal = resolve(node.bind);
    if (boundVal) src = boundVal;
  }

  const alt = node.config?.alt || 'Profile photo';

  if (!src) return null;

  return (
    <div id={node.id} className={classNames} data-node-type="image">
      <img src={src} alt={alt} className="resume-image" />
    </div>
  );
}
