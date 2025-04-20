import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: 'info' // 'info', 'success', 'warning', 'error'
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
    },
    clearAlert: (state) => {
      state.message = '';
      state.type = 'info';
    }
  }
});

export const { showAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;