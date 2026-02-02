'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Scissors, MapPin } from 'lucide-react';
import BarbershopCard from '@/components/BarbershopCard';
import { api, handleApiError, BarbershopResponse } from '@/lib/api/client';
import { Barbershop } from '@/types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export default function Home() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch barbershops on mount
  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        setIsLoading(true);
        const response = await api.barbershops.getAll();
        const mappedBarbershops: Barbershop[] = response.items.map((item: BarbershopResponse) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          address: item.address,
          city: item.city,
          district: item.district,
          phone: item.phone,
          email: item.email || undefined,
          image: item.image,
          images: item.images || [],
          workingHours: item.workingHours || {},
          services: [],
          barbers: [],
          amenities: item.amenities || [],
        }));
        setBarbershops(mappedBarbershops);
      } catch (error: unknown) {
        const apiError = handleApiError(error as AxiosError);
        toast.error(apiError.message || 'Failed to load barbershops');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbershops();
  }, []);

  // Search barbershops via API
  useEffect(() => {
    const searchBarbershops = async () => {
      if (!searchQuery.trim()) {
        // Reset to all barbershops if search is empty
        const response = await api.barbershops.getAll();
        const mappedBarbershops: Barbershop[] = response.items.map((item: BarbershopResponse) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          address: item.address,
          city: item.city,
          district: item.district,
          phone: item.phone,
          email: item.email || undefined,
          image: item.image,
          images: item.images || [],
          workingHours: item.workingHours || {},
          services: [],
          barbers: [],
          amenities: item.amenities || [],
        }));
        setBarbershops(mappedBarbershops);
        return;
      }

      try {
        const response = await api.barbershops.search({ search: searchQuery });
        const mappedBarbershops: Barbershop[] = response.items.map((item: BarbershopResponse) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          address: item.address,
          city: item.city,
          district: item.district,
          phone: item.phone,
          email: item.email || undefined,
          image: item.image,
          images: item.images || [],
          workingHours: item.workingHours || {},
          services: [],
          barbers: [],
          amenities: item.amenities || [],
        }));
        setBarbershops(mappedBarbershops);
      } catch (error: unknown) {
        const apiError = handleApiError(error as AxiosError);
        console.error('Search error:', apiError);
      }
    };

    const timeoutId = setTimeout(() => {
      searchBarbershops();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Dropdown search results (max 5 items)
  const dropdownResults = barbershops.filter((bs) => {
    if (!searchQuery) return false;
    return (
      bs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bs.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bs.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).slice(0, 5);

  // Main page filtered results
  const filteredBarbershops = barbershops;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsDropdownOpen(value.length > 0 && dropdownResults.length > 0);
    setFocusedIndex(-1);
  };

  const handleSelectBarbershop = (id: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    router.push(`/barbershop/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || dropdownResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => 
        prev < dropdownResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectBarbershop(dropdownResults[focusedIndex].id);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 min-h-[600px] flex items-center overflow-visible">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80"
            alt="Barbershop background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-50/50" />
        <div className="container mx-auto relative z-10 overflow-visible">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
                <Scissors className="h-20 w-20 text-white mx-auto relative z-10 drop-shadow-lg" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Barbershop Booking
            </h1>
            <p className="text-xl text-white/95 mb-8 drop-shadow-md">
              Find the best barbershops in Uzbekistan and book online
            </p>

            {/* Search Bar with Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative overflow-visible"
              ref={searchRef}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-3 border border-white/20">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search barbershop name, address or service..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.length > 0 && dropdownResults.length > 0) {
                        setIsDropdownOpen(true);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 py-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Dropdown Results */}
              <AnimatePresence>
                {isDropdownOpen && dropdownResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200  max-h-96 overflow-y-auto"
                  >
                    {dropdownResults.map((barbershop, index) => (
                      <motion.div
                        key={barbershop.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectBarbershop(barbershop.id)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        className={`p-3 cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ${
                          focusedIndex === index
                            ? 'bg-gray-50 border-gray-300'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Image */}
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                            <Image
                              src={barbershop.image}
                              alt={barbershop.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                              unoptimized={barbershop.image.startsWith('http')}
                            />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            <h4 className="font-bold text-gray-900 mb-1.5 truncate text-sm text-left">
                              {barbershop.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate text-left">
                                {barbershop.district}, {barbershop.city}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Scissors className="h-3 w-3 text-blue-500 shrink-0" />
                              <span className="text-xs text-gray-500 text-left">
                                Services available
                              </span>
                            </div>
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className="shrink-0 pt-1">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                              focusedIndex === index
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {barbershops.length}+
              </div>
              <div className="text-gray-600 font-medium">Barbershops</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Online Booking</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Barbershops Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Top Barbershops</h2>
            <p className="text-gray-600">
              Best rated barbershops
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading barbershops...</p>
            </div>
          ) : filteredBarbershops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBarbershops.map((barbershop, index) => (
                <BarbershopCard key={barbershop.id} barbershop={barbershop} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">
                Nothing found. Try different search terms.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
