// Auth Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { api, handleApiError } from '@/lib/api/client';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, showToast?: boolean) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string, showToast = true) => {
        try {
          set({ isLoading: true });
          const { user: userData } = await api.auth.login({ email, password });

          const user: User = {
            id: userData.id,
            name: userData.name || '',
            email: userData.email,
            phone: userData.phone || '',
            avatar: userData.avatar || undefined,
          };

          set({ user, isAuthenticated: true });
          if (showToast) {
            toast.success('Successfully logged in');
          }
        } catch (error: unknown) {
          const apiError = handleApiError(error as AxiosError);
          toast.error(apiError.message || 'Login failed');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name: string, email: string, phone: string, password: string) => {
        try {
          set({ isLoading: true });
          await api.auth.register({ name, email, phone, password });
          // After registration, login automatically
          await get().login(email, password, false);
          toast.success('Registration successful');
        } catch (error: unknown) {
          const apiError = handleApiError(error as AxiosError);
          toast.error(apiError.message || 'Registration failed');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCurrentUser: async () => {
        try {
          const userData = await api.auth.getCurrentUser();
          const user: User = {
            id: userData.id,
            name: userData.name || '',
            email: userData.email,
            phone: userData.phone || '',
            avatar: userData.avatar || undefined,
          };
          set({ user, isAuthenticated: true });
        } catch (error: unknown) {
          // If fetching user fails, clear auth state
          set({ user: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.auth.logout();
        } catch (error) {
          // Even if logout fails on server, clear local state
          console.error('Logout error:', error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
