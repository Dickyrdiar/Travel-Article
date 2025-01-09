/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: object | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove the token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        const { user, jwt } = action.payload;
        state.loading = false;
        state.user = user;
        state.token = jwt;
        localStorage.setItem('token', jwt); // Save the token to localStorage
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
