'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useAuthStore } from '@/lib/stores/authStore';
import { useBookingStore } from '@/lib/stores/bookingStore';
import { BookingStatus } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { bookings } = useBookingStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Profile</h1>
          <p className="text-sm text-gray-500">Your account information</p>
        </div>

        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Name</p>
              <p className="text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-sm text-gray-900">{user.phone}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Appointment History</h2>
          
          {sortedBookings.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {booking.barbershopName}
                      </h3>
                      <p className="text-xs text-gray-500">{booking.serviceName}</p>
                    </div>
                    <span className={`text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Date</p>
                      <p className="text-gray-900">{formatDate(booking.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Time</p>
                      <p className="text-gray-900">{booking.time}</p>
                    </div>
                    {booking.barberName && (
                      <div>
                        <p className="text-gray-500 mb-1">Barber</p>
                        <p className="text-gray-900">{booking.barberName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 mb-1">Price</p>
                      <p className="text-gray-900">{booking.price.toLocaleString()} UZS</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Booked on {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
