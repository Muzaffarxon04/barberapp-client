'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Scissors, User, DollarSign, CheckCircle } from 'lucide-react';
import { Booking, BookingStatus } from '@/types';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function BookingModal({ isOpen, onClose, booking }: BookingModalProps) {
  if (!booking) return null;

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-gray-900">Booking Information</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(booking.status)}`}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {/* Booking Details */}
              <div className="space-y-6">
                {/* Barbershop Info */}
                <div className="text-black border-b border-gray-200 pb-4">Book Appointment
                  <div className="flex items-center gap-2 mb-2">
                    <Scissors className="h-5 w-5 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900">{booking.barbershopName}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{booking.serviceName}</p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="text-sm font-medium text-gray-900">{booking.time}</p>
                    </div>
                  </div>
                </div>

                {/* Barber */}
                {booking.barberName && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Barber</p>
                      <p className="text-sm font-medium text-gray-900">{booking.barberName}</p>
                    </div>
                  </div>
                )}

                {/* Service Details */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Service Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service:</span>
                      <span className="text-gray-900 font-medium">{booking.serviceName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900 font-medium">{booking.duration} minutes</span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Total Price</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {Number(booking.price || 0)?.toLocaleString()} UZS
                    </span>
                  </div>
                </div>

                {/* Booking Date */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">
                    Booked on {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
