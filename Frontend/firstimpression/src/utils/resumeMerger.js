/**
 * Utility to merge AI-altered partial resume data into current frontend resume state.
 * Only present non-null keys on matched items (by ID or index) are updated.
 * Untouched sections (e.g. personalInformation, educations, languages) and non-updated fields remain intact.
 *
 * @param {Object} currentResume - Current full resume state (editableData)
 * @param {Object} alteredData - Partial or section-level altered data returned from AI
 * @returns {Object} Updated copy of currentResume
 */
export function mergeResumeData(currentResume, alteredData) {
  if (!currentResume || typeof currentResume !== "object") return currentResume;
  if (!alteredData || typeof alteredData !== "object") return currentResume;

  const merged = { ...currentResume };

  // 1. Merge summary if provided
  if (alteredData.summary !== undefined && alteredData.summary !== null) {
    merged.summary = alteredData.summary;
  }

  // 2. Sections allowed for AI alteration
  const sections = ["workExperiences", "projects", "skills", "certifications", "experience", "education", "educations"];

  sections.forEach((sectionKey) => {
    if (Array.isArray(alteredData[sectionKey])) {
      const currentList = Array.isArray(currentResume[sectionKey]) ? currentResume[sectionKey] : [];
      const alteredList = alteredData[sectionKey];

      // Map existing items by id (as string)
      const currentById = new Map();
      currentList.forEach((item, index) => {
        if (item && item.id !== undefined && item.id !== null) {
          currentById.set(String(item.id), { item, index });
        }
      });

      const newList = [...currentList];

      alteredList.forEach((aiItem, aiIdx) => {
        if (!aiItem || typeof aiItem !== "object") return;

        const aiId = aiItem.id !== undefined && aiItem.id !== null ? String(aiItem.id) : null;
        let match = aiId ? currentById.get(aiId) : null;

        // Fallback matching by array index if no id matched
        if (!match && aiIdx < currentList.length) {
          match = { item: currentList[aiIdx], index: aiIdx };
        }

        if (match) {
          // Update ONLY present non-null/non-undefined keys from aiItem into matched item
          const updatedItem = { ...match.item };
          Object.keys(aiItem).forEach((key) => {
            if (key !== "id" && aiItem[key] !== undefined && aiItem[key] !== null) {
              updatedItem[key] = aiItem[key];
              if (key === "title") updatedItem.name = aiItem.title;
              if (key === "name") updatedItem.title = aiItem.name;
              if (key === "projectLink") updatedItem.link = aiItem.projectLink;
              if (key === "link") updatedItem.projectLink = aiItem.link;
              if (key === "jobTitle") updatedItem.role = aiItem.jobTitle;
              if (key === "role") updatedItem.jobTitle = aiItem.role;
              if (key === "companyName") updatedItem.company = aiItem.companyName;
              if (key === "company") updatedItem.companyName = aiItem.company;
              if (key === "issuedBy") updatedItem.issuer = aiItem.issuedBy;
              if (key === "issuer") updatedItem.issuedBy = aiItem.issuer;
              if (key === "issueDate") updatedItem.date = aiItem.issueDate;
              if (key === "date") updatedItem.issueDate = aiItem.date;
            }
          });
          newList[match.index] = updatedItem;
        } else {
          // If brand new item from AI, append it with synced aliases
          const newItem = { ...aiItem };
          if (newItem.title && !newItem.name) newItem.name = newItem.title;
          if (newItem.name && !newItem.title) newItem.title = newItem.name;
          if (newItem.projectLink && !newItem.link) newItem.link = newItem.projectLink;
          if (newItem.link && !newItem.projectLink) newItem.projectLink = newItem.link;
          if (newItem.jobTitle && !newItem.role) newItem.role = newItem.jobTitle;
          if (newItem.role && !newItem.jobTitle) newItem.jobTitle = newItem.role;
          if (newItem.companyName && !newItem.company) newItem.company = newItem.companyName;
          if (newItem.company && !newItem.companyName) newItem.companyName = newItem.company;
          if (newItem.issuedBy && !newItem.issuer) newItem.issuer = newItem.issuedBy;
          if (newItem.issuer && !newItem.issuedBy) newItem.issuedBy = newItem.issuer;
          if (newItem.issueDate && !newItem.date) newItem.date = newItem.issueDate;
          if (newItem.date && !newItem.issueDate) newItem.issueDate = newItem.date;
          newList.push(newItem);
        }
      });

      merged[sectionKey] = newList;
    }
  });

  return merged;
}

export default mergeResumeData;
