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
| **Testing** | Jest 29 (5 tests) |
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
| `/api/frontend/*` | 5 routes (availability, config, subscription, users, verify) | ❌ Públicas (endpoints públicos del landing) |
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
3. **Sin MSW** — Tests unitarios sin mock de API (msw instalado pero no hay handlers ni setup en `src/mocks/`)
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
- **Kernel note**: Ubuntu 26.04 (kernel 7.0.0) incompatible with MongoDB 8.0+ (SIGSEGV). Upgrade blocked until 8.x fixes.
