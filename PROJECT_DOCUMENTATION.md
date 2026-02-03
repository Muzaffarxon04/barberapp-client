# Barbershop Client - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Core Features](#core-features)
6. [Data Flow & State Management](#data-flow--state-management)
7. [API Integration](#api-integration)
8. [Component Structure](#component-structure)
9. [Routing System](#routing-system)
10. [Authentication Flow](#authentication-flow)
11. [Booking Workflow](#booking-workflow)
12. [Admin Panel](#admin-panel)
13. [UI/UX Design](#uiux-design)

---

## Project Overview

**Barbershop Client** is a modern, full-featured booking platform frontend for barbershops in Uzbekistan. Built with Next.js 16 and TypeScript, it provides a seamless user experience for customers to discover barbershops, book appointments, and manage their bookings. The platform also includes a comprehensive admin panel for barbershop owners and managers.

### Key Capabilities
- 🔍 **Search & Discovery**: Find barbershops by location with real-time search
- 📅 **Booking System**: Complete appointment scheduling with date/time selection
- 👤 **User Management**: Authentication, user profiles, and booking history
- 🛒 **Cart System**: Multiple appointment bookings in one session
- 👨‍💼 **Admin Panel**: Full barbershop, service, and booking management
- 🎨 **Modern UI**: Responsive design with smooth animations

---

## Technology Stack

### Frontend Framework
- **Next.js 16.1.2** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety

### Styling & Animation
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12.26.2** - Animation library
- **Lucide React 0.562.0** - Icon library

### State Management & Data
- **Zustand 5.0.10** - Lightweight state management
- **Axios 1.13.4** - HTTP client for API requests
- **date-fns 4.1.0** - Date manipulation utilities

### Developer Tools
- **ESLint 9** - Code linting
- **PostCSS** - CSS processing

---

## Project Structure

```
barbershop-client/
├── app/                          # Next.js App Router
│   ├── (client)/                 # Client-facing pages
│   │   ├── page.tsx             # Homepage with search
│   │   ├── barbershop/[id]/     # Barbershop details
│   │   ├── cart/                # Cart & checkout
│   │   └── profile/             # User profile & bookings
│   ├── (admin)/                 # Admin panel
│   │   └── admin/
│   │       ├── dashboard/       # Admin dashboard
│   │       ├── barbershops/     # Barbershop management
│   │       │   └── [id]/        # Barbershop details
│   │       ├── services/        # Service management
│   │       └── bookings/        # Booking management
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── favicon.ico              # Site icon
│
├── components/                   # Reusable components
│   ├── Header.tsx               # Main navigation
│   ├── Footer.tsx               # Site footer
│   ├── AuthModal.tsx            # Login/Register modal
│   ├── BookingModal.tsx         # Booking details modal
│   ├── ConfirmModal.tsx         # Confirmation dialog
│   ├── SuccessModal.tsx         # Success feedback
│   ├── BarbershopCard.tsx       # Barbershop display card
│   ├── BarberCard.tsx           # Barber display card
│   ├── ServiceCard.tsx          # Service display card
│   ├── ConditionalHeader.tsx    # Layout-aware header
│   ├── ConditionalFooter.tsx    # Layout-aware footer
│   ├── Toaster.tsx              # Toast notifications
│   └── admin/                   # Admin-specific components
│       ├── BarbershopModal.tsx  # Barbershop create/edit
│       └── ServiceModal.tsx     # Service create/edit
│
├── lib/                         # Utilities & configurations
│   ├── api/
│   │   └── client.ts           # Axios API client (1062 lines)
│   ├── stores/                 # Zustand state stores
│   │   ├── authStore.ts        # Authentication state
│   │   ├── bookingStore.ts     # Booking management
│   │   └── cartStore.ts        # Shopping cart state
│   ├── data.ts                 # Mock data (deprecated)
│   └── utils.ts                # Utility functions
│
├── types/
│   └── index.ts                # TypeScript type definitions
│
├── public/                     # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── next.config.ts              # Next.js config
├── eslint.config.mjs           # ESLint config
├── postcss.config.mjs          # PostCSS config
├── README.md                   # Project readme
└── API_DOCUMENTATION.md        # API reference

```

---

## Architecture

### High-Level Architecture

The application follows a **modern client-side architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│                     (app directory)                      │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│  Client Routes │      │  Admin Routes   │
│   (client)     │      │    (admin)      │
└───────┬────────┘      └────────┬────────┘
        │                        │
        └────────┬───────────────┘
                 │
    ┌────────────▼────────────┐
    │    React Components     │
    │   (components/)         │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │   State Management      │
    │   (Zustand Stores)      │
    │  - authStore            │
    │  - bookingStore         │
    │  - cartStore            │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │      API Client         │
    │    (Axios + Token)      │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    Backend API          │
    │  (http://localhost:3001)│
    └─────────────────────────┘
```

### Key Architectural Patterns

1. **Route Groups**: Uses Next.js route groups `(client)` and `(admin)` for layout separation
2. **Server/Client Components**: Strategic use of `'use client'` directive for interactive components
3. **Centralized State**: Zustand stores with persistence for auth, bookings, and cart
4. **API Abstraction**: Single API client with token management and error handling
5. **Type Safety**: Comprehensive TypeScript types across the application

---

## Core Features

### 1. Authentication System
- **Registration**: New user signup with email/phone/password
- **Login**: Email/password authentication
- **Session Management**: JWT tokens (access + refresh)
- **Persistent Auth**: LocalStorage-based state persistence
- **Auto-login**: Automatic login after registration

### 2. Search & Discovery
- **Real-time Search**: Live search as user types
- **Autocomplete**: Dropdown suggestions
- **Keyboard Navigation**: Arrow keys + Enter support
- **City/District Filtering**: Location-based search
- **Click-outside Detection**: Close suggestions on blur

### 3. Booking System
- **Service Selection**: Browse and select services
- **Barber Selection**: Choose preferred barber (optional)
- **Date Picker**: Calendar-based date selection
- **Time Slots**: Available time slot display
- **Cart Integration**: Add multiple bookings
- **Booking Status**: Track pending/confirmed/completed/cancelled

### 4. Shopping Cart
- **Multi-booking**: Multiple appointments in one session
- **Price Calculation**: Automatic total calculation
- **Duration Tracking**: Total appointment duration
- **Item Management**: Add/remove/update cart items
- **Persistent Cart**: Saved in localStorage

### 5. User Profile
- **Booking History**: View all bookings
- **Status Filtering**: Filter by status
- **Booking Details**: View full booking information
- **Cancel Booking**: Cancel pending bookings
- **User Information**: View/update profile

### 6. Admin Panel
- **Dashboard**: Overview statistics
- **Barbershop Management**: CRUD operations
- **Service Management**: Create/edit/delete services
- **Booking Management**: View and manage all bookings
- **Barber Management**: Add/edit barbers

---

## Data Flow & State Management

### Zustand Stores

The application uses three main Zustand stores with persistence:

#### 1. Auth Store (`authStore.ts`)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email, password) => Promise<void>;
  register: (name, email, phone, password) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}
```

**Key Features:**
- Persisted in `auth-storage` localStorage key
- Automatically fetches current user on mount
- Handles token management via API client
- Toast notifications for success/error

**Flow:**
1. User submits login form
2. Store calls `api.auth.login()`
3. API client saves tokens to localStorage
4. Store updates user state
5. UI re-renders with authenticated state

#### 2. Booking Store (`bookingStore.ts`)
```typescript
interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  addBooking: (booking) => void;
  updateBooking: (id, updates) => void;
  cancelBooking: (id) => Promise<void>;
  getBookingsByStatus: (status) => Booking[];
  fetchBookings: (status?) => Promise<void>;
}
```

**Key Features:**
- Persisted in `booking-storage`
- Real-time booking updates
- Status-based filtering
- API integration for cancel/fetch

**Flow:**
1. Component calls `fetchBookings()`
2. Store fetches from API
3. Maps API response to Booking type
4. Updates store state
5. Components re-render with new data

#### 3. Cart Store (`cartStore.ts`)
```typescript
interface CartState {
  items: CartItem[];
  addToCart: (item) => void;
  removeFromCart: (id) => void;
  updateCartItem: (id, updates) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalDuration: () => number;
}
```

**Key Features:**
- Persisted in `cart-storage`
- Real-time price/duration calculations
- Simple CRUD operations
- No API integration (local only)

---

## API Integration

### API Client Architecture (`lib/api/client.ts`)

The API client is a **comprehensive 1062-line module** that handles all backend communication.

#### Key Components

1. **Token Manager**
```typescript
class TokenManager {
  setTokens(access, refresh, isAdmin);
  getAccessToken();
  getRefreshToken();
  clearTokens();
  // Separate admin token management
  setAdminTokens();
  getAdminAccessToken();
  clearAdminTokens();
}
```

**Features:**
- Separate user and admin token storage
- LocalStorage persistence
- Automatic token injection in requests

2. **Axios Instance**
```typescript
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor:**
- Automatically adds `Authorization: Bearer <token>` header
- Checks admin routes and uses admin token
- Allows public routes without token

**Response Interceptor:**
- Handles 401 errors (token expired)
- Automatic token refresh
- Retries failed request with new token
- Falls back to logout on refresh failure

3. **Error Handling**
```typescript
export function handleApiError(error: AxiosError): {
  message: string;
  code: string;
  details?: any;
}
```

**Features:**
- Unified error format
- Handles multiple API error response formats
- Extracts meaningful error messages
- Type-safe error objects

#### API Endpoints

The API client exports a comprehensive `api` object:

```typescript
export const api = {
  auth: {
    register(dto),
    login(dto),
    logout(),
    getCurrentUser(),
    refreshToken(),
  },
  barbershops: {
    getAll(params),
    getById(id),
    create(dto),
    update(id, dto),
    delete(id),
  },
  services: {
    getAll(barbershopId?),
    getById(id),
    create(dto),
    update(id, dto),
    delete(id),
  },
  barbers: {
    getAll(barbershopId?),
    getById(id),
    create(dto),
    update(id, dto),
    delete(id),
    getAvailableSlots(id, date),
  },
  bookings: {
    getAll(params),
    getById(id),
    create(dto),
    update(id, dto),
    cancel(id),
    confirm(id),
    complete(id),
  },
};
```

#### Response Type Mapping

The API client includes comprehensive TypeScript types:

- **DTOs**: Create/Update data transfer objects
- **Responses**: API response types (BarbershopResponse, ServiceResponse, etc.)
- **API Formats**: Success/error/paginated response types

**Example:**
```typescript
interface BarbershopResponse {
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
  workingHours: { open: string; close: string; closed: boolean };
  amenities: string[];
  barbers?: BarberResponse[];
  createdAt: string;
  updatedAt: string;
}
```

---

## Component Structure

### Layout Components

#### Root Layout (`app/layout.tsx`)
- Sets up HTML structure
- Loads Inter font
- Includes ConditionalHeader, ConditionalFooter, Toaster
- Defines page metadata

#### Conditional Components
- **ConditionalHeader**: Shows header only on non-admin routes
- **ConditionalFooter**: Shows footer only on non-admin routes

### Shared Components

#### Header (`components/Header.tsx`)
**Features:**
- Sticky header with blur backdrop
- Desktop/mobile responsive navigation
- Authentication status display
- Shopping cart icon with badge
- User profile dropdown
- Mobile hamburger menu

**State Management:**
- Uses `useAuthStore` for auth state
- Uses `useCartStore` for cart count
- Local state for menu/modal visibility

#### AuthModal (`components/AuthModal.tsx`)
**Features:**
- Login/Register tabs
- Form validation
- Animated transitions (Framer Motion)
- Calls `authStore.login()` or `authStore.register()`
- Toast notifications for success/error

#### BarbershopCard (`components/BarbershopCard.tsx`)
**Features:**
- Image display with fallback
- Rating and address display
- Hover animations
- Click navigation to details

#### BookingModal (`components/BookingModal.tsx`)
**Features:**
- Display booking details
- Status badge with color coding
- Formatted date/time display
- Service and price information
- Modal with backdrop

#### ConfirmModal (`components/ConfirmModal.tsx`)
**Features:**
- Reusable confirmation dialog
- Custom title/message/buttons
- Loading state support
- Used for booking cancellation

### Admin Components

#### BarbershopModal (`components/admin/BarbershopModal.tsx`)
- Create/edit barbershop form
- Image upload handling
- Working hours configuration
- Amenities management

#### ServiceModal (`components/admin/ServiceModal.tsx`)
- Create/edit service form
- Category selection
- Price and duration inputs
- Optional image URL

---

## Routing System

### Next.js App Router Structure

The application uses **Next.js 16's App Router** with route groups:

#### Client Routes (`app/(client)/`)
```
/                           → Home page with search
/barbershop/[id]           → Barbershop details & booking
/cart                      → Shopping cart & checkout
/profile                   → User profile & booking history
```

#### Admin Routes (`app/(admin)/admin/`)
```
/admin                     → Admin dashboard
/admin/barbershops         → Barbershop list
/admin/barbershops/[id]    → Barbershop details
/admin/services            → Service management
/admin/bookings            → Booking management
```

### Route Group Benefits

1. **Layout Isolation**: Admin and client have separate layouts
2. **URL Structure**: `/admin/*` vs root-level client routes
3. **Conditional Rendering**: Different headers/footers per section
4. **Code Organization**: Clear separation of concerns

### Dynamic Routes

- **`[id]`**: Dynamic barbershop ID parameter
- **Server Components**: Can use `params` prop
- **Client Components**: Use `useParams()` hook from `next/navigation`

---

## Authentication Flow

### Complete Login Flow

```
┌─────────────┐
│ User clicks │
│   "Login"   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  AuthModal      │
│  opens          │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ User enters         │
│ email + password    │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────┐
│ authStore.login()    │
│ called               │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ api.auth.login()     │
│ POST /auth/login     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Backend validates    │
│ & returns tokens     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ TokenManager saves   │
│ access + refresh     │
│ to localStorage      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ authStore updates    │
│ user state           │
│ isAuthenticated=true │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ UI re-renders        │
│ Shows user profile   │
│ Hides login button   │
└──────────────────────┘
```

### Token Refresh Flow

```
┌────────────────┐
│ API request    │
│ returns 401    │
└───────┬────────┘
        │
        ▼
┌────────────────────┐
│ Response           │
│ interceptor        │
│ catches error      │
└───────┬────────────┘
        │
        ▼
┌────────────────────┐
│ Check if refresh   │
│ token exists       │
└───────┬────────────┘
        │
    ┌───┴───┐
    │       │
    ▼       ▼
  YES      NO
    │       │
    │       ▼
    │   ┌─────────┐
    │   │ Logout  │
    │   │ user    │
    │   └─────────┘
    │
    ▼
┌─────────────────┐
│ Call refresh    │
│ endpoint        │
│ POST /auth/     │
│ refresh         │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│ Get new tokens  │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│ Save new tokens │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│ Retry original  │
│ request         │
└─────────────────┘
```

### Registration Flow

1. User fills registration form (name, email, phone, password)
2. `authStore.register()` called
3. `api.auth.register()` → POST `/auth/register`
4. Backend creates user account
5. **Automatic login**: Store calls `login()` with same credentials
6. User is logged in immediately after registration

---

## Booking Workflow

### Complete Booking Flow

```
1. Browse Barbershops
   ↓
2. Select Barbershop → Navigate to /barbershop/[id]
   ↓
3. View Available Services
   ↓
4. Select Service
   ↓
5. Select Barber (optional)
   ↓
6. Select Date
   ↓
7. Select Time Slot
   ↓
8. Add to Cart
   ↓
9. Continue Shopping OR Go to Cart
   ↓
10. Review Cart Items
   ↓
11. Confirm Booking
   ↓
12. API Call → POST /bookings
   ↓
13. Booking Created
   ↓
14. Show Success Modal
   ↓
15. Clear Cart
   ↓
16. View Booking in Profile
```

### Barbershop Details Page

The barbershop details page (`app/(client)/barbershop/[id]/page.tsx`) includes:

1. **Barbershop Information**
   - Name, description, address
   - Images gallery
   - Working hours
   - Amenities

2. **Services List**
   - Service cards with name, price, duration
   - Click to select service

3. **Barber Selection**
   - Barber cards with specialization
   - Optional selection

4. **Date Picker**
   - Calendar component
   - Disable past dates
   - Highlight selected date

5. **Time Slots**
   - Show available times
   - Disable booked slots
   - Select time

6. **Add to Cart Button**
   - Validates selection
   - Creates cart item
   - Shows confirmation

### Cart Page

The cart page (`app/(client)/cart/page.tsx`) provides:

1. **Cart Items List**
   - Barbershop name
   - Service name
   - Date and time
   - Price

2. **Summary**
   - Total items count
   - Total price
   - Total duration

3. **Actions**
   - Remove individual items
   - Clear entire cart
   - Proceed to booking

4. **Booking Confirmation**
   - Creates booking for each cart item
   - Handles errors gracefully
   - Shows success/failure for each

---

## Admin Panel

### Dashboard (`app/(admin)/admin/dashboard/page.tsx`)

**Features:**
- Statistics overview
- Recent bookings
- Quick actions

### Barbershop Management

#### List View (`app/(admin)/admin/barbershops/page.tsx`)
- Table/grid of all barbershops
- Search and filter
- Create new barbershop button
- Edit/delete actions

#### Detail View (`app/(admin)/admin/barbershops/[id]/page.tsx`)
- Full barbershop information
- Associated services
- Associated barbers
- Edit mode

#### Create/Edit Modal
- Form fields:
  - Name, description
  - Address (city, district, full address)
  - Contact (phone, email)
  - Working hours
  - Images
  - Amenities
- Validation
- API integration

### Service Management (`app/(admin)/admin/services/page.tsx`)

**Features:**
- List all services
- Filter by barbershop
- Create/edit/delete services
- ServiceModal for form

**Service Fields:**
- Name
- Description
- Price
- Duration
- Category (haircut, beard, etc.)
- Image URL
- Active status

### Booking Management (`app/(admin)/admin/bookings/page.tsx`)

**Features:**
- View all bookings
- Filter by status, date, barbershop
- Booking details modal
- Status management (confirm, cancel, complete)
- User information display

### Admin Layout

The admin section has a dedicated layout (`app/(admin)/admin/layout.tsx`):
- Admin header/sidebar
- Different color scheme
- Admin-specific navigation
- Separate authentication (admin tokens)

---

## UI/UX Design

### Design System

#### Color Palette
- **Primary**: Gray-900 (dark text/backgrounds)
- **Secondary**: Gray-100 (light backgrounds)
- **Accent**: Blue-600 (interactive elements)
- **Success**: Green-600
- **Error**: Red-600
- **Warning**: Yellow-600

#### Typography
- **Font**: Inter (Google Font)
- **Headings**: Font weight 600-700
- **Body**: Font weight 400
- **Small text**: 0.875rem (14px)

#### Spacing
- Consistent Tailwind spacing scale
- Container max-width: 1200px
- Mobile padding: 1rem
- Desktop padding: 2rem

### Animation Library (Framer Motion)

#### Common Animations

1. **Modal Entrance**
```typescript
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.95, y: 20 }}
```

2. **Fade In**
```typescript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
```

3. **Slide In**
```typescript
initial={{ x: -100, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
```

4. **Hover Effects**
```typescript
whileHover={{ scale: 1.05, y: -5 }}
transition={{ type: 'spring', stiffness: 300 }}
```

5. **Tap Effects**
```typescript
whileTap={{ scale: 0.98 }}
```

### Responsive Design

#### Breakpoints (Tailwind)
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

#### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement with `md:`, `lg:` prefixes
- Hamburger menu on mobile
- Adaptive grid layouts

#### Key Responsive Patterns

1. **Header**
   - Mobile: Hamburger menu
   - Desktop: Full navigation

2. **Grid Layouts**
   - Mobile: 1 column
   - Tablet: 2 columns
   - Desktop: 3-4 columns

3. **Forms**
   - Mobile: Single column
   - Desktop: Multi-column

### Toast Notifications

Using `react-hot-toast`:

```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Booking confirmed!');

// Error
toast.error('Failed to create booking');

// Loading
const toastId = toast.loading('Processing...');
toast.dismiss(toastId);
```

**Configuration** (`components/Toaster.tsx`):
- Position: top-center
- Duration: 3000ms
- Style: Consistent with design system

---

## Type System

### Core Types (`types/index.ts`)

#### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}
```

#### Barbershop
```typescript
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
  images?: string[];
  workingHours?: WorkingHours;
  services: Service[];
  barbers: Barber[];
  amenities?: string[];
  createdAt?: string;
}
```

#### Service
```typescript
interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  category: ServiceCategory;
}

type ServiceCategory = 
  | 'haircut' 
  | 'beard' 
  | 'haircut-beard' 
  | 'coloring' 
  | 'styling' 
  | 'other';
```

#### Booking
```typescript
interface Booking {
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

type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled';
```

#### CartItem
```typescript
interface CartItem {
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
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Code Organization Guidelines

1. **Components**
   - One component per file
   - Export default at the end
   - Use TypeScript interfaces for props

2. **Naming Conventions**
   - Components: PascalCase (Header.tsx)
   - Utilities: camelCase (utils.ts)
   - Types: PascalCase (User, Booking)
   - Store hooks: use prefix (useAuthStore)

3. **File Structure**
   - Group by feature, not by type
   - Keep related files together
   - Use route groups for layouts

### Best Practices

1. **State Management**
   - Use Zustand for global state
   - Use React state for local UI state
   - Persist important data with localStorage

2. **API Calls**
   - Always use the API client
   - Handle errors with try-catch
   - Show toast notifications
   - Use loading states

3. **Type Safety**
   - Define interfaces for all data structures
   - Avoid `any` type
   - Use strict TypeScript config

4. **Performance**
   - Use `'use client'` only when needed
   - Optimize images with Next.js Image
   - Lazy load heavy components
   - Memoize expensive computations

5. **Accessibility**
   - Semantic HTML
   - Keyboard navigation support
   - ARIA labels where needed
   - Color contrast compliance

---

## Key Files Reference

### Most Important Files

1. **`lib/api/client.ts`** (1062 lines)
   - Complete API integration
   - Token management
   - Error handling
   - All endpoints

2. **`app/(client)/page.tsx`** (407 lines)
   - Homepage with search
   - Real-time autocomplete
   - Barbershop listing
   - Complex interaction logic

3. **`lib/stores/authStore.ts`** (103 lines)
   - Authentication state
   - Login/register/logout
   - User data management

4. **`components/Header.tsx`** (160 lines)
   - Main navigation
   - Responsive design
   - Auth integration

5. **`types/index.ts`** (108 lines)
   - All TypeScript types
   - Type documentation

---

## Summary

This barbershop booking platform is a **full-featured frontend application** with:

✅ **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS  
✅ **Complete Features**: Search, booking, cart, profile, admin panel  
✅ **Robust Architecture**: Clear separation of concerns, type safety  
✅ **State Management**: Zustand stores with persistence  
✅ **API Integration**: Comprehensive API client with token management  
✅ **Professional UI**: Responsive design, smooth animations  
✅ **Best Practices**: Clean code, error handling, accessibility  

The codebase is well-organized, maintainable, and ready for integration with the backend API. All core workflows (authentication, booking, admin management) are fully implemented and tested.
