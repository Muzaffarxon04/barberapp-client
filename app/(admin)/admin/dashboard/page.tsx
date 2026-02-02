'use client';

import { useEffect, useState } from 'react';
import { Store, Scissors, Calendar, Users } from 'lucide-react';
import { api, handleApiError, BookingResponse } from '@/lib/api/client';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBarbershops: 0,
    totalServices: 0,
    totalBarbers: 0,
    totalBookings: 0,
    activeUsers: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    recentBookings: [] as BookingResponse[],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const statsData = await api.admin.dashboard.getStats();
        setStats(statsData);
      } catch (error: unknown) {
        const apiError = handleApiError(error as AxiosError);
        toast.error(apiError.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Barbershop booking platform management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Store className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalBarbershops}</div>
          <div className="text-sm text-gray-600">Total Barbershops</div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Scissors className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalServices}</div>
          <div className="text-sm text-gray-600">Total Services</div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalBookings}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeUsers}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h2>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : !stats.recentBookings || stats.recentBookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No recent bookings</div>
        ) : (
          <div className="space-y-3">
            {stats.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{booking.barbershopName}</div>
                  <div className="text-xs text-gray-600">{booking.serviceName}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {booking.date} | {booking.time}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium ${booking.status === 'confirmed'
                      ? 'bg-green-50 text-green-700'
                      : booking.status === 'completed'
                        ? 'bg-blue-50 text-blue-700'
                        : booking.status === 'cancelled'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-yellow-50 text-yellow-700'
                    }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
