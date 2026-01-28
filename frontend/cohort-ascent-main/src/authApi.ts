import api from './api';

export interface LoginRequest {
  empId: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  userId: number;
  empId: string;
  name: string;
  role: string;
}

export const authApi = {
  login: (credentials: LoginRequest) => api.post<AuthResponse>('/auth/login', credentials),
};