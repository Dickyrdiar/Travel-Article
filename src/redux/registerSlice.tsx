/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/auth/types.ts
// src/features/auth/types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  jwt?: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ErrorResponse {
  message: string;
  details?: Record<string, any>; // Untuk menyimpan detail error jika ada
  status?: number; // Status code error
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  errorDetails: ErrorResponse | null; // Menyimpan detail error
}

// src/features/auth/authSlice.ts
// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local/register';

export const registerUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: ErrorResponse } // Gunakan ErrorResponse sebagai tipe rejectValue
>(
  'auth/register',
  async (credentials: { username: string, email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, credentials);
      console.log("response", response);
      
      // Assuming the API returns { user: User, jwt: string }
      const { jwt, user } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', jwt);
      
      return { ...user, jwt };
    } catch (error) {
      // console.log("error", error?.response?.data?.error?.message || "An unknown error occurred")

      if (axios.isAxiosError(error)) {
        // Tangkap error response dari API
        const errorResponse: ErrorResponse = {
          message: error?.response?.data?.error?.message , 
          details: error.response?.data?.details, 
          status: error.response?.status || 500,
        };
        return rejectWithValue(errorResponse);
      }
    }
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  errorDetails: null, // Inisialisasi errorDetails
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.errorDetails = null; // Reset errorDetails saat logout
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
      state.errorDetails = null; // Reset errorDetails saat clearError
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorDetails = null; // Reset errorDetails saat pending
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null; // Set error to null on success
        state.errorDetails = null; // Reset errorDetails on success
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || null
        state.errorDetails = action.payload || null
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;