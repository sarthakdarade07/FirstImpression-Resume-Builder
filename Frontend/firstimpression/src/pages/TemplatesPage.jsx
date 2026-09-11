import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Eye,
  Check,
  User,
  LayoutTemplate,
  Layers,
  Sparkles,
  Loader2,
  FileText,
  ExternalLink,
  CheckCircle2,
  Edit3,
  Maximize2,
  Save,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { routes } from '../routes/routes';
import logo from '../assets/promotional/Firstimpression_icon_logo_copy.png';
import UserMenu from '../components/dashboard/UserMenu';
import {
  TemplateRenderer,
  useTemplateRenderer,
  sampleResumeData,
  ResumeEditorPanel
} from '../components/templates';
import { resumeApi, transformProfileToResumeData } from '../services/resumeApi';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSlug = searchParams.get('template') || 'modern-sidebar';
  const resumeId = searchParams.get('resumeId');
  const editParam = searchParams.get('edit');

  const {
    activeSlug,
    setActiveSlug,
    templatesList,
    currentTemplate,
    loading
  } = useTemplateRenderer(initialSlug);

  const [zoomLevel, setZoomLevel] = useState(80); // %
  const [dataSourceType, setDataSourceType] = useState(resumeId ? 'saved' : 'sample'); // 'saved' | 'sample' | 'user'
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [loadedResume, setLoadedResume] = useState(null);
  const [savedResumeData, setSavedResumeData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(true); // Default to ON as requested
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const authUser = useSelector((state) => state.auth?.user);

  // Fetch resume if resumeId is in URL
  useEffect(() => {
    if (!resumeId) {
      setLoadedResume(null);
      setSavedResumeData(null);
      setEditableData(null);
      return;
    }

    let isMounted = true;
    setIsLoadingResume(true);

    resumeApi
      .getResumeById(resumeId)
      .then((res) => {
        if (!isMounted || !res) return;
        setLoadedResume(res);
        setResumeTitle(res.title || 'My Resume');
        if (res.templateSlug && res.templateSlug !== activeSlug) {
          setActiveSlug(res.templateSlug);
        }
        if (res.resumeDataJson) {
          try {
            const parsed = typeof res.resumeDataJson === 'string' ? JSON.parse(res.resumeDataJson) : res.resumeDataJson;
            setSavedResumeData(parsed);
            setEditableData(parsed);
            setDataSourceType('saved');
          } catch (e) {
            console.warn('Failed to parse resumeDataJson:', e);
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load resume:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingResume(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  // Default resume data based on selected source (or live user profile)
  const baseResumeData = useMemo(() => {
    if (dataSourceType === 'saved' && savedResumeData) {
      return savedResumeData;
    }

    if (dataSourceType === 'user' && authUser) {
      return transformProfileToResumeData(null, authUser);
    }

    return sampleResumeData;
  }, [dataSourceType, savedResumeData, authUser]);

  // Active data being edited and rendered
  const activeResumeData = editableData || baseResumeData;

  const handleSaveResume = async () => {
    setIsSaving(true);
    const dataToSave = activeResumeData;
    try {
      if (resumeId) {
        const updated = await resumeApi.updateResume(resumeId, {
          title: resumeTitle || `${authUser?.name || 'My'} Resume`,
          resumeDataJson: JSON.stringify(dataToSave),
          templateSlug: activeSlug
        });
        if (updated) {
          setLoadedResume(updated);
          setSavedResumeData(dataToSave);
        }
        setLastSaved(new Date());
        setToastMessage('Changes saved to your resume!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
      } else {
        // Create new resume if not yet created, saving the current edited content
        const title = resumeTitle || `${authUser?.name || authUser?.fullName || 'My'} ${currentTemplate?.name || 'Resume'}`;
        const created = await resumeApi.createResumeFromTemplate(currentTemplate, title, dataToSave);
        setLoadedResume(created);
        setResumeTitle(created.title);
        setSavedResumeData(dataToSave);
        setEditableData(dataToSave);
        setSearchParams({ template: currentTemplate.slug, resumeId: created.id, edit: 'true' });
        setLastSaved(new Date());
        setToastMessage(`Resume created and saved to your account!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4500);
      }
    } catch (err) {
      console.error('Failed to save resume:', err);
      setToastMessage('Failed to save resume. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-theme-red-start/20 selection:text-theme-red">
      {/* Top Navigation & Controls Toolbar */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-30 shadow-sm print-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(routes.DASHBOARD)}
              className="p-1.5 sm:p-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-gray-500 hover:text-theme-red-start hover:border-theme-red-start/30 transition-all shadow-sm flex items-center justify-center shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <div
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(routes.DASHBOARD)}
            >
              <img
                src={logo}
                alt="FirstImpression"
                className="h-8 sm:h-9 object-contain mr-2"
              />
              <div className="hidden sm:flex items-center font-bold tracking-tight text-gray-900 text-xl sm:text-2xl">
                <span className="text-theme-red-start">first</span>
                <span className="ml-0.5">impression</span>
              </div>
            </div>

            <span className="text-gray-300 hidden sm:inline">/</span>
            <span className="font-semibold text-gray-700 text-xs sm:text-sm bg-gray-100 px-2.5 py-1 rounded-lg">
              Template Studio
            </span>

            {loadedResume && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200/80 rounded-lg text-xs font-semibold text-theme-red max-w-[220px] truncate">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{resumeTitle || loadedResume.title || 'Saved Resume'}</span>
              </span>
            )}
          </div>

          {/* Active Template Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden md:inline">Template:</span>
            <select
              value={activeSlug}
              onChange={(e) => {
                const nextSlug = e.target.value;
                setActiveSlug(nextSlug);
                setSearchParams(
                  resumeId
                    ? { template: nextSlug, resumeId, edit: isEditorOpen ? 'true' : 'false' }
                    : { template: nextSlug, edit: isEditorOpen ? 'true' : 'false' }
                );
              }}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 hover:bg-white hover:border-gray-300 transition-colors focus:ring-2 focus:ring-theme-red/30 focus:outline-none cursor-pointer"
            >
              {templatesList.map((tpl) => (
                <option key={tpl.slug} value={tpl.slug}>
                  {tpl.name} ({tpl.layoutType?.replace('_', ' ') || 'Template'})
                </option>
              ))}
            </select>
          </div>

          {/* Toolbar Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center bg-gray-100/90 rounded-xl p-0.5 border border-gray-200">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 50))}
                className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded-lg transition shadow-none hover:shadow-sm"
                title="Zoom Out"
              >
                −
              </button>
              <span className="px-2 text-xs font-semibold text-gray-700 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
                className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded-lg transition shadow-none hover:shadow-sm"
                title="Zoom In"
              >
                +
              </button>
            </div>

            {/* Resume Storage Isolation Indicator */}
            {loadedResume || resumeId ? (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Separate Resume Copy (Profile Untouched)</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center bg-gray-100/90 rounded-xl p-0.5 border border-gray-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setDataSourceType('user');
                    if (authUser) {
                      setEditableData(transformProfileToResumeData(null, authUser));
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    dataSourceType === 'user'
                      ? 'bg-white text-theme-red shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  👤 Profile Data
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDataSourceType('sample');
                    setEditableData(sampleResumeData);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    dataSourceType === 'sample'
                      ? 'bg-white text-theme-red shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📋 Sample Data
                </button>
              </div>
            )}

            {/* Edit Details vs Full View Toggle Button */}
            <button
              type="button"
              onClick={() => setIsEditorOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm cursor-pointer ${
                isEditorOpen
                  ? 'bg-orange-50 border-orange-200 text-theme-red'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              title={isEditorOpen ? 'Switch to Full View' : 'Edit Resume Content'}
            >
              {isEditorOpen ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-theme-red" />
                  <span>Edit Resume</span>
                </>
              )}
            </button>

            {/* Save Changes Button */}
            <button
              type="button"
              onClick={handleSaveResume}
              disabled={isSaving || !currentTemplate}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-theme-red-start to-theme-red hover:from-theme-red hover:to-theme-red-end text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-theme-red/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{loadedResume ? 'Save Changes' : 'Save Resume'}</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-theme-red/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* User Profile Avatar */}
            {authUser && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:ring-2 hover:ring-theme-red/30 transition-all flex items-center justify-center bg-gray-100 overflow-hidden"
                >
                  {authUser.avatar || authUser.profilePictureUrl ? (
                    <img
                      src={authUser.avatar || authUser.profilePictureUrl}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm font-medium">{toastMessage}</div>
          <button
            type="button"
            onClick={() => navigate(routes.DASHBOARD, { state: { activeTab: 'My Resumes' } })}
            className="ml-2 flex items-center gap-1 text-xs font-bold text-theme-red-start hover:text-theme-red bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl transition"
          >
            <span>My Resumes</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Slide-over / Split Left Resume Content Editor Drawer */}
        {isEditorOpen && (
          <ResumeEditorPanel
            resumeData={activeResumeData}
            onChange={(newData) => {
              setEditableData(newData);
            }}
            resumeTitle={resumeTitle}
            onTitleChange={setResumeTitle}
            onSave={handleSaveResume}
            isSaving={isSaving}
            lastSaved={lastSaved}
            onClose={() => setIsEditorOpen(false)}
          />
        )}

        {/* Central Preview Stage */}
        <main className="flex-1 overflow-auto bg-slate-200/80 p-6 sm:p-8 flex justify-center items-start relative">
          {/* Quick Floating Button to Re-open Editor if closed */}
          {!isEditorOpen && (
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="fixed bottom-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-gray-900/90 hover:bg-gray-900 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-gray-800 text-xs font-bold transition-all hover:scale-105 cursor-pointer print-hide"
            >
              <Edit3 className="w-4 h-4 text-theme-red-start" />
              <span>Edit Details</span>
            </button>
          )}

          {loading || isLoadingResume ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-3">
              <div className="w-9 h-9 border-4 border-theme-red border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-gray-500">Loading resume and template styles...</span>
            </div>
          ) : currentTemplate ? (
            <div
              className="resume-print-wrapper"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
            >
              <TemplateRenderer
                template={currentTemplate}
                resumeData={activeResumeData}
              />
            </div>
          ) : (
            <div className="text-gray-400 p-12 text-center">
              Failed to load template.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
