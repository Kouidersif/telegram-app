
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/api";
import { showAlert } from "./alertSlice";


export const getUser = createAsyncThunk(
    'user/getUser',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.get('/user'); // TODO : Add endpoint
            if (response.status !== 200) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.data;
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

export const LoginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post('/token', credentials, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            if (response.status !== 200) {
                throw new Error('Failed to login');
            }
            const data = await response.data;
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

export const LogoutUser = createAsyncThunk(
    'user/logoutUser',
    async (tg_ssid, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.post(`/telegram/logout/${tg_ssid}`);
            if (response.status !== 200) {
                throw new Error('Failed to login');
            }
            const data = await response.data;
            return data;
        } catch (error) {
            const errorMsg = error.response?.data?.detail;
            const errorMessage = typeof errorMsg === 'object' ? errorMsg.msg || "Request Failed" : errorMsg || 'Something went wrong';
            console.log("error msg", errorMessage);
            dispatch(showAlert({
                message: errorMessage,
                type: 'failure',
            }));
            return rejectWithValue(error.message);
        }
    }
)

export const Register = createAsyncThunk(
    'user/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/register', credentials);
            if (response.status !== 200) {
                throw new Error('Failed to login');
            }
            const data = await response.data;
            return data;
        } catch (error) {
            // TODO : Add descriptive msg
            return rejectWithValue(error.message);
        }
    }
)




const initialState = {
    accessToken: null,
    error: null,
    loading: false,
    tg_ssid: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setTgSsid: (state, action) => {
            state.tg_ssid = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.accessToken = data?.access;
                state.isAuthenticated = true;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.accessToken = data?.access_token;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(Register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(Register.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.accessToken = data?.access_token;
            })
            .addCase(Register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(LogoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // eslint-disable-next-line no-unused-vars
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = null;
                state.tg_ssid = null;
                state.error = null;
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.accessToken = null; 
                state.tg_ssid = null;
            })
    }
})

export const { setAccessToken, setTgSsid } = userSlice.actions;
export default userSlice.reducer;