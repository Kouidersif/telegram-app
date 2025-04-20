
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/api";
import { showAlert } from "./alertSlice";



export const getConversations = createAsyncThunk(
    'chat/getConversations',
    async (sessionId, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.get(`/telegram/chats/${sessionId}`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch conversations');
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
);

export const getConversationMessages = createAsyncThunk(
    'chat/getConversationMessages',
    async ({ sessionId, conversationId }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.get(`/telegram/messages/${sessionId}/${conversationId}?limit=50`);
            if (response.status !== 200) {
                throw new Error('Failed to fetch messages');
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



const initialState = {
    messages: [],
    loading: false,
    error: null,
    conversations: [],
    fetchingMessages: false,
};
export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        removeMessage: (state, action) => {
            state.messages.splice(action.payload, 1);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConversations.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.conversations = [];
            })
            .addCase(getConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload;
            })
            .addCase(getConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.conversations = [];
            })
            .addCase(getConversationMessages.pending, (state) => {
                state.fetchingMessages = true;
                state.error = null;
                state.messages = [];
            })
            .addCase(getConversationMessages.fulfilled, (state, action) => {
                state.fetchingMessages = false;
                state.messages = action.payload;
            })
            .addCase(getConversationMessages.rejected, (state, action) => {
                state.fetchingMessages = false;
                state.error = action.payload;
                state.messages = [];
            })
    }
})

export const { addMessage, removeMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;