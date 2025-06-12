import apiClient from './apiClient';
import type { LoginCredentials, User, SignUpPayload } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<any> => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error || new Error('Failed to login');
    }
  },

  signUp: async (credentials: SignUpPayload): Promise<any> => {
    try {
      const response = await apiClient.post('/auth/register', credentials);
      return response.data;
    } catch (error: any) {
      throw error || new Error('Failed to sign up');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      throw error || new Error('Failed to logout');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error: any) {
      throw error || new Error('Failed to fetch current user');
    }
  },
};