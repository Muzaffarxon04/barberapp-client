'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useAuthStore } from '@/lib/stores/authStore';
import { useBookingStore } from '@/lib/stores/bookingStore';
import { Booking, BookingStatus } from '@/types';
import ConfirmModal from '@/components/ConfirmModal';
import BookingModal from '@/components/BookingModal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { bookings, fetchBookings, cancelBooking } = useBookingStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      // Fetch bookings when authenticated
      fetchBookings().catch(console.error);
    }
  }, [isAuthenticated, router, fetchBookings]);

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

  const handleCancelClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the details modal
    setCancelId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (cancelId) {
      try {
        await cancelBooking(cancelId);
        setIsConfirmModalOpen(false);
        setCancelId(null);
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
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
                  onClick={() => {
                    setSelectedBooking(booking);
                    setIsModalOpen(true);
                  }}
                  className="border border-gray-200 p-4 cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {booking.barbershopName}
                      </h3>
                      <p className="text-xs text-gray-500">{booking.serviceName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={(e) => handleCancelClick(e, booking.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium px-4 py-1 rounded bg-red-200 hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
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

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setCancelId(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
        variant="danger"
      />
    </div>
  );
}
