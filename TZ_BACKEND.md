# Texnik Talablar (TZ) - Barbershop Booking Platform Backend API

## Umumiy ma'lumot

Bu hujjat Barbershop Booking Platform uchun backend API texnik talablarini tavsiflaydi. Frontend allaqachon tayyor va API integratsiyasi uchun tayyorlangan.

**Platforma maqsadi:** Foydalanuvchilar barbershop'larni topish, xizmatlarni ko'rish va booking qilish imkoniyatiga ega bo'lishi kerak.

---

## Texnologiyalar

- **Backend Framework**: Node.js (Express/NestJS) yoki Python (FastAPI/Django)
- **Database**: PostgreSQL (tavsiya etiladi) yoki MongoDB
- **Authentication**: JWT tokens
- **API Format**: RESTful API, JSON
- **File Storage**: Cloud storage (AWS S3, Cloudinary) yoki local storage

---

## API Base URL

```
Development: http://localhost:3001/api
Production: https://api.yourdomain.com/api
```

---

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
    "phone": "string",
    "avatar": "string | null"
  },
  "token": "string"
}

Error Responses:
- 400: Validation error
- 409: Email or phone already exists
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
    "phone": "string",
    "avatar": "string | null"
  },
  "token": "string"
}

Error Responses:
- 401: Invalid credentials
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
    "avatar": "string | null"
  }
}

Error Responses:
- 401: Unauthorized
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
GET /api/barbershops?city=Tashkent&district=Yunusabad&sortBy=name&page=1&limit=20

Query Parameters:
- city: string (optional) - Filter by city
- district: string (optional) - Filter by district
- sortBy: 'name' | 'price' | 'distance' (optional) - Sort order
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
      "email": "string | null",
      "image": "string (URL)",
      "images": ["string"] (optional),
      "workingHours": {
        "monday": { "open": "09:00", "close": "20:00", "closed": false },
        "tuesday": { "open": "09:00", "close": "20:00", "closed": false },
        "wednesday": { "open": "09:00", "close": "20:00", "closed": false },
        "thursday": { "open": "09:00", "close": "20:00", "closed": false },
        "friday": { "open": "09:00", "close": "20:00", "closed": false },
        "saturday": { "open": "09:00", "close": "20:00", "closed": false },
        "sunday": { "open": "09:00", "close": "20:00", "closed": false }
      },
      "services": [Service[]],
      "barbers": [Barber[]],
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
    // Full barbershop object with all details
  }
}

Error Responses:
- 404: Barbershop not found
```

#### 2.3. Search Barbershops
```
GET /api/barbershops/search?q=premium&city=Tashkent&district=Yunusabad

Query Parameters:
- q: string (required) - Search query
- city: string (optional)
- district: string (optional)
- page: number (optional)
- limit: number (optional)

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
- barbershopId: string (optional) - Filter by barbershop

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string | null",
      "duration": number, // in minutes
      "price": number,
      "category": "haircut" | "beard" | "haircut-beard" | "coloring" | "styling" | "other",
      "barbershopId": "string"
    }
  ]
}
```

---

### 4. Bookings APIs

#### 4.1. Create Single Booking
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
    "userId": "string",
    "barbershopId": "string",
    "barbershopName": "string",
    "barberId": "string | null",
    "barberName": "string | null",
    "serviceId": "string",
    "serviceName": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:mm",
    "price": number,
    "duration": number,
    "status": "confirmed",
    "createdAt": "ISO datetime string"
  }
}

Error Responses:
- 400: Validation error
- 401: Unauthorized
- 409: Time slot already booked
- 400: Invalid time slot
- 400: Past date
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
  "data": [Booking[]],
  "failed": [
    {
      "booking": {...},
      "error": "Error message"
    }
  ] // optional, if some bookings failed
}
```

#### 4.3. Get User Bookings
```
GET /api/bookings
Authorization: Bearer <token>

Query Parameters:
- status: "pending" | "confirmed" | "completed" | "cancelled" (optional)
- page: number (optional, default: 1)
- limit: number (optional, default: 20)

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
GET /api/bookings/time-slots?barbershopId=bs1&date=2024-01-15&serviceId=s1&barberId=b1

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
      "barberId": "string | null"
    }
  ]
}
```

**Time Slots Logic:**
- Generate slots from 09:00 to 21:00, every 30 minutes
- Check if barbershop is open on that day
- Check if time slot conflicts with existing bookings
- Consider service duration + 15 min buffer
- If barberId provided, only show that barber's availability
- If serviceId provided, only show barbers who provide that service

---

### 5. Barbers APIs

#### 5.1. Get Barbers by Barbershop
```
GET /api/barbers?barbershopId=bs1

Response (200):
{
  "success": true,
  "data": [Barber[]]
}
```

---

### 6. Admin APIs

#### 6.1. Admin Authentication

##### 6.1.1. Admin Login
```
POST /api/admin/auth/login
Content-Type: application/json

Request Body:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "success": true,
  "admin": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "admin"
  },
  "token": "string"
}
```

##### 6.1.2. Get Admin Profile
```
GET /api/admin/auth/me
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "admin": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "admin"
  }
}
```

#### 6.2. Admin Dashboard

##### 6.2.1. Get Dashboard Stats
```
GET /api/admin/dashboard/stats
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": {
    "totalBarbershops": number,
    "totalBookings": number,
    "totalServices": number,
    "todayBookings": number,
    "pendingBookings": number,
    "revenue": {
      "today": number,
      "month": number,
      "total": number
    }
  }
}
```

#### 6.3. Admin Barbershops Management

##### 6.3.1. Get All Barbershops (Admin)
```
GET /api/admin/barbershops?page=1&limit=20
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": [Barbershop[]],
  "pagination": {...}
}
```

##### 6.3.2. Create Barbershop
```
POST /api/admin/barbershops
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  "name": "string",
  "description": "string",
  "address": "string",
  "city": "string",
  "district": "string",
  "phone": "string",
  "email": "string (optional)",
  "image": "string (URL or file)",
  "images": ["string"] (optional),
  "workingHours": {
    "monday": { "open": "09:00", "close": "20:00", "closed": false }
    // ... other days
  },
  "amenities": ["string"] (optional)
}

Response (201):
{
  "success": true,
  "data": Barbershop
}
```

##### 6.3.3. Update Barbershop
```
PUT /api/admin/barbershops/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  // Same as create, all fields optional
}

Response (200):
{
  "success": true,
  "data": Barbershop
}
```

##### 6.3.4. Delete Barbershop
```
DELETE /api/admin/barbershops/:id
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "message": "Barbershop deleted successfully"
}
```

#### 6.4. Admin Services Management

##### 6.4.1. Get All Services (Admin)
```
GET /api/admin/services?barbershopId=bs1&page=1&limit=20
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": [Service[]],
  "pagination": {...}
}
```

##### 6.4.2. Create Service
```
POST /api/admin/services
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  "name": "string",
  "description": "string (optional)",
  "duration": number, // minutes
  "price": number,
  "category": "haircut" | "beard" | "haircut-beard" | "coloring" | "styling" | "other",
  "barbershopId": "string"
}

Response (201):
{
  "success": true,
  "data": Service
}
```

##### 6.4.3. Update Service
```
PUT /api/admin/services/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  // Same as create, all fields optional
}

Response (200):
{
  "success": true,
  "data": Service
}
```

##### 6.4.4. Delete Service
```
DELETE /api/admin/services/:id
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "message": "Service deleted successfully"
}
```

#### 6.5. Admin Bookings Management

##### 6.5.1. Get All Bookings (Admin)
```
GET /api/admin/bookings?status=confirmed&page=1&limit=20
Authorization: Bearer <admin-token>

Query Parameters:
- status: "pending" | "confirmed" | "completed" | "cancelled" (optional)
- barbershopId: string (optional)
- date: YYYY-MM-DD (optional)
- page: number (optional)
- limit: number (optional)

Response (200):
{
  "success": true,
  "data": [Booking[]],
  "pagination": {...}
}
```

##### 6.5.2. Update Booking Status
```
PATCH /api/admin/bookings/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  "status": "pending" | "confirmed" | "completed" | "cancelled"
}

Response (200):
{
  "success": true,
  "data": Booking
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
  password: string; // hashed, never returned
  avatar?: string | null;
  role: 'user' | 'admin';
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
  email?: string | null;
  image: string; // URL
  images?: string[]; // Array of URLs
  workingHours: {
    monday: { open: string; close: string; closed?: boolean };
    tuesday: { open: string; close: string; closed?: boolean };
    wednesday: { open: string; close: string; closed?: boolean };
    thursday: { open: string; close: string; closed?: boolean };
    friday: { open: string; close: string; closed?: boolean };
    saturday: { open: string; close: string; closed?: boolean };
    sunday: { open: string; close: string; closed?: boolean };
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
  description?: string | null;
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
  specialization?: string | null;
  experience?: number | null;
  rating?: number | null;
  avatar?: string | null;
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
  createdAt: Date;
}
```

### Booking
```typescript
{
  id: string;
  userId: string;
  barbershopId: string;
  barbershopName: string; // denormalized
  serviceId: string;
  serviceName: string; // denormalized
  barberId?: string | null;
  barberName?: string | null; // denormalized
  date: Date; // stored as date, returned as YYYY-MM-DD string
  time: string; // HH:mm format
  price: number;
  duration: number; // minutes
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
    "message": "Human-readable error message",
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
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BOOKING_CONFLICT` - Time slot already booked
- `INVALID_TIME_SLOT` - Time slot not available
- `PAST_DATE` - Cannot book in the past
- `INVALID_WORKING_HOURS` - Time outside working hours
- `SERVICE_NOT_AVAILABLE` - Service doesn't belong to barbershop
- `BARBER_NOT_AVAILABLE` - Barber doesn't provide this service
- `DUPLICATE_EMAIL` - Email already registered
- `DUPLICATE_PHONE` - Phone already registered

---

## Authentication

### User Authentication
Barcha protected endpoints `Authorization: Bearer <token>` header orqali authentication qiladi.

Token JWT formatida bo'lishi kerak:
```json
{
  "userId": "string",
  "email": "string",
  "role": "user",
  "exp": 1234567890
}
```

### Admin Authentication
Admin endpoints alohida authentication talab qiladi. Admin token'da `role: "admin"` bo'lishi kerak.

Token format:
```json
{
  "adminId": "string",
  "email": "string",
  "role": "admin",
  "exp": 1234567890
}
```

### Token Expiration
- User tokens: 7 days
- Admin tokens: 1 day (recommended for security)

---

## Validation Rules

### Registration
- `name`: Required, min 2, max 50 characters, only letters and spaces
- `email`: Required, valid email format, unique, max 100 characters
- `phone`: Required, valid format (+998XXXXXXXXX), unique, exactly 13 characters
- `password`: Required, min 8 characters, must contain letters and numbers, max 100 characters

### Booking
- `barbershopId`: Required, must exist
- `serviceId`: Required, must exist and belong to barbershop
- `date`: Required, valid date (YYYY-MM-DD), not in past, not more than 3 months future
- `time`: Required, valid time (HH:mm), within working hours, 30-minute intervals
- `barberId`: Optional, if provided must exist and provide the service

---

## Business Logic

### Time Slot Availability

1. **Time slot mavjud bo'lishi uchun:**
   - Barbershop o'sha kuni ishlashi kerak (workingHours'da closed: false)
   - Vaqt ish vaqti ichida bo'lishi kerak (open <= time <= close)
   - Service duration + buffer time (15 min) bo'sh bo'lishi kerak
   - Barber (agar tanlangan bo'lsa) o'sha vaqtda band bo'lmasligi kerak
   - Boshqa bookinglar bilan conflict bo'lmasligi kerak

2. **Booking yaratilganda:**
   - Time slotni reserve qilish (status: confirmed)
   - Service va barbershop ma'lumotlarini denormalize qilish
   - Userga notification yuborish (optional, keyingi bosqich)

3. **Time slot conflict check:**
   - Agar barber tanlangan bo'lsa, faqat o'sha barberning bookinglarini tekshirish
   - Agar barber tanlanmagan bo'lsa, barbershop'dagi barcha bookinglarni tekshirish
   - Service duration + 15 min buffer time hisobga olinishi kerak

### Booking Status Flow
```
pending → confirmed → completed
         ↓
      cancelled
```

---

## Database Schema Recommendations

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(13) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Barbershops table
CREATE TABLE barbershops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  address VARCHAR(200) NOT NULL,
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  phone VARCHAR(13) NOT NULL,
  email VARCHAR(100),
  image TEXT NOT NULL,
  images TEXT[],
  working_hours JSONB NOT NULL,
  amenities TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL CHECK (duration > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(20) NOT NULL CHECK (category IN ('haircut', 'beard', 'haircut-beard', 'coloring', 'styling', 'other')),
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Barbers table
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  experience INTEGER,
  rating DECIMAL(3, 2),
  avatar TEXT,
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Barber-Service many-to-many
CREATE TABLE barber_services (
  barber_id UUID NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (barber_id, service_id)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  barbershop_id UUID NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  barbershop_name VARCHAR(100) NOT NULL,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  service_name VARCHAR(100) NOT NULL,
  barber_id UUID REFERENCES barbers(id) ON DELETE SET NULL,
  barber_name VARCHAR(100),
  date DATE NOT NULL,
  time VARCHAR(5) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_barbershop_id ON bookings(barbershop_id);
CREATE INDEX idx_bookings_date_time ON bookings(date, time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_barbershops_city_district ON barbershops(city, district);
CREATE INDEX idx_services_barbershop_id ON services(barbershop_id);
CREATE INDEX idx_barbers_barbershop_id ON barbers(barbershop_id);
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/barbershop_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_ADMIN_EXPIRES_IN=1d

# Server
API_PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Storage (optional)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_REGION=...

# Admin
ADMIN_EMAIL=admin@barbershop.uz
ADMIN_PASSWORD=change-in-production
```

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...} | [...],
  "pagination": {...} // optional
}
```

### Error Response
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

---

## Pagination

Barcha list endpoints pagination qo'llab-quvvatlashi kerak:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Date and Time Handling

- **Timezone**: UTC+5 (Uzbekistan timezone)
- **Date format**: YYYY-MM-DD (ISO 8601)
- **Time format**: HH:mm (24-hour format)
- **DateTime format**: ISO 8601 string

---

## Security Considerations

1. **Password Hashing**: bcrypt yoki argon2
2. **JWT Security**: Strong secret key, proper expiration
3. **Input Validation**: Barcha inputlarni validate qilish
4. **SQL Injection**: Parameterized queries
5. **CORS**: Frontend URL'ni allow qilish
6. **Rate Limiting**: API abuse'ni oldini olish
7. **HTTPS**: Production'da faqat HTTPS

---

## Performance Requirements

1. **Response Time**: 
   - Simple queries: < 200ms
   - Complex queries: < 500ms
   - List endpoints: < 1s

2. **Database Optimization**:
   - Proper indexes
   - Query optimization
   - Connection pooling

---

## Additional Features (Keyingi bosqichlar)

1. **Reviews & Ratings**
2. **Notifications** (Email, SMS)
3. **Payments** (Payme, Click)
4. **Analytics**
5. **Search Enhancement**

---

## Notes

- Barcha vaqtlar UTC+5 (Uzbekistan timezone)
- Currency: UZS (Uzbekistan Som)
- Date format: YYYY-MM-DD
- Time format: HH:mm (24-hour format)
- Phone format: +998XXXXXXXXX
- Barcha string fieldlar UTF-8 encoding'da (Uzbek/Russian text support)
- Admin va User authentication alohida
- Booking ma'lumotlari denormalize qilinishi kerak (performance uchun)

---

## Frontend Integration Notes

Frontend allaqachon quyidagi API client'ga tayyorlangan:
- File: `lib/api/client.ts`
- Base URL: `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'`
- Barcha endpointlar frontend'da mock qilingan, backend integratsiyasi uchun tayyor
