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

1. **No file upload real** — Media model listo, falta uploadthing/S3
2. **API sin auth** — Rutas /api/* sin protección (solo middleware protege dashboard UI)
3. **Sin MSW** — Tests sin mock de API
4. **Pendiente**: Separar backoffice del frontend
5. **Pendiente**: Proteger API routes con auth

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

## MongoDB

- **Version**: 7.0.37 LTS (service: mongod7)
- **Kernel note**: Ubuntu 26.04 (kernel 7.0.0) incompatible with MongoDB 8.0+ (SIGSEGV). Upgrade blocked until 8.x fixes.
