export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface GoogleCredential {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}