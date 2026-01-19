'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  token: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem('admin-session');
    if (adminSession) {
      try {
        const session: AdminSession = JSON.parse(adminSession);
        if (session.role === 'admin' && session.token) {
          router.push('/admin/dashboard');
        }
      } catch {
        // Invalid session, clear it
        localStorage.removeItem('admin-session');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual admin API call
      // await api.admin.auth.login({ email, password });
      
      // For now, use mock admin authentication
      // Check admin credentials
      const adminCredentials = [
        { email: 'admin@barbershop.uz', password: 'admin123', name: 'Admin User' },
        { email: 'admin@example.com', password: 'admin123', name: 'Admin' },
      ];

      const validAdmin = adminCredentials.find(
        (cred) => cred.email === email && cred.password === password
      );

      if (!validAdmin) {
        toast.error('Invalid email or password. Only admins can login.');
        setLoading(false);
        return;
      }

      // Create admin session
      const adminSession: AdminSession = {
        id: 'admin-' + Date.now(),
        email: validAdmin.email,
        name: validAdmin.name,
        role: 'admin',
        token: 'admin-token-' + Date.now(),
      };

      // Save admin session (separate from regular user auth)
      localStorage.setItem('admin-session', JSON.stringify(adminSession));
      
      toast.success('Successfully logged into admin panel!', {
        icon: '🎉',
        duration: 2000,
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 500);
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('An error occurred. Please try again.');
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
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900"
                placeholder="admin@barbershop.uz"
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

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Demo: admin@barbershop.uz / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
