import type { HttpStatusCode } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SetPasswordRequest,
  User,
  UserProfile,
} from '../types';
import { apiClient } from './axios';

export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users/create', data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/profile');
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordRequest,
  ): Promise<HttpStatusCode.NoContent> => {
    const response = await apiClient.post('/profile/reset', data);
    return response.data;
  },

  setPassword: async (
    data: SetPasswordRequest,
  ): Promise<HttpStatusCode.NoContent> => {
    const response = await apiClient.post('/profile/password', data);
    return response.data;
  },
};
