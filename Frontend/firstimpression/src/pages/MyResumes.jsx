import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Trash2, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { resumeApi } from "../services/resumeApi";
import { routes } from "../routes/routes";

const MyResumes = () => {
  const navigate = useNavigate();

  const [userResumes, setUserResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const loadResumes = async () => {
    setLoadingResumes(true);

    try {
      const resumes = await resumeApi.getUserResumes();
      setUserResumes(resumes || []);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleDeleteResume = async (e, id) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      await resumeApi.deleteResume(id);
      await loadResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 15,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Stats */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-sm">
          <FileText className="w-6 h-6 text-gray-400 mb-4" />

          <div className="text-3xl font-bold text-gray-900">
            {userResumes.length}
          </div>

          <h4 className="text-gray-500 text-sm font-medium mt-1">
            Total Resumes
          </h4>
        </motion.div>
      </motion.div>

      {/* Header */}

      <div className="mt-10 mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Resumes</h2>

        <p className="text-sm text-gray-500 mt-1">
          Create, customize, and manage your personal resumes.
        </p>
      </div>

      {/* Resume Cards */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New */}

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate(routes.TEMPLATES)}
          className="group flex flex-col items-center justify-center gap-4 h-[260px] rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 hover:bg-white hover:border-theme-red/50 hover:shadow-lg transition-all cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-theme-red" />
          </div>

          <div className="text-center">
            <span className="block font-semibold text-gray-900 text-lg">
              Create New
            </span>

            <span className="text-sm text-gray-500">
              Pick a template to start
            </span>
          </div>
        </motion.button>

        {/* Existing resumes */}

        {userResumes.map((resume, idx) => (
          <motion.div
            variants={itemVariants}
            key={resume.id || idx}
            onClick={() =>
              navigate(
                `${routes.RESUME}?template=${resume.templateSlug}&resumeId=${resume.id}&edit=true`,
              )
            }
            className="group relative flex flex-col h-[260px] rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl p-6 cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>

              <button
                type="button"
                onClick={(e) => handleDeleteResume(e, resume.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-auto">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-50 text-theme-red mb-2">
                {resume.templateSlug?.replace("-", " ") || "Template"}
              </span>

              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {resume.title || "My Resume"}
              </h3>

              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1.5" />

                {resume.updatedAt
                  ? new Date(resume.updatedAt).toLocaleDateString()
                  : "Recently"}
              </div>
            </div>

            <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100">
              <div className="w-10 h-10 rounded-full bg-theme-red text-white flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default MyResumes;
