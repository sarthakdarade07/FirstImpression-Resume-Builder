import React from 'react';
import { useTemplateContext } from '../TemplateRenderer/TemplateContext';

export default function SkillsBlock({ config = {}, title }) {
  const { resolve } = useTemplateContext();

  const skillsData = resolve('skills') || [];
  if (!skillsData || (Array.isArray(skillsData) && skillsData.length === 0)) return null;

  const sectionTitle = title || config.title || 'Skills';

  // Check if skills is grouped or flat array
  const isGrouped = Array.isArray(skillsData) && skillsData[0] && typeof skillsData[0] === 'object' && (skillsData[0].items || skillsData[0].skills);

  return (
    <div className="block-skills">
      {sectionTitle && <h2 className="block-section-title">{sectionTitle}</h2>}
      
      {isGrouped ? (
        <div className="skills-grouped">
          {skillsData.map((group, idx) => {
            const groupName = group.name || group.category || group.title || '';
            const items = group.items || group.skills || [];

            return (
              <div key={idx} className="skill-group">
                {groupName && <div className="skill-group-name">{groupName}</div>}
                <ul className="skills-list">
                  {items.map((skill, sIdx) => (
                    <li key={sIdx} className="skill-tag skill-badge">
                      {typeof skill === 'string' ? skill : (skill.title || skill.name || skill.skill || '')}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="skills-list">
          {skillsData.map((skill, idx) => (
            <li key={idx} className="skill-tag skill-badge">
              {typeof skill === 'string' ? skill : (skill.title || skill.name || skill.skill || '')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
