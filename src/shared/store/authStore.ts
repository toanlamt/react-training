import { create } from 'zustand';
import type { User, LoginCredentials, SignUpPayload } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpPayload) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  signUp: async (credentials: SignUpPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.signUp(credentials);
      set({ isAuthenticated: false, isLoading: false });
      return result;
    } catch (error: any) {
      const errorDetail = Array.isArray(error.response?.data?.detail)
        ? error.response.data.detail.map((item: any) => item.msg).join('<br />')
        : error.response?.data?.detail || 'Sign-up failed';
      set({
        error: errorDetail,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (_) {
      // ignore error
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      localStorage.setItem('user', JSON.stringify(user));
      set({
        user: user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  clearError: () => set({ error: null })
}));