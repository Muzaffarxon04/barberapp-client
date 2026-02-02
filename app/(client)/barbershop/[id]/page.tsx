'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Clock, Phone, User, Scissors } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import BarberCard from '@/components/BarberCard';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import { api, handleApiError, ServiceResponse, BarberResponse } from '@/lib/api/client';
import { Barbershop, Service, Barber, TimeSlot } from '@/types';
import { AxiosError } from 'axios';

export default function BarbershopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [timeSlots, setTimeSlots] = useState<(string | TimeSlot)[]>([]);
  const [availableBarbers, setAvailableBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const cartIdCounter = useRef(0);

  // Fetch barbershop data
  useEffect(() => {
    const fetchBarbershop = async () => {
      try {
        setIsLoading(true);
        const data = await api.barbershops.getById(params.id as string);

        // Map API response to Barbershop type
        const mappedBarbershop: Barbershop = {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          city: data.city,
          district: data.district,
          phone: data.phone,
          email: data.email || null,
          image: data.image,
          images: data.images || [],
          workingHours: data.workingHours || { open: '09:00', close: '20:00', closed: false },
          services: [],
          barbers: [],
          amenities: data.amenities || [],
          createdAt: (data as any).createdAt || new Date().toISOString(),
          updatedAt: (data as any).updatedAt || new Date().toISOString(),
        };

        setBarbershop(mappedBarbershop);

        // Fetch services and barbers
        const [servicesData, barbersData] = await Promise.all([
          api.services.getByBarbershop(params.id as string),
          api.barbers.getByBarbershop(params.id as string),
        ]);

        setServices(servicesData.map((s: ServiceResponse) => ({
          id: s.id,
          name: s.name,
          description: s.description || undefined,
          duration: s.duration,
          price: s.price,
          category: s.category === 'haircut_beard' ? 'haircut-beard' : s.category as Service['category'],
        })));

        setBarbers(barbersData.map((b: BarberResponse) => ({
          id: b.id,
          name: b.name,
          specialization: b.specialization || undefined,
          experience: b.experience || undefined,
          rating: b.rating || undefined,
          avatar: b.avatar || undefined,
          services: (b as any).services || [], // Will be fetched separately if needed
        })));
      } catch (error: unknown) {
        const apiError = handleApiError(error as AxiosError);
        toast.error(apiError.message || 'Failed to load barbershop');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBarbershop();
    }
  }, [params.id, router]);

  // Fetch time slots when date/service/barber changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !barbershop) return;

      try {
        setIsLoadingSlots(true);
        const slots = await api.bookings.getTimeSlots({
          barbershopId: barbershop.id,
          date: selectedDate,
          serviceId: selectedService || undefined,
          barberId: selectedBarber || undefined,
        });
        setTimeSlots(slots);
      } catch (error: unknown) {
        const apiError = handleApiError(error as AxiosError);
        toast.error(apiError.message || 'Failed to load time slots');
        setTimeSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, selectedService, selectedBarber, barbershop]);

  // Fetch available barbers when service changes
  useEffect(() => {
    const fetchAvailableBarbers = async () => {
      if (!selectedService || !barbershop) {
        setAvailableBarbers(barbers);
        return;
      }

      try {
        const data = await api.barbers.getByBarbershop(barbershop.id, selectedService);
        setAvailableBarbers(data.map((b: BarberResponse) => ({
          id: b.id,
          name: b.name,
          specialization: b.specialization || undefined,
          experience: b.experience || undefined,
          rating: b.rating || undefined,
          avatar: b.avatar || undefined,
          services: (b as any).services || [],
        })));
      } catch (error: unknown) {
        console.error('Failed to fetch available barbers:', error);
        // Fallback to local filtering if API fails
        setAvailableBarbers(barbers.filter(b => b.services.includes(selectedService)));
      }
    };

    fetchAvailableBarbers();
  }, [selectedService, barbershop, barbers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Barbershop not found</p>
      </div>
    );
  }

  // Generate date options (next 14 days)
  const generateDateOptions = () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      const dayIndex = date.getDay();
      dates.push({
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'dd.MM.yyyy'),
        dayName: dayNames[dayIndex],
      });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedBarber(null);
  };

  const handleAddToCart = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select service, date and time');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in first', {
        duration: 4000,
      });
      return;
    }

    const service = services.find((s) => s.id === selectedService);
    if (!service) return;

    const barber = selectedBarber
      ? barbers.find((b) => b.id === selectedBarber)
      : null;

    cartIdCounter.current += 1;
    addToCart({
      id: `cart-${barbershop.id}-${selectedService}-${cartIdCounter.current}`,
      barbershopId: barbershop.id,
      barbershopName: barbershop.name,
      barbershopImage: barbershop.image,
      barbershopAddress: barbershop.address,
      serviceId: service.id,
      serviceName: service.name,
      barberId: barber?.id,
      barberName: barber?.name,
      date: selectedDate,
      time: selectedTime,
      price: service.price,
      duration: service.duration,
    });

    toast.success('Added to cart!', {
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
        <div className="absolute inset-0 bg-black/50" />
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
              <span className="font-bold">{services.length} services</span>
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
              <h2 className="text-2xl font-bold mb-4 text-gray-800">About</h2>
              <p className="text-gray-600 leading-relaxed">{barbershop.description}</p>
            </motion.section>

            {/* Services Price List */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Services Price List</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Service</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Duration</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-900">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr
                        key={service.id}
                        className={`border-b border-gray-100 bg-white`}
                      >
                        <td className="py-3 px-4 text-sm text-gray-900">{service.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{service.duration} min</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                          {Math.round(service.price).toLocaleString('uz-UZ', {
                            currency: 'UZS',
                          })} UZS

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* All Barbers Info */}
            {barbers.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">All Barbers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center">
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">Book Appointment</h3>

              {/* Services Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-900">Services</label>
                <div className="space-y-2">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedService === service.id}
                      onSelect={() => handleServiceSelect(service.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Barbers Selection */}
              {selectedService && availableBarbers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-900">Select Barber</label>
                  <div className="space-y-2">
                    {availableBarbers.map((barber) => (
                      <BarberCard
                        key={barber.id}
                        barber={barber}
                        selected={selectedBarber === barber.id}
                        onSelect={() => setSelectedBarber(barber.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-900">Date of admission</label>
                <div className="grid grid-cols-4 gap-2">
                  {dateOptions.map((option) => (
                    <button
                      key={option.date}
                      onClick={() => setSelectedDate(option.date)}
                      className={`p-2 text-left border-2 rounded-lg transition-all ${selectedDate === option.date
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                      <div className="text-xs text-gray-900 mb-1">{option.displayDate}</div>
                      <div className="text-xs text-gray-600">{option.dayName}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Time</label>
                  {isLoadingSlots ? (
                    <div className="text-sm text-gray-500 py-4 text-center">Loading time slots...</div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4 text-center">No available time slots</div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                      {timeSlots.map((slot, index) => {
                        const timeValue = typeof slot === 'string' ? slot : slot?.time;
                        const isSelected = selectedTime === timeValue;

                        return (
                          <button
                            key={typeof slot === 'string' ? slot : (slot?.id || slot?.time || index)}
                            onClick={() => setSelectedTime(timeValue)}
                            className={`px-3 py-2 text-sm font-medium border-2 rounded-lg transition-all ${isSelected
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-gray-700'
                              }`}
                          >
                            {timeValue}
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                    {barbershop.workingHours?.open && barbershop.workingHours?.close
                      ? `${barbershop.workingHours.open} - ${barbershop.workingHours.close}`
                      : barbershop.workingHours?.closed
                        ? 'Closed'
                        : '24 hours'}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedService || !selectedDate || !selectedTime}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
