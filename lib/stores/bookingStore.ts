// Booking Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking } from '@/types';
import { api, handleApiError, BookingResponse } from '@/lib/api/client';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string) => Promise<void>;
  getBookingsByStatus: (status: Booking['status']) => Booking[];
  fetchBookings: (status?: Booking['status']) => Promise<void>;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      isLoading: false,

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

      cancelBooking: async (id: string) => {
        try {
          set({ isLoading: true });
          await api.bookings.cancel(id);
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === id ? { ...booking, status: 'cancelled' } : booking
            ),
          }));
          toast.success('Booking cancelled successfully');
        } catch (error: unknown) {
          const apiError = handleApiError(error as AxiosError);
          toast.error(apiError.message || 'Failed to cancel booking');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getBookingsByStatus: (status) => {
        return get().bookings.filter((booking) => booking.status === status);
      },

      fetchBookings: async (status?: Booking['status']) => {
        try {
          set({ isLoading: true });
          const response = await api.bookings.getAll({ status });
          // Map API response to Booking type
          const bookings: Booking[] = response.items.map((item: BookingResponse) => ({
            id: item.id,
            barbershopId: item.barbershopId,
            barbershopName: item.barbershopName,
            barberId: item.barberId || undefined,
            barberName: item.barberName || undefined,
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            date: item.date,
            time: item.time,
            price: item.price,
            duration: item.duration,
            status: item.status,
            createdAt: item.createdAt,
          }));
          set({ bookings });
        } catch (error: unknown) {
          const apiError = handleApiError(error as AxiosError);
          toast.error(apiError.message || 'Failed to fetch bookings');
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'booking-storage',
    }
  )
);
