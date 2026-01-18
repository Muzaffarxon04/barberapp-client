'use client';

import { motion } from 'framer-motion';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { Trash2, Calendar, Clock, MapPin, Scissors, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeFromCart, clearCart, getTotalPrice, getTotalDuration } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

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

    const loadingToast = toast.loading('Booking...');

    try {
      // TODO: Replace with actual API call
      // await api.bookings.createMultiple(items);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.dismiss(loadingToast);
      toast.success('Booking completed successfully!', {
        icon: '🎉',
        duration: 4000,
      });
      clearCart();
      
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('An error occurred. Please try again.');
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20" />
            <Scissors className="h-20 w-20 text-gray-400 mx-auto relative z-10" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">Cart is Empty</h2>
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            Select a barbershop to add services to your cart
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
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
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${item.price.toLocaleString()}
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
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${getTotalPrice().toLocaleString()}
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
