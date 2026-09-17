import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  FileText,
  X,
  ChevronLeft,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  Briefcase,
  Tag,
  HelpCircle,
  FileUp
} from 'lucide-react';
import { jdApi } from '../../../services/jdApi';

export default function JdSidebar({
  isOpen,
  onClose,
  resumeId = null,
  resumeTitle = ''
}) {
  const [activeJd, setActiveJd] = useState(null);
  const [parsedFeatures, setParsedFeatures] = useState(null);

  // Upload states
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Query & Session History states (in-memory for this session only)
  const [queryInput, setQueryInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryError, setQueryError] = useState(null);
  const [messages, setMessages] = useState([]);

  // UI accordion for extracted features
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true);

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isQuerying]);

  // Handle file drop / selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const lower = file.name.toLowerCase();
      if (!lower.endsWith('.pdf') && !lower.endsWith('.docx') && !lower.endsWith('.txt')) {
        setUploadError('Please select a valid .pdf, .docx, or .txt file');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  // Submit JD upload
  const handleUploadJd = async (e) => {
    e?.preventDefault();
    if (uploadMode === 'file' && !selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    if (uploadMode === 'text' && !textInput.trim()) {
      setUploadError('Please enter job description text.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await jdApi.uploadJd({
        file: uploadMode === 'file' ? selectedFile : null,
        text: uploadMode === 'text' ? textInput.trim() : null,
        resumeId: resumeId || null,
      });

      setActiveJd(response);

      // Parse jdJson safely
      let features = null;
      if (response.jdJson) {
        try {
          features = typeof response.jdJson === 'string' ? JSON.parse(response.jdJson) : response.jdJson;
        } catch (err) {
          console.error('Failed to parse JD features JSON:', err);
        }
      }
      setParsedFeatures(features);

      // Add system message to session history
      const title = features?.jobTitle || response.fileName || 'Job Description';
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: 'system',
          text: `Extracted features for "${title}". You can now query or refine this Job Description.`,
          timestamp: new Date(),
        },
      ]);

      // Reset file input
      setSelectedFile(null);
      setTextInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message ||
        'Failed to upload and parse Job Description with Gemini.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit natural-language query to update/query JD
  const handleSendQuery = async (queryOverride = null) => {
    const query = (queryOverride || queryInput).trim();
    if (!query || !activeJd?.id) return;

    // Add user message to session history
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        text: query,
        timestamp: new Date(),
      },
    ]);

    setQueryInput('');
    setIsQuerying(true);
    setQueryError(null);

    try {
      const res = await jdApi.updateJd(activeJd.id, query);

      // If changed, update active features in state
      if (res.changed && res.jd) {
        setParsedFeatures(res.jd);
      }

      // Add Gemini assistant response
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: res.message || (res.changed ? 'Updated Job Description.' : 'No changes were made.'),
          changed: Boolean(res.changed),
          updatedJd: res.jd || null,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message ||
        'Gemini query failed. Please try again.';

      setQueryError(errorMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          text: `Error: ${errorMsg}`,
          isError: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  // Quick prompt suggestions
  const QUICK_PROMPTS = [
    'What skills are required?',
    'Add Docker & AWS to technical skills',
    'Summarize responsibilities',
    'What are the qualification criteria?'
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Main Sliding Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-full sm:w-[430px] max-w-[95vw] bg-white border-r border-gray-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out print-hide ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Top Header */}
        <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-theme-red-start to-theme-red flex items-center justify-center shadow-md shadow-red-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>JD AI Assistant</span>
                <span className="text-[10px] font-semibold bg-white/10 text-orange-200 px-1.5 py-0.5 rounded-full">
                  Gemini
                </span>
              </h2>
              <p className="text-[11px] text-gray-300">
                {resumeTitle ? `Linked to: ${resumeTitle}` : 'Extract & Tailor with Job Description'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="Close JD Assistant"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto flex flex-col divide-y divide-gray-100">
          {/* SECTION 1: UPLOAD OR ACTIVE JD STATUS */}
          <div className="p-4 bg-slate-50/70">
            {activeJd ? (
              /* Active JD Summary Banner */
              <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Active Job Description
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate mt-0.5">
                      {parsedFeatures?.jobTitle || activeJd.fileName || 'Untitled Role'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {parsedFeatures?.company ? `${parsedFeatures.company} • ` : ''}
                      {parsedFeatures?.location || (activeJd.inputType ? `${activeJd.inputType} Input` : 'Document')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveJd(null);
                      setParsedFeatures(null);
                      setUploadError(null);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition text-xs flex items-center gap-1 font-medium"
                    title="Upload different JD"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Change</span>
                  </button>
                </div>

                {/* Collapsible Skills & Summary */}
                {parsedFeatures && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
                      className="text-[11px] font-bold text-gray-600 hover:text-theme-red flex items-center gap-1 transition mb-2 cursor-pointer"
                    >
                      <Tag className="w-3 h-3 text-theme-red" />
                      <span>Extracted Skills & Details ({parsedFeatures.technicalSkills?.length || 0})</span>
                      <span className="text-gray-400">{isFeaturesExpanded ? '▼' : '▶'}</span>
                    </button>

                    {isFeaturesExpanded && (
                      <div className="space-y-2 pt-1">
                        {/* Technical skills chips */}
                        {parsedFeatures.technicalSkills && parsedFeatures.technicalSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                            {parsedFeatures.technicalSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 bg-orange-50 border border-orange-200/80 text-orange-800 rounded-lg text-[10px] font-semibold"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Soft skills or keywords */}
                        {parsedFeatures.keywords && parsedFeatures.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                            {parsedFeatures.keywords.slice(0, 8).map((kw, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px]"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* JD Upload Form */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Upload Job Description
                  </span>
                  <div className="flex bg-gray-200 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        uploadMode === 'file'
                          ? 'bg-white text-gray-900 shadow-xs font-bold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('text')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        uploadMode === 'text'
                          ? 'bg-white text-gray-900 shadow-xs font-bold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Paste Text
                    </button>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                    <span className="flex-1 leading-tight">{uploadError}</span>
                  </div>
                )}

                {uploadMode === 'file' ? (
                  /* File Dropzone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      selectedFile
                        ? 'border-theme-red bg-orange-50/50'
                        : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50/80'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-6 h-6 text-theme-red" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-gray-900 truncate max-w-[220px]">
                            {selectedFile.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="w-10 h-10 mx-auto rounded-full bg-orange-50 text-theme-red flex items-center justify-center">
                          <FileUp className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-gray-800">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Supports PDF, DOCX, or TXT
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Raw Text Area */
                  <div>
                    <textarea
                      rows={5}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste job posting text, qualifications, and requirements here..."
                      className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:border-theme-red focus:ring-1 focus:ring-theme-red outline-none resize-y"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleUploadJd}
                  disabled={isUploading || (uploadMode === 'file' ? !selectedFile : !textInput.trim())}
                  className="w-full py-2.5 bg-gradient-to-r from-theme-red-start to-theme-red hover:from-theme-red hover:to-theme-red-end text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Extract & Analyze JD</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: SESSION CHAT / QUERY HISTORY */}
          <div className="flex-1 flex flex-col min-h-[300px] p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                <span>Session Query History</span>
              </span>
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-mono">
                {messages.length} messages
              </span>
            </div>

            {/* Chat message bubbles list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[160px]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    No queries in this session yet.
                  </p>
                  <p className="text-[11px] text-gray-400 max-w-[240px]">
                    Upload a Job Description and ask Gemini to inspect skills or modify criteria.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {msg.role === 'system' ? (
                      <div className="w-full my-1 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{msg.text}</span>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                          msg.role === 'user'
                            ? 'bg-gray-900 text-white rounded-br-xs'
                            : msg.isError
                            ? 'bg-red-50 border border-red-200 text-red-700 rounded-bl-xs'
                            : 'bg-slate-100 border border-slate-200 text-gray-800 rounded-bl-xs'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3 text-theme-red" />
                            <span className="text-theme-red">Gemini</span>
                            {msg.changed && (
                              <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                                JD Modified
                              </span>
                            )}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span
                          className={`block text-[9px] mt-1 ${
                            msg.role === 'user' ? 'text-gray-400' : 'text-gray-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}

              {isQuerying && (
                <div className="flex items-start gap-2 text-xs text-gray-500 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-theme-red flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-slate-100 rounded-2xl px-3.5 py-2 text-xs text-gray-600">
                    Gemini is reasoning and analyzing the query...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            {activeJd && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Quick Actions
                </span>
                <div className="flex flex-wrap gap-1">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendQuery(prompt)}
                      disabled={isQuerying}
                      className="px-2.5 py-1 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-600 hover:text-theme-red rounded-lg text-[11px] transition text-left cursor-pointer disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Query Input Box */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={
                activeJd
                  ? 'Ask or modify: "Add AWS to skills", "Summarize JD"...'
                  : 'Upload a JD first to query...'
              }
              disabled={!activeJd || isQuerying}
              className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-theme-red focus:ring-1 focus:ring-theme-red disabled:opacity-50 disabled:bg-gray-100 transition shadow-2xs"
            />

            <button
              type="submit"
              disabled={!activeJd || !queryInput.trim() || isQuerying}
              className="p-2.5 bg-gradient-to-r from-theme-red-start to-theme-red hover:from-theme-red hover:to-theme-red-end text-white rounded-xl shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Send to Gemini"
            >
              {isQuerying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-1.5">
            Queries and responses are kept for this browser session only.
          </p>
        </div>
      </aside>
    </>
  );
}