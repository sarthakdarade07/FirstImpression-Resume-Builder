import React, { useState, useEffect } from "react";
import {
  Sparkles,
  UploadCloud,
  Send,
  AlertCircle,
  X,
  Loader2,
  Bot,
  User,
  Briefcase,
  Building2,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import useJDAssistant from "./hooks/useJDAssistant";

const formatKeyName = (str) => {
  if (!str) return "";
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
};

const GenericFeatureRenderer = ({ data, showAll = false }) => {
  const [expandedKey, setExpandedKey] = useState(null);

  if (!data || typeof data !== "object") return null;

  const entries = Object.entries(data).filter(([_, val]) => {
    if (val === null || val === undefined || val === "null" || val === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && Object.keys(val).length === 0) return false;
    return true;
  });

  if (entries.length === 0) {
    return <p className="text-gray-400 italic text-[11px]">No extracted details found.</p>;
  }

  const primitives = entries.filter(([_, v]) => typeof v !== "object");
  const complex = entries.filter(([_, v]) => typeof v === "object");

  const toggleExpand = (key) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="space-y-2.5">
      {/* Primitives / Attributes */}
      {primitives.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/90 p-2 rounded-xl border border-gray-100">
          {primitives.map(([key, value]) => (
            <div key={key} className="min-w-0">
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider block truncate">
                {formatKeyName(key)}
              </span>
              <span className="text-[11px] font-semibold text-gray-800 break-words">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Complex / Lists / Nested Objects */}
      {complex.map(([key, value]) => {
        const title = formatKeyName(key);
        const isExpanded = showAll || expandedKey === key;

        if (Array.isArray(value)) {
          const isShortList = value.every(
            (item) => typeof item === "string" && item.length <= 40
          );
          const limit = isShortList ? 8 : 3;
          const hasMore = value.length > limit;

          return (
            <div key={key} className="space-y-1">
              <button
                type="button"
                onClick={() => hasMore && toggleExpand(key)}
                className={`w-full flex items-center justify-between text-left py-0.5 ${
                  hasMore ? "cursor-pointer group" : "cursor-default"
                }`}>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-800 transition">
                  {title}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-medium text-gray-400">
                    {value.length}
                  </span>
                  {hasMore &&
                    (isExpanded ? (
                      <ChevronUp className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition" />
                    ))}
                </div>
              </button>

              {isShortList ? (
                <div className="flex flex-wrap gap-1 items-center">
                  {(isExpanded ? value : value.slice(0, limit)).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200/60 rounded-md text-[10px] font-semibold">
                      {String(item)}
                    </span>
                  ))}
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(key)}
                      className="px-2 py-0.5 text-[10px] font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md border border-orange-200 transition cursor-pointer">
                      {isExpanded ? "Show less" : `+${value.length - limit} more`}
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-700">
                    {(isExpanded ? value : value.slice(0, limit)).map((item, idx) => (
                      <li key={idx} className="leading-snug">
                        {typeof item === "object" ? JSON.stringify(item) : String(item)}
                      </li>
                    ))}
                  </ul>
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(key)}
                      className="text-[10px] font-semibold text-orange-600 hover:text-orange-700 hover:underline pl-4 inline-flex items-center gap-1 cursor-pointer transition">
                      {isExpanded ? (
                        <>
                          <span>Show less</span>
                          <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <span>+{value.length - limit} more items...</span>
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        }

        // Nested Object (e.g. additionalInfo)
        const objectEntries = Object.entries(value);
        const hasMore = objectEntries.length > 3;

        return (
          <div key={key} className="space-y-1">
            <button
              type="button"
              onClick={() => hasMore && toggleExpand(key)}
              className={`w-full flex items-center justify-between text-left py-0.5 ${
                hasMore ? "cursor-pointer group" : "cursor-default"
              }`}>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-gray-800 transition">
                {title}
              </span>
              {hasMore &&
                (isExpanded ? (
                  <ChevronUp className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-orange-600 transition" />
                ))}
            </button>
            <div className="bg-gray-50/70 rounded-xl p-2 border border-gray-100 space-y-1">
              {(isExpanded ? objectEntries : objectEntries.slice(0, 3)).map(
                ([subK, subV]) => (
                  <div key={subK} className="flex items-baseline justify-between gap-2 text-[10px]">
                    <span className="font-medium text-gray-500">{formatKeyName(subK)}:</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {typeof subV === "object" ? JSON.stringify(subV) : String(subV)}
                    </span>
                  </div>
                )
              )}
              {hasMore && (
                <button
                  type="button"
                  onClick={() => toggleExpand(key)}
                  className="text-[10px] font-semibold text-orange-600 hover:text-orange-700 hover:underline pt-1 inline-flex items-center gap-1 cursor-pointer">
                  {isExpanded ? "Show less" : `+${objectEntries.length - 3} more...`}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function JdAssistantDrawer({
  isOpen = false,
  onToggle,
  resumeId = null,
}) {
  // ============================================================
  // BUSINESS / API LOGIC
  // ============================================================

  const {
    jd: fetchedJd,
    features: fetchedFeatures,
    isFetchingJd,
    uploadJd,
    updateJd,
    isUploading,
    isQuerying,
    uploadError,
    queryError,
  } = useJDAssistant({
    resumeId,
  });

  // ============================================================
  // UI STATE
  // ============================================================

  const [inputMode, setInputMode] = useState("file");

  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState("");

  const [currentJd, setCurrentJd] = useState(null);
  const [features, setFeatures] = useState(null);

  useEffect(() => {
    if (fetchedJd) {
      setCurrentJd(fetchedJd);
      setFeatures(fetchedFeatures);
    }
  }, [fetchedJd, fetchedFeatures]);

  const [query, setQuery] = useState("");

  // Frontend-only session history
  const [history, setHistory] = useState([]);

  const [showFullDetails, setShowFullDetails] = useState(false);

  // ============================================================
  // UPLOAD JD
  // ============================================================

  const handleUploadJd = async (e) => {
    e?.preventDefault();

    try {
      const jd = await uploadJd({
        inputMode,
        selectedFile,
        pastedText,
      });

      setCurrentJd(jd);

      setFeatures(jd.features);

      // Frontend-only history
      setHistory((prev) => [
        ...prev,
        {
          id: `init-${Date.now()}`,
          type: "upload",
          message: `Job description "${
            jd.fileName || "Pasted Text"
          }" uploaded and analyzed.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          features: jd.features,
        },
      ]);

      setSelectedFile(null);
      setPastedText("");
    } catch (error) {
      // Error state is managed by useJDAssistant
      console.error("JD upload failed:", error);
    }
  };

  // ============================================================
  // UPDATE / QUERY JD
  // ============================================================

  const handleSendQuery = async (e) => {
    e?.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery || !currentJd?.id) {
      return;
    }

    // Clear input immediately
    setQuery("");

    try {
      const result = await updateJd(currentJd.id, cleanQuery);

      // Update current JD features
      if (result?.jd) {
        setFeatures(result.jd);

        setCurrentJd((prev) => ({
          ...prev,
          jdJson: result.jd,
        }));
      }

      // Frontend-only history
      setHistory((prev) => [
        ...prev,
        {
          id: `query-${Date.now()}`,
          type: "query",
          userQuery: cleanQuery,
          message: result?.message || "Response received",
          changed: result?.changed,
          features: result?.jd,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      // Error state is managed by useJDAssistant
      console.error("JD query failed:", error);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
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

          <span className="tracking-wide font-semibold">Resume Assistant</span>
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 lg:bg-transparent lg:pointer-events-none transition-opacity duration-300 print-hide"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[360px] sm:w-[420px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out print-hide ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">
                Resume Assistant
              </h2>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${isFetchingJd ? "bg-amber-400 animate-ping" : "bg-emerald-500"}`} />

                <span>{isFetchingJd ? "Loading saved JD..." : "Powered by Gemini 3.6 Flash"}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition"
            title="Close JD Assistant">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Upload / Input Card */}
          <div className="bg-gray-50/80 border border-gray-200/70 rounded-2xl p-3.5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                {currentJd ? "Update / Change JD" : "Upload Job Description"}
              </span>

              <div className="flex bg-gray-200/70 rounded-lg p-0.5 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setInputMode("file")}
                  className={`px-2 py-1 rounded-md transition ${
                    inputMode === "file"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  File
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode("text")}
                  className={`px-2 py-1 rounded-md transition ${
                    inputMode === "text"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}>
                  Paste Text
                </button>
              </div>
            </div>

            {/* File Input */}
            {inputMode === "file" ? (
              <div>
                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 hover:border-orange-400 rounded-xl cursor-pointer bg-white transition group">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-orange-500 mb-1 transition" />

                  <span className="text-[11px] font-semibold text-gray-700">
                    {selectedFile ? selectedFile.name : "Upload PDF or DOCX"}
                  </span>

                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Max size 10MB
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              /* Text Input */
              <div>
                <textarea
                  rows={4}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:border-orange-500 outline-none resize-y font-normal"
                />
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />

                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUploadJd}
              disabled={
                isUploading ||
                (inputMode === "file" && !selectedFile) ||
                (inputMode === "text" && !pastedText.trim())
              }
              className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer text-xs">
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />

                  <span>Analyzing with ai...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />

                  <span>
                    {currentJd
                      ? "Re-Analyze & Update"
                      : "Analyze Job Description"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* JD Features - Dynamic Key-Value View */}
          {features && (
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5 truncate">
                  <Briefcase className="w-3.5 h-3.5 text-orange-500 shrink-0" />

                  <span className="truncate">
                    {features.jobTitle || features.title || features.role || "Job Description Details"}
                  </span>
                </h3>

                <button
                  type="button"
                  onClick={() => setShowFullDetails(!showFullDetails)}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 p-1 hover:bg-orange-50 rounded-lg transition shrink-0">
                  <span>{showFullDetails ? "Less" : "Details"}</span>

                  {showFullDetails ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>

              <GenericFeatureRenderer data={features} showAll={showFullDetails} />
            </div>
          )}

          {/* Session History */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Session Activity ({history.length})</span>

              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-[10px] font-medium text-gray-400 hover:text-red-500 transition">
                  Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
                <Bot className="w-6 h-6 mx-auto mb-1 text-gray-300" />

                <p className="text-[11px]">
                  Upload a Job Description to start refining skills and
                  keywords.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5 shadow-sm animate-in fade-in">
                    {item.userQuery && (
                      <div className="flex items-start gap-1.5 text-gray-900 font-semibold text-[11px]">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />

                        <span>{item.userQuery}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-1.5 text-gray-700 text-[11px] pl-1">
                      <Bot className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />

                      <div className="flex-1 space-y-1">
                        <div>{item.message}</div>

                        {item.changed !== undefined && (
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              item.changed
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                            {item.changed ? "Updated" : "Query Only"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[9px] text-gray-400 text-right">
                      {item.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Query Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/90 backdrop-blur-sm">
          {queryError && (
            <div className="mb-2 text-[10px] text-red-600 bg-red-50 p-1.5 rounded-lg border border-red-100 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />

              <span>{queryError}</span>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[10px]">
            <button
              type="button"
              onClick={() => setQuery("What skills are required?")}
              className="px-2 py-0.5 bg-white border border-gray-200 hover:border-orange-300 rounded-full text-gray-600 hover:text-gray-900 transition whitespace-nowrap">
              Required skills?
            </button>

            <button
              type="button"
              onClick={() => setQuery("Add Docker to technical skills")}
              className="px-2 py-0.5 bg-white border border-gray-200 hover:border-orange-300 rounded-full text-gray-600 hover:text-gray-900 transition whitespace-nowrap">
              + Add Docker
            </button>

            <button
              type="button"
              onClick={() => setQuery("Summarize responsibilities")}
              className="px-2 py-0.5 bg-white border border-gray-200 hover:border-orange-300 rounded-full text-gray-600 hover:text-gray-900 transition whitespace-nowrap">
              Summarize
            </button>
          </div>

          {/* Query Form */}
          <form
            onSubmit={handleSendQuery}
            className="flex items-center gap-1.5">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!currentJd || isQuerying}
              placeholder={
                currentJd
                  ? "Ask query or instruction (e.g. 'Add Docker')..."
                  : "Upload JD first to query..."
              }
              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-orange-500 disabled:bg-gray-100 transition"
            />

            <button
              type="submit"
              disabled={!currentJd || !query.trim() || isQuerying}
              className="p-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 text-white rounded-xl shadow disabled:opacity-40 transition cursor-pointer"
              title="Send query">
              {isQuerying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
