// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './autSlice'; // Ensure the filename is correct
import authRegisReducer from './registerSlice'; // Import the authRegis reducer

export const store = configureStore({
  reducer: {
    auth: authReducer, // Handles auth-related state
    authRegis: authRegisReducer, // Handles registration-related state
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
