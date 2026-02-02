'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, handleApiError } from '@/lib/api/client';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in and has admin role
    if (isAuthenticated && user) {
      // Check if user has admin role (this would come from the API)
      // For now, we'll check after login
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.admins.login({ username, password });

      toast.success('Successfully logged into admin panel!', {
        icon: '🎉',
        duration: 2000,
      });

      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Invalid email or password. Only admins can login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Admin Login
            </h1>
            <p className="text-sm text-gray-500">Enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

        
        </div>
      </div>
    </div>
  );
}
