// src/features/auth/types.ts
export interface UserRegistration {
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
  user: UserRegistration | null;
  loading: boolean;
  error: string | null;  // Updated to allow null
}