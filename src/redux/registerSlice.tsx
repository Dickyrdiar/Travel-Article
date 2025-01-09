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

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local/register';

export const registerUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>(
  'auth/register',
  async (credentials: { username: string, email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, credentials);
      console.log("response", response)
      
      // Assuming the API returns { user: User, jwt: string }
      const { jwt, user } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', jwt);
      
      return { ...user, jwt } ;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;  // Set error to null on success
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;