# Barbershop Booking Platform - Frontend

O'zbekistondagi barbershoplar uchun online bron qilish platformasi.

## Texnologiyalar

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Loyiha tuzilishi

```
barbershop-client/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Bosh sahifa
│   ├── search/            # Qidirish sahifasi
│   ├── barbershop/[id]/   # Barbershop detallari
│   └── cart/              # Savat sahifasi
├── components/            # React komponentlar
│   ├── Header.tsx         # Navigation header
│   ├── AuthModal.tsx     # Authentication modal
│   ├── BarbershopCard.tsx # Barbershop kartasi
│   └── ServiceCard.tsx    # Xizmat kartasi
├── lib/                   # Utilities va helpers
│   ├── api/               # API client (backend uchun tayyor)
│   ├── stores/           # Zustand stores
│   └── data.ts           # Static mock data
├── types/                # TypeScript types
└── public/               # Static files
```

## O'rnatish va ishga tushirish

```bash
# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev

# Production build
npm run build
npm start
```

Sayt `http://localhost:3000` da ochiladi.

## Asosiy funksiyalar

### ✅ Bajarilgan

1. **Authentication (Auth)**
   - Login/Register modallari
   - Zustand store bilan state management
   - LocalStorage'da saqlash

2. **Search (Qidirish)**
   - Barbershop qidirish
   - Filtrlar (shahar, tuman, reyting)
   - Real-time search

3. **Booking (Bron)**
   - Barbershop tanlash
   - Xizmat tanlash
   - Sana va vaqt tanlash
   - Time slot availability

4. **Cart (Savat)**
   - Multiple bookings
   - Cart management
   - Total price calculation

5. **UI/UX**
   - Modern va chiroyli dizayn
   - Framer Motion animatsiyalar
   - Responsive design
   - Interactive elements

## API Integratsiyasi

Frontend allaqachon API integratsiyasi uchun tayyorlangan. `lib/api/client.ts` faylida API client mavjud.

Backend tayyor bo'lganda:
1. `.env.local` faylida `NEXT_PUBLIC_API_URL` o'rnating
2. `lib/stores/authStore.ts` va `lib/stores/cartStore.ts` da mock funksiyalarni API chaqiruvlari bilan almashtiring
3. `lib/api/client.ts` da API endpoints'larni to'g'ri sozlang

Batafsil ma'lumot uchun `TZ_BACKEND.md` faylini ko'ring.

## Static Data

Hozircha static mock data ishlatilmoqda (`lib/data.ts`):
- 4 ta barbershop
- 5 ta xizmat turi
- 4 ta barber

Backend tayyor bo'lganda, bu data API'dan keladi.

## Keyingi qadamlar

1. Backend API integratsiyasi
2. Real-time notifications
3. Payment integration
4. Reviews va ratings
5. Admin panel

## Muallif

Senior Developer
