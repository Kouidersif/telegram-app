import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/api";
import { showAlert } from "./alertSlice";
import { setTgSsid } from "./userSlice";

export const verifyCode = createAsyncThunk(
    'telegram/verifyCode',
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post('/telegram/verify', formData);
            if (response.status !== 200) {
                throw new Error('Failed to verify code');
            }
            const data = await response.data;
            dispatch(showAlert({
                message: 'Code verified successfully',
                type: 'success',
            }));
            return data;
        } catch (error) {
            const errorMsg = error.response?.data?.detail;
            const errorMessage = typeof errorMsg === 'object' ? errorMsg.msg || "Request Failed" : errorMsg || 'Something went wrong';
            dispatch(showAlert({
                message: errorMessage,
                type: 'failure',
            }));
            return rejectWithValue(error.message);
        }
    }
)

export const connectTelegram = createAsyncThunk(
    'telegram/connectTelegram',
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post('/telegram/connect', formData);
            if (response.status !== 200) {
                throw new Error('Failed to connect to telegram');
            }
            const data = await response.data;
            dispatch(setTgSsid(data?.session_id))
            return data;
        } catch (error) {
            const errorMsg = error.response?.data?.detail;
            const errorMessage = typeof errorMsg === 'object' ? errorMsg.msg || "Request Failed" : errorMsg || 'Something went wrong';
            dispatch(showAlert({
                message: errorMessage,
                type: 'failure',
            }));
            return rejectWithValue(error.message);
        }
    }
)





const initialState = {
    loading: false,
    error: null,
    phone_code_hash: null,
    success: false,
    codeVerified: false,
}

export const telegramSlice = createSlice({
    name: "telegram",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setCodeVerified: (state, action) => {
            state.codeVerified = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(connectTelegram.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(connectTelegram.fulfilled, (state, action) => {
                state.loading = false;
                state.phone_code_hash = action.payload.phone_code_hash;
                state.success = action.payload.code_required;
            })
            .addCase(connectTelegram.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(verifyCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyCode.fulfilled, (state) => {
                state.loading = false;
                state.codeVerified = true;
                state.phone_code_hash = null;
                state.success = false;
            })
            .addCase(verifyCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.codeVerified = false;
                state.phone_code_hash = null;
                state.success = false;
            })
    }
})

export const { setLoading, setError, setCodeVerified } = telegramSlice.actions;
export default telegramSlice.reducer;