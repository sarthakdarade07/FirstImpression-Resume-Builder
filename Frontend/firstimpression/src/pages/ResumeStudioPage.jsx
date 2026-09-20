import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Download,
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
  sampleResumeData
} from '../components/templates';
import { ResumeEditorPanel, JdAssistantDrawer } from '../components/resume';
import { resumeApi, transformProfileToResumeData } from '../services/resumeApi';
import { mergeResumeData } from '../utils/resumeMerger';
import { printResumeHTML } from '../utils/printResume';
import {
  setCurrentResume,
  mergeAlteredResume,
  setSavedResume,
  setResumeMetadata,
  setResumeTitle as setReduxResumeTitle,
} from '../redux/slices/resumeSlice';

export default function ResumeStudioPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSlug = searchParams.get('template') || 'modern-sidebar';
  const resumeId = searchParams.get('resumeId');
  const editParam = searchParams.get('edit');
  const previewParam = searchParams.get('preview');
  const [isOpen,setIsOpen] = useState(false);
  // Explicit editing state tracking to ensure instant UI transitions
  const [isEditingMode, setIsEditingMode] = useState(editParam === 'true');

  // Preview Mode: active ONLY when not actively editing, no loaded resume, and preview mode is indicated
  const isPreviewMode = !isEditingMode && !resumeId && (previewParam === 'true' || editParam !== 'true');

  const {
    activeSlug,
    setActiveSlug,
    templatesList,
    currentTemplate,
    loading
  } = useTemplateRenderer(initialSlug);

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);

  // Redux single source of truth for current resume state
  const currentResume = useSelector((state) => state.resume?.currentResume);
  const savedResumeData = useSelector((state) => state.resume?.savedResume);

  const [zoomLevel, setZoomLevel] = useState(80); // %
  const [dataSourceType, setDataSourceType] = useState(resumeId ? 'saved' : 'sample'); // 'saved' | 'sample' | 'user'
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [loadedResume, setLoadedResume] = useState(null);
  const [resumeTitle, setResumeTitleState] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(editParam === 'true' || !isPreviewMode);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isJdDrawerOpen, setIsJdDrawerOpen] = useState(false);

  const setResumeTitle = (title) => {
    setResumeTitleState(title);
    dispatch(setReduxResumeTitle(title));
  };

  // Synchronize editor drawer with URL params
  useEffect(() => {
    if (editParam === 'true') {
      setIsEditingMode(true);
      setIsEditorOpen(false);
    } else if (previewParam === 'true') {
      setIsEditingMode(false);
      setIsEditorOpen(false);
    }
  }, [previewParam, editParam]);

  // Fetch resume if resumeId is in URL
  useEffect(() => {
    if (!resumeId) {
      setLoadedResume(null);
      dispatch(setSavedResume(null));
      dispatch(setCurrentResume(null));
      dispatch(setResumeMetadata({ resumeId: null, resumeTitle: '', templateSlug: initialSlug }));
      return;
    }

    let isMounted = true;
    setIsLoadingResume(true);
    // Reset currentResume while loading a new resumeId to prevent stale data race condition
    dispatch(setCurrentResume(null));

    resumeApi
      .getResumeById(resumeId)
      .then((res) => {
        if (!isMounted || !res) return;
        setLoadedResume(res);
        setResumeTitle(res.title || 'My Resume');
        if (res.templateSlug && res.templateSlug !== activeSlug) {
          setActiveSlug(res.templateSlug);
        }

        let dataToSet = null;
        if (res.resumeDataJson) {
          try {
            dataToSet = typeof res.resumeDataJson === 'string' ? JSON.parse(res.resumeDataJson) : res.resumeDataJson;
          } catch (e) {
            console.warn('Failed to parse resumeDataJson:', e);
          }
        }

        // Fallback to live user profile or sample data if stored resumeDataJson is empty
        if (!dataToSet || Object.keys(dataToSet).length === 0) {
          dataToSet = authUser ? transformProfileToResumeData(null, authUser) : sampleResumeData;
        }

        dispatch(setSavedResume(dataToSet));
        dispatch(setCurrentResume(dataToSet));
        dispatch(setResumeMetadata({ resumeId: res.id, resumeTitle: res.title || 'My Resume', templateSlug: res.templateSlug }));
        setDataSourceType('saved');
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
  }, [resumeId, dispatch, authUser]);

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

  // Ensure Redux currentResume is initialized if null (only when not actively loading a resumeId)
  useEffect(() => {
    if (!currentResume && baseResumeData && !isLoadingResume && !resumeId) {
      dispatch(setCurrentResume(baseResumeData));
    }
  }, [baseResumeData, currentResume, isLoadingResume, resumeId, dispatch]);

  // Single source of truth for active resume data (powered by Redux)
  const activeResumeData = currentResume || baseResumeData;

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
          dispatch(setSavedResume(dataToSave));
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
        dispatch(setSavedResume(dataToSave));
        dispatch(setCurrentResume(dataToSave));
        dispatch(setResumeMetadata({ resumeId: created.id, resumeTitle: created.title, templateSlug: currentTemplate.slug }));
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

  const handleUseThisTemplate = async () => {
    setIsSaving(true);
    try {  
        if (!authUser) {
          const returnUrl = encodeURIComponent(
            `${routes.RESUME}?template=${currentTemplate?.slug || activeSlug}&autoUse=true`,
          );
          navigate(`${routes.SIGNIN}?redirect=${returnUrl}`);
          return;
        }
      const title = resumeTitle || `${authUser?.name || authUser?.fullName || 'My'} ${currentTemplate?.name || 'Resume'}`;
      const created = await resumeApi.createResumeFromTemplate(currentTemplate, title, null, authUser);
      
      const populatedData = created?.resumeDataJson
        ? (typeof created.resumeDataJson === 'string' ? JSON.parse(created.resumeDataJson) : created.resumeDataJson)
        : transformProfileToResumeData(null, authUser);

      setLoadedResume(created);
      setResumeTitle(created?.title || title);
      setSavedResumeData(populatedData);
      setEditableData(populatedData);
      setDataSourceType('saved');
      setIsEditingMode(true);
      setIsEditorOpen(true);

      if (created && created.id) {
        navigate(`${routes.RESUME}?template=${currentTemplate.slug}&resumeId=${created.id}&edit=true`, { replace: true });
        setToastMessage('Template chosen! Your profile details have been loaded.');
      } else {
        navigate(`${routes.RESUME}?template=${currentTemplate.slug}&edit=true`, { replace: true });
        setToastMessage('Ready to edit! Your profile details have been loaded.');
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (err) {
      console.warn('Failed to create resume from template via API:', err);
      const fallbackData = transformProfileToResumeData(null, authUser);
      setSavedResumeData(fallbackData);
      setEditableData(fallbackData);
      setDataSourceType('saved');
      setIsEditingMode(true); 
      setIsEditorOpen(true);
      navigate(`${routes.RESUME}?template=${currentTemplate.slug}&edit=true`, { replace: true });
      setToastMessage('Ready to edit! Your profile details have been loaded.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const resumeContainerRef = useRef(null);

  useEffect(() => {
    if (authUser && searchParams.get("autoUse") === "true" && currentTemplate) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("autoUse");
      setSearchParams(nextParams, { replace: true });
      handleUseThisTemplate();
    }
  }, [authUser, currentTemplate]);
  
  const handlePrint = () => {
    setIsUserMenuOpen(false);
    if (resumeContainerRef.current) {
      printResumeHTML(resumeContainerRef.current, resumeTitle || 'My Resume');
    }
  };

  // Keyboard shortcut listener to ensure menus are closed when printing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


   function onToggle(){
    const temp = !isOpen;
    setIsJdDrawerOpen(true);
    setIsOpen(temp);
   }

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
              title="Back to Dashboard">
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <div
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(routes.DASHBOARD)}>
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
            <span className="font-semibold text-gray-700 text-xs sm:text-sm bg-gray-100 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              {isPreviewMode ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-theme-red" />
                  <span>Read-Only Preview</span>
                </>
              ) : (
                <span>Template Studio</span>
              )}
            </span>

            {loadedResume && !isPreviewMode && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200/80 rounded-lg text-xs font-semibold text-theme-red max-w-[220px] truncate">
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {resumeTitle || loadedResume.title || "Saved Resume"}
                </span>
              </span>
            )}
          </div>

          {/* Active Template Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden md:inline">
              Template:
            </span>
            <select
              value={activeSlug}
              onChange={(e) => {
                const nextSlug = e.target.value;
                setActiveSlug(nextSlug);
                setSearchParams(
                  resumeId
                    ? {
                        template: nextSlug,
                        resumeId,
                        edit: isEditorOpen ? "true" : "false",
                      }
                    : isPreviewMode
                      ? { template: nextSlug, preview: "true" }
                      : {
                          template: nextSlug,
                          edit: isEditorOpen ? "true" : "false",
                        },
                );
              }}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 hover:bg-white hover:border-gray-300 transition-colors focus:ring-2 focus:ring-theme-red/30 focus:outline-none cursor-pointer">
              {templatesList.map((tpl) => (
                <option key={tpl.slug} value={tpl.slug}>
                  {tpl.name} ({tpl.layoutType?.replace("_", " ") || "Template"})
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
                title="Zoom Out">
                −
              </button>
              <span className="px-2 text-xs font-semibold text-gray-700 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
                className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded-lg transition shadow-none hover:shadow-sm"
                title="Zoom In">
                +
              </button>
            </div>

            {/* Resume Storage Isolation Indicator (Edit Mode Only) */}
            {!isPreviewMode &&
              (loadedResume || resumeId ? (
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Separate Resume Copy (Profile Untouched)</span>
                </div>
              ) : (
                <div className="hidden lg:flex items-center bg-gray-100/90 rounded-xl p-0.5 border border-gray-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setDataSourceType("user");
                      if (authUser) {
                        setEditableData(
                          transformProfileToResumeData(null, authUser),
                        );
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      dataSourceType === "user"
                        ? "bg-white text-theme-red shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}>
                    👤 Profile Data
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDataSourceType("sample");
                      setEditableData(sampleResumeData);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      dataSourceType === "sample"
                        ? "bg-white text-theme-red shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}>
                    📋 Sample Data
                  </button>
                </div>
              ))}

            {/* Save Changes Button (Edit Mode Only) */}
            {!isPreviewMode && (
              <button
                type="button"
                onClick={handleSaveResume}
                disabled={isSaving || !currentTemplate}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-theme-red-start to-theme-red hover:from-theme-red hover:to-theme-red-end text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-theme-red/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{loadedResume ? "Save Changes" : "Save Resume"}</span>
              </button>
            )}

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-gray-900/20 cursor-pointer"
              title="Download High-Resolution PDF">
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>Download PDF</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-theme-red/20 cursor-pointer"
              title="Print Resume">
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* USE THIS TEMPLATE BUTTON (Prominently placed in Top Right Corner during Preview) */}
            {isPreviewMode &&  (
              <button
                type="button"
                onClick={handleUseThisTemplate}
                disabled={isSaving || !currentTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-theme-red-start to-theme-red hover:from-theme-red hover:to-theme-red-end text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-theme-red/30 cursor-pointer disabled:opacity-50"
                title="Use and customize this template">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                )}
                <span>Use This Template</span>
              </button>
            )}

            {/* User Profile Avatar */}
            {authUser && (
              <div className="relative ml-auto">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 rounded-full border border-gray-200 hover:ring-2 hover:ring-theme-red/30 transition-all flex items-center justify-center bg-gray-100 overflow-hidden">
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
                <UserMenu
                  isOpen={isUserMenuOpen}
                  onClose={() => setIsUserMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-300 print-hide">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm font-medium">{toastMessage}</div>
          <button
            type="button"
            onClick={() =>
              navigate(routes.DASHBOARD, { state: { activeTab: "My Resumes" } })
            }
            className="ml-2 flex items-center gap-1 text-xs font-bold text-theme-red-start hover:text-theme-red bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl transition">
            <span>My Resumes</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden relative print-hide">
        {/* Left Side JD Assistant Drawer Slider */}

        
        {!isPreviewMode && (
          <button 
            type="button"
             onClick={onToggle}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white rounded-full shadow-2xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all text-xs font-bold border border-white/20 print-hide backdrop-blur-md cursor-pointer group"
            title="Open Job Description Assistant">
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />

              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />

                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
              </span>
            </div>

            <span className="tracking-wide font-semibold">
              Resume Assistant
            </span>
          </button>
        )}

        <JdAssistantDrawer
          isOpen={isJdDrawerOpen}
          onToggle={() => setIsJdDrawerOpen(!isJdDrawerOpen)}
          resumeId={resumeId || loadedResume?.id}
          currentResumeData={activeResumeData}
          onResumeAltered={(alteredData) => {
            if (!alteredData) return;
            dispatch(mergeAlteredResume(alteredData));
            // NOT calling setSavedResume — this is a preview only
            // User must click Save to persist to DB
            setToastMessage("AI changes previewed — click Save to keep them.");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
          }}
        />

        {/* Mobile Backdrop for Resume Content Editor Drawer */}
        {isEditorOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden transition-opacity print-hide"
            onClick={() => setIsEditorOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Slide-over / Split Left Resume Content Editor Drawer */}
        {isEditorOpen && (
          <aside className="print-hide shrink-0 fixed inset-y-0 left-0 z-40 w-full sm:w-[460px] max-w-full lg:static lg:z-20 lg:w-[440px] xl:w-[480px] h-full shadow-2xl lg:shadow-none flex">
            <ResumeEditorPanel
              resumeData={activeResumeData}
              onChange={(newData) => {
                dispatch(setCurrentResume(newData));
              }}
              resumeTitle={resumeTitle}
              onTitleChange={setResumeTitle}
              onSave={handleSaveResume}
              isSaving={isSaving}
              lastSaved={lastSaved}
              onClose={() => setIsEditorOpen(false)}
            />
          </aside>
        )}

        {/* Central Preview Stage (Screen Only) */}
        <main className="resume-screen-preview flex-1 overflow-auto bg-slate-200/80 p-3 sm:p-8 flex justify-center items-start relative print-hide">
          {/* Quick Floating Button to Re-open Editor if closed and NOT in preview mode */}
          {!isEditorOpen && !isPreviewMode && (
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setIsJdDrawerOpen(false);
                }
                setIsEditorOpen(true);
              }}
              className="fixed bottom-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-gray-900/90 hover:bg-gray-900 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-gray-800 text-xs font-bold transition-all hover:scale-105 cursor-pointer print-hide">
              <Edit3 className="w-4 h-4 text-theme-red-start" />
              <span>Edit Details</span>
            </button>
          )}

          {/* Floating Call-to-Action Pill in Preview Mode */}
          {isPreviewMode && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-2.5 bg-gray-900/90 hover:bg-gray-900 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-gray-800 print-hide transition-all">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  Previewing{" "}
                  <strong className="text-white">
                    {currentTemplate?.name || "Template"}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleUseThisTemplate}
                disabled={isSaving || !currentTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-theme-red-start to-theme-red hover:opacity-95 text-white text-xs font-bold rounded-xl shadow transition-transform hover:scale-105 cursor-pointer disabled:opacity-50">
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                )}
                <span>Use This Template</span>
              </button>
            </div>
          )}

          {loading || isLoadingResume ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-3">
              <div className="w-9 h-9 border-4 border-theme-red border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-gray-500">
                Loading resume and template styles...
              </span>
            </div>
          ) : currentTemplate ? (
            <div
              ref={resumeContainerRef}
              className="resume-screen-zoom-wrapper"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out",
              }}>
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
