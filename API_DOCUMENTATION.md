# Barbershop Booking Platform - API Documentation

> **Comprehensive API Documentation for Frontend Integration**
> 
> Bu hujjat frontend dasturchilar uchun to'liq API integratsiya qo'llanmasi hisoblanadi. Barcha endpoint'lar, request/response formatlari, autentifikatsiya, error handling va best practices ko'rsatilgan.

---

## 📋 Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Auth APIs](#auth-apis)
   - [Barbershops APIs](#barbershops-apis)
   - [Services APIs](#services-apis)
   - [Barbers APIs](#barbers-apis)
   - [Bookings APIs](#bookings-apis)
   - [Admin APIs](#admin-apis)
   - [File Upload APIs](#file-upload-apis)
4. [Error Handling](#error-handling)
5. [Best Practices](#best-practices)
6. [TypeScript Types](#typescript-types)
7. [Example Integration](#example-integration)

---

## Base Configuration

### Base URL

```typescript
const API_BASE_URL = 'http://localhost:3001/api'; // Development
// const API_BASE_URL = 'https://api.yourdomain.com/api'; // Production
```

### API Response Format

Barcha API response'lar quyidagi formatda qaytadi:

**Success Response:**
```typescript
{
  success: true,
  data: T // Response data
}
```

**Error Response:**
```typescript
{
  success: false,
  error: {
    code: string;      // Error code (e.g., 'EMAIL_ALREADY_IN_USE')
    message: string;   // Human-readable error message
    details?: Record<string, unknown>; // Additional error details
  }
}
```

### Headers

**Required Headers:**
```typescript
{
  'Content-Type': 'application/json',
  // For authenticated requests:
  'Authorization': 'Bearer <access_token>'
}
```

### Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Response Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

## Authentication

### Authentication Flow

1. **Register/Login** → Olish `accessToken` va `refreshToken`
2. **Store tokens** → LocalStorage yoki secure cookie'da saqlash
3. **Include token** → Har bir authenticated request'da `Authorization: Bearer <token>` header qo'shish
4. **Refresh token** → Access token muddati tugaganda, refresh token bilan yangi token olish

### Token Storage Example

```typescript
// Token storage utility
class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
```

### Axios Interceptor Example

```typescript
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
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
    const originalRequest = error.config as any;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        tokenManager.setTokens(accessToken, newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## API Endpoints

### Auth APIs

#### 1. User Registration

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string;        // Valid email address
  password: string;     // Min 8 characters
  roles?: string[];     // Optional, defaults to ['user']
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    roles: string[];
  }
}
```

**Example:**
```typescript
const register = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/register', {
    email,
    password,
  });
  return response.data.data;
};
```

---

#### 2. User Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    accessToken: string;
    refreshToken: string;
  }
}
```

**Example:**
```typescript
const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });
  
  const { accessToken, refreshToken } = response.data.data;
  tokenManager.setTokens(accessToken, refreshToken);
  
  return response.data.data;
};
```

---

#### 3. Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json
```

**Request Body:**
```typescript
{
  refreshToken: string;
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    accessToken: string;
    refreshToken: string;
  }
}
```

---

#### 4. Get Current User

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    avatar: string | null;
  }
}
```

---

#### 5. Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    message: 'Logged out successfully';
  }
}
```

---

### Barbershops APIs

#### 1. Get All Barbershops

```http
GET /api/barbershops?page=1&limit=20&isActive=true&city=Tashkent&district=Yunusabad&sortBy=rating
```

**Query Parameters:**
```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  isActive?: boolean;   // Filter by active status
  city?: string;        // Filter by city
  district?: string;    // Filter by district
  sortBy?: 'name' | 'rating'; // Sort by name or rating
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    items: Array<{
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
        monday?: { open: string; close: string; closed?: boolean };
        tuesday?: { open: string; close: string; closed?: boolean };
        // ... other days
      };
      amenities: string[];
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

**Example:**
```typescript
const getBarbershops = async (filters?: {
  page?: number;
  limit?: number;
  city?: string;
  district?: string;
  sortBy?: 'name' | 'rating';
}) => {
  const response = await apiClient.get('/barbershops', { params: filters });
  return response.data.data;
};
```

---

#### 2. Search Barbershops

```http
GET /api/barbershops/search?q=salon&city=Tashkent&page=1&limit=20
```

**Query Parameters:**
```typescript
{
  q: string;           // Search query (required)
  city?: string;
  district?: string;
  page?: number;
  limit?: number;
}
```

**Response:** Same as Get All Barbershops

---

#### 3. Get Barbershop by ID

```http
GET /api/barbershops/:id
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
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
    workingHours: WorkingHoursDto;
    amenities: string[];
    createdAt: string;
    updatedAt: string;
  }
}
```

---

#### 4. Create Barbershop (Admin Only)

```http
POST /api/barbershops
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string;                    // Min 2, Max 100 chars
  description: string;             // Min 10, Max 500 chars
  address: string;                 // Min 5, Max 200 chars
  city: string;                    // Min 2, Max 50 chars
  district: string;                // Min 2, Max 50 chars
  phone: string;                   // Format: +998XXXXXXXXX
  email?: string;                  // Valid email
  image: string;                   // URL or base64
  images?: string[];               // Array of URLs
  workingHours: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    // ... other days (sunday, monday, tuesday, wednesday, thursday, friday, saturday)
  };
  amenities?: string[];            // Array of amenity names
}
```

**Example Working Hours:**
```typescript
{
  workingHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { closed: true }
  }
}
```

---

#### 5. Update Barbershop (Admin Only)

```http
PATCH /api/barbershops/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:** Same as Create, but all fields optional

---

#### 6. Delete Barbershop (Admin Only)

```http
DELETE /api/barbershops/:id
Authorization: Bearer <access_token>
```

**Response:** 204 No Content

---

### Services APIs

#### 1. Get All Services

```http
GET /api/services?page=1&limit=20&barbershopId=xxx&isActive=true
```

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  barbershopId?: string | 'global'; // 'global' for global services, specific ID for barbershop services
  isActive?: boolean;
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    items: Array<{
      id: string;
      name: string;
      description: string | null;
      duration: number;        // in minutes
      price: number;
      category: 'haircut' | 'beard' | 'haircut_beard' | 'coloring' | 'styling' | 'other';
      imageUrl: string | null;
      barbershopId: string | null; // null = global service
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

**Example - Get Global Services:**
```typescript
const getGlobalServices = async () => {
  const response = await apiClient.get('/services', {
    params: { barbershopId: 'global' }
  });
  return response.data.data;
};
```

---

#### 2. Get Services by Barbershop

```http
GET /api/services/barbershop/:barbershopId?isActive=true
```

**Response:** Array of services (same structure as above, but without pagination)

---

#### 3. Get Service by ID

```http
GET /api/services/:id
```

---

#### 4. Create Service (Admin Only)

```http
POST /api/services
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  barbershopId?: string | null; // null = global service, undefined = must provide
  name: string;                 // Max 100 chars
  description?: string;         // Max 500 chars
  duration: number;             // in minutes, min 5, must be multiple of 5
  price: number;                // min 0
  category: 'haircut' | 'beard' | 'haircut_beard' | 'coloring' | 'styling' | 'other';
  imageUrl?: string;
}
```

---

#### 5. Update Service (Admin Only)

```http
PATCH /api/services/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:** Same as Create, but all fields optional (except barbershopId cannot be changed)

---

#### 6. Delete Service (Admin Only)

```http
DELETE /api/services/:id
Authorization: Bearer <access_token>
```

**Response:** 204 No Content

---

### Barbers APIs

#### 1. Get All Barbers

```http
GET /api/barbers?page=1&limit=10&barbershopId=xxx&isActive=true
```

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  barbershopId?: string;
  isActive?: boolean;
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    items: Array<{
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
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

---

#### 2. Get Barbers by Barbershop

```http
GET /api/barbers/barbershop/:barbershopId?isActive=true
```

---

#### 3. Get Barber by ID

```http
GET /api/barbers/:id
```

---

#### 4. Create Barber (Admin Only)

```http
POST /api/barbers
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  barbershopId: string;
  name: string;                  // Min 2, Max 100 chars
  specialization?: string;       // Max 100 chars
  experience?: number;           // Min 0
  avatar?: string;               // URL
  services?: string[];           // Array of service IDs
}
```

---

#### 5. Update Barber (Admin Only)

```http
PATCH /api/barbers/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### 6. Delete Barber (Admin Only)

```http
DELETE /api/barbers/:id
Authorization: Bearer <access_token>
```

---

### Bookings APIs

> **Note:** Barcha booking endpoint'lari authentication talab qiladi.

#### 1. Create Single Booking

```http
POST /api/bookings
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  barbershopId: string;
  barberId?: string;             // Optional - if not provided, any available barber
  serviceId: string;
  date: string;                  // Format: YYYY-MM-DD
  time: string;                  // Format: HH:mm (24-hour format)
  notes?: string;                // Optional notes
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    barbershopId: string;
    barbershopName: string;
    serviceId: string;
    serviceName: string;
    barberId: string | null;
    barberName: string | null;
    date: string;                // YYYY-MM-DD
    time: string;                // HH:mm
    duration: number;            // minutes
    price: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  }
}
```

**Example:**
```typescript
const createBooking = async (bookingData: {
  barbershopId: string;
  serviceId: string;
  date: string;
  time: string;
  barberId?: string;
  notes?: string;
}) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data.data;
};
```

---

#### 2. Create Multiple Bookings (Cart)

```http
POST /api/bookings/multiple
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  bookings: Array<{
    barbershopId: string;
    barberId?: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
  }>;
}
```

**Response (201 Created):**
```typescript
{
  success: true,
  data: Array<Booking> // Array of created bookings
}
```

---

#### 3. Get User Bookings

```http
GET /api/bookings?page=1&limit=20&status=pending
Authorization: Bearer <access_token>
```

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
```

**Note:** 
- **Regular users:** Faqat o'z booking'larini ko'radi
- **Admin users:** Barcha booking'larni ko'radi

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    items: Array<Booking>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

---

#### 4. Get Available Time Slots

```http
GET /api/bookings/time-slots?barbershopId=xxx&date=2024-01-15&serviceId=xxx&barberId=xxx
```

**Query Parameters:**
```typescript
{
  barbershopId: string;    // Required
  date: string;            // Required, Format: YYYY-MM-DD
  serviceId?: string;      // Optional - if provided, considers service duration
  barberId?: string;       // Optional - if provided, only shows slots for that barber
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: string[] // Array of available time slots in HH:mm format
  // Example: ['09:00', '09:30', '10:00', '10:30', ...]
}
```

**Example Usage:**
```typescript
const getAvailableTimeSlots = async (
  barbershopId: string,
  date: string,
  serviceId?: string,
  barberId?: string
) => {
  const response = await apiClient.get('/bookings/time-slots', {
    params: { barbershopId, date, serviceId, barberId }
  });
  return response.data.data; // Array of time strings
};

// Usage
const slots = await getAvailableTimeSlots(
  'barbershop-id',
  '2024-01-15',
  'service-id',
  'barber-id'
);
// slots = ['09:00', '09:30', '10:00', ...]
```

**Important Notes:**
- Time slots barbershop'ning working hours'iga qarab generate qilinadi
- Agar serviceId berilsa, service duration hisobga olinadi
- Mavjud booking'lar available slots'dan chiqariladi
- Time slots 30 daqiqada bir marta generate qilinadi

---

#### 5. Get Booking by ID

```http
GET /api/bookings/:id
Authorization: Bearer <access_token>
```

---

#### 6. Cancel Booking

```http
POST /api/bookings/:id/cancel
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: Booking // Updated booking with status: 'cancelled'
}
```

**Note:** 
- Users faqat o'z booking'larini cancel qila oladi
- Admin barcha booking'larni cancel qila oladi

---

#### 7. Update Booking Status (Admin Only)

```http
PATCH /api/bookings/:id/status
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
```

---

#### 8. Delete Booking (Admin Only)

```http
DELETE /api/bookings/:id
Authorization: Bearer <access_token>
```

**Response:** 204 No Content

---

### Admin APIs

#### 1. Get Dashboard Statistics

```http
GET /api/admin/dashboard/stats
Authorization: Bearer <access_token> (Admin only)
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    totalBarbershops: number;
    totalServices: number;
    totalBarbers: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    totalRevenue: number;
  }
}
```

---

#### 2. Get Recent Bookings

```http
GET /api/admin/dashboard/recent-bookings?limit=10
Authorization: Bearer <access_token> (Admin only)
```

**Query Parameters:**
```typescript
{
  limit?: number; // Default: 10
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: Array<Booking> // Array of recent bookings with full details
}
```

---

### File Upload APIs

> **Note:** Barcha upload endpoint'lari Admin role talab qiladi.

#### 1. Upload Single Image

```http
POST /api/upload/image
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```typescript
{
  file: File; // Image file (max 10MB, formats: jpeg, jpg, png, webp, gif)
}
```

**Response (200 OK):**
```typescript
{
  success: true,
  data: {
    url: string;           // Full URL to uploaded image
    filename?: string;     // Local filename (if local storage)
    publicId?: string;     // Cloudinary public ID (if Cloudinary)
  }
}
```

**Example with FormData:**
```typescript
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};
```

---

#### 2. Upload Multiple Images

```http
POST /api/upload/images
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```typescript
{
  files: File[]; // Array of image files (max 10 files)
}
```

**Response:**
```typescript
{
  success: true,
  data: Array<{
    url: string;
    filename?: string;
    publicId?: string;
  }>
}
```

---

#### 3. Upload Image from Base64

```http
POST /api/upload/image/base64
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
{
  image: string;      // Base64 encoded image string (e.g., 'data:image/png;base64,iVBORw0KG...')
  folder?: string;    // Optional folder name for organization
}
```

**Response:** Same as single image upload

**Example:**
```typescript
const uploadBase64Image = async (base64String: string, folder?: string) => {
  const response = await apiClient.post('/upload/image/base64', {
    image: base64String,
    folder,
  });
  return response.data.data;
};
```

---

#### 4. Upload Barbershop Image

```http
POST /api/upload/barbershop
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```typescript
{
  file: File;
}
```

**Response:** Same as single image upload (automatically saved to barbershops folder)

---

#### 5. Upload Barber Avatar

```http
POST /api/upload/barber
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```typescript
{
  file: File;
}
```

---

#### 6. Upload Service Image

```http
POST /api/upload/service
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

---

#### 7. Upload User Avatar

```http
POST /api/upload/user
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

---

### Static File Access

Upload qilingan fayllar quyidagi URL orqali kirish mumkin:

```
http://localhost:3001/uploads/{folder}/{filename}
```

**Example:**
```
http://localhost:3001/uploads/barbershops/1234567890-abc123def456.jpg
```

---

## Error Handling

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., email already exists)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: string;      // Error code
    message: string;   // Error message
    details?: Record<string, unknown>;
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `EMAIL_ALREADY_IN_USE` | Email is already registered |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `INVALID_REFRESH_TOKEN` | Refresh token is invalid or expired |
| `USER_NOT_FOUND` | User not found |
| `VALIDATION_ERROR` | Request validation failed |
| `NOT_FOUND` | Resource not found |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |

### Error Handling Example

```typescript
import { AxiosError } from 'axios';

const handleApiError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error
    const errorData = error.response.data as {
      success: false;
      error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
      };
    };

    switch (error.response.status) {
      case 401:
        // Unauthorized - redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden - show permission error
        showNotification('You do not have permission to perform this action', 'error');
        break;
      case 404:
        // Not found
        showNotification(errorData.error.message || 'Resource not found', 'error');
        break;
      case 409:
        // Conflict
        showNotification(errorData.error.message, 'error');
        break;
      case 429:
        // Rate limited
        showNotification('Too many requests. Please try again later.', 'warning');
        break;
      default:
        showNotification(errorData.error.message || 'An error occurred', 'error');
    }

    return errorData.error;
  } else if (error.request) {
    // Request made but no response
    showNotification('Network error. Please check your connection.', 'error');
  } else {
    // Error in request setup
    showNotification('An unexpected error occurred', 'error');
  }
};

// Usage
try {
  const result = await apiClient.post('/auth/login', { email, password });
  return result.data.data;
} catch (error) {
  handleApiError(error as AxiosError);
  throw error;
}
```

---

## Best Practices

### 1. Token Management

- ✅ Tokens'ni secure storage'da saqlang (LocalStorage yoki secure HTTP-only cookies)
- ✅ Access token'ni har request'da `Authorization` header orqali yuboring
- ✅ Token muddati tugaganda, automatic refresh qiling
- ✅ Logout qilganda tokens'ni clear qiling
- ❌ Tokens'ni JavaScript code'da hardcode qilmang

### 2. Error Handling

- ✅ Barcha API call'lar uchun try-catch ishlating
- ✅ User-friendly error message'lar ko'rsating
- ✅ Network error'lar uchun retry mechanism qo'shing
- ✅ 401 error'da automatic logout qiling

### 3. Loading States

- ✅ API call'lar davomida loading indicator ko'rsating
- ✅ Optimistic updates ishlating (agar mumkin bo'lsa)
- ✅ Skeleton screens ishlating loading state'lar uchun

### 4. Caching

- ✅ Static data'lar (barbershops, services) uchun caching ishlating
- ✅ React Query yoki SWR kabi library'lardan foydalaning
- ✅ Cache invalidation strategiyasi qo'llang

### 5. Type Safety

- ✅ TypeScript ishlating va barcha API response'lar uchun type'lar yarating
- ✅ API client uchun type-safe wrapper yarating

### 6. Pagination

- ✅ Barcha list endpoint'larda pagination ishlating
- ✅ Infinite scroll yoki "Load More" button qo'shing
- ✅ Page size'ni user-friendly qiling (20-50 items)

### 7. File Uploads

- ✅ Upload qilishdan oldin file size va format'ni validate qiling
- ✅ Upload progress indicator ko'rsating
- ✅ Image preview qo'shing
- ✅ Base64 upload'larni minimize qiling (memory-intensive)

---

## TypeScript Types

### Core Types

```typescript
// API Response Types
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// User Types
interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  roles: string[];
}

// Barbershop Types
interface Barbershop {
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
  workingHours: WorkingHours;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

interface WorkingHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

interface DaySchedule {
  open: string;    // HH:mm format
  close: string;   // HH:mm format
  closed?: boolean;
}

// Service Types
type ServiceCategory = 'haircut' | 'beard' | 'haircut_beard' | 'coloring' | 'styling' | 'other';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;        // minutes
  price: number;
  category: ServiceCategory;
  imageUrl: string | null;
  barbershopId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Barber Types
interface Barber {
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

// Booking Types
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  userId: string;
  barbershopId: string;
  barbershopName: string;
  serviceId: string;
  serviceName: string;
  barberId: string | null;
  barberName: string | null;
  date: string;            // YYYY-MM-DD
  time: string;            // HH:mm
  duration: number;        // minutes
  price: number;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Pagination Types
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Upload Types
interface UploadResult {
  url: string;
  filename?: string;
  publicId?: string;
}
```

### API Client Type Example

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = tokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Token refresh logic here
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async register(data: { email: string; password: string; roles?: string[] }): Promise<User> {
    const response = await this.client.post<ApiSuccessResponse<User>>('/auth/register', data);
    return response.data.data;
  }

  async login(data: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await this.client.post<ApiSuccessResponse<{ accessToken: string; refreshToken: string }>>('/auth/login', data);
    return response.data.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<ApiSuccessResponse<User>>('/auth/me');
    return response.data.data;
  }

  // Barbershop methods
  async getBarbershops(params?: {
    page?: number;
    limit?: number;
    city?: string;
    district?: string;
    sortBy?: 'name' | 'rating';
  }): Promise<PaginatedResponse<Barbershop>> {
    const response = await this.client.get<ApiSuccessResponse<PaginatedResponse<Barbershop>>>('/barbershops', { params });
    return response.data.data;
  }

  async getBarbershop(id: string): Promise<Barbershop> {
    const response = await this.client.get<ApiSuccessResponse<Barbershop>>(`/barbershops/${id}`);
    return response.data.data;
  }

  // Booking methods
  async createBooking(data: {
    barbershopId: string;
    serviceId: string;
    date: string;
    time: string;
    barberId?: string;
    notes?: string;
  }): Promise<Booking> {
    const response = await this.client.post<ApiSuccessResponse<Booking>>('/bookings', data);
    return response.data.data;
  }

  async getAvailableTimeSlots(params: {
    barbershopId: string;
    date: string;
    serviceId?: string;
    barberId?: string;
  }): Promise<string[]> {
    const response = await this.client.get<ApiSuccessResponse<string[]>>('/bookings/time-slots', { params });
    return response.data.data;
  }

  // ... other methods
}

export const apiClient = new ApiClient(API_BASE_URL);
```

---

## Example Integration

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from './api-client';
import { Barbershop, Booking } from './types';

// Custom hook for barbershops
export const useBarbershops = (filters?: {
  city?: string;
  district?: string;
  sortBy?: 'name' | 'rating';
}) => {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getBarbershops({
          page: pagination.page,
          limit: 20,
          ...filters,
        });
        setBarbershops(response.items);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbershops();
  }, [pagination.page, filters?.city, filters?.district, filters?.sortBy]);

  return {
    barbershops,
    loading,
    error,
    pagination,
    setPage: (page: number) => setPagination((prev) => ({ ...prev, page })),
  };
};

// Custom hook for booking
export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBooking = async (data: {
    barbershopId: string;
    serviceId: string;
    date: string;
    time: string;
    barberId?: string;
    notes?: string;
  }): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);
      const booking = await apiClient.createBooking(data);
      return booking;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};
```

### Complete Booking Flow Example

```typescript
// Booking component example
import React, { useState } from 'react';
import { useCreateBooking } from './hooks/use-booking';
import { apiClient } from './api-client';

const BookingForm: React.FC<{
  barbershopId: string;
  serviceId: string;
}> = ({ barbershopId, serviceId }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { createBooking, loading, error } = useCreateBooking();

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate, serviceId, barbershopId]);

  const loadTimeSlots = async () => {
    setLoadingSlots(true);
    try {
      const slots = await apiClient.getAvailableTimeSlots({
        barbershopId,
        date: selectedDate,
        serviceId,
      });
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Failed to load time slots', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    const booking = await createBooking({
      barbershopId,
      serviceId,
      date: selectedDate,
      time: selectedTime,
    });

    if (booking) {
      alert('Booking created successfully!');
      // Navigate to bookings page
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div>
        <label>Time</label>
        {loadingSlots ? (
          <div>Loading available slots...</div>
        ) : (
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="">Select time</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <div className="error">{error.message}</div>}

      <button type="submit" disabled={loading || !selectedDate || !selectedTime}>
        {loading ? 'Creating...' : 'Book Now'}
      </button>
    </form>
  );
};
```

---

## Additional Resources

### Date/Time Formatting

```typescript
// Helper functions for date/time formatting
export const formatDate = (date: string): string => {
  // Input: '2024-01-15', Output: 'January 15, 2024'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  // Input: '14:30', Output: '2:30 PM'
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getTimeSlots = (start: string, end: string, interval: number = 30): string[] => {
  // Generate time slots between start and end
  const slots: string[] = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
    currentMin += interval;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour++;
    }
  }
  
  return slots;
};
```

### Phone Number Validation

```typescript
export const validateUzbekPhoneNumber = (phone: string): boolean => {
  // Format: +998XXXXXXXXX
  const regex = /^\+998\d{9}$/;
  return regex.test(phone);
};

export const formatUzbekPhoneNumber = (phone: string): string => {
  // Format: +998 XX XXX XX XX
  if (phone.startsWith('+998')) {
    const numbers = phone.slice(4);
    return `+998 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7)}`;
  }
  return phone;
};
```

---

## Support & Contact

Agar API integratsiya jarayonida savol yoki muammo bo'lsa, backend team bilan bog'laning.

**Happy Coding! 🚀**
