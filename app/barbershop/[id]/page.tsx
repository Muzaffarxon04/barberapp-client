'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Clock, Phone, Calendar, User, Scissors } from 'lucide-react';
import { mockBarbershops } from '@/lib/data';
import ServiceCard from '@/components/ServiceCard';
import BarberCard from '@/components/BarberCard';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function BarbershopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const barbershop = mockBarbershops.find((bs) => bs.id === params.id);

  if (!barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Barbershop topilmadi</p>
      </div>
    );
  }

  // Generate time slots (mock)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({ time, available: Math.random() > 0.3 }); // 70% available
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Filter barbers by selected service
  const availableBarbers = selectedService
    ? barbershop.barbers.filter((barber) => barber.services.includes(selectedService))
    : barbershop.barbers;

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    // Reset barber selection if current barber doesn't provide this service
    if (selectedBarber) {
      const service = barbershop.services.find((s) => s.id === serviceId);
      if (service) {
        const barber = barbershop.barbers.find((b) => b.id === selectedBarber);
        if (barber && !barber.services.includes(serviceId)) {
          setSelectedBarber(null);
        }
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Iltimos, xizmat, sana va vaqtni tanlang');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Avval tizimga kiring', {
        duration: 4000,
      });
      return;
    }

    const service = barbershop.services.find((s) => s.id === selectedService);
    if (!service) return;

    const barber = selectedBarber
      ? barbershop.barbers.find((b) => b.id === selectedBarber)
      : null;

    addToCart({
      id: `${Date.now()}`,
      barbershopId: barbershop.id,
      barbershopName: barbershop.name,
      barbershopImage: barbershop.image,
      barbershopAddress: barbershop.address,
      serviceId: service.id,
      serviceName: service.nameUz || service.name,
      barberId: barber?.id,
      barberName: barber?.name,
      date: selectedDate,
      time: selectedTime,
      price: service.price,
      duration: service.duration,
    });

    toast.success('Savatga qo\'shildi!', {
      icon: '✅',
    });
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={barbershop.image}
          alt={barbershop.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized={barbershop.image.startsWith('http')}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg"
          >
            {barbershop.name}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4 text-white/95">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Scissors className="h-5 w-5" />
              <span className="font-bold">{barbershop.services.length} xizmat</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="h-5 w-5" />
              <span>{barbershop.district}, {barbershop.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Haqida</h2>
              <p className="text-gray-600 leading-relaxed">{barbershop.description}</p>
            </motion.section>

            {/* Services */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Xizmatlar</h2>
              <div className="space-y-3">
                {barbershop.services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    selected={selectedService === service.id}
                    onSelect={() => handleServiceSelect(service.id)}
                  />
                ))}
              </div>
            </motion.section>

            {/* Barbers Selection */}
            {selectedService && availableBarbers.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Barber tanlang</h2>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedService
                    ? 'Quyidagi barberlar tanlangan xizmatni bajaradi'
                    : 'Avval xizmat tanlang'}
                </p>
                <div className="space-y-3">
                  {availableBarbers.map((barber) => (
                    <BarberCard
                      key={barber.id}
                      barber={barber}
                      selected={selectedBarber === barber.id}
                      onSelect={() => setSelectedBarber(barber.id)}
                    />
                  ))}
                </div>
                {availableBarbers.length === 0 && (
                  <p className="text-gray-600 text-center py-4">
                    Bu xizmat uchun mavjud barberlar yo'q
                  </p>
                )}
              </motion.section>
            )}

            {/* All Barbers Info */}
            {barbershop.barbers.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Barcha barberlar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barbershop.barbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{barber.name}</div>
                        <div className="text-sm text-gray-600">{barber.specialization}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800">Bron qilish</h3>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Sana</label>
                <input
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Vaqt</label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`px-3 py-2 text-sm font-medium border-2 rounded-lg transition-all ${
                          selectedTime === slot.time
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md'
                            : slot.available
                            ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                            : 'border-gray-200 opacity-40 cursor-not-allowed text-gray-400'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{barbershop.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>
                    {barbershop.workingHours.monday.open} - {barbershop.workingHours.monday.close}
                  </span>
                </div>
              </div>

              {/* Selected Barber Info */}
              {selectedBarber && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">
                      {barbershop.barbers.find((b) => b.id === selectedBarber)?.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedService || !selectedDate || !selectedTime}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                Savatga qo'shish
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
