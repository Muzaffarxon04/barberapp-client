# Texnik Talablar (TZ) - Barbershop Booking Platform Backend API

## Umumiy ma'lumot

Bu hujjat Barbershop Booking Platform uchun backend API texnik talablarini tavsiflaydi. Frontend allaqachon tayyor va API integratsiyasi uchun tayyorlangan.

## Texnologiyalar

- **Backend Framework**: Node.js (Express/NestJS) yoki Python (FastAPI/Django)
- **Database**: PostgreSQL yoki MongoDB
- **Authentication**: JWT tokens
- **API Format**: RESTful API, JSON

## API Endpoints

### 1. Authentication APIs

#### 1.1. User Registration
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string"
}

Response (201):
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "token": "string"
}
```

#### 1.2. User Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "token": "string"
}
```

#### 1.3. Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string (optional)"
  }
}
```

#### 1.4. Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. Barbershops APIs

#### 2.1. Get All Barbershops
```
GET /api/barbershops?city=Tashkent&district=Yunusabad&minRating=4.0&sortBy=rating

Query Parameters:
- city: string (optional)
- district: string (optional)
- minRating: number (optional)
- sortBy: 'rating' | 'price' | 'name' | 'distance' (optional)
- page: number (optional, default: 1)
- limit: number (optional, default: 20)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "address": "string",
      "city": "string",
      "district": "string",
      "phone": "string",
      "email": "string (optional)",
      "rating": number,
      "reviewCount": number,
      "image": "string (URL)",
      "images": ["string"] (optional),
      "workingHours": {
        "monday": { "open": "09:00", "close": "20:00", "closed": false },
        "tuesday": { "open": "09:00", "close": "20:00", "closed": false },
        ...
      },
      "services": [Service],
      "barbers": [Barber],
      "amenities": ["string"] (optional)
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

#### 2.2. Get Barbershop by ID
```
GET /api/barbershops/:id

Response (200):
{
  "success": true,
  "data": {
    // Full barbershop object
  }
}
```

#### 2.3. Search Barbershops
```
GET /api/barbershops/search?q=premium&city=Tashkent

Query Parameters:
- q: string (search query)
- city: string (optional)
- district: string (optional)
- minRating: number (optional)

Response (200):
{
  "success": true,
  "data": [Barbershop[]],
  "pagination": {...}
}
```

---

### 3. Services APIs

#### 3.1. Get All Services
```
GET /api/services?barbershopId=bs1

Query Parameters:
- barbershopId: string (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string (optional)",
      "duration": number, // in minutes
      "price": number,
      "category": "haircut" | "beard" | "haircut-beard" | "coloring" | "styling" | "other"
    }
  ]
}
```

#### 3.2. Get Services by Barbershop
```
GET /api/services?barbershopId=bs1

Response (200):
{
  "success": true,
  "data": [Service[]]
}
```

---

### 4. Bookings APIs

#### 4.1. Create Booking
```
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "barbershopId": "string",
  "serviceId": "string",
  "barberId": "string (optional)",
  "date": "YYYY-MM-DD",
  "time": "HH:mm"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "string",
    "barbershopId": "string",
    "barbershopName": "string",
    "barberId": "string (optional)",
    "barberName": "string (optional)",
    "serviceId": "string",
    "serviceName": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:mm",
    "price": number,
    "duration": number,
    "status": "pending" | "confirmed" | "completed" | "cancelled",
    "createdAt": "ISO datetime"
  }
}
```

#### 4.2. Create Multiple Bookings (from Cart)
```
POST /api/bookings/multiple
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "bookings": [
    {
      "barbershopId": "string",
      "serviceId": "string",
      "barberId": "string (optional)",
      "date": "YYYY-MM-DD",
      "time": "HH:mm"
    }
  ]
}

Response (201):
{
  "success": true,
  "data": [Booking[]]
}
```

#### 4.3. Get User Bookings
```
GET /api/bookings
Authorization: Bearer <token>
Query Parameters:
- status: "pending" | "confirmed" | "completed" | "cancelled" (optional)
- page: number (optional)
- limit: number (optional)

Response (200):
{
  "success": true,
  "data": [Booking[]],
  "pagination": {...}
}
```

#### 4.4. Get Booking by ID
```
GET /api/bookings/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": Booking
}
```

#### 4.5. Cancel Booking
```
POST /api/bookings/:id/cancel
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    ...Booking,
    "status": "cancelled"
  }
}
```

#### 4.6. Get Available Time Slots
```
GET /api/bookings/time-slots?barbershopId=bs1&date=2024-01-15&serviceId=s1

Query Parameters:
- barbershopId: string (required)
- date: YYYY-MM-DD (required)
- serviceId: string (optional)
- barberId: string (optional)

Response (200):
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "available": true,
      "barberId": "string (optional)"
    },
    {
      "time": "09:30",
      "available": false,
      "barberId": "string (optional)"
    }
  ]
}
```

---

### 5. Barbers APIs

#### 5.1. Get Barbers by Barbershop
```
GET /api/barbers?barbershopId=bs1

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "specialization": "string (optional)",
      "experience": number (optional),
      "rating": number (optional),
      "avatar": "string (URL, optional)",
      "services": ["serviceId"]
    }
  ]
}
```

---

## Data Models

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // hashed
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Barbershop
```typescript
{
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email?: string;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[];
  workingHours: {
    [day: string]: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  amenities?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Service
```typescript
{
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  category: 'haircut' | 'beard' | 'haircut-beard' | 'coloring' | 'styling' | 'other';
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Barber
```typescript
{
  id: string;
  name: string;
  specialization?: string;
  experience?: number;
  rating?: number;
  avatar?: string;
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### BarberService (Many-to-Many)
```typescript
{
  barberId: string;
  serviceId: string;
}
```

### Booking
```typescript
{
  id: string;
  userId: string;
  barbershopId: string;
  serviceId: string;
  barberId?: string;
  date: Date;
  time: string; // HH:mm
  price: number;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Handling

Barcha API endpoints quyidagi formatda error qaytarishi kerak:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {} // optional
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., booking already exists)
- `500` - Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BOOKING_CONFLICT` - Time slot already booked
- `INVALID_TIME_SLOT` - Time slot not available
- `PAST_DATE` - Cannot book in the past

---

## Authentication

Barcha protected endpoints `Authorization: Bearer <token>` header orqali authentication qiladi.

Token JWT formatida bo'lishi kerak va quyidagi ma'lumotlarni o'z ichiga olishi kerak:
- `userId`
- `email`
- `exp` (expiration time)

---

## Validation Rules

### Registration
- `name`: required, min 2 characters, max 50 characters
- `email`: required, valid email format, unique
- `phone`: required, valid phone format (Uzbekistan: +998XXXXXXXXX)
- `password`: required, min 8 characters, must contain letters and numbers

### Booking
- `barbershopId`: required, must exist
- `serviceId`: required, must exist and belong to barbershop
- `date`: required, valid date, not in the past
- `time`: required, valid time format (HH:mm), must be within working hours
- `barberId`: optional, if provided must exist and provide the service

---

## Business Logic

### Time Slot Availability
1. Time slot mavjud bo'lishi uchun:
   - Barbershop o'sha kuni ishlashi kerak
   - Vaqt ish vaqti ichida bo'lishi kerak
   - Service duration + buffer time (15 min) bo'sh bo'lishi kerak
   - Barber (agar tanlangan bo'lsa) o'sha vaqtda band bo'lmasligi kerak

2. Booking yaratilganda:
   - Time slotni reserve qilish
   - Userga email/SMS notification yuborish
   - Barbershop owner'ga notification yuborish

### Rating Calculation
- Barbershop rating = barcha review'larning o'rtacha qiymati
- Har bir yangi review rating'ni yangilaydi

---

## Additional Features (Keyingi bosqichlar)

1. **Reviews & Ratings**
   - POST /api/reviews
   - GET /api/reviews?barbershopId=bs1

2. **Notifications**
   - Email notifications
   - SMS notifications (Uzbekistan operators)
   - Push notifications

3. **Payments**
   - Payment gateway integration
   - POST /api/payments/process

4. **Admin Panel APIs**
   - Barbershop management
   - Booking management
   - User management

5. **Analytics**
   - GET /api/analytics/bookings
   - GET /api/analytics/revenue

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
API_PORT=3001
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE_API_KEY=...
SMS_SERVICE_API_KEY=...
```

---

## Testing Requirements

Har bir endpoint uchun:
- Error handling tests
- Authentication/Authorization tests

---

## API Documentation

API dokumentatsiyasi Swagger/OpenAPI formatida bo'lishi kerak va `/api/docs` endpoint'da mavjud bo'lishi kerak.

---

## Notes

- Barcha vaqtlar UTC+5 (Uzbekistan timezone) formatida saqlanishi kerak
- Currency: UZS (Uzbekistan Som)
- Date format: YYYY-MM-DD
- Time format: HH:mm (24-hour format)
- Phone format: +998XXXXXXXXX
