'use client';

import { Store, Scissors, Calendar, Users } from 'lucide-react';
import { mockBarbershops } from '@/lib/data';

export default function AdminDashboard() {
  // Mock stats - TODO: Replace with API calls
  const stats = {
    totalBarbershops: mockBarbershops.length,
    totalServices: mockBarbershops.reduce((sum, bs) => sum + bs.services.length, 0),
    totalBookings: 156, // Mock
    activeUsers: 89, // Mock
  };

  const recentBookings = [
    {
      id: '1',
      barbershopName: 'Premium Barbershop',
      serviceName: 'Soch olish',
      date: '2024-01-15',
      time: '14:00',
      status: 'confirmed',
    },
    {
      id: '2',
      barbershopName: 'Modern Style',
      serviceName: 'Soch + Soqol',
      date: '2024-01-15',
      time: '15:30',
      status: 'pending',
    },
  ];

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
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-3">
          {recentBookings.map((booking) => (
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
                className={`px-2 py-1 text-xs font-medium ${
                  booking.status === 'confirmed'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}
              >
                {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
