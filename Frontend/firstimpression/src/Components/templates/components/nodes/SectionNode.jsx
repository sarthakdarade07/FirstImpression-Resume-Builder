import React from 'react';

export default function SectionNode({ node, renderChildren }) {
  const classNames = `resume-section ${node.classNames || ''}`.trim();
  const sectionTitle = node.config?.title || node.text;

  return (
    <section id={node.id} className={classNames} data-node-type="section">
      {sectionTitle && (
        <h3 className="section-title">{sectionTitle}</h3>
      )}
      {renderChildren(node.children)}
    </section>
  );
}
