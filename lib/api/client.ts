// API Client - Ready for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    // const token = localStorage.getItem('auth-token');
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     Authorization: `Bearer ${token}`,
    //   };
    // }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (data: { name: string; email: string; phone: string; password: string }) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () => this.request('/auth/logout', { method: 'POST' }),
    getCurrentUser: () => this.request('/auth/me'),
  };

  // Barbershop endpoints
  barbershops = {
    getAll: (filters?: any) => {
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      return this.request(`/barbershops${queryParams}`);
    },
    getById: (id: string) => this.request(`/barbershops/${id}`),
    search: (query: string, filters?: any) => {
      const params = new URLSearchParams({ q: query, ...filters });
      return this.request(`/barbershops/search?${params.toString()}`);
    },
  };

  // Booking endpoints
  bookings = {
    create: (data: any) =>
      this.request('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => this.request('/bookings'),
    getById: (id: string) => this.request(`/bookings/${id}`),
    cancel: (id: string) =>
      this.request(`/bookings/${id}/cancel`, { method: 'POST' }),
    getTimeSlots: (barbershopId: string, date: string, serviceId?: string) =>
      this.request(
        `/bookings/time-slots?barbershopId=${barbershopId}&date=${date}${serviceId ? `&serviceId=${serviceId}` : ''}`
      ),
  };

  // Services endpoints
  services = {
    getAll: () => this.request('/services'),
    getByBarbershop: (barbershopId: string) =>
      this.request(`/services?barbershopId=${barbershopId}`),
  };

  // Admin endpoints
  admin = {
    // Dashboard stats
    dashboard: {
      getStats: () => this.request('/admin/dashboard/stats'),
    },

    // Barbershops management
    barbershops: {
      getAll: (filters?: any) => {
        const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
        return this.request(`/admin/barbershops${queryParams}`);
      },
      getById: (id: string) => this.request(`/admin/barbershops/${id}`),
      create: (data: any) =>
        this.request('/admin/barbershops', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: any) =>
        this.request(`/admin/barbershops/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        this.request(`/admin/barbershops/${id}`, { method: 'DELETE' }),
    },

    // Services management
    services: {
      getAll: (filters?: any) => {
        const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
        return this.request(`/admin/services${queryParams}`);
      },
      getById: (id: string) => this.request(`/admin/services/${id}`),
      create: (data: any) =>
        this.request('/admin/services', {
          method: 'POST',
          body: JSON.stringify(data),
        }),
      update: (id: string, data: any) =>
        this.request(`/admin/services/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      delete: (id: string) =>
        this.request(`/admin/services/${id}`, { method: 'DELETE' }),
    },

    // Bookings management
    bookings: {
      getAll: (filters?: any) => {
        const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
        return this.request(`/admin/bookings${queryParams}`);
      },
      getById: (id: string) => this.request(`/admin/bookings/${id}`),
      updateStatus: (id: string, status: string) =>
        this.request(`/admin/bookings/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }),
      cancel: (id: string) =>
        this.request(`/admin/bookings/${id}/cancel`, { method: 'POST' }),
    },
  };
}

export const api = new ApiClient(API_BASE_URL);
