'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Scissors,
  Calendar,
  Menu,
  X,
  LogOut,
  Store,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';

interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  token: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Initialize state from localStorage to avoid synchronous setState in effect
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const session = localStorage.getItem('admin-session');
      if (session) {
        const parsed: AdminSession = JSON.parse(session);
        if (parsed.role === 'admin' && parsed.token) {
          return parsed;
        }
      }
    } catch {
      // Ignore parsing errors during initialization
    }
    return null;
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Check admin session and handle redirects (but only for protected routes, not login page)
  useEffect(() => {
    // Skip check for login page
    if (pathname === '/admin') {
      return;
    }

    // Check admin session and handle redirects if needed
    const session = localStorage.getItem('admin-session');
    if (!session || !adminSession) {
      toast.error('Admin access required');
      router.push('/admin');
      return;
    }

    try {
      const parsed: AdminSession = JSON.parse(session);
      if (parsed.role !== 'admin' || !parsed.token) {
        localStorage.removeItem('admin-session');
        toast.error('Admin access required');
        router.push('/admin');
        return;
      }
    } catch {
      localStorage.removeItem('admin-session');
      toast.error('Admin access required');
      router.push('/admin');
    }
  }, [router, pathname, adminSession]);

  // Don't show dashboard layout on login page
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('admin-session');
    toast.success('Logged out from admin panel');
    router.push('/admin');
    router.refresh();
  };

  const menuItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/barbershops', icon: Store, label: 'Barbershops' },
    { href: '/admin/services', icon: Scissors, label: 'Services' },
    { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  ];
  
  // Check if active route matches or starts with menu item href
  const isActiveRoute = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname?.startsWith(href);
  };

  // Show dashboard layout for all other admin pages
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Admin Panel
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gray-50 text-gray-900 border border-gray-300'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

       
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              {adminSession && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-semibold text-gray-900">{adminSession.name}</div>
                    <div className="text-xs text-gray-500">{adminSession.email}</div>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
}
