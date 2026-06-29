# GERÍCHT — Restaurant Project Context

## Overview

Full-stack restaurant POS/web application for **GERÍCHT**, a fine dining restaurant. Built with Next.js 16 + React 19 + MongoDB 7.0 LTS. Includes public landing page, menu, booking system, gallery, full backoffice with shadcn/ui, comandas/pedidos/billing, dynamic taxes/charges/payment methods, role-based access, credit notes, day opening/closing, cash audits, work shifts, sequential invoice numbering, timezone support, i18n (ES/EN/PT), and Auth.js authentication.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.9 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS 3 + shadcn/ui v2 + globals.css |
| **State** | Redux Toolkit |
| **Database** | MongoDB 7.0.37 LTS + Mongoose 8 |
| **Auth** | Auth.js v5 (Credentials + Google OAuth) |
| **Validation** | Zod 3 |
| **Animation** | Framer Motion 11, Swiper 11 |
| **Testing** | Jest 29 (51 tests) |
| **Package Manager** | npm 10.9.2 |

## Database Models

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| User | name, email, role (admin/staff/user), googleId | Auth + roles |
| Booking | firstName, email, dateTime, turnTime, tableId | Reservations |
| Table | tableId, name, capacity, location, status | Restaurant tables |
| Product | name, price, categoryId, type, taxIds, SKU | Menu products |
| Category | name, image | Product grouping |
| Turn | label, time, color | Service turns (lunch/dinner) |
| Media | filename, url, mimeType | Media library |
| Comanda | tableId, customerName, status (open/closed/rejected) | Table session |
| Pedido | comandaId, items, status (cocina) | Kitchen rounds |
| Order | comandaId, items, charges, taxes, total, invoiceNumber | Billing/invoice |
| Config | businessName, rif, timezone, nextInvoiceNumber | Business config |
| Tax | name, rate, scope (product/global), categoryIds | Dynamic taxes |
| Charge | name, type (percentage/fixed), scope | Dynamic charges |
| PaymentMethod | type, label, fields[] configurable | Payment methods |
| CreditNote | creditNoteNumber, originalOrderId, amount, reason | Credit notes |
| DayOpening | date, openedBy, workShiftId | Day opening |
| DayClosing | date, closedBy, summary | Day closing |
| CashAudit | date, workShiftId, expectedCash, declaredCash | Cash reconciliation |
| WorkShift | name, startTime, endTime | Employee shifts |

## Auth Flow

- CredentialsProvider (email + bcrypt) + Google OAuth via Auth.js v5
- First registered user → admin, subsequent → staff
- JWT includes role, userId, accessToken
- Middleware protects /dashboard (auth required)
- adminOnly: /dashboard/users, products, categories, tables, turns, config, media
- staffAndUp: /dashboard, comanda, bookings, orders, reports, credit-notes

## Key Architecture Decisions

### i18n
- 3 idiomas: ES (default), EN, PT
- Archivos JSON en `src/i18n/`
- Hook `useT()` con carga asíncrona y cache
- Provider en dashboard layout, idioma desde Config.defaultLanguage
- Sidebar y todas las páginas del dashboard traducidas

### Timezone Support
- Config.timezone (default "-04:00" Venezuela)
- Utilidad `getLocalDayRange()` para rangos UTC → local
- APIs de reports, close, open, cash-audits usan timezone
- GET /api/orders usa timezone-aware date filtering
- Server TZ env var mapeada como fallback

### Day Cycle (Apertura → Operación → Cierre)
1. Abrir día: requiere días anteriores (laborables) cerrados
2. Operar: comandas, pedidos, facturas — sin límites operativos
3. Arqueo de caja: múltiples por día, compara efectivo esperado vs declarado
4. Cerrar día: requiere día abierto, 0 comandas abiertas, 0 bills pendientes
5. Cierre 100% manual: el sistema nunca cierra automáticamente
6. Días NO cerrados: facturas visibles en Today, banner de notificación
7. Días cerrados: facturas pasan a History, inmutables — correcciones vía notas de crédito

### Notas de Crédito
- N° correlativo propio (CN-00001)
- Referencia a factura original, monto parcial o total
- IVA proporcional calculado automáticamente
- No modifica el día cerrado

### Billing: Today / History
- Today: facturas del día actual + días anteriores NO cerrados (timezone local)
- API `GET /api/orders?unclosedOnly=true` excluye órdenes de días con DayClosing
- History: solo facturas de días cerrados (requiere Close Day manual desde Reports)
- Filtros en History: rango de fechas, nombre de cliente, n° de factura
- Botón "Detalles" en cada fila del History → modal `InvoiceDetailDialog` con info completa (items, charges, taxes, payment data, totales)
- Desde el modal de detalle se puede emitir una Nota de Crédito directamente
- Banner de notificación en Today cuando hay días anteriores sin cerrar (ámbar, no bloqueante)
- El cierre del día es 100% manual: sin Close Day las facturas NO pasan a History

### InvoiceDetailDialog
- Modal con desglose completo de factura: items, charges, taxes, payment data
- Botón "Credit Note" si la factura está pagada → abre CreditNoteDialog
- Accesible desde el botón "Detalles" en la tabla de History

### Reglas de Desarrollo (workflow)
- Archivo `.opencode/rules.md` con reglas mandatorias
- `opencode.json` con `instructions` apuntando a las reglas
- Engram memory con topic_key `workflow/dev-rules` como preferencia persistente
- Protocolo de preguntas (analizar → alternativas → recomendar → esperar confirmación)
- Actualización de context.md después de cada cambio significativo
- Testing antes de commits, commits solo con autorización explícita

### Refactor (DRY/KISS)
- Todos los archivos del dashboard ≤ 400 líneas
- Settings: 6 tabs en componentes separados
- Billing/Reports/Products: dialogs extraídos a componentes
- 14 componentes nuevos en `components/dashboard/`

## Monorepo Architecture — Backoffice/Frontend Separation

La separación entre backoffice y frontend es **parcial por diseño deliberado**, no un pendiente técnico. El proyecto está concebido como un **monorepo reutilizable** (similar a WordPress) que pueda clonarse y adaptarse a otros proyectos similares (restaurantes, POS, comercios).

### Cómo funciona
- **Rutas separadas por prefijo**: `/api/backoffice/*` (42 rutas protegidas) y `/api/frontend/*` (5 rutas públicas)
- **Modelos compartidos**: Todos los modelos de DB viven en `src/database/models/` y son usados por ambos grupos de rutas
- **Middleware unificado**: `src/middleware.ts` protege por prefijo de ruta
- **Roles y permisos**: `requireRole()` para control granular en rutas críticas

### Por qué no monorepo físico (apps/ + packages/)
- No se necesita mantener múltiples repos o workspaces
- El template se clona y se adapta borrando lo que no aplica
- Se evita la sobreingeniería de una separación física cuando el negocio es el mismo
- Si en el futuro un proyecto requiere separación real, la estructura de rutas ya está lista para extraerse

### Routing map
| Prefijo | Rutas | Protegido |
|---------|-------|-----------|
| `/api/backoffice/*` | 42 routes (CRUD users, products, orders, config, etc.) | ✅ Middleware + requireRole |
| `/api/frontend/*` | 8 routes (availability, config, subscription, users, verify, menu, menu/breakdown, orders) | ❌ Públicas (endpoints públicos del landing) |
| `/api/auth/*` | Auth.js callbacks | ❌ Manejado por Auth.js |
| `/dashboard/*` | UI del backoffice | ✅ Middleware redirige a login |

## Service Layer — Business Logic Extraction

### `src/libs/services/order-service.ts`
- `calculateItemTaxes(items, productTaxes, taxCategoryMap, productMap)` — product-scoped tax calculation (moved from POST /api/orders)
- `calculateGlobalTaxes(subtotal, totalCharge, deliveryCost, globalTaxes)` — global-scoped tax calculation (moved from POST /api/orders)
- `calculateCharges(subtotal, isDelivery, globalCharges, config, orderChargesOverride?, deliveryCostFromBody?)` — dynamic charge computation + merge with overrides (moved from POST /api/orders)

### `src/libs/services/day-service.ts`
- `validateSequentialOpen(dateStr, nonWorkingDays, holidays)` — checks previous working days are closed before opening (moved from POST /api/day-opening)
- `validateSequentialClose(dateStr, nonWorkingDays, holidays)` — same sequential check for close context
- `getDaySummary(dateStr, tz)` — aggregates paid orders for a date (moved from POST /api/reports/close)
- `isNonWorkingDay(date, nonWorkingDays, holidays)` — non-working day check

## Known Issues

1. ~~No file upload real~~ **(Resuelto — Storage híbrido Local/S3)**
2. ~~**API sin auth**~~ **(Resuelto — middleware protege `/api/backoffice/*`, `requireRole()` en rutas críticas; `/api/frontend/*` queda público por diseño)**
3. **Mock de API en tests** — Se evaluó MSW v2 pero se descartó por sobrecarga de configuración con next/jest (~15 paquetes ESM en transpilePackages + moduleNameMapper). Se opta por mocks manuales con `jest.fn()` para mantener KISS. Los 9 tests unitarios actuales usan este enfoque sin configuración extra.
4. ~~**Separar backoffice del frontend**~~ **(Decisión arquitectónica — monorepo reutilizable como WordPress, separación lógica por prefijos)**
5. ~~**Proteger API routes con auth**~~ **(Resuelto — middleware + requireRole)**
6. ~~**Middleware check de auth usa accessToken (solo OAuth)**~~ **(Corregido — fallback a `userId`)**

## E2E Testing

### Stack
- **Playwright** + test DB (`gericht_e2e`) + seed via `global-setup.ts`
- Tests contra app real con MongoDB, Auth.js credentials login

### Cómo correr
```bash
# 1. Asegurate que MongoDB esté corriendo
# 2. Seed + start + test con un comando:
MONGO_URI="mongodb://localhost:27017/gericht_e2e" DB_NAME="gericht_e2e" \
AUTH_SECRET="e2e-test-secret" AUTH_URL="http://localhost:3000" \
NEXT_PUBLIC_BASE_URL="http://localhost:3000" TZ="America/Caracas" \
npx playwright test

# O manual:
npm run test:e2e:seed   # seed DB
npm run dev              # arrancar server con vars e2e
npm run test:e2e         # correr tests
```

### Tests existentes (10 tests, 3 suites)
| Suite | Tests | Cubre |
|-------|-------|-------|
| `media.spec.ts` | 3 | Upload URL, file picker, delete |
| `product-form.spec.ts` | 3 | Add images, URL en input, scroll con muchas imágenes |
| `storage.spec.ts` | 4 | Tab visible, toggle S3, guardar config, volver a Local |

### Archivos clave
| Archivo | Rol |
|---------|-----|
| `playwright.config.ts` | Config de Playwright |
| `e2e/global-setup.ts` | Seed DB con admin + config |
| `e2e/global-teardown.ts` | Drop DB de test |
| `e2e/tests/auth.setup.ts` | Helper loginAsAdmin |

## Storage (Media Upload)

### Arquitectura Híbrida
- **Provider local** (default): guarda en `public/uploads/`, servido como static por Next.js
- **Provider S3**: configurable desde Settings → Storage

### Cómo funciona
- `POST /api/media` acepta multipart/form-data + JSON legacy
- Lee `Config.storageProvider` para decidir provider
- `src/libs/services/storage-service.ts`: factory pattern con `LocalProvider` y `S3Provider`
- `DELETE /api/media/[id]` también borra del storage activo
- `public/uploads/` en `.gitignore`
- Provider S3 requiere bucket, region, accessKeyId, secretAccessKey, endpoint opcional

### Archivos clave
| Archivo | Rol |
|---------|-----|
| `src/libs/services/storage-service.ts` | Abstract factory + providers |
| `src/database/models/config.ts` | `storageProvider` + `s3Config` |
| `src/components/dashboard/settings/StorageTab.tsx` | UI de configuración |
| `src/app/api/media/route.ts` | POST con multipart |
| `src/app/api/media/[id]/route.ts` | DELETE con cleanup

## Security Headers (next.config.mjs)

| Header | Value | Entorno |
|--------|-------|---------|
| Content-Security-Policy-Report-Only | default-src, script-src, style-src, img-src, font-src, connect-src, frame-src, base-uri, form-action | Todos |
| X-Frame-Options | DENY | Todos |
| X-Content-Type-Options | nosniff | Todos |
| Referrer-Policy | strict-origin-when-cross-origin | Todos |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Producción (o si HSTS_ENABLED=true) |

HSTS usa flag híbrido: `NODE_ENV=production` lo activa automáticamente; en staging/dev se forza con `HSTS_ENABLED=true`.

## Frontend Foundation Components (PR 1)

Se implementaron los componentes base del frontend público para el carrito de compras, navegación de menú y visualización de productos.

### Cart System

| Componente | Archivo | Propósito |
|------------|---------|-----------|
| `cartSlicer` | `src/libs/store/slicers/cartSlicer.ts` | Slice Redux con items, loading, reducers (addItem, removeItem, updateQuantity, clearCart, hydrateCart) y selectors (selectCartCount, selectSubtotal, selectSubtotalBs) |
| `CartContext` | `src/components/frontend/CartContext.tsx` | React context para open/close del CartSheet (isCartOpen, setCartOpen, toggleCart) |
| `CartHydrator` | `src/components/frontend/CartHydrator.tsx` | Client component que hydrata el carrito desde localStorage al montar |
| `CartPersister` | `src/components/frontend/CartPersister.tsx` | Watchea items del carrito y persiste a localStorage en cada cambio |
| `CartBadge` | `src/components/frontend/CartBadge.tsx` | Ícono de carrito con badge animado (framer-motion scale) |
| `CartSheet` | `src/components/frontend/CartSheet.tsx` | Sheet lateral con lista de items, controles +/- , eliminar, subtotal Bs, botón "Ir al Checkout" |

### Menu Display

| Componente | Archivo | Propósito |
|------------|---------|-----------|
| `ProductCard` | `src/components/frontend/ProductCard.tsx` | Card con imagen, nombre, precio Bs, hover translateY, botón "Agregar" |
| `ResponsiveGrid` | `src/components/frontend/ResponsiveGrid.tsx` | Grid responsive (1→2→3→4 cols) con stagger animation via framer-motion |
| `CategorySlider` | `src/components/frontend/CategorySlider.tsx` | Scroll horizontal con pills de categorías, active state |
| `SearchBar` | `src/components/frontend/SearchBar.tsx` | Input con icono Search, debounce 300ms, botón X para limpiar |
| `ImageCarousel` | `src/components/frontend/ImageCarousel.tsx` | Imagen principal + thumbnails para detalle de producto |
| `MenuFilters` | `src/components/frontend/MenuFilters.tsx` | Client wrapper que conecta SearchBar + CategorySlider con router.push |

### Pages

| Página | Ruta | Archivo |
|--------|------|---------|
| Menú | `/menu` | `src/app/(frontend)/menu/page.tsx` (SSR, searchParams) |
| Detalle producto | `/menu/[slug]` | `src/app/(frontend)/menu/[slug]/page.tsx` (SSR) |
| 404 menú | `/menu/*` | `src/app/(frontend)/menu/not-found.tsx` |

### API Routes (nuevas)

| Ruta | Archivo | Propósito |
|------|---------|-----------|
| `GET /api/frontend/menu/[slug]` | `src/app/api/frontend/menu/[slug]/route.ts` | Producto individual por slug con priceBs, categoryName |

### Modificaciones existentes

- `src/libs/store/store.ts`: agregado `cart: cartSlicer` al reducer
- `src/libs/providers.tsx`: envuelve app con `CartProvider`
- `src/app/(frontend)/layout.tsx`: agregado `CartHydrator`, `CartPersister`, `CartSheet`
- `src/app/(frontend)/page.tsx`: sección "Menú Destacado" con fetch a `/api/frontend/menu`
- `src/utils/localStorage.ts`: creado con `safeGetItem`, `safeSetItem`
- `src/components/frontend/index.ts`: barrel exports actualizados

### Reglas de integración para próximas fases

- `CartBadge` debe colocarse en el Header para que los usuarios puedan abrir el carrito
- CartSheet usa `Sheet` de `@/components/ui/sheet` (basado en Radix Dialog)
- Las imágenes se sirven desde `/uploads/food/{filename}`
- Los precios se muestran en Bs usando `formatVes()`
- La tasa de cambio se calcula server-side en las APIs con `Config.exchangeRateBcv`

## Frontend Delivery Order Flow

Los pedidos realizados desde el frontend público (carrito en landing/menu) siguen un flujo **con revisión de staff**, sin crear comandas automáticamente.

### Flujo completo

```
Cliente → POST /api/frontend/orders → Order(source:"frontend", status:"pending")
    ↓
Staff ve en dashboard "Pedidos Pendientes"
    ↓
┌── Acepta ──────────────────────┐   ┌── Rechaza ──────────────────┐
│ Crea Comanda(isDelivery:true,   │   │ Order.status → "cancelled"  │
│   tableId:null,                 │   │ (con motivo opcional)       │
│   tableLabel:"Delivery - [nom]")│   └─────────────────────────────┘
│ Crea Pedido(items, "pending")   │
│ Order.comandaId = comanda._id   │
│ Order.pedidoIds = [pedido._id]  │
│ Order.status → "pending" (pago) │
└─────────────────────────────────┘
    ↓
Flujo existente: cocina prepara → sirve → factura
```

### Decisiones arquitectónicas

| Aspecto | Decisión |
|---------|----------|
| **Modelo** | Se reusa Comanda/Pedido/Order existente. Comanda con `isDelivery:true`, `tableId:null`. |
| **Source** | Order agrega campo `source: ["backoffice", "frontend"]` para filtrar. |
| **Precios** | USD → Bs. con `Config.exchangeRateBcv` (tasa BCV). Congelado en `Order.exchangeRateBcv` al crear la orden. |
| **Carrito** | Redux Toolkit (el existente), no se agrega Zustand. |
| **Tax/Charge calc** | El server calcula al ACEPTAR la orden, no en frontend. |
| **Popularidad** | Pendiente de definir (automático vs manual). |
| **Pedidos desde mesa** | Pospuesto para después del MVP delivery. |

### Componentes nuevos necesarios

| Componente | Descripción |
|------------|-------------|
| `GET /api/frontend/menu` | Landing: categorías + top productos |
| `GET /api/frontend/menu/breakdown` | Breakdown completo con filtros |
| `POST /api/frontend/orders` | Crear pedido delivery (status "pending", source "frontend") |
| `GET /api/backoffice/orders/pending` | Staff: listar órdenes frontend pendientes |
| `PUT /api/backoffice/orders/[id]/review` | Staff: aceptar (crea comanda+pedido) o rechazar |
| Staff "Pending Orders" view | Sección en dashboard para revisar pedidos |

### Roadmap completo
Ver `docs/frontend-roadmap.md` — 5 fases, ~6-8 días hábiles.

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
| TZ | Server timezone (e.g. America/Caracas) |
| HSTS_ENABLED | Force HSTS in non-production (true/false, default: auto via NODE_ENV) |

## Dependency Audit (Jun 2026)

| Issue | Severity | Location | Fix | Estado |
|-------|----------|----------|-----|--------|
| PostCSS < 8.5.10 (XSS) | 🟡 Moderate | Bundled inside Next.js 16.2.9 | Requires Next.js update upstream | ⏳ WON'T FIX (tooling dep, not runtime) |
| js-yaml (ReDoS) | 🟡 Moderate | Transitive via Jest's dependency chain | Would downgrade Jest 29 → 25 (breaking) | ⏳ WON'T FIX (tooling dep, not runtime) |

Ambos son vulnerabilidades **moderadas en tooling/build**, no en runtime. Sin impacto en producción.

## Utilities

| File | Purpose |
|------|---------|
| `src/utils/escapeRegex.ts` | Escapa metacaracteres de regex para búsqueda segura |
| `src/utils/slugify.ts` | Genera slugs URL-friendly desde nombres (con tildes/ñ) |
| `src/utils/phoneRegex.ts` | Validación de formato telefónico |
| `src/utils/getBaseUrl.ts` | Deriva URL base para fetch SSR — prioriza NEXT_PUBLIC_BASE_URL, fallback a headers() |
| `src/libs/currency.ts` | Funciones usdToVes, formatVes, formatUsd, fmtPrice, fmtPriceFull |
| `src/schemas/frontend.ts` | Schemas checkoutSchema (customer+items+notes), reviewOrderSchema |
| `src/app/api/frontend/menu/route.ts` | GET /api/frontend/menu — categorías con featured products + priceBs |
| `src/app/api/frontend/menu/breakdown/route.ts` | GET /api/frontend/menu/breakdown — todos los productos agrupados con filtros search/category |
| `src/app/api/frontend/orders/route.ts` | POST /api/frontend/orders — crea Order(source:frontend) desde carrito público |

## DB Model Changes (Frontend Public Prep)

| Model | Change | Purpose |
|-------|--------|---------|
| Product | Added `slug` (unique, sparse) | URLs SEO-friendly tipo `/menu/chapel-hill-shiraz` |
| Product | Added `featured` (Boolean, indexed) | Productos destacados para landing menu |
| Order | Added `source` (enum: backoffice/frontend, indexed) | Distinguir órdenes del frontend público |
| Order | Added `"preparing"` to `status` enum | Estado intermedio al aceptar pedido delivery |

## Seed Data (`scripts/seed-full.ts`)

| Concepto | Cantidad | Notas |
|----------|----------|-------|
| Categorías | 10 | Con imágenes Unsplash de alimentos reales |
| Productos | 30 | Con imágenes Unsplash específicas por producto |
| Mesas | 12 | 6 ubicaciones distintas |
| Reservas | 20 | Pasadas y futuras |
| Facturas | ~95 | 14 días hábiles de operación |
| Usuarios | 3 | admin@gericht.com / staff@gericht.com + Google |
| Días cerrados | 12 | Ayer y hoy abiertos |

### Categorías
Entradas, Sopas, Ensaladas, Platos Principales, Pastas, Carnes, Pescados & Mariscos, Postres, Bebidas, Panadería

### Roles y accesos
- **admin**: todo
- **staff**: dashboard, products, categories, media, bookings, comanda, orders, reports, credit-notes
- **staff NO ve en sidebar**: users, tables, turns, config

## MongoDB

- **Version**: 7.0.37 LTS (service: mongod7)
- **Database**: `gericht` (MONGO_URI=mongodb://localhost:27017/gericht)

## Session 2026-06-28 — PR 1 Foundation + Currency & UX Fixes

### Monetary Contract (CRITICAL)
**All Order monetary fields are stored in VES.** USD is only for reference (`totalUsdRef`).
- `POST /api/backoffice/orders`: converts subtotal, totalCharge, totalTax, total, orderCharges amounts, globalTaxBreakdown amounts to VES using frozen Config.exchangeRateBcv
- `POST /api/frontend/orders`: 503 if no exchange rate; stores totalUsdRef + exchangeRateBcv
- `PATCH /api/backoffice/orders/[id]`: recalculates subtotal in VES when items edited
- Seed: stores VES amounts with totalUsdRef and exchangeRateBcv

### Bug Fixes
- `toVes()` double conversion eliminated from TodayView, HistoryView, Reports
- `order-service.ts`: `catIds.length === 0` no longer applies tax to ALL products (fix: `catIds.length > 0`)
- `unclosedOnly=true` replaced with `dateFrom/dateTo` in Today billing tab
- `t("common.select")` returns key (truthy) — fallback `||` never executes
- `customer.email: ""` fails Zod `.email()` — omitted when empty
- `orderCharges` now includes `type` and `value` (schema requires all 4 fields)
- Alcohol tax removed from seed (no proper alcohol product classification)

### New Features
- **Day Opening**: BCV rate field with "Fetch" button (dolarapi.com/pydolarve.com/open.er-api.com)
- **Reports**: Day/Week/Month tabs (default Day), sort desc, open/closed days visible
- **NewBillDialog**: Comanda/Directo toggle mode; direct mode uses full menu products
- **EditBillDialog**: edit items with +/- quantity; add products from full menu
- **ProductSearch**: text input with filtered dropdown (no dependencies)
- **CurrencyInput**: VE format (`.` thousands, `,` decimal) with focus/blur
- **BillCard**: fixed structure (subtotal→charges→taxes→total), product names visible, USD ref on all lines
- **Billing cards**: revenue, bill count, charges breakdown (by name), taxes breakdown (by name)
- **Dashboard home**: formatVes + USD ref
- **Mobile**: CartBadge always visible, BookingIcon (CalendarDays) in header

### XPending
- ~~CRITICAL-002: fetch `localhost:3000` in SSR pages~~ **(Resuelto — utility getBaseUrl.ts con headers())**
- Review warnings (11) + suggestions (5) from adversarial audit
- Pipeline: review → scribe → archive → PR

- **Kernel note**: Ubuntu 26.04 (kernel 7.0.0) incompatible with MongoDB 8.0+ (SIGSEGV). Upgrade blocked until 8.x fixes.
