import { useState, useEffect } from 'react';
import templateApi from '../services/templateApi';
import fallbackTemplates from '../data/localTemplates';

/**
 * Hook to manage template browsing, selection, and switching
 */
export function useTemplateRenderer(initialSlug = 'modern-sidebar') {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [templatesList, setTemplatesList] = useState(fallbackTemplates);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch list of templates
  useEffect(() => {
    let isMounted = true;
    async function fetchList() {
      try {
        const list = await templateApi.getTemplates();
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setTemplatesList(list);
        }
      } catch (e) {
        console.warn('Failed to load templates list:', e);
      }
    }
    fetchList();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch active template whenever activeSlug changes
  useEffect(() => {
    let isMounted = true;
    async function fetchActive() {
      setLoading(true);
      try {
        const tpl = await templateApi.getTemplateBySlug(activeSlug);
        if (isMounted) {
          setCurrentTemplate(tpl);
        }
      } catch (e) {
        console.warn(`Failed to load template ${activeSlug}:`, e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchActive();
    return () => {
      isMounted = false;
    };
  }, [activeSlug]);

  return {
    activeSlug,
    setActiveSlug,
    templatesList,
    currentTemplate,
    loading
  };
}

export default useTemplateRenderer;
