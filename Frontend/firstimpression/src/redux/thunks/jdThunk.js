import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
const baseUrl = "api/ai"
export const uploadJd =  createAsyncThunk(
    "jd/uploadJd",

    async(formdata,{rejectWithValue})=>{
         try{
            const response = await api.post(`${baseUrl}/jd`, formdata, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 120000,
            });

            return response.data;
         }
         catch(error){
            return rejectWithValue(
                "Faild Upload JD"
            );
         }
    }
);

export const fetchJdByResumeId = createAsyncThunk(
    "jd/fetchJdByResumeId",
    async (resumeId, { rejectWithValue }) => {
        try {
            const response = await api.get(`${baseUrl}/jd/resume/${resumeId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch JD"
            );
        }
    }
);