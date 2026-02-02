'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { useBookingStore } from '@/lib/stores/bookingStore';
import { Trash2, Calendar, Clock, MapPin, Scissors, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api, handleApiError } from '@/lib/api/client';
import { AxiosError } from 'axios';
import SuccessModal from '@/components/SuccessModal';

export default function CartPage() {
  const { items, removeFromCart, clearCart, getTotalPrice, getTotalDuration } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { fetchBookings } = useBookingStore();
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in first', {
        duration: 4000,
      });
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Booking...');

    try {
      // Prepare bookings data for API
      const bookingsData = items.map((item) => ({
        barbershopId: item.barbershopId,
        barberId: item.barberId,
        serviceId: item.serviceId,
        date: item.date,
        time: item.time,
      }));

      // Create bookings via API
      await api.bookings.createMultiple({ bookings: bookingsData });
      
      toast.dismiss(loadingToast);
      toast.success('Bookings created successfully');
      
      // Refresh bookings list
      await fetchBookings();
      
      // Clear cart AFTER bookings are saved
      clearCart();
      
      // Open success modal
      setTimeout(() => {
        setIsSuccessModalOpen(true);
      }, 100);
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const apiError = handleApiError(error as AxiosError);
      toast.error(apiError.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="relative mb-6">
            <Scissors className="h-20 w-20 text-gray-400 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">Cart is Empty</h2>
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            Select a barbershop to add services to your cart
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            View Barbershops
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Cart</h1>

          <div className="space-y-4 mb-8">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{item.barbershopName}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{item.barbershopAddress}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Scissors className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{item.serviceName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{item.time} ({item.duration} min)</span>
                      </div>
                      {item.barberName && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">Barber: {item.barberName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success('Removed from cart');
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors mb-2"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                    <div className="text-xl font-bold text-gray-900">
                      {item.price.toLocaleString()} UZS
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 sticky bottom-0 shadow-xl"
          >
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg text-gray-700">
                <span>Total Services:</span>
                <span className="font-semibold">{items.length}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700">
                <span>Total Time:</span>
                <span className="font-semibold">{getTotalDuration()} min</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-200">
                <span className="text-gray-800">Total:</span>
                <span className="text-gray-900">
                  {getTotalPrice().toLocaleString()} UZS
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  clearCart();
                  toast.success('Cart cleared');
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Booking...' : 'Book Now'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewAppointments={() => {
          setIsSuccessModalOpen(false);
          router.push('/profile');
        }}
      />
    </div>
  );
}
