/* eslint-disable @typescript-eslint/no-explicit-any */
// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Interface untuk response error
interface ApiError {
  details: Record<string, unknown>;
  message: string;
  name: string;
  status: number;
}

// Interface untuk state auth
interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: ApiError | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk untuk login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.error || {
        message: 'An unknown error occurred',
        name: 'ValidationError',
        status: 500,
      });
    }
  }
);

// Buat slice untuk auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Hapus token dari localStorage
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
        localStorage.setItem('token', jwt); // Simpan token ke localStorage
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.loading = false;

        // Safely handle the unknown type
        if (typeof action.payload === 'object' && action.payload !== null) {
          const errorPayload = action.payload as ApiError; // Cast to ApiError
          state.error = {
            details: errorPayload.details || {},
            message: errorPayload.message || 'An unknown error occurred',
            name: errorPayload.name || 'ValidationError',
            status: errorPayload.status || 500,
          };
        } else {
          state.error = {
            details: {},
            message: 'An unknown error occurred',
            name: 'ValidationError',
            status: 500,
          };
        }
      });
  },
});

// Export actions
export const { logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;