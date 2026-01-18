'use client';

import { motion } from 'framer-motion';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Barbershop booking platform management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBarbershops}</div>
          <div className="text-sm text-gray-600">Jami Barbershoplar</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Scissors className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalServices}</div>
          <div className="text-sm text-gray-600">Total Services</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBookings}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeUsers}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{booking.barbershopName}</div>
                <div className="text-sm text-gray-600">{booking.serviceName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {booking.date} | {booking.time}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
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
