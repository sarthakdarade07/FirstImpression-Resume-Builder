/**
 * HtmlTemplateEngine
 * Lightweight, zero-dependency HTML template compiler for resume templates.
 * Supports:
 * - Direct & nested properties: {{personal.name}}, {{role}}
 * - Conditional blocks: {{#if condition}}...{{else}}...{{/if}}, {{#unless ...}}
 * - Repeating loops: {{#each experience}}...{{/each}}, {{@index}}, {{@first}}, {{@last}}, {{this}}
 * - Automatic alias fallback normalization (jobTitle -> role, companyName -> company, etc.)
 */

export function normalizeResumeData(raw = {}, templateHtml = '') {
  if (!raw || typeof raw !== 'object') return {};
  const personal = raw.personal || raw.personalInformation || {};

  const name = personal.name || personal.fullName || raw.fullName || raw.name || 'Your Name';
  const title = personal.title || personal.jobTitle || raw.role || '';
  const email = personal.email || raw.email || '';
  const rawPhone = personal.phone || personal.phoneNo || personal.phoneNumber || personal.mobile || personal.contact || raw.phone || raw.phoneNo || '';
  const phone = String(rawPhone || '').trim();
  const phoneClean = phone.replace(/[^\d+]/g, '');
  const location = personal.location || [personal.city, personal.country].filter(Boolean).join(', ') || raw.location || '';
  const linkedin = personal.linkedin || personal.linkedinUrl || raw.linkedinUrl || '';
  const github = personal.github || personal.githubUrl || raw.githubUrl || '';
  const website = personal.website || personal.portfolio || personal.portfolioUrl || raw.portfolioUrl || '';
  const photoUrl = personal.photoUrl || personal.avatar || raw.photoUrl || '';
  const bio = personal.bio || raw.summary || '';

  const summary = raw.summary || personal.summary || personal.bio || raw.about || '';

  const rawExp = raw.experience || raw.workExperiences || raw.experiences || raw.workExperience || [];
  const experience = (Array.isArray(rawExp) ? rawExp : []).map(exp => {
    const role = exp.role || exp.jobTitle || exp.title || exp.position || '';
    const company = exp.company || exp.companyName || exp.employer || '';
    const startDate = exp.startDate || exp.joinDate || '';
    const endDate = exp.current ? 'Present' : (exp.endDate || '');
    const highlights = (Array.isArray(exp.highlights) && exp.highlights.length > 0)
      ? exp.highlights
      : (Array.isArray(exp.technologies) && exp.technologies.length > 0)
        ? exp.technologies
        : (Array.isArray(exp.bullets) ? exp.bullets : (Array.isArray(exp.responsibilities) ? exp.responsibilities : []));
    return {
      ...exp,
      role,
      jobTitle: role,
      company,
      companyName: company,
      location: exp.location || '',
      startDate,
      endDate,
      current: Boolean(exp.current),
      highlights,
      bullets: highlights,
      description: exp.description || ''
    };
  });

  const rawEdu = raw.education || raw.educations || [];
  const education = (Array.isArray(rawEdu) ? rawEdu : []).map(edu => {
    const degree = edu.degree || '';
    const fieldOfStudy = edu.fieldOfStudy || edu.major || '';
    const institution = edu.institution || edu.school || edu.college || edu.instituteName || '';
    const gpa = edu.gpa || (edu.score ? `${edu.score} ${edu.scoreType || ''}`.trim() : '');
    return {
      ...edu,
      degree,
      fieldOfStudy,
      major: fieldOfStudy,
      institution,
      school: institution,
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa,
      score: gpa,
      highlights: Array.isArray(edu.highlights) ? edu.highlights : []
    };
  });

  // Skills normalization: support categorized, flat array of objects, and flat array of strings
  const rawSkills = raw.skills || [];
  const flatSkillStrings = [];
  if (Array.isArray(rawSkills)) {
    rawSkills.forEach(s => {
      if (typeof s === 'string') {
        if (s.trim()) flatSkillStrings.push(s.trim());
      } else if (s && typeof s === 'object') {
        if (Array.isArray(s.items)) {
          s.items.forEach(it => {
            const str = typeof it === 'string' ? it : (it?.name || it?.title || it?.skill || '');
            if (str && str.trim()) flatSkillStrings.push(str.trim());
          });
        } else if (Array.isArray(s.skills)) {
          s.skills.forEach(it => {
            const str = typeof it === 'string' ? it : (it?.name || it?.title || it?.skill || '');
            if (str && str.trim()) flatSkillStrings.push(str.trim());
          });
        } else {
          const str = s.name || s.title || s.skill || s.skillName || '';
          if (str && str.trim()) flatSkillStrings.push(str.trim());
        }
      }
    });
  }

  const isAlreadyCategorized = Array.isArray(rawSkills) && rawSkills.length > 0 &&
    typeof rawSkills[0] === 'object' && (Array.isArray(rawSkills[0].items) || Array.isArray(rawSkills[0].skills));

  // Determine if template expects categorized groups (uses `items` or `category`)
  const wantsCategorized = templateHtml
    ? (templateHtml.includes('items') || templateHtml.includes('category'))
    : isAlreadyCategorized;

  let skills = [];
  if (wantsCategorized) {
    if (isAlreadyCategorized) {
      skills = rawSkills.map(s => {
        const category = s.category || s.name || s.title || 'Technical Skills';
        const items = (Array.isArray(s.items) ? s.items : (Array.isArray(s.skills) ? s.skills : []))
          .map(it => (typeof it === 'string' ? it : (it?.name || it?.title || it?.skill || '')))
          .filter(Boolean);
        return {
          category,
          name: category,
          title: category,
          items,
          skills: items
        };
      });
    } else {
      skills = flatSkillStrings.length > 0 ? [
        {
          category: 'Technical Skills',
          name: 'Technical Skills',
          title: 'Technical Skills',
          items: flatSkillStrings,
          skills: flatSkillStrings
        }
      ] : [];
    }
  } else {
    if (isAlreadyCategorized) {
      skills = flatSkillStrings.map(name => ({
        name,
        title: name,
        skill: name,
        level: ''
      }));
    } else {
      skills = (Array.isArray(rawSkills) ? rawSkills : []).map(s => {
        if (typeof s === 'string') {
          return { name: s, title: s, skill: s, level: '' };
        }
        const name = s?.name || s?.title || s?.skill || s?.skillName || '';
        return {
          ...s,
          name,
          title: name,
          skill: name,
          level: s?.level || s?.proficiency || ''
        };
      });
    }
  }

  const rawProjects = raw.projects || [];
  const projects = (Array.isArray(rawProjects) ? rawProjects : []).map(p => {
    const name = p.name || p.title || '';
    const link = p.link || p.projectLink || p.url || p.repoUrl || p.githubUrl || '';
    const technologies = Array.isArray(p.technologies) ? p.technologies : (Array.isArray(p.techStack) ? p.techStack : []);
    const highlights = Array.isArray(p.highlights) ? p.highlights : (Array.isArray(p.bullets) ? p.bullets : []);
    return {
      ...p,
      name,
      title: name,
      link,
      projectLink: link,
      technologies,
      highlights,
      description: p.description || ''
    };
  });

  const rawCerts = raw.certifications || raw.certificates || [];
  const certifications = (Array.isArray(rawCerts) ? rawCerts : []).map(c => {
    const name = c.name || c.title || '';
    const issuer = c.issuer || c.issuedBy || c.organization || '';
    const date = c.date || c.issueDate || '';
    const url = c.url || c.link || c.certificateUrl || c.credentialUrl || '';
    return {
      ...c,
      name,
      title: name,
      issuer,
      issuedBy: issuer,
      date,
      url,
      link: url
    };
  });

  const rawLangs = raw.languages || [];
  const languages = (Array.isArray(rawLangs) ? rawLangs : []).map(l => {
    if (typeof l === 'string') return { name: l, level: '' };
    return {
      name: l.name || l.language || '',
      level: l.level || l.proficiency || ''
    };
  });

  return {
    ...raw,
    personal: {
      ...personal,
      name,
      fullName: name,
      title,
      jobTitle: title,
      email,
      phone,
      phoneNo: phone,
      phoneClean,
      phoneTel: phoneClean,
      location,
      linkedin,
      github,
      website,
      photoUrl,
      bio
    },
    phone,
    phoneNo: phone,
    phoneClean,
    phoneTel: phoneClean,
    summary,
    experience,
    workExperiences: experience,
    education,
    educations: education,
    skills,
    categorizedSkills: isAlreadyCategorized ? skills : (flatSkillStrings.length > 0 ? [
      { category: 'Technical Skills', items: flatSkillStrings }
    ] : []),
    flatSkills: flatSkillStrings,
    projects,
    certifications,
    languages,
    custom: raw.custom || []
  };
}

function resolveValue(context, path, rootData) {
  if (!path) return '';
  const trimmed = path.trim();
  if (trimmed === 'this' || trimmed === '.') return context;

  // If context is a string and template requests name/title/skill, return the string itself
  if (typeof context === 'string' && (trimmed === 'name' || trimmed === 'title' || trimmed === 'skill')) {
    return context;
  }

  // Direct key on context
  if (context && typeof context === 'object' && trimmed in context) {
    return context[trimmed];
  }

  // Dot path lookup on local context
  const parts = trimmed.split('.');
  let cur = context;
  for (const part of parts) {
    if (cur == null) break;
    cur = cur[part];
  }
  if (cur !== undefined && cur !== null) return cur;

  // Fallback to root data lookup
  if (rootData && rootData !== context) {
    let rCur = rootData;
    for (const part of parts) {
      if (rCur == null) break;
      rCur = rCur[part];
    }
    if (rCur !== undefined && rCur !== null) return rCur;
  }

  return '';
}

function parseTemplate(templateStr) {
  const root = [];
  const stack = [{ children: root }];
  let lastIndex = 0;
  const tagRegex = /\{\{(#each|#if|#unless|\/each|\/if|\/unless|else)\s*([^}]*)\}\}|\{\{([^}]+)\}\}/g;
  let match;

  while ((match = tagRegex.exec(templateStr)) !== null) {
    const textBefore = templateStr.slice(lastIndex, match.index);
    if (textBefore) {
      stack[stack.length - 1].children.push({ type: 'text', value: textBefore });
    }
    lastIndex = tagRegex.lastIndex;

    const control = match[1];
    const controlArg = match[2]?.trim();
    const varExpr = match[3]?.trim();

    if (control) {
      if (control === '#if') {
        const node = { type: 'if', expr: controlArg, truthy: [], falsy: [] };
        stack[stack.length - 1].children.push(node);
        stack.push({ node, children: node.truthy });
      } else if (control === '#unless') {
        const node = { type: 'unless', expr: controlArg, truthy: [], falsy: [] };
        stack[stack.length - 1].children.push(node);
        stack.push({ node, children: node.truthy });
      } else if (control === '#each') {
        const node = { type: 'each', expr: controlArg, body: [] };
        stack[stack.length - 1].children.push(node);
        stack.push({ node, children: node.body });
      } else if (control === 'else') {
        const top = stack[stack.length - 1];
        if (top?.node && (top.node.type === 'if' || top.node.type === 'unless')) {
          top.children = top.node.falsy;
        }
      } else if (control.startsWith('/')) {
        if (stack.length > 1) {
          stack.pop();
        }
      }
    } else if (varExpr) {
      stack[stack.length - 1].children.push({ type: 'var', expr: varExpr });
    }
  }

  const remainingText = templateStr.slice(lastIndex);
  if (remainingText) {
    stack[stack.length - 1].children.push({ type: 'text', value: remainingText });
  }

  return root;
}

function renderAst(ast, context, rootData, specialVars = {}) {
  let out = '';
  for (const node of ast) {
    if (node.type === 'text') {
      out += node.value;
    } else if (node.type === 'var') {
      if (node.expr in specialVars) {
        out += specialVars[node.expr];
      } else {
        const val = resolveValue(context, node.expr, rootData);
        if (val !== undefined && val !== null) {
          if (typeof val === 'object' && (node.expr === 'this' || node.expr === '.')) {
            out += String(val.name || val.title || val.category || Object.values(val)[0] || '');
          } else {
            out += String(val);
          }
        }
      }
    } else if (node.type === 'if') {
      const val = resolveValue(context, node.expr, rootData);
      const isTruthy = Array.isArray(val) ? val.length > 0 : Boolean(val);
      if (isTruthy) {
        out += renderAst(node.truthy, context, rootData, specialVars);
      } else if (node.falsy.length > 0) {
        out += renderAst(node.falsy, context, rootData, specialVars);
      }
    } else if (node.type === 'unless') {
      const val = resolveValue(context, node.expr, rootData);
      const isTruthy = Array.isArray(val) ? val.length > 0 : Boolean(val);
      if (!isTruthy) {
        out += renderAst(node.truthy, context, rootData, specialVars);
      } else if (node.falsy.length > 0) {
        out += renderAst(node.falsy, context, rootData, specialVars);
      }
    } else if (node.type === 'each') {
      const items = resolveValue(context, node.expr, rootData);
      if (Array.isArray(items)) {
        const total = items.length;
        for (let i = 0; i < total; i++) {
          const item = items[i];
          const itemVars = {
            ...specialVars,
            '@index': i,
            '@first': i === 0,
            '@last': i === total - 1
          };
          out += renderAst(node.body, item, rootData, itemVars);
        }
      }
    }
  }
  return out;
}

export class HtmlTemplateEngine {
  /**
   * Compiles an HTML template string with resume data
   * @param {string} templateHtml
   * @param {Object} resumeData
   * @returns {string}
   */
  static compile(templateHtml, resumeData = {}) {
    if (!templateHtml || typeof templateHtml !== 'string') return '';
    const normalized = normalizeResumeData(resumeData, templateHtml);
    const ast = parseTemplate(templateHtml);
    let rendered = renderAst(ast, normalized, normalized);

    // Auto-sanitize all tel: links so spaces, dashes, brackets, etc. are stripped for valid RFC 3966 URIs
    rendered = rendered.replace(/href\s*=\s*(["'])tel:([^"']*)\1/gi, (match, quote, phoneVal) => {
      const clean = phoneVal.replace(/[^\d+]/g, '');
      return `href=${quote}tel:${clean}${quote}`;
    });

    return rendered;
  }
}

export default HtmlTemplateEngine;
