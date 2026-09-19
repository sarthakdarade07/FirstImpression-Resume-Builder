import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api/axios";
import resumeApi from "../../../services/resumeApi";
import { uploadJd as uploadJdThunk, fetchJdByResumeId } from "../../../redux/thunks/jdThunk";

const useJDAssistant = ({ resumeId = null }) => {
  const dispatch = useDispatch();
  const { jd: reduxJd, fetching: isFetchingJd } = useSelector((state) => state.jd);

  const [isUploading, setIsUploading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);

  const [uploadError, setUploadError] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [tailorError, setTailorError] = useState(null);
  const [tailorResult, setTailorResult] = useState(null);

  useEffect(() => {
    if (resumeId) { 
      dispatch(fetchJdByResumeId(resumeId));
    }
  }, [dispatch, resumeId]);

  const features = useMemo(() => {
    if (!reduxJd?.jdJson) return null;
    try {
      return typeof reduxJd.jdJson === "string"
        ? JSON.parse(reduxJd.jdJson)
        : reduxJd.jdJson;
    } catch {
      return null;
    }
  }, [reduxJd]);


  const uploadJd = async ({ inputMode, selectedFile, pastedText }) => {
    setUploadError(null);

    if (inputMode === "file" && !selectedFile) {
      const error = "Please select a PDF, DOCX, or TXT file.";
      setUploadError(error);
      throw new Error(error);
    }

    if (inputMode === "text" && !pastedText?.trim()) {
      const error = "Please paste job description text.";
      setUploadError(error);
      throw new Error(error);
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      if (inputMode === "file") {
        formData.append("file", selectedFile);
      } else {
        formData.append("text", pastedText.trim());
      }

      if (resumeId) {
        formData.append("resumeId", resumeId);
      }

      const response = await dispatch(uploadJdThunk(formData)).unwrap();
      console.log("In useJDAssistant{} response of upload jd",response);
      const jd = response;

      let parsedFeatures = null;

      if (jd?.jdJson) {
        try {
          parsedFeatures =
            typeof jd.jdJson === "string" ? JSON.parse(jd.jdJson) : jd.jdJson;
        } catch (error) {
          console.error("Failed to parse JD JSON:", error);
        }
      }

      return {
        ...jd,
        features: parsedFeatures,
      };
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to upload JD";

      const message =
        typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);

      setUploadError(message);

      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const updateResume = async (resumeId, query) => {
    setQueryError(null);
 
    const cleanQuery = query?.trim();

    if (!resumeId) {
      const error = "resume not found";
      setQueryError(error);
      throw new Error(error);
    }

    if (!cleanQuery) {
      const error = "Query cannot be empty.";
      setQueryError(error);
      throw new Error(error);
    }

    setIsQuerying(true);

    try {
      const response = await api.post(`/api/resumes/${resumeId}/update-resume`, {
        query: cleanQuery,
      }, {
        timeout: 120000,
      });
        
      const freshResume = await resumeApi.getResumeById(resumeId);

       const parsedData = freshResume?.resumeDataJson
         ? typeof freshResume.resumeDataJson === "string"
           ? JSON.parse(freshResume.resumeDataJson)
           : freshResume.resumeDataJson
         : freshResume;

          setTailorResult(parsedData);
      return {
        ...response.data,
        updatedResumeData: parsedData,
      };
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Query failed";

      const message = typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);

      setQueryError(message);

      throw error;
    } finally {
      setIsQuerying(false);
    }
  };

  const tailorResume = async (targetResumeId = null) => {
    setTailorError(null);
    const activeId = targetResumeId || resumeId;
    if (!activeId) {
      const err = "Please save or open a resume first to tailor it.";
      setTailorError(err);
      throw new Error(err);
    }

    setIsTailoring(true);
    try {
      const result = await resumeApi.tailorResumeToJd(activeId);
      setTailorResult(result);
      return result;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to tailor resume with AI";

      const message =
        typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg);

      setTailorError(message);
      throw error;
    } finally {
      setIsTailoring(false);
    }
  };

  const clearErrors = () => {
    setUploadError(null);
    setQueryError(null);
    setTailorError(null);
  };

  return {
    jd: reduxJd,
    features,
    isFetchingJd,

    uploadJd,
    updateResume,
    tailorResume,

    isUploading,
    isQuerying,
    isTailoring,

    uploadError,
    queryError,
    tailorError,
    tailorResult,
    setTailorResult,

    clearErrors,
  };
};

export default useJDAssistant;
