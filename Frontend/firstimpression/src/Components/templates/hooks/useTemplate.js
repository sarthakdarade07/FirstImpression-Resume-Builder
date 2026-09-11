import { useState, useEffect, useCallback } from 'react';
import templateApi from '../services/templateApi';
import { TemplateEngine } from '../engine/TemplateEngine';

/**
 * Hook to fetch and manage active template state
 * @param {string} initialSlug
 */
export function useTemplate(initialSlug = 'modern-sidebar') {
  const [slug, setSlug] = useState(initialSlug);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTemplate = useCallback(async (targetSlug) => {
    setLoading(true);
    setError(null);
    try {
      const rawTemplate = await templateApi.getTemplateBySlug(targetSlug);
      const parsed = TemplateEngine.parse(rawTemplate);
      setTemplate(parsed);
      setSlug(targetSlug);
    } catch (err) {
      console.error(`[useTemplate] Error loading template '${targetSlug}':`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      loadTemplate(slug);
    }
  }, [slug, loadTemplate]);

  return {
    template,
    slug,
    setSlug,
    loading,
    error,
    reload: () => loadTemplate(slug)
  };
}

export default useTemplate;
