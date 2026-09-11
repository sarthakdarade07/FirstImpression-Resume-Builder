import React, { createContext, useContext, useMemo } from 'react';
import { DataBindingResolver } from '../../engine/DataBindingResolver';

const TemplateContext = createContext(null);

export function TemplateProvider({ template, resumeData = {}, children }) {
  const contextValue = useMemo(() => {
    return {
      template,
      slug: template?.slug || '',
      resumeData: resumeData || {},
      resolve: (path, defaultValue = null) =>
        DataBindingResolver.getValue(resumeData, path, defaultValue),
      interpolate: (templateString) =>
        DataBindingResolver.interpolate(resumeData, templateString),
      hasContent: (path) =>
        DataBindingResolver.hasContent(resumeData, path)
    };
  }, [template, resumeData]);

  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateContext() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplateContext must be used within a <TemplateProvider>');
  }
  return context;
}

export default TemplateContext;
