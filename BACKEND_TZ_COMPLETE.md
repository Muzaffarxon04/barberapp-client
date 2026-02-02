# Barbershop Booking Platform - Backend API Texnik Talablar (NestJS)

## Vazifa

Sizga Barbershop Booking Platform uchun NestJS backend API yaratish vazifasi berilmoqda. Frontend allaqachon tayyor va admin panel bilan birga ishlaydi.

**Platforma maqsadi:** Foydalanuvchilar barbershop'larni topish, xizmatlarni ko'rish va booking qilish imkoniyatiga ega bo'lishi kerak.

---

## Texnologiyalar

- **NestJS** (Framework - majburiy)
- **TypeScript** (majburiy)
- **PostgreSQL** (database)
- **TypeORM** (ORM - tavsiya etiladi NestJS bilan)
- **@nestjs/jwt** (JWT authentication)
- **@nestjs/passport** (Passport integration)
- **class-validator** va **class-transformer** (Validation)
- **Multer** yoki **Cloudinary** (file upload)
- **@nestjs/config** (Configuration management)

---

## API Base URL

```
Development: http://localhost:3001/api
Production: https://api.yourdomain.com/api
```

---

## Kod Strukturasi (NestJS)

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── storage.config.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── admin.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── admin-jwt.strategy.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       └── admin-login.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │
│   ├── barbershops/
│   │   ├── barbershops.module.ts
│   │   ├── barbershops.controller.ts
│   │   ├── barbershops.service.ts
│   │   ├── entities/
│   │   │   └── barbershop.entity.ts
│   │   └── dto/
│   │
│   ├── services/
│   │   ├── services.module.ts
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   ├── entities/
│   │   │   └── service.entity.ts
│   │   └── dto/
│   │
│   ├── barbers/
│   │   ├── barbers.module.ts
│   │   ├── barbers.controller.ts
│   │   ├── barbers.service.ts
│   │   ├── entities/
│   │   │   └── barber.entity.ts
│   │   └── dto/
│   │
│   ├── bookings/
│   │   ├── bookings.module.ts
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   ├── entities/
│   │   │   └── booking.entity.ts
│   │   └── dto/
│   │
│   ├── admin/
│   │   ├── admin.module.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.ts
│   │   │   └── dashboard.service.ts
│   │   ├── barbershops/
│   │   │   ├── admin-barbershops.controller.ts
│   │   │   └── admin-barbershops.service.ts
│   │   ├── barbers/
│   │   │   ├── admin-barbers.controller.ts
│   │   │   └── admin-barbers.service.ts
│   │   ├── services/
│   │   │   ├── admin-services.controller.ts
│   │   │   └── admin-services.service.ts
│   │   └── bookings/
│   │       ├── admin-bookings.controller.ts
│   │       └── admin-bookings.service.ts
│   │
│   └── utils/
│       ├── time-slots.util.ts
│       ├── image-upload.util.ts
│       └── pagination.util.ts
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── typeorm/
│   └── migrations/
│
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── package.json
└── README.md
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
  "data": [Barbershop[]],
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
  "data": Barbershop
}

Error Responses:
- 404: Barbershop not found
```

#### 2.3. Search Barbershops
```
GET /api/barbershops/search?q=premium&city=Tashkent&district=Yunusabad

Query Parameters:
- search: string (required) - Search query
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
  "data": [Service[]]
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
  "data": Booking
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
  ]
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
- barbershopId: string (required) - Barbershop ID
- date: YYYY-MM-DD (required) - Sana (faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun)
- serviceId: string (optional) - Service ID (service duration hisobga olinadi)
- barberId: string (optional) - Barber ID (faqat o'sha barberning slotlari)

**MUHIM**: Date parametri faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun kerak.
Time slotlar generatsiya qilish workingHours'ga qarab bo'ladi (hamma kunlar uchun bir xil).
Date statik bo'ladi, lekin har bir sana uchun existing bookings bilan conflict tekshirish kerak.

Response (200):
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "available": true,
      "barberId": "string | null"
    },
    {
      "time": "09:30",
      "available": false,
      "barberId": "string | null"
    }
  ]
}

**MUHIM**: Time slotlar generatsiya qilish **BACKEND** tomonidan amalga oshiriladi.

**Business Logic:**
- Time slotlar har bir request uchun dinamik generatsiya qilinadi
- Database'ga saqlanmaydi (chunki har bir sana uchun existing bookings bilan conflict tekshirish kerak)
- Barbershop'ning workingHours'ini database'dan olish
- **MUHIM**: Time slotlar generatsiya qilish workingHours'ga qarab bo'ladi (hamma kunlar uchun bir xil)
- Date parametri faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun kerak
- Har bir slot uchun availability tekshirish (o'sha kundagi existing bookings bilan conflict)
- Service duration va buffer time hisobga olish
- Barber va Service filtrlash

**Backend vazifasi:**
1. Barbershop'ning workingHours'ini database'dan olish (hamma kunlar uchun bir xil)
2. Time slotlarni generatsiya qilish (workingHours'ga qarab, date'ga bog'liq emas)
3. Request qilingan sana (date) bo'yicha o'sha kundagi existing bookings bilan conflict tekshirish
4. Har bir slot uchun availability tekshirish (o'sha kundagi existing bookings bilan conflict)
5. Service duration va buffer time hisobga olish
6. Barber va Service filtrlash
7. Frontend'ga tayyor time slotlar ro'yxatini qaytarish

**Eslatma**: Date parametri faqat filter sifatida ishlatiladi (o'sha kundagi bookinglarni tekshirish uchun).
Time slotlar generatsiya qilish workingHours'ga qarab bo'ladi (hamma kunlar uchun bir xil).

**Frontend vazifasi:**
- Faqat backend'dan kelgan time slotlarni ko'rsatish
- User tanlagan slotni booking yaratish uchun yuborish
- Time slotlarni generatsiya qilish frontend'da amalga oshirilmaydi

**Time Slots Generation Logic:**

**MUHIM QOIDA**: Time slotlar faqat workingHours oralig'ida generatsiya qilinadi. WorkingHours tashqarisidagi vaqtlar hech qachon ko'rsatilmaydi.

1. **Ish vaqtini aniqlash:**
   - Barbershop'ning workingHours'ini olish (hamma kunlar uchun bir xil)
   - Agar "closed": true bo'lsa, bo'sh array qaytarish
   - Agar "closed": false bo'lsa:
     - Agar "open" va "close" null bo'lsa → 24 soatlik (00:00 dan 23:30 gacha)
     - Agar "open" va "close" berilgan bo'lsa → **FAQAT** o'sha vaqtlar orasida

2. **Time slotlarni generatsiya qilish:**
   - Agar "open" va "close" null bo'lsa:
     - 00:00 dan 23:30 gacha 30 daqiqalik intervalda generatsiya qilish
     - 00:00, 00:30, 01:00, 01:30, ..., 23:00, 23:30
   - Agar "open" va "close" berilgan bo'lsa:
     - **FAQAT** "open" vaqtdan boshlab "close" vaqtgacha generatsiya qilish
     - Oxirgi slot "close" vaqtdan oldin bo'lishi kerak (service duration + buffer hisobga olinadi)
     - Masalan: open: "09:00", close: "20:00", serviceDuration: 30min bo'lsa:
       - 09:00, 09:30, 10:00, 10:30, ..., 19:00, 19:30
       - 20:00 slot mavjud emas (chunki 20:00 + 30min + 15min = 20:15 > 20:00)
     - Masalan: open: "09:00", close: "20:00", serviceDuration: 60min bo'lsa:
       - Oxirgi slot: 18:30 (chunki 18:30 + 60min + 15min = 19:45 < 20:00)
       - 19:00 va 19:30 slotlar mavjud emas (chunki 19:00 + 60min + 15min = 20:15 > 20:00)
   - Har bir slot uchun "available" statusini tekshirish

3. **Availability tekshirish (Date parametri bu yerda ishlatiladi):**
   - **MUHIM**: Date parametri faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun kerak
   - Request qilingan sana (date) bo'yicha o'sha kundagi bookinglarni database'dan olish
   - Agar barberId berilgan bo'lsa:
     - Faqat o'sha barberning o'sha kundagi bookinglarini tekshirish
     - Service duration + 15 min buffer time hisobga olinadi
     - Agar barber o'sha vaqtda band bo'lsa, available: false
   - Agar barberId berilmagan bo'lsa:
     - Barbershop'dagi o'sha kundagi barcha bookinglarni tekshirish
     - Service duration + 15 min buffer time hisobga olinadi
     - Agar conflict bo'lsa, available: false

4. **Service va Barber filtrlash:**
   - Agar serviceId berilgan bo'lsa:
     - Faqat o'sha serviceni qo'llay oladigan barberlar ko'rsatiladi
     - Agar barberId ham berilgan bo'lsa, barber o'sha serviceni qo'llay olishini tekshirish
   - Agar barberId berilgan bo'lsa:
     - Faqat o'sha barberning time slotlari ko'rsatiladi

5. **Conflict tekshirish:**
   - Har bir time slot uchun:
     - Slot vaqti: 09:00
     - Service duration: 30 min
     - Buffer time: 15 min
     - Jami: 09:00 dan 09:45 gacha band bo'lishi kerak
     - Agar bu vaqt oralig'ida boshqa booking bo'lsa, conflict
     - Agar barberId berilgan bo'lsa, faqat o'sha barberning bookinglarini tekshirish

**Example 1 (Ish vaqti berilgan):**
- Barbershop ish vaqti: open: "09:00", close: "20:00", closed: false
- Service duration: 30 min
- Buffer time: 15 min
- Existing booking: 09:00-09:30 (barberId: b1)
- Request: barbershopId=bs1, date=2024-01-15, serviceId=s1, barberId=b1

Result (faqat workingHours ichida):
- 09:00 - available: false (conflict with existing booking)
- 09:30 - available: true (09:30 + 30min + 15min = 10:15, no conflict)
- 10:00 - available: true
- ...
- 19:00 - available: true (19:00 + 30min + 15min = 19:45 < 20:00)
- **Eslatma**: 19:30 slot generatsiya qilinmaydi, chunki 19:30 + serviceDuration + buffer = 20:15 > close (20:00)
- Oxirgi slot: 19:00 (chunki 19:00 + 30min + 15min = 19:45 < 20:00)
- **MUHIM**: WorkingHours tashqarisidagi vaqtlar (08:00, 08:30, 20:00, 20:30, va hokazo) hech qachon ko'rsatilmaydi

**Example 2 (24 soatlik):**
- Barbershop ish vaqti: open: null, close: null, closed: false (24 soatlik)
- Service duration: 30 min
- Buffer time: 15 min
- Request: barbershopId=bs1, date=2024-01-15, serviceId=s1

Result:
- 00:00, 00:30, 01:00, 01:30, ..., 23:00, 23:30 (barcha vaqtlar mavjud, agar conflict bo'lmasa)

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
    "totalServices": number,
    "totalBookings": number,
    "activeUsers": number,
    "recentBookings": [
      {
        "id": "string",
        "barbershopName": "string",
        "serviceName": "string",
        "date": "YYYY-MM-DD",
        "time": "HH:mm",
        "status": "pending" | "confirmed" | "completed" | "cancelled"
      }
    ]
  }
}

Business Logic:
- totalBarbershops: Barcha barbershoplar soni
- totalServices: Barcha servicelar soni (barcha barbershoplardan)
- totalBookings: Barcha bookinglar soni
- activeUsers: Oxirgi 30 kun ichida kamida 1 booking qilgan userlar soni
- recentBookings: Oxirgi 5 ta booking (status bo'yicha sort qilingan)
```

#### 6.3. Admin Barbershops Management

##### 6.3.1. Upload Barbershop Image
```
POST /api/admin/barbershops/upload-image
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

Request Body:
- file: File (image file, max 10MB)

Response (200):
{
  "success": true,
  "data": {
    "url": "string (image URL)",
    "filename": "string"
  }
}

File Upload Requirements:
- Allowed formats: JPEG, PNG, GIF, WebP
- Max file size: 10MB
- Store in cloud storage (AWS S3, Cloudinary) yoki local storage
- Return public URL
```

##### 6.3.2. Get All Barbershops (Admin)
```
GET /api/admin/barbershops?page=1&limit=20&search=premium
Authorization: Bearer <admin-token>

Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 20)
- search: string (optional) - Search in name, address

Response (200):
{
  "success": true,
  "data": [Barbershop[]],
  "pagination": {...}
}
```

##### 6.3.3. Create Barbershop
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
  "image": "string (URL or base64)", // If base64, convert to file and upload
  "workingHours": {
    "open": "09:00",      // Boshlanish vaqti (HH:mm format, 24-hour) - optional, null bo'lsa 24 soatlik
    "close": "20:00",     // Tugash vaqti (HH:mm format, 24-hour) - optional, null bo'lsa 24 soatlik
    "closed": false       // Agar true bo'lsa, barbershop yopiq (hamma kunlar uchun)
  }
  
  // Yoki 24 soatlik uchun:
  "workingHours": {
    "open": null,         // null = 24 soatlik ishlaydi
    "close": null,        // null = 24 soatlik ishlaydi
    "closed": false
  }
}

Response (201):
{
  "success": true,
  "data": Barbershop
}

**Business Logic:**
- Barbershop yaratilganda, workingHours database'ga saqlanadi
- Time slotlar har bir sana uchun dinamik generatsiya qilinadi (database'ga saqlanmaydi)
- Time slotlarni get qilish uchun: GET /api/bookings/time-slots?barbershopId=<id>&date=<date>
- Har bir request uchun real-time generatsiya qilinadi (existing bookings bilan conflict tekshirish uchun)

Validation Rules:
- "open" va "close" vaqtlari optional (null bo'lishi mumkin)
- Agar "open" va "close" null bo'lsa, barbershop 24 soatlik ishlaydi (00:00 dan 23:59 gacha)
- Agar "open" va "close" berilgan bo'lsa:
  - "open" vaqt "close" vaqtdan oldin bo'lishi kerak
  - Vaqt formati: HH:mm (24-hour format, masalan: "09:00", "21:00")
- "closed": true bo'lsa, "open" va "close" maydonlari e'tiborsiz qoldiriladi
- Hamma kunlar uchun bir xil ish vaqti (hafta kunlari farqi yo'q)

Image Handling:
- Agar image base64 formatda bo'lsa, uni file'ga convert qilib upload qilish kerak
- Agar image URL bo'lsa, to'g'ridan-to'g'ri saqlash
- Default image: agar image berilmasa, default image URL qo'yish

Working Hours va Time Slots Logic:
- Barbershop yaratilganda, workingHours database'ga saqlanadi (barbershops table'da JSONB formatda)
- Time slotlar har bir sana uchun dinamik generatsiya qilinadi (database'ga saqlanmaydi)
- Time slotlarni get qilish: GET /api/bookings/time-slots?barbershopId=<id>&date=<date>
- Har bir request uchun real-time generatsiya qilinadi (existing bookings bilan conflict tekshirish uchun)
- WorkingHours'ga qarab time slotlar generatsiya qilinadi:
  - Agar open va close null bo'lsa → 24 soatlik (00:00 dan 23:30 gacha)
  - Agar open va close berilgan bo'lsa → o'sha vaqtlar orasida
- "open" va "close" vaqtlari optional (null bo'lishi mumkin)
- Agar "open" va "close" null bo'lsa, barbershop 24 soatlik ishlaydi (00:00 dan 23:59 gacha)
- Agar "closed": true bo'lsa, barbershop yopiq (hamma kunlar uchun)
- Time slotlar generatsiya qilinadi:
  - Agar "open" va "close" null bo'lsa: 00:00 dan 23:30 gacha (30 daqiqalik interval)
  - Agar "open" va "close" berilgan bo'lsa: "open" dan "close" gacha (30 daqiqalik interval)
- Masalan: open: "09:00", close: "20:00" bo'lsa, time slotlar: 09:00, 09:30, 10:00, ..., 19:30 bo'ladi
- Masalan: open: null, close: null bo'lsa, time slotlar: 00:00, 00:30, 01:00, ..., 23:30 bo'ladi
- Hafta kunlari farqi yo'q, hamma kunlar uchun bir xil ish vaqti
```

##### 6.3.4. Update Barbershop
```
PUT /api/admin/barbershops/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  // Same as create, all fields optional
  "image": "string (URL or base64)" // optional
}

Response (200):
{
  "success": true,
  "data": Barbershop
}
```

##### 6.3.5. Delete Barbershop
```
DELETE /api/admin/barbershops/:id
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "message": "Barbershop deleted successfully"
}
```

##### 6.3.6. Get Barbershop Detail (with barbers)
```
GET /api/admin/barbershops/:id
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": {
    ...Barbershop,
    "barbers": [
      {
        "id": "string",
        "name": "string",
        "specialization": "string | null",
        "experience": "number | null",
        "services": ["string"], // service IDs
        "createdAt": "ISO datetime",
        "updatedAt": "ISO datetime"
      }
    ]
  }
}
```

#### 6.4. Admin Barbers Management

##### 6.4.1. Add Barber to Barbershop
```
POST /api/admin/barbershops/:barbershopId/barbers
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  "name": "string",
  "specialization": "string (optional)",
  "experience": "number (optional)",
  "services": ["string"] // array of service IDs
}

Response (201):
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "specialization": "string | null",
    "experience": "number | null",
    "barbershopId": "string",
    "services": ["string"], // service IDs
    "createdAt": "ISO datetime",
    "updatedAt": "ISO datetime"
  }
}

Error Responses:
- 404: Barbershop not found
- 400: Service IDs must exist (can be global services)
- 400: Validation error

Validation:
- name: Required, min 2, max 100 characters
- specialization: Optional, max 100 characters
- experience: Optional, number >= 0
- services: Optional array, all service IDs must exist
```

##### 6.4.2. Update Barber
```
PUT /api/admin/barbershops/:barbershopId/barbers/:barberId
Authorization: Bearer <admin-token>
Content-Type: application/json

Request Body:
{
  "name": "string (optional)",
  "specialization": "string (optional)",
  "experience": "number (optional)",
  "services": ["string"] // optional, array of service IDs
}

Response (200):
{
  "success": true,
  "data": Barber
}
```

##### 6.4.3. Remove Barber from Barbershop
```
DELETE /api/admin/barbershops/:barbershopId/barbers/:barberId
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "message": "Barber removed successfully"
}

Error Responses:
- 404: Barber not found
- 400: Barber has active bookings (cannot delete)

Business Logic:
- Agar barber'da active bookinglar bo'lsa (confirmed yoki pending), o'chirish mumkin emas
- Faqat completed yoki cancelled bookinglar bo'lsa, o'chirish mumkin
```

##### 6.4.4. Get All Services (for barber selection)
```
GET /api/admin/services/all
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "price": number,
      "duration": number,
      "category": "string"
    }
  ]
}

Note: Bu endpoint barcha servicelarni qaytaradi (barbershop'ga bog'liq emas, global servicelar ham)
```

#### 6.5. Admin Services Management

##### 6.5.1. Get All Services (Admin)
```
GET /api/admin/services?page=1&limit=20&search=soch
Authorization: Bearer <admin-token>

Query Parameters:
- page: number (optional, default: 1)
- limit: number (optional, default: 20)
- search: string (optional) - Search by name

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string | null",
      "duration": number,
      "price": number,
      "category": "string",
      "barbershopId": "string | null", // null = global service
      "barbershopName": "string | null", // denormalized
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ],
  "pagination": {...}
}
```

##### 6.5.2. Create Service
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
  "barbershopId": "string (optional)" // If not provided, service is global
}

Response (201):
{
  "success": true,
  "data": Service
}

Note: Agar barbershopId berilmasa, service global bo'ladi (barcha barbershoplar uchun)
```

##### 6.5.3. Update Service
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

##### 6.5.4. Delete Service
```
DELETE /api/admin/services/:id
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "message": "Service deleted successfully"
}

Error Responses:
- 404: Service not found
- 400: Service has active bookings (cannot delete)

Business Logic:
- Agar service'da active bookinglar bo'lsa, o'chirish mumkin emas
- Faqat completed yoki cancelled bookinglar bo'lsa, o'chirish mumkin
```

#### 6.6. Admin Bookings Management

##### 6.6.1. Get All Bookings (Admin)
```
GET /api/admin/bookings?status=confirmed&search=ali&page=1&limit=20
Authorization: Bearer <admin-token>

Query Parameters:
- status: "pending" | "confirmed" | "completed" | "cancelled" | "all" (optional)
- search: string (optional) - Search in barbershopName, serviceName, userName
- barbershopId: string (optional)
- date: YYYY-MM-DD (optional)
- page: number (optional, default: 1)
- limit: number (optional, default: 20)

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "userName": "string", // denormalized
      "barbershopId": "string",
      "barbershopName": "string",
      "serviceId": "string",
      "serviceName": "string",
      "barberId": "string | null",
      "barberName": "string | null",
      "date": "YYYY-MM-DD",
      "time": "HH:mm",
      "price": number,
      "duration": number,
      "status": "pending" | "confirmed" | "completed" | "cancelled",
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ],
  "pagination": {...}
}
```

##### 6.6.2. Update Booking Status
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

Error Responses:
- 400: Invalid status transition
- 404: Booking not found

Status Transition Rules:
- pending → confirmed, cancelled
- confirmed → completed, cancelled
- completed → cannot change
- cancelled → cannot change
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
    open: string | null;      // Boshlanish vaqti (HH:mm format, masalan: "09:00") - optional, null bo'lsa 24 soatlik
    close: string | null;     // Tugash vaqti (HH:mm format, masalan: "20:00") - optional, null bo'lsa 24 soatlik
    closed?: boolean;         // Agar true bo'lsa, barbershop yopiq (hamma kunlar uchun)
  };
  amenities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

**Working Hours Notes:**
- "open" va "close" vaqtlari optional (null bo'lishi mumkin)
- Agar "open" va "close" null bo'lsa, barbershop 24 soatlik ishlaydi (00:00 dan 23:59 gacha)
- Agar "open" va "close" berilgan bo'lsa:
  - "open" vaqt "close" vaqtdan oldin bo'lishi kerak
  - Vaqt formati: HH:mm (24-hour format, masalan: "09:00", "21:00")
- "closed": true bo'lsa, barbershop yopiq (hamma kunlar uchun)
- Hafta kunlari farqi yo'q, hamma kunlar uchun bir xil ish vaqti
- Time slotlar generatsiya qilinadi:
  - Agar null bo'lsa: 00:00 dan 23:30 gacha (30 daqiqalik interval)
  - Agar berilgan bo'lsa: "open" dan "close" gacha (30 daqiqalik interval)
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
  barbershopId: string | null; // null = global service
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

## Database Schema (PostgreSQL)

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

-- Services table (barbershop_id can be NULL for global services)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL CHECK (duration > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(20) NOT NULL CHECK (category IN ('haircut', 'beard', 'haircut-beard', 'coloring', 'styling', 'other')),
  barbershop_id UUID REFERENCES barbershops(id) ON DELETE CASCADE,
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
CREATE INDEX idx_barber_services_barber_id ON barber_services(barber_id);
CREATE INDEX idx_barber_services_service_id ON barber_services(service_id);
```

---

## Validation Rules

### Registration
- `name`: Required, min 2, max 50 characters, only letters and spaces
- `email`: Required, valid email format, unique, max 100 characters
- `phone`: Required, valid format (+998XXXXXXXXX), unique, exactly 13 characters
- `password`: Required, min 8 characters, must contain letters and numbers, max 100 characters

### Booking
- `barbershopId`: Required, must exist
- `serviceId`: Required, must exist (can be global service)
- `date`: Required, valid date (YYYY-MM-DD), not in past, not more than 3 months future
- `time`: Required, valid time (HH:mm), within working hours, 30-minute intervals
  - Agar "open" va "close" null bo'lsa → har qanday vaqt (00:00 dan 23:59 gacha)
  - Agar "open" va "close" berilgan bo'lsa → Time slot barbershop'ning "open" va "close" vaqtlari ichida bo'lishi kerak
  - Time slot + service duration + buffer (15 min) <= close vaqtdan oshmasligi kerak (agar close null bo'lsa, bu tekshirilmaydi)
- `barberId`: Optional, if provided must exist and provide the service

### Barbershop Working Hours
- "open" va "close" vaqtlari optional (null bo'lishi mumkin)
- Agar "open" va "close" null bo'lsa, barbershop 24 soatlik ishlaydi (00:00 dan 23:59 gacha)
- Agar "open" va "close" berilgan bo'lsa:
  - "open" vaqt "close" vaqtdan oldin bo'lishi kerak
  - Vaqt formati: HH:mm (24-hour format, masalan: "09:00", "21:00")
- "closed": true bo'lsa, "open" va "close" maydonlari e'tiborsiz qoldiriladi
- Hamma kunlar uchun bir xil ish vaqti (hafta kunlari farqi yo'q)

### Barber
- `name`: Required, min 2, max 100 characters
- `specialization`: Optional, max 100 characters
- `experience`: Optional, number >= 0
- `services`: Optional array, all service IDs must exist (can be global services)

### Service
- `name`: Required, min 2, max 100 characters
- `description`: Optional, max 500 characters
- `duration`: Required, number >= 5, multiple of 5
- `price`: Required, number >= 0
- `category`: Required, enum value
- `barbershopId`: Optional (if null, service is global)

### Image Upload
- Max file size: 10MB
- Allowed formats: JPEG, PNG, GIF, WebP
- Min dimensions: 200x200px
- Max dimensions: 5000x5000px

---

## Business Logic

### Time Slot Availability

**MUHIM**: Time slotlar generatsiya qilish **BACKEND** tomonidan amalga oshiriladi. Frontend faqat backend'dan kelgan time slotlarni ko'rsatadi.

**Backend Implementation:**
- Time slotlar generatsiya qilish logikasi backend'da yozilishi kerak
- Utility function: `utils/time-slots.util.ts` yoki `bookings.service.ts` ichida
- Har bir request uchun real-time generatsiya qilinadi (cache qilinmaydi, chunki bookinglar o'zgarishi mumkin)
- **MUHIM**: Time slotlar database'ga saqlanmaydi, har bir request uchun dinamik generatsiya qilinadi
- Barbershop yaratilganda, faqat workingHours saqlanadi (barbershops table'da JSONB formatda)
- Time slotlarni get qilish: GET /api/bookings/time-slots?barbershopId=<id>&date=<date>

1. **Ish vaqtini aniqlash:**
   - Barbershop'ning workingHours'ini database'dan olish (hamma kunlar uchun bir xil)
   - **MUHIM**: Date parametri bu yerda ishlatilmaydi, chunki workingHours hamma kunlar uchun bir xil
   - Agar "closed": true bo'lsa, time slotlar mavjud emas
   - Agar "closed": false bo'lsa:
     - Agar "open" va "close" null bo'lsa → 24 soatlik (00:00 dan 23:30 gacha)
     - Agar "open" va "close" berilgan bo'lsa → o'sha vaqtlar orasida

2. **Time slotlarni generatsiya qilish:**
   - **MUHIM**: Time slotlar faqat workingHours oralig'ida generatsiya qilinadi
   - Agar "open" va "close" null bo'lsa:
     - 00:00 dan 23:30 gacha 30 daqiqalik intervalda generatsiya qilish
     - 00:00, 00:30, 01:00, 01:30, ..., 23:00, 23:30
   - Agar "open" va "close" berilgan bo'lsa:
     - **FAQAT** "open" vaqtdan boshlab "close" vaqtgacha generatsiya qilish
     - Oxirgi slot "close" vaqtdan oldin bo'lishi kerak (service duration + buffer hisobga olinadi)
     - Masalan: open: "09:00", close: "20:00", serviceDuration: 30min bo'lsa:
       - 09:00, 09:30, 10:00, 10:30, ..., 19:00, 19:30
       - 20:00 slot mavjud emas (chunki 20:00 + 30min + 15min = 20:15 > 20:00)
     - Masalan: open: "09:00", close: "20:00", serviceDuration: 60min bo'lsa:
       - Oxirgi slot: 18:30 (chunki 18:30 + 60min + 15min = 19:45 < 20:00)
       - 19:00 va 19:30 slotlar mavjud emas (chunki 19:00 + 60min + 15min = 20:15 > 20:00)
   - Har bir slot uchun "available" statusini tekshirish

3. **Time slot mavjud bo'lishi uchun:**
   - Barbershop ishlashi kerak (workingHours'da closed: false)
   - **MUHIM**: Vaqt faqat workingHours ichida bo'lishi kerak
   - Vaqt ish vaqti ichida bo'lishi kerak:
     - Agar "open" va "close" null bo'lsa → har qanday vaqt (00:00 dan 23:59 gacha)
     - Agar "open" va "close" berilgan bo'lsa → **FAQAT** open <= time <= close - serviceDuration
     - WorkingHours tashqarisidagi vaqtlar hech qachon ko'rsatilmaydi
   - Service duration + buffer time (15 min) bo'sh bo'lishi kerak
   - Barber (agar tanlangan bo'lsa) o'sha vaqtda band bo'lmasligi kerak
   - Boshqa bookinglar bilan conflict bo'lmasligi kerak

4. **Booking yaratilganda:**
   - Time slotni reserve qilish (status: confirmed)
   - Service va barbershop ma'lumotlarini denormalize qilish
   - Userga notification yuborish (optional, keyingi bosqich)

5. **Time slot conflict check (Date parametri bu yerda ishlatiladi):**
   - **MUHIM**: Date parametri faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun kerak
   - Request qilingan sana (date) bo'yicha o'sha kundagi bookinglarni database'dan olish
   - Agar barber tanlangan bo'lsa, faqat o'sha barberning o'sha kundagi bookinglarini tekshirish
   - Agar barber tanlanmagan bo'lsa, barbershop'dagi o'sha kundagi barcha bookinglarni tekshirish
   - Service duration + 15 min buffer time hisobga olinishi kerak
   - Conflict tekshirish:
     - Slot vaqti: 09:00
     - Service duration: 30 min
     - Buffer time: 15 min
     - Jami: 09:00 dan 09:45 gacha band bo'lishi kerak
     - Agar bu vaqt oralig'ida o'sha kundagi boshqa booking bo'lsa, conflict

**Example 1 (Ish vaqti berilgan):**
- Barbershop ish vaqti: open: "09:00", close: "20:00", closed: false
- Service duration: 30 min
- Buffer time: 15 min
- Existing booking: 09:00-09:30 (barberId: b1)
- New booking request: 09:00, barberId: b1
- Result: Conflict (09:00 + 30min + 15min = 09:45, existing booking 09:00-09:30 bilan overlap)

**Example 2 (24 soatlik):**
- Barbershop ish vaqti: open: null, close: null, closed: false (24 soatlik)
- Service duration: 30 min
- Buffer time: 15 min
- Existing booking: 09:00-09:30 (barberId: b1)
- New booking request: 09:00, barberId: b1
- Result: Conflict (09:00 + 30min + 15min = 09:45, existing booking 09:00-09:30 bilan overlap)
- New booking request: 23:00, barberId: b1
- Result: Available (23:00 + 30min + 15min = 23:45, no conflict)

### Booking Status Flow
```
pending → confirmed → completed
         ↓
      cancelled
```

### Barber-Service Relationship

1. **Barber qo'shilganda:**
   - Services array'ni tekshirish
   - Barcha service ID'lar mavjud bo'lishi kerak (global servicelar ham)
   - BarberService many-to-many jadvalga qo'shish

2. **Service o'chirilganda:**
   - BarberService jadvaldan ham o'chirish
   - Barber'ning services array'ini yangilash

3. **Barber o'chirilganda:**
   - BarberService jadvaldan ham o'chirish
   - Booking'larda barberId NULL qilish (ON DELETE SET NULL)

### Global Services

- Agar service `barbershopId = NULL` bo'lsa, u global service
- Global servicelar barcha barbershoplar uchun mavjud
- Barber global servicelarni ham tanlashi mumkin
- Booking yaratilganda global service'ni barbershop'ga bog'lash kerak emas

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
- `IMAGE_TOO_LARGE` - Image file exceeds 10MB
- `INVALID_IMAGE_FORMAT` - Image format not supported
- `BARBER_HAS_BOOKINGS` - Cannot delete barber with active bookings
- `SERVICE_HAS_BOOKINGS` - Cannot delete service with active bookings
- `INVALID_STATUS_TRANSITION` - Invalid booking status change

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

### NestJS Implementation
- Guards: `JwtAuthGuard`, `AdminGuard`
- Strategies: `JwtStrategy`, `AdminJwtStrategy`
- Decorators: `@CurrentUser()`, `@Roles('admin')`

---

## File Upload

### Image Upload Flow

1. **Client sends base64 image** → Backend converts to file → Uploads to storage → Returns URL
2. **Client sends file directly** → Backend uploads to storage → Returns URL

### Recommended Storage Solutions

1. **Cloudinary** (Recommended)
   - Free tier available
   - Automatic image optimization
   - CDN included

2. **AWS S3**
   - Scalable
   - Cost-effective
   - Requires AWS setup

3. **Local Storage** (Development only)
   - Simple setup
   - Not recommended for production

### Image Processing

- Resize images to max 1920x1080
- Compress images (quality: 80-90%)
- Generate thumbnails (optional)
- Support formats: JPEG, PNG, GIF, WebP

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

## NestJS Implementation Examples

### Module Example
```typescript
// barbershops.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Barbershop]),
    BarbersModule,
    ServicesModule,
  ],
  controllers: [BarbershopsController],
  providers: [BarbershopsService],
  exports: [BarbershopsService],
})
export class BarbershopsModule {}
```

### Controller Example
```typescript
// barbershops.controller.ts
@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Get()
  findAll(@Query() query: GetBarbershopsDto) {
    return this.barbershopsService.findAll(query);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createDto: CreateBarbershopDto) {
    return this.barbershopsService.create(createDto);
  }
}
```

### Bookings Controller Example (Time Slots)
```typescript
// bookings.controller.ts
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('time-slots')
  async getAvailableTimeSlots(
    @Query('barbershopId') barbershopId: string,
    @Query('date') date: string,
    @Query('serviceId') serviceId?: string,
    @Query('barberId') barberId?: string,
  ) {
    const timeSlots = await this.bookingsService.getAvailableTimeSlots(
      barbershopId,
      date,
      serviceId,
      barberId,
    );
    
    return {
      success: true,
      data: timeSlots,
    };
  }
}
```

### Service Example
```typescript
// barbershops.service.ts
@Injectable()
export class BarbershopsService {
  constructor(
    @InjectRepository(Barbershop)
    private readonly barbershopRepository: Repository<Barbershop>,
  ) {}

  async findAll(query: GetBarbershopsDto) {
    // Implementation
  }

  async create(createDto: CreateBarbershopDto) {
    // Implementation
  }
}
```

### Bookings Service Example (Time Slots)
```typescript
// bookings.service.ts
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Barbershop)
    private readonly barbershopRepository: Repository<Barbershop>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async getAvailableTimeSlots(
    barbershopId: string,
    date: string,
    serviceId?: string,
    barberId?: string,
  ) {
    // 1. Barbershop'ni olish
    const barbershop = await this.barbershopRepository.findOne({
      where: { id: barbershopId },
    });
    
    if (!barbershop) {
      throw new NotFoundException('Barbershop not found');
    }
    
    // 2. Service'ni olish (agar berilgan bo'lsa)
    let serviceDuration = 30; // default
    if (serviceId) {
      const service = await this.serviceRepository.findOne({
        where: { id: serviceId },
      });
      if (service) {
        serviceDuration = service.duration;
      }
    }
    
    // 3. O'sha kundagi bookinglarni olish (Date parametri bu yerda ishlatiladi)
    // MUHIM: Date parametri faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun kerak
    const existingBookings = await this.bookingRepository.find({
      where: {
        barbershopId,
        date, // Faqat o'sha kundagi bookinglar
        status: In(['pending', 'confirmed']), // Faqat active bookinglar
      },
      relations: ['barber'],
    });
    
    // 4. Time slotlarni generatsiya qilish (workingHours'ga qarab, date'ga bog'liq emas)
    // Time slotlar har bir request uchun dinamik generatsiya qilinadi
    // Database'ga saqlanmaydi, chunki har bir sana uchun existing bookings bilan conflict tekshirish kerak
    // Barbershop yaratilganda saqlangan workingHours'dan foydalaniladi
    // MUHIM: Date parametri bu yerda ishlatilmaydi, chunki workingHours hamma kunlar uchun bir xil
    const timeSlots = generateTimeSlots({
      workingHours: barbershop.workingHours, // Barbershop yaratilganda saqlangan workingHours (hamma kunlar uchun bir xil)
      serviceDuration,
      bufferTime: 15,
      date, // Faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun
      existingBookings: existingBookings.map(b => ({
        time: b.time,
        duration: b.duration,
        barberId: b.barberId,
      })),
      barberId,
    });
    
    // 5. Service va Barber filtrlash
    if (serviceId && barberId) {
      // Barber o'sha serviceni qo'llay olishini tekshirish
      // Implementation...
    }
    
    return timeSlots;
  }
}
```

### Entity Example
```typescript
// barbershop.entity.ts
@Entity('barbershops')
export class Barbershop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  image: string;

  @Column('jsonb')
  workingHours: WorkingHours;

  @OneToMany(() => Service, (service) => service.barbershop)
  services: Service[];

  @OneToMany(() => Barber, (barber) => barber.barbershop)
  barbers: Barber[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### DTO Example
```typescript
// create-barbershop.dto.ts

// Working Hours DTO (hamma kunlar uchun bir xil)
class WorkingHoursDto {
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/) // HH:mm format
  @IsOptional()
  @IsNullable()
  @ValidateIf((o) => !o.closed && o.open !== null)
  open: string | null;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/) // HH:mm format
  @IsOptional()
  @IsNullable()
  @ValidateIf((o) => !o.closed && o.close !== null)
  close: string | null;

  @IsBoolean()
  @IsOptional()
  closed?: boolean;
}

export class CreateBarbershopDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  @Matches(/^\+998\d{9}$/)
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @ValidateNested()
  @Type(() => WorkingHoursDto)
  @IsObject()
  @IsValidWorkingHours()
  workingHours: WorkingHoursDto;
}

// Custom Validator: open < close (agar ikkalasi ham null bo'lmasa)
@ValidatorConstraint({ name: 'isValidWorkingHours', async: false })
export class IsValidWorkingHoursConstraint implements ValidatorConstraintInterface {
  validate(workingHours: WorkingHoursDto) {
    if (workingHours.closed) {
      return true; // Agar closed bo'lsa, open va close tekshirilmaydi
    }
    
    // Agar ikkalasi ham null bo'lsa, 24 soatlik - valid
    if (workingHours.open === null && workingHours.close === null) {
      return true;
    }
    
    // Agar bittasi null bo'lsa, invalid
    if (workingHours.open === null || workingHours.close === null) {
      return false;
    }
    
    // Agar ikkalasi ham berilgan bo'lsa, open < close bo'lishi kerak
    const openTime = this.timeToMinutes(workingHours.open);
    const closeTime = this.timeToMinutes(workingHours.close);
    
    return openTime < closeTime;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

@ValidatorConstraint({ name: 'isValidWorkingHours' })
export function IsValidWorkingHours(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidWorkingHoursConstraint,
    });
  };
}
```

### Time Slots Utility Example
```typescript
// utils/time-slots.util.ts
export interface TimeSlot {
  time: string; // HH:mm format
  available: boolean;
  barberId?: string | null;
}

export interface GenerateTimeSlotsParams {
  workingHours: {
    open: string | null;
    close: string | null;
    closed?: boolean;
  };
  serviceDuration: number; // minutes
  bufferTime: number; // minutes (default: 15)
  date: string; // YYYY-MM-DD (faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun)
  existingBookings: Array<{
    time: string;
    duration: number;
    barberId?: string | null;
  }>;
  barberId?: string | null;
}

// MUHIM: Date parametri faqat o'sha kundagi existing bookings bilan conflict tekshirish uchun kerak.
// Time slotlar generatsiya qilish workingHours'ga qarab bo'ladi (hamma kunlar uchun bir xil).

export function generateTimeSlots(params: GenerateTimeSlotsParams): TimeSlot[] {
  const { workingHours, serviceDuration, bufferTime = 15, existingBookings, barberId } = params;
  
  // MUHIM: Date parametri bu yerda ishlatilmaydi, chunki workingHours hamma kunlar uchun bir xil
  // Date faqat existingBookings bilan conflict tekshirish uchun kerak
  
  // Agar barbershop yopiq bo'lsa
  if (workingHours.closed) {
    return [];
  }
  
  // Ish vaqtini aniqlash (workingHours'ga qarab, date'ga bog'liq emas)
  let startTime: string;
  let endTime: string;
  
  if (workingHours.open === null && workingHours.close === null) {
    // 24 soatlik
    startTime = '00:00';
    endTime = '23:30';
  } else if (workingHours.open && workingHours.close) {
    startTime = workingHours.open;
    endTime = workingHours.close;
  } else {
    return []; // Invalid working hours
  }
  
  // Time slotlarni generatsiya qilish
  const slots: TimeSlot[] = [];
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
    const slotTime = minutesToTime(minutes);
    
    // Oxirgi slot tekshirish (service duration + buffer)
    const slotEndMinutes = minutes + serviceDuration + bufferTime;
    if (slotEndMinutes > endMinutes) {
      break; // Bu slot mavjud emas
    }
    
    // Availability tekshirish (Date parametri bu yerda ishlatiladi)
    // existingBookings o'sha kundagi bookinglar (date parametri bo'yicha filter qilingan)
    const available = isSlotAvailable(
      slotTime,
      serviceDuration,
      bufferTime,
      existingBookings, // O'sha kundagi bookinglar (date parametri bo'yicha filter qilingan)
      barberId
    );
    
    slots.push({
      time: slotTime,
      available,
      barberId: barberId || null,
    });
  }
  
  return slots;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function isSlotAvailable(
  slotTime: string,
  serviceDuration: number,
  bufferTime: number,
  existingBookings: Array<{ time: string; duration: number; barberId?: string | null }>,
  barberId?: string | null
): boolean {
  const slotStart = timeToMinutes(slotTime);
  const slotEnd = slotStart + serviceDuration + bufferTime;
  
  for (const booking of existingBookings) {
    // Agar barberId berilgan bo'lsa, faqat o'sha barberning bookinglarini tekshirish
    if (barberId && booking.barberId !== barberId) {
      continue;
    }
    
    const bookingStart = timeToMinutes(booking.time);
    const bookingEnd = bookingStart + booking.duration;
    
    // Conflict tekshirish
    if (slotStart < bookingEnd && slotEnd > bookingStart) {
      return false; // Conflict
    }
  }
  
  return true; // Available
}
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

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Admin
ADMIN_EMAIL=admin@barbershop.uz
ADMIN_PASSWORD=change-in-production
```

---

## Boshlash (NestJS)

1. **Project Setup:**
   ```bash
   nest new barbershop-backend
   npm install @nestjs/typeorm typeorm pg
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt
   npm install class-validator class-transformer
   npm install @nestjs/config
   npm install @nestjs/platform-express multer
   npm install bcrypt
   npm install --save-dev @types/passport-jwt @types/bcrypt
   ```

2. **Database Setup:**
   - TypeORM configuration
   - Entity classes yaratish
   - Migrations yaratish
   - Seed data

3. **Module Structure:**
   - AuthModule (User va Admin)
   - UsersModule
   - BarbershopsModule
   - ServicesModule
   - BarbersModule
   - BookingsModule
   - AdminModule (sub-modules bilan)

4. **Authentication:**
   - JWT Strategy (User)
   - Admin JWT Strategy
   - Guards va Decorators

5. **Controllers va Services:**
   - Har bir module uchun controller va service
   - DTO classes
   - Validation

6. **Business Logic:**
   - Time slots calculation
   - Booking conflict check
   - Status transitions

7. **File Upload:**
   - Multer configuration
   - Image processing
   - Cloud storage integration

8. **Testing:**
   - Unit tests
   - Integration tests
   - E2E tests

---

## NestJS Best Practices

1. **Module Organization:**
   - Har bir feature alohida module
   - Shared modules (common, config)
   - Feature modules (auth, barbershops, etc.)

2. **Dependency Injection:**
   - Constructor injection
   - Interface-based injection (optional)

3. **DTOs:**
   - Har bir endpoint uchun DTO
   - Validation decorators
   - Transform decorators

4. **Entities:**
   - TypeORM decorators
   - Relations (OneToMany, ManyToOne, ManyToMany)
   - Indexes va constraints

5. **Services:**
   - Business logic
   - Database operations
   - Error handling

6. **Controllers:**
   - Route handlers
   - Request/Response handling
   - Guards va Pipes

7. **Guards:**
   - Authentication guards
   - Authorization guards
   - Role-based access control

8. **Exception Filters:**
   - Global exception filter
   - Custom exceptions
   - Error response formatting

---

## Security Considerations

1. **Password Hashing**: bcrypt yoki argon2
2. **JWT Security**: Strong secret key, proper expiration
3. **Input Validation**: Barcha inputlarni validate qilish
4. **SQL Injection**: Parameterized queries (TypeORM)
5. **CORS**: Frontend URL'ni allow qilish
6. **Rate Limiting**: `@nestjs/throttler`
7. **HTTPS**: Production'da faqat HTTPS
8. **File Upload**: Validate file type (magic bytes), scan for malware (optional)

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
   - Eager loading (avoid N+1)

3. **Caching**:
   - Dashboard stats (5 daqiqa)
   - Use database aggregation functions

---

## Testing (NestJS)

- **Unit Tests**: Jest (built-in)
  - Service tests
  - Controller tests
  - Utility function tests

- **Integration Tests**: 
  - Module tests
  - Database integration tests

- **E2E Tests**: 
  - API endpoint tests
  - Authentication flow
  - Critical business flows

---

## Deployment (NestJS)

- **Docker**: Dockerfile va docker-compose.yml
- **Environment Variables**: `.env` files (development, production)
- **Database Migrations**: TypeORM migrations
- **Health Check**: `/health` endpoint
- **Build**: `npm run build` → `dist/` folder
- **Production**: PM2 yoki Docker

---

## Muhim Nuanslar

1. **Timezone**: UTC+5 (Uzbekistan)
2. **Currency**: UZS
3. **Date Format**: YYYY-MM-DD
4. **Time Format**: HH:mm (24-hour)
5. **Phone Format**: +998XXXXXXXXX
6. **Encoding**: UTF-8 (Uzbek/Russian text support)
7. **Global Services**: `barbershopId = NULL` bo'lsa, service global
8. **Barber Services**: Many-to-many relationship
9. **Booking Denormalization**: Performance uchun ma'lumotlar denormalize qilinadi

---

## Frontend Integration

Frontend quyidagi base URL'dan foydalanadi:
- Development: `http://localhost:3001/api`
- Production: Environment variable'dan olinadi

Barcha endpointlar yuqorida batafsil tavsiflangan.

---

**Eslatma**: 
- NestJS best practices'ga rioya qiling
- TypeScript type safety'ni to'liq qo'llab-quvvatlash kerak
- Dependency Injection'dan to'liq foydalaning
- Modular architecture
- Clean code principles
- SOLID principles
