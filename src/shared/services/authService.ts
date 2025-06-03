import apiClient from './apiClient';
import type { LoginCredentials, User, SignUpCredentials } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<any> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  signUp: async (credentials: SignUpCredentials): Promise<any> => {
     const response = await apiClient.post('/auth/register', credentials);
     return response.data; 
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};