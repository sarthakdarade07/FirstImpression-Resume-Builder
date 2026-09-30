import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates, fetchTemplateBySlug } from '../../../redux/thunks/templateThunks';
import { setActiveSlug as setReduxActiveSlug } from '../../../redux/slices/templateSlice';
import fallbackTemplates, { modernSidebarTemplate } from '../components/data/localTemplates';

/**
 * Hook to manage template browsing, selection, and switching.
 * Backed by Redux store caching to prevent duplicate API hits.
 */
export function useTemplateRenderer(initialSlug = 'modern-sidebar') {
  const dispatch = useDispatch();
  const [activeSlug, setActiveSlugState] = useState(initialSlug);

  const templatesList = useSelector(
    (state) => state.template?.templatesList || fallbackTemplates
  );
  const templatesBySlug = useSelector(
    (state) => state.template?.templatesBySlug || {}
  );
  const loading = useSelector(
    (state) => state.template?.loadingTemplate || false
  );

  const currentTemplate =
    templatesBySlug[activeSlug] ||
    templatesList.find((t) => t.slug === activeSlug) ||
    modernSidebarTemplate;

  const setActiveSlug = (slug) => {
    setActiveSlugState(slug);
    dispatch(setReduxActiveSlug(slug));
  };

  // Fetch list of templates once (Redux condition skips if already loaded)
  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  // Fetch active template when activeSlug changes (Redux condition skips if already in cache)
  useEffect(() => {
    if (activeSlug) {
      dispatch(fetchTemplateBySlug(activeSlug));
    }
  }, [activeSlug, dispatch]);

  return {
    activeSlug,
    setActiveSlug,
    templatesList,
    currentTemplate,
    loading,
  };
}

export default useTemplateRenderer;
