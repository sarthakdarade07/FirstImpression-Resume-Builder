import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi } from "../../components/authPage/services/authService";

export const loginUser = createAsyncThunk(
    "auth/loginUser",

    async(
        {email,password},{rejectWithValue}
    )=>{

        try {
            const data = await loginUserApi(email, password);
            const user = {
                id: data.response.id,
                name: data.response.name,
                email: data.response.email,
                subscriptionPlan: data.response.subscriptionPlan,
                profileImageUrl: data.response.profileImageUrl,
            };

            const token = data.response.jwtToken;

            return {
                token,
                user
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Invalid credentials"
            );
        }
    }
)   

