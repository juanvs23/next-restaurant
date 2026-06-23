# GERÍCHT — Restaurant Project Context

## Overview

Full-stack restaurant web application for **GERÍCHT**, a fine dining restaurant in Berlin. Built with Next.js 16 + React 19 + MongoDB. Includes public landing page, menu display, booking system, gallery, admin backoffice, and Google OAuth authentication.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.9 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS 3 + globals.css (SCSS y styled-components eliminados) |
| **State** | Redux Toolkit |
| **Database** | MongoDB 7.0.37 LTS + Mongoose 8 |
| **Auth** | Auth.js v5 (next-auth@beta, Google OAuth) |
| **Validation** | Zod 3 |
| **Animation** | Framer Motion 11, Swiper 11 |
| **Testing** | Jest 29 + @testing-library/react (5 tests) |
| **Package Manager** | npm 10.9.2 |

## Current Architecture

```
src/
├── app/
│   ├── (frontend)/          # Public pages
│   │   ├── page.tsx         # Home sections
│   │   ├── about/page.tsx
│   │   └── [...not-found]/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── subscription/    # Newsletter
│   │   ├── products/        # CRUD
│   │   ├── categories/      # CRUD
│   │   ├── bookings/        # GET list
│   │   ├── users/           # GET list + PUT role
│   │   ├── media/           # GET + POST
│   │   ├── menu.ts          # Hardcoded (pending migration to DB)
│   │   └── slidesContents.ts
│   ├── dashboard/           # Admin panel
│   │   ├── products/
│   │   ├── categories/
│   │   ├── bookings/
│   │   └── users/
│   ├── auth.ts              # Auth.js v5 + user sync + JWT refresh
│   ├── middleware.ts         # Role-based protection
│   ├── globals.css          # Tailwind + estilos globales
│   └── layout.tsx           # Root layout
├── components/
│   ├── common/              # Logo, SponImage, fonts
│   └── frontend/            # Header, Footer, Booking, Sliders, etc.
├── database/
│   ├── connection.ts        # Mongoose cached connection
│   └── models/              # 7 modelos
│       ├── subscription.ts
│       ├── user.ts
│       ├── booking.ts
│       ├── table.ts
│       ├── product.ts
│       ├── category.ts
│       └── media.ts
├── libs/
│   ├── axios/               # Axios instance (sin AbortController)
│   ├── store/               # Redux (booking + modal)
│   └── providers.tsx
├── schemas/                 # Zod schemas
├── types/                   # TypeScript interfaces
├── __tests__/               # Jest tests
└── routes.ts
```

## Database Models

| Model | Key Fields | Indexes |
|-------|-----------|---------|
| Subscription | email (unique) | email:1 |
| User | name, email, googleId, role | email:1, googleId:1 |
| Booking | firstName, lastName, email, dateTime, turnTime, numberPersons, tableId, status | dateTime+turnTime, email, status |
| Table | tableId (unique), name, capacity, location, status | tableId:1, capacity:1 |
| Product | name, price, categoryId, type, sizes, SKU (unique) | SKU:1, categoryId:1, type:1 |
| Category | name (unique), description, image, items[] | name:1 |
| Media | filename, url, mimeType, alt, title, caption, description | refType+refId |

## Auth Flow

- Google OAuth via Auth.js v5
- User auto-created in DB on first sign-in (role: "user")
- JWT includes role + userId
- Session includes accessToken, role, userId
- Middleware protects /dashboard (requires auth) and /dashboard/users (admin only)
- JWT token refresh with Google refresh_token

## Roadmap

El roadmap completo con fases, prioridades y traducciones (ES/EN/PT) se encuentra en **[`docs/roadmap.md`](./roadmap.md)**.

## Known Issues

1. **No file upload real** — Media model creado, falta uploadthing o S3
2. **API sin auth** — Las rutas /api/products, /api/categories no tienen protección (solo dashboard UI)
3. **Sin MSW** — Tests no tienen mock de API

## Architecture — Comandas / Pedidos / Factura

**Comanda** → Sesión de mesa/barra (abierta, cerrada, rechazada). Contiene cliente, mesa, delivery flag.
**Pedido** → Ronda de productos enviada a cocina. Pertenece a una comanda. Estado: pending→preparing→ready→served.
**Factura (Order)** → Cuenta final. Consolida items de todos los pedidos. Calcula subtotal, serviceCharge (10% mesa), deliveryCost. Asociada a una comanda.

Flujo: Mesero crea Comanda → agrega Pedidos (rondas) → cocina recibe → cuando cliente paga, se genera Factura desde la comanda → comanda se cierra.

## Environment Variables

| Variable | Description |
|----------|-------------|
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret |
| NEXTAUTH_URL / AUTH_URL | Application base URL |
| NEXTAUTH_SECRET / AUTH_SECRET | Auth encryption secret |
| AUTH_TRUST_HOST | Trust host for Auth.js |
| MONGO_URI | MongoDB connection string |
| DB_NAME | MongoDB database name |
| NEXT_PUBLIC_BASE_URL | Public base URL |

## MongoDB

- **Version**: 7.0.37 LTS (service: mongod7)
- **Kernel note**: Ubuntu 26.04 (kernel 7.0.0) incompatible with MongoDB 8.0+ (SIGSEGV). Upgrade blocked until 8.x fixes tcmalloc/rseq issue.
