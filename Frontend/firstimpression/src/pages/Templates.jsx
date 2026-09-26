import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { templateApi } from "../components/templates/services/templateApi";
import { fallbackTemplates } from "../components/templates/data/localTemplates";
import { resumeApi } from "../services/resumeApi";
import { routes } from "../routes/routes";

const Templates = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [templatesList, setTemplatesList] = useState(fallbackTemplates);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [creatingForSlug, setCreatingForSlug] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadTemplates = async () => {
      setLoadingTemplates(true);

      try {
        const list = await templateApi.getTemplates();

        if (isMounted && Array.isArray(list) && list.length > 0) {
          setTemplatesList(list);
        }
      } catch (error) {
        console.warn("Failed to load templates:", error);
      } finally {
        if (isMounted) {
          setLoadingTemplates(false);
        }
      }
    };

    loadTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUseTemplate = async (template) => {
    setCreatingForSlug(template.slug);

    if (!user) {
      navigate(routes.SIGNIN);
      return;
    }

    try {
      const created = await resumeApi.createResumeFromTemplate(template);

      navigate(
        `${routes.RESUME}?template=${template.slug}&resumeId=${created.id}&edit=true`,
      );
    } catch (error) {
      console.error("Failed to create resume:", error);
    } finally {
      setCreatingForSlug(null);
    }
  };

  const categories = [
    "All",
    ...new Set(
      templatesList.map((template) => template.category).filter(Boolean),
    ),
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? templatesList
      : templatesList.filter(
          (template) => template.category === selectedCategory,
        );

  return (
    <>
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Resume Templates</h2>

          <p className="text-sm text-gray-500 mt-1">
            Choose from our curated collection of professional, ATS-optimized
            resume layouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Categories */}

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  selectedCategory === category
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}>
                {category}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate(`${routes.RESUME}?preview=true`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-theme-red text-white text-xs font-semibold rounded-xl">
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Templates */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => {
          const isCreating = creatingForSlug === template.slug;

          return (
            <motion.div
              key={template.slug}
              className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* Preview */}

              <div className="relative h-64 bg-slate-100 overflow-hidden p-4">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover object-top rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-white rounded-lg shadow border p-4">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-2 bg-slate-100 rounded w-3/4 mt-2" />
                  </div>
                )}

                {/* Overlay */}

                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `${routes.RESUME}?template=${template.slug}&preview=true`,
                      )
                    }
                    className="px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-theme-red" />
                    Preview
                  </button>

                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => handleUseTemplate(template)}
                    className="px-4 py-2 bg-theme-red text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Use Template
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {template.name}
                  </h3>

                  <span className="text-xs text-gray-400">
                    {template.layoutType?.replace("_", " ") || "standard"}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mt-2">
                  {template.description ||
                    "A modern, ATS-optimized layout crafted for maximum readability."}
                </p>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Ready to Use
                  </span>

                  <button
                    type="button"
                    disabled={isCreating}
                    onClick={() => handleUseTemplate(template)}
                    className="text-xs font-bold text-theme-red flex items-center gap-1">
                    {isCreating ? "Adding..." : "Use this template"}

                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default Templates;
