// Types for Barbershop Booking Platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Barbershop {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email: string | null;
  rating?: number; // Deprecated - not used in UI
  reviewCount?: number; // Deprecated - not used in UI
  image: string;
  images?: string[];
  workingHours?: WorkingHours;
  services: Service[];
  barbers: Barber[];
  amenities?: string[];
 
}

export interface WorkingHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface Service {
  id: string;
  name: string; // Uzbek name
  description?: string;
  duration: number; // in minutes
  price: number;
  category: ServiceCategory;
}

export type ServiceCategory = 'haircut' | 'beard' | 'haircut-beard' | 'coloring' | 'styling' | 'other';

export interface Barber {
  id: string;
  name: string;
  specialization?: string;
  experience?: number;
  rating?: number;
  avatar?: string;
  services: string[]; // service IDs
}

export interface TimeSlot {
  id: string;
  time: string; // HH:mm format
  available: boolean;
  barberId?: string;
}

export interface Booking {
  id: string;
  barbershopId: string;
  barbershopName: string;
  barberId?: string;
  barberName?: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  duration: number;
  status: BookingStatus;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface CartItem {
  id: string;
  barbershopId: string;
  barbershopName: string;
  barbershopImage: string;
  barbershopAddress: string;
  serviceId: string;
  serviceName: string;
  barberId?: string;
  barberName?: string;
  date: string;
  time: string;
  price: number;
  duration: number;
}

export interface SearchFilters {
  city?: string;
  district?: string;
  service?: string;
  minRating?: number;
  priceRange?: [number, number];
  sortBy?: 'rating' | 'price' | 'name' | 'distance';
}
