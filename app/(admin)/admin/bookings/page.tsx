'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, handleApiError, BookingResponse } from '@/lib/api/client';
import { AxiosError } from 'axios';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {};

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.admin.bookings.getAll(params);
      setBookings(response.items);
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.admin.bookings.updateStatus(id, newStatus as any);
      toast.success('Status updated');
      fetchBookings();
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      await api.admin.bookings.delete(id);
      toast.success('Booking deleted');
      fetchBookings();
    } catch (error: unknown) {
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'Failed to delete booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'completed':
        return 'bg-gray-50 text-gray-700';
      case 'cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900 mb-1">Bookings</h1>
        <p className="text-sm text-gray-500">Manage all bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 p-3 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 placeholder:text-gray-400 bg-white text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 bg-white text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Barbershop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.userName || 'Unknown User'}</div>
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
                        {booking.price?.toLocaleString()} UZS
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
                            className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="p-2 border border-gray-300 text-red-600 hover:bg-red-50 transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                            title="Complete"
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
        )}
      </div>

      {!isLoading && bookings.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200">
          <p className="text-gray-600">Nothing found</p>
        </div>
      )}
    </div>
  );
}
