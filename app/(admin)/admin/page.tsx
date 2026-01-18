'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Scissors, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
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
      } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 mb-4 shadow-lg"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-600">Admin Login</p>
            <p className="text-xs text-gray-500 mt-1">For admins only</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="admin@barbershop.uz"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-red-700 hover:via-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-sm text-orange-700 text-center">
              <Shield className="h-4 w-4 inline mr-1" />
              Demo admin: <span className="font-semibold">admin@barbershop.uz</span> / <span className="font-semibold">admin123</span>
            </p>
          </div>

         
        </div>
      </motion.div>
    </div>
  );
}
