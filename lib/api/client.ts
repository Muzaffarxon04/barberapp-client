// API Client with Axios, Token Management, and Error Handling

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

// Alternative success response format (for barbershops)
export interface ApiPaginatedResponse<T> {
  data: T[];
  total_elements: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  from: number;
  to: number;
  status_code: number;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Real API Error Response Format
export interface RealApiErrorResponse {
  status_code: number;
  error: string;
  path: string;
  method: string;
  message: string | string[];
  timestamp?: string;
  time_stamp?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// DTO Types
export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password: string;
  roles?: string[];
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  roles: string[];
}

export interface CreateBarbershopDto {
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email?: string;
  image: string;
  images?: string[];
  workingHours: {
    open: string;
    close: string;
    closed: boolean;
  };
  amenities?: string[];
}

export interface UpdateBarbershopDto extends Partial<CreateBarbershopDto> { }

export interface CreateServiceDto {
  name: string;
  price: number;
  duration: number;
  description?: string;
  category: 'haircut' | 'beard' | 'haircut_beard' | 'coloring' | 'styling' | 'other';
  imageUrl?: string;
}

export type UpdateServiceDto = Partial<Omit<CreateServiceDto, 'barbershopId'>>;

export interface CreateBarberDto {
  barbershopId: string;
  name: string;
  specialization?: string;
  experience?: number;
  avatar?: string;
  services?: string[];
}

export type UpdateBarberDto = Partial<Omit<CreateBarberDto, 'barbershopId'>>;

export interface CreateBookingDto {
  barbershopId: string;
  barberId?: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface BarbershopResponse {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email: string | null;
  image: string;
  images: string[];
  rating: number;
  isActive: boolean;
  workingHours: {
    open: string;
    close: string;
    closed: boolean;
  };
  amenities: string[];
  barbers?: BarberResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: 'haircut' | 'beard' | 'haircut_beard' | 'coloring' | 'styling' | 'other';
  imageUrl: string | null;
  barbershopId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BarberResponse {
  id: string;
  name: string;
  specialization: string | null;
  experience: number | null;
  rating: number;
  avatar: string | null;
  barbershopId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResponse {
  id: string;
  userId: string;
  barbershopId: string;
  barbershopName: string;
  serviceId: string;
  serviceName: string;
  barberId: string | null;
  barberName: string | null;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userName?: string;
}

// Token Manager
class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly ADMIN_ACCESS_TOKEN_KEY = 'admin_access_token';
  private readonly ADMIN_REFRESH_TOKEN_KEY = 'admin_refresh_token';

  setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  setAdminTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ADMIN_ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(this.ADMIN_REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  getAdminAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ADMIN_ACCESS_TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  getAdminRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ADMIN_REFRESH_TOKEN_KEY);
    }
    return null;
  }

  clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  clearAdminTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ADMIN_ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_REFRESH_TOKEN_KEY);
    }
  }
}

export const tokenManager = new TokenManager();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if the request is for admin endpoints
    const isAdminRequest = config.url?.startsWith('/admins') || config.url?.includes('/admin/');

    // Choose the correct token based on the request type
    const token = isAdminRequest
      ? tokenManager.getAdminAccessToken()
      : tokenManager.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Refresh token
        const response = await axios.post<ApiSuccessResponse<{ accessToken: string; refreshToken: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        tokenManager.setTokens(accessToken, newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Error handler - handles both formats
export const handleApiError = (error: AxiosError): ApiErrorResponse['error'] => {
  if (error.response) {
    const errorData = error.response.data as RealApiErrorResponse | ApiErrorResponse;

    // Check if it's the real API error format
    if ('status_code' in errorData && 'error' in errorData) {
      const realError = errorData as RealApiErrorResponse;
      return {
        code: realError.error || `HTTP_${realError.status_code}`,
        message: Array.isArray(realError.message)
          ? realError.message.join(', ')
          : realError.message || 'An error occurred',
      };
    }

    // Check if it's our expected format
    if ('success' in errorData && !errorData.success && 'error' in errorData) {
      const apiError = errorData as ApiErrorResponse;
      return {
        code: apiError.error.code,
        message: Array.isArray(apiError.error.message)
          ? apiError.error.message.join(', ')
          : apiError.error.message,
      };
    }

    // Fallback
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An error occurred',
    };
  } else if (error.request) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
    };
  } else {
    return {
      code: 'REQUEST_ERROR',
      message: 'An unexpected error occurred',
    };
  }
};

// API Client Class
class ApiClient {
  // Auth endpoints
  auth = {
    register: async (data: RegisterDto) => {
      const response = await apiClient.post<ApiSuccessResponse<AuthResponse> | AuthResponse>(
        '/auth/register',
        data
      );
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<AuthResponse>).data;
      }
      return response.data as AuthResponse;
    },

    login: async (data: { email: string; password: string }) => {
      const response = await apiClient.post<any>(
        '/auth/login',
        data
      );

      let token: string;
      let user: AuthResponse;

      // The API might return { success: true, user, token } OR { success: true, data: { user, token } }
      if (response.data.data && response.data.data.token) {
        token = response.data.data.token;
        user = response.data.data.user;
      } else {
        token = response.data.token;
        user = response.data.user;
      }

      tokenManager.setTokens(token);
      return { token, user };
    },

    refresh: async (refreshToken: string) => {
      const response = await apiClient.post<ApiSuccessResponse<{ accessToken: string; refreshToken: string }> | { accessToken: string; refreshToken: string }>(
        '/auth/refresh',
        { refreshToken }
      );
      let accessToken: string;
      let newRefreshToken: string;

      if ('success' in response.data && response.data.success) {
        const refreshData = (response.data as ApiSuccessResponse<{ accessToken: string; refreshToken: string }>).data;
        accessToken = refreshData.accessToken;
        newRefreshToken = refreshData.refreshToken;
      } else {
        const refreshData = response.data as { accessToken: string; refreshToken: string };
        accessToken = refreshData.accessToken;
        newRefreshToken = refreshData.refreshToken;
      }

      tokenManager.setTokens(accessToken, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    },

    getCurrentUser: async () => {
      const response = await apiClient.get<ApiSuccessResponse<{
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        avatar: string | null;
      }> | {
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        avatar: string | null;
      }>('/auth/me');
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<{
          id: string;
          name: string | null;
          email: string;
          phone: string | null;
          avatar: string | null;
        }>).data;
      }
      return response.data as {
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        avatar: string | null;
      };
    },

    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
      } finally {
        tokenManager.clearTokens();
      }
    },
  };

  // Admin endpoints
  admins = {
    login: async (data: { username: string; password: string }) => {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        expires_in: string;
        user: {
          id: string;
          username: string;
          full_name: string;
        };
      }>(
        '/admins/login',
        data
      );

      const { access_token, refresh_token, user } = response.data;

      // Save tokens using the token manager
      tokenManager.setAdminTokens(access_token, refresh_token);

      // We might want to save the admin user data separately if needed, 
      // but for now returning it allows the component to handle it.
      // Ideally, we'd have a separate useAdminStore or similar.
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_user', JSON.stringify(user));
      }

      return { user, token: access_token };
    },
  };

  // Helper function to normalize paginated responses
  private normalizePaginatedResponse<T>(
    response: ApiPaginatedResponse<T> | ApiSuccessResponse<{ items: T[]; total: number; page: number; limit: number; totalPages: number }> | ApiSuccessResponse<T[]>
  ): { items: T[]; total: number; page: number; limit: number; totalPages: number } {
    // Check if it's the paginated format (from real API - barbershops)
    if ('total_elements' in response) {
      const paginated = response as ApiPaginatedResponse<T>;
      return {
        items: paginated.data || [],
        total: paginated.total_elements || 0,
        page: paginated.current_page || 1,
        limit: paginated.page_size || 20,
        totalPages: paginated.total_pages || 0,
      };
    }

    // Check if it's success format with array data (services, barbers)
    if ('success' in response && response.success && Array.isArray(response.data)) {
      const arrayResponse = response as ApiSuccessResponse<T[]>;
      return {
        items: arrayResponse.data || [],
        total: arrayResponse.data.length || 0,
        page: 1,
        limit: arrayResponse.data.length || 20,
        totalPages: 1,
      };
    }

    // Otherwise it's our expected paginated format
    const standard = response as ApiSuccessResponse<{ items: T[]; total: number; page: number; limit: number; totalPages: number }>;
    return standard.data;
  }

  // Barbershops endpoints
  barbershops = {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      isActive?: boolean;
      city?: string;
      district?: string;
      sortBy?: 'name' | 'rating';
    }) => {
      const response = await apiClient.get<ApiPaginatedResponse<BarbershopResponse> | ApiSuccessResponse<{
        items: BarbershopResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>('/barbershops', { params });
      return this.normalizePaginatedResponse(response.data);
    },

    search: async (params: {
      search: string;
      city?: string;
      district?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await apiClient.get<ApiPaginatedResponse<BarbershopResponse> | ApiSuccessResponse<{
        items: BarbershopResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>('/barbershops/search', { params });
      return this.normalizePaginatedResponse(response.data);
    },

    getById: async (id: string) => {
      const response = await apiClient.get<ApiSuccessResponse<BarbershopResponse> | BarbershopResponse>(`/barbershops/${id}`);
      // Handle both response formats
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BarbershopResponse>).data;
      }
      return response.data as BarbershopResponse;
    },

    create: async (data: CreateBarbershopDto) => {
      const response = await apiClient.post<ApiSuccessResponse<BarbershopResponse> | BarbershopResponse>('/admin/barbershops', data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BarbershopResponse>).data;
      }
      return response.data as BarbershopResponse;
    },

    update: async (id: string, data: UpdateBarbershopDto) => {
      const response = await apiClient.put<ApiSuccessResponse<BarbershopResponse> | BarbershopResponse>(`/admin/barbershops/${id}`, data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BarbershopResponse>).data;
      }
      return response.data as BarbershopResponse;
    },

    delete: async (id: string) => {
      await apiClient.delete(`/admin/barbershops/${id}`);
    },
  };

  // Services endpoints
  services = {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      barbershopId?: string | 'global';
      isActive?: boolean;
    }) => {
      const response = await apiClient.get<ApiPaginatedResponse<ServiceResponse> | ApiSuccessResponse<ServiceResponse[]> | ApiSuccessResponse<{
        items: ServiceResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>('/services', { params });
      // Services API returns { success: true, data: [] } format (array directly)
      if ('success' in response.data && response.data.success) {
        const standard = response.data as ApiSuccessResponse<ServiceResponse[] | {
          items: ServiceResponse[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>;
        // If data is array, convert to paginated format
        if (Array.isArray(standard.data)) {
          return {
            items: standard.data,
            total: standard.data.length,
            page: 1,
            limit: standard.data.length,
            totalPages: 1,
          };
        }
        // Otherwise it's already paginated
        return standard.data as {
          items: ServiceResponse[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }
      // Fallback to paginated format
      return this.normalizePaginatedResponse(response.data);
    },

    getByBarbershop: async (barbershopId: string, isActive?: boolean) => {
      const response = await apiClient.get<ApiSuccessResponse<ServiceResponse[]> | ServiceResponse[]>(
        `/services/?barbershopId=${barbershopId}`,
        { params: { isActive } }
      );
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<ServiceResponse[]>).data;
      }
      return response.data as ServiceResponse[];
    },

    getById: async (id: string) => {
      const response = await apiClient.get<ApiSuccessResponse<ServiceResponse> | ServiceResponse>(`/services/${id}`);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<ServiceResponse>).data;
      }
      return response.data as ServiceResponse;
    },

    create: async (data: CreateServiceDto) => {
      const response = await apiClient.post<ApiSuccessResponse<ServiceResponse> | ServiceResponse>('/services', data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<ServiceResponse>).data;
      }
      return response.data as ServiceResponse;
    },

    update: async (id: string, data: UpdateServiceDto) => {
      const response = await apiClient.patch<ApiSuccessResponse<ServiceResponse> | ServiceResponse>(`/services/${id}`, data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<ServiceResponse>).data;
      }
      return response.data as ServiceResponse;
    },

    delete: async (id: string) => {
      await apiClient.delete(`/services/${id}`);
    },
  };

  // Barbers endpoints
  barbers = {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      barbershopId?: string;
      isActive?: boolean;
    }) => {
      const response = await apiClient.get<ApiPaginatedResponse<BarberResponse> | ApiSuccessResponse<BarberResponse[]> | ApiSuccessResponse<{
        items: BarberResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>('/barbers', { params });
      // Barbers API returns { success: true, data: [] } format (array directly)
      if ('success' in response.data && response.data.success) {
        const standard = response.data as ApiSuccessResponse<BarberResponse[] | {
          items: BarberResponse[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>;
        // If data is array, convert to paginated format
        if (Array.isArray(standard.data)) {
          return {
            items: standard.data,
            total: standard.data.length,
            page: 1,
            limit: standard.data.length,
            totalPages: 1,
          };
        }
        // Otherwise it's already paginated
        return standard.data as {
          items: BarberResponse[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }
      // Fallback to paginated format
      return this.normalizePaginatedResponse(response.data);
    },

    getByBarbershop: async (barbershopId: string, serviceId?: string) => {
      const response = await apiClient.get<ApiSuccessResponse<BarberResponse[]> | BarberResponse[]>(
        `/barbers`,
        { params: { barbershopId, serviceId } }
      );
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BarberResponse[]>).data;
      }
      return response.data as BarberResponse[];
    },

    getById: async (id: string) => {
      const response = await apiClient.get<ApiSuccessResponse<BarberResponse> | BarberResponse>(`/barbers/${id}`);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BarberResponse>).data;
      }
      return response.data as BarberResponse;
    },

    create: async (barbershopId: string, data: Omit<CreateBarberDto, 'barbershopId'>) => {
      const response = await apiClient.post<ApiSuccessResponse<BarberResponse> | BarberResponse>(`/admin/barbershops/${barbershopId}/barbers`, data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BarberResponse>).data;
      }
      return response.data as BarberResponse;
    },

    update: async (barbershopId: string, barberId: string, data: UpdateBarberDto) => {
      const response = await apiClient.put<ApiSuccessResponse<BarberResponse> | BarberResponse>(`/admin/barbershops/${barbershopId}/barbers/${barberId}`, data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BarberResponse>).data;
      }
      return response.data as BarberResponse;
    },

    delete: async (barbershopId: string, barberId: string) => {
      await apiClient.delete(`/admin/barbershops/${barbershopId}/barbers/${barberId}`);
    },
  };

  // Bookings endpoints
  bookings = {
    create: async (data: CreateBookingDto) => {
      const response = await apiClient.post<ApiSuccessResponse<BookingResponse> | BookingResponse>('/bookings', data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BookingResponse>).data;
      }
      return response.data as BookingResponse;
    },

    createMultiple: async (data: {
      bookings: CreateBookingDto[];
    }) => {
      const response = await apiClient.post<ApiSuccessResponse<BookingResponse[]> | BookingResponse[]>('/bookings/multiple', data);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BookingResponse[]>).data;
      }
      return response.data as BookingResponse[];
    },

    getAll: async (params?: {
      page?: number;
      limit?: number;
      status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    }) => {
      const response = await apiClient.get<ApiPaginatedResponse<BookingResponse> | ApiSuccessResponse<{
        items: BookingResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>>('/bookings', { params });
      return this.normalizePaginatedResponse(response.data);
    },

    getById: async (id: string) => {
      const response = await apiClient.get<ApiSuccessResponse<BookingResponse> | BookingResponse>(`/bookings/${id}`);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BookingResponse>).data;
      }
      return response.data as BookingResponse;
    },

    cancel: async (id: string) => {
      const response = await apiClient.post<ApiSuccessResponse<BookingResponse> | BookingResponse>(`/bookings/${id}/cancel`);
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<BookingResponse>).data;
      }
      return response.data as BookingResponse;
    },

    getTimeSlots: async (params: {
      barbershopId: string;
      date: string;
      serviceId?: string;
      barberId?: string;
    }) => {
      const response = await apiClient.get<ApiSuccessResponse<string[]> | string[]>('/bookings/time-slots', { params });
      if ('success' in response.data && response.data.success) {
        return (response.data as ApiSuccessResponse<string[]>).data;
      }
      return response.data as string[];
    },
  };

  // Admin endpoints
  admin = {
    dashboard: {
      getStats: async () => {
        const response = await apiClient.get<ApiSuccessResponse<{
          totalBarbershops: number;
          totalServices: number;
          totalBarbers: number;
          totalBookings: number;
          activeUsers: number;
          pendingBookings: number;
          confirmedBookings: number;
          completedBookings: number;
          totalRevenue: number;
          recentBookings: BookingResponse[];
        }>>('/admin/dashboard/stats');
        return response.data.data;
      },
    },

    barbershops: {
      getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
      }) => {
        const response = await apiClient.get<ApiPaginatedResponse<BarbershopResponse> | ApiSuccessResponse<{
          items: BarbershopResponse[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>>('/admin/barbershops', { params });
        return this.normalizePaginatedResponse(response.data);
      },

      uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post<ApiSuccessResponse<{
          url: string;
          filename: string;
        }>>('/admin/barbershops/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.data;
      },

      update: async (id: string, data: UpdateBarbershopDto) => {
        const response = await apiClient.put<ApiSuccessResponse<BarbershopResponse> | BarbershopResponse>(`/admin/barbershops/${id}`, data);
        if ('success' in response.data && response.data.success) {
          return (response.data as ApiSuccessResponse<BarbershopResponse>).data;
        }
        return response.data as BarbershopResponse;
      },

      getById: async (id: string) => {
        const response = await apiClient.get<ApiSuccessResponse<BarbershopResponse> | BarbershopResponse>(`/admin/barbershops/${id}`);
        if ('success' in response.data && response.data.success) {
          return (response.data as ApiSuccessResponse<BarbershopResponse>).data;
        }
        return response.data as BarbershopResponse;
      },
    },

    services: {
      getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
      }) => {
        const response = await apiClient.get<ApiPaginatedResponse<ServiceResponse> | ApiSuccessResponse<{
          items: ServiceResponse[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>>('/admin/services', { params });
        return this.normalizePaginatedResponse(response.data);
      },

      create: async (data: CreateServiceDto) => {
        const response = await apiClient.post<ApiSuccessResponse<ServiceResponse>>('/admin/services', data);
        return response.data.data;
      },

      update: async (id: string, data: UpdateServiceDto) => {
        const response = await apiClient.put<ApiSuccessResponse<ServiceResponse>>(`/admin/services/${id}`, data);
        return response.data.data;
      },

      delete: async (id: string) => {
        await apiClient.delete(`/admin/services/${id}`);
      },
    },

    bookings: {
      getAll: async (params?: {
        page?: number;
        limit?: number;
        status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
        search?: string;
      }) => {
        const response = await apiClient.get<ApiPaginatedResponse<BookingResponse> | ApiSuccessResponse<{
          items: BookingResponse[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        }>>('/admin/bookings', { params });
        return this.normalizePaginatedResponse(response.data);
      },

      updateStatus: async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
        const response = await apiClient.patch<ApiSuccessResponse<BookingResponse> | BookingResponse>(`/admin/bookings/${id}/status`, { status });
        if ('success' in response.data && response.data.success) {
          return (response.data as ApiSuccessResponse<BookingResponse>).data;
        }
        return response.data as BookingResponse;
      },

      delete: async (id: string) => {
        await apiClient.delete(`/admin/bookings/${id}`);
      },
    },
  };

  // File Upload endpoints
  upload = {
    image: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<ApiSuccessResponse<{
        url: string;
        filename?: string;
        publicId?: string;
      }>>('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },

    images: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      const response = await apiClient.post<ApiSuccessResponse<Array<{
        url: string;
        filename?: string;
        publicId?: string;
      }>>>('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },

    imageBase64: async (image: string, folder?: string) => {
      const response = await apiClient.post<ApiSuccessResponse<{
        url: string;
        filename?: string;
        publicId?: string;
      }>>('/upload/image/base64', { image, folder });
      return response.data.data;
    },

    barbershop: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<ApiSuccessResponse<{
        url: string;
        filename?: string;
        publicId?: string;
      }>>('/upload/barbershop', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },

    barber: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<ApiSuccessResponse<{
        url: string;
        filename?: string;
        publicId?: string;
      }>>('/upload/barber', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },

    service: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<ApiSuccessResponse<{
        url: string;
        filename?: string;
        publicId?: string;
      }>>('/upload/service', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
  };
}

export const api = new ApiClient();
export default api;
