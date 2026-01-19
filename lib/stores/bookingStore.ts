// Booking Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking } from '@/types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  getBookingsByStatus: (status: Booking['status']) => Booking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (booking) => {
        set((state) => ({
          bookings: [...state.bookings, booking],
        }));
      },
      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, ...updates } : booking
          ),
        }));
      },
      cancelBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, status: 'cancelled' } : booking
          ),
        }));
      },
      getBookingsByStatus: (status) => {
        return get().bookings.filter((booking) => booking.status === status);
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);
