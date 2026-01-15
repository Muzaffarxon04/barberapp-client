'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock bookings data
const mockBookings = [
  {
    id: '1',
    barbershopName: 'Premium Barbershop',
    serviceName: 'Soch olish',
    userName: 'Ali Valiyev',
    date: '2024-01-15',
    time: '14:00',
    price: 50000,
    status: 'confirmed',
  },
  {
    id: '2',
    barbershopName: 'Modern Style',
    serviceName: 'Soch + Soqol',
    userName: 'Hasan Karimov',
    date: '2024-01-15',
    time: '15:30',
    price: 70000,
    status: 'pending',
  },
  {
    id: '3',
    barbershopName: 'Elite Barbershop',
    serviceName: 'Soqol tuzatish',
    userName: 'Javohir Toshmatov',
    date: '2024-01-16',
    time: '10:00',
    price: 30000,
    status: 'completed',
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.barbershopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.admin.bookings.updateStatus(id, newStatus);
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      toast.success('Status yangilandi');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Tasdiqlangan';
      case 'pending':
        return 'Kutilmoqda';
      case 'completed':
        return 'Yakunlangan';
      case 'cancelled':
        return 'Bekor qilingan';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bronlar</h1>
        <p className="text-gray-600">Barcha bookinglarni boshqarish</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="all">Barcha statuslar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="confirmed">Tasdiqlangan</option>
            <option value="completed">Yakunlangan</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Barbershop
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Xizmat
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Sana/Vaqt
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Narx
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Harakatlar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.userName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{booking.barbershopName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{booking.serviceName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">
                      <div>{booking.date}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {booking.price.toLocaleString()} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          title="Tasdiqlash"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                          title="Bekor qilish"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Yakunlash"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600">Hech narsa topilmadi</p>
        </div>
      )}
    </div>
  );
}
