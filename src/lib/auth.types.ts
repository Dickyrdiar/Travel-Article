 
export interface User {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: { message: string };
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

