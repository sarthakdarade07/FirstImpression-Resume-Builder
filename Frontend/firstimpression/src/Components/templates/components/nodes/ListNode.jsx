import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function ListNode({ node, renderChildren }) {
  const { resolve } = useTemplateContext();
  const classNames = `resume-list ${node.classNames || ''}`.trim();
  const ordered = node.config?.ordered || false;
  const Tag = ordered ? 'ol' : 'ul';

  // If node binds to an array of strings, render them as items directly
  if (node.bind) {
    const listData = resolve(node.bind);
    if (Array.isArray(listData) && listData.length > 0) {
      return (
        <Tag id={node.id} className={classNames} data-node-type="list">
          {listData.map((item, idx) => (
            <li key={idx} className="resume-item">
              {typeof item === 'string' ? item : item.name || item.title || JSON.stringify(item)}
            </li>
          ))}
        </Tag>
      );
    }
    return null;
  }

  return (
    <Tag id={node.id} className={classNames} data-node-type="list">
      {renderChildren(node.children)}
    </Tag>
  );
}
