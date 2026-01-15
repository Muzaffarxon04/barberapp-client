// Auth Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock authentication - will be replaced with API calls
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // TODO: Replace with actual API call
        // const response = await api.auth.login({ email, password });
        // For now, use mock data
        const mockUser: User = {
          id: '1',
          name: 'Test User',
          email,
          phone: '+998901234567',
        };
        set({ user: mockUser, isAuthenticated: true });
      },
      register: async (name: string, email: string, phone: string, password: string) => {
        // TODO: Replace with actual API call
        // const response = await api.auth.register({ name, email, phone, password });
        const mockUser: User = {
          id: Date.now().toString(),
          name,
          email,
          phone,
        };
        set({ user: mockUser, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
