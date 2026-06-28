# GERÍCHT — Roadmap

> **Ordenado por:** prioridad → impacto → bloqueos

## 🇪🇸 Español

### Fases completadas

| Fase | Estado |
|------|--------|
| **0 — Upgrade** (Next 14→16, React 18→19, ESLint 9) | ✅ |
| **1 — Foundation** (Modelos DB, auth, conexión) | ✅ |
| **2 — Backoffice** (CRUDs productos/categorías/usuarios/mesas/turns/media) | ✅ |
| **3 — Reservas** (Booking form, PDF ticket, QR verificación) | ✅ |
| **4 — Comandas** (Comanda/Pedido/Order, billing, charges, taxes, payments) | ✅ |
| **5 — Refactor** (DRY/KISS, <400 líneas por archivo, i18n) | ✅ |

### Features completadas

| Feature | Prioridad |
|---------|-----------|
| Reportes mensuales + cierre de día | 🔴 Alta |
| Traducciones i18n (ES/EN/PT en UI) | 🟡 Media |
| Refactor <400 líneas por archivo | 🟡 Media |
| Historial de facturación (pestañas Today/History) | 🟡 Media |
| Storage híbrido Local/S3 | 🟢 Baja |
| Proteger API routes con auth (middleware + requireRole) | 🟢 Baja |
| Rate limiting en login (5 intentos, 15 min cooldown) | 🟡 Alta |
| Separación backoffice/frontend (monorepo reutilizable, diseño tipo WordPress) | 🟢 Baja |

> **Nota:** La separación backoffice/frontend es **parcial por diseño**. El proyecto es un monorepo reutilizable (similar a WordPress) que comparte modelos, servicios y config entre las rutas `/api/backoffice/*` (protegidas) y `/api/frontend/*` (públicas). No es un pendiente técnico — es una decisión arquitectónica deliberada para poder clonar y adaptar el template a otros proyectos.

### Pendiente real

| Feature | Prioridad | Estado |
|---------|-----------|--------|
| MSW para tests (handlers + mocks) | 🟢 Baja | ❌ Descartado — se usan mocks manuales (KISS) |
| Validación Zod en API routes | 🟡 Media | ✅ Completado |
| Sanitizar regex en queries de búsqueda | 🟡 Media | ⏳ Pendiente |
| HSTS header en next.config.mjs | 🟡 Alta | ✅ Completado |

---

## 🇬🇧 English

### Completed Phases

| Phase | Status |
|-------|--------|
| **0 — Upgrade** (Next 14→16, React 18→19, ESLint 9) | ✅ |
| **1 — Foundation** (DB models, auth, connection) | ✅ |
| **2 — Backoffice** (CRUD products/categories/users/tables/turns/media) | ✅ |
| **3 — Reservations** (Booking form, PDF ticket, QR verification) | ✅ |
| **4 — Orders** (Comanda/Pedido/Order, billing, charges, taxes, payments) | ✅ |
| **5 — Refactor** (DRY/KISS, <400 lines/file, i18n) | ✅ |

### Completed Features

| Feature | Priority |
|---------|----------|
| Monthly reports + day closing | 🔴 High |
| i18n translations (EN/ES/PT in UI) | 🟡 Medium |
| <400 lines per file refactor | 🟡 Medium |
| Billing history (Today/History tabs) | 🟡 Medium |
| Hybrid Local/S3 storage | 🟢 Low |
| Protect API routes with auth (middleware + requireRole) | 🟢 Low |
| Rate limiting on login (5 attempts, 15 min cooldown) | 🟡 High |
| Backoffice/frontend separation (monorepo, WordPress-like design) | 🟢 Low |

> **Note:** Backoffice/frontend separation is **partial by design**. The project is a reusable monorepo (WordPress-like) sharing models, services, and config between `/api/backoffice/*` (protected) and `/api/frontend/*` (public) routes. This is an architectural decision, not a pending task — the template can be cloned and adapted to similar projects.

### Actual Pending

| Feature | Priority | Status |
|---------|----------|--------|
| MSW for tests (handlers + mocks setup) | 🟢 Low | ❌ Discarded — manual mocks instead (KISS) |
| Zod validation on API routes | 🟡 Medium | ✅ Completed |
| Sanitize regex in search queries | 🟡 Medium | ⏳ Pending |
| HSTS header in next.config.mjs | 🟡 High | ✅ Completed |

---

## 🔒 Seguridad — Plan de acción / Security Action Plan

> Priorizado por riesgo: CRÍTICO → ALTO → MEDIO → BAJO

| # | Acción / Action | Riesgo / Risk | Estado / Status | Esfuerzo / Effort |
|---|-----------------|---------------|-----------------|-------------------|
| 1 | **Proteger rutas `/api/backoffice/*` con auth** / _Protect `/api/backoffice/*` routes with auth_ | 🔴 Crítico | ✅ Completado / _Done_ | 2-3h |
| 2 | **Corregir `httpOnly: false`** en cookie `authjs.callback-url` / _Fix `httpOnly: false` on `authjs.callback-url` cookie_ | 🔴 Crítico | ✅ Completado / _Done_ | 15min |
| 3 | **Rate limiting en login** / _Rate limiting on login_ | 🟡 Alto | ✅ Completado / _Done_ | 1-2h |
| 4 | **Headers de seguridad (HSTS)** / _Security headers (HSTS)_ | 🟡 Alto | ✅ Completado / _Done_ | 5min |
| 5 | **Validación Zod en API routes** / _Zod validation on API routes_ | 🟡 Medio | ✅ Completado / _Done_ | 4-6h |
| 6 | **Sanitizar regex en queries** / _Sanitize regex in queries_ | 🟡 Medio | ⏳ Pendiente / _Pending_ | 15min |
| 7 | **Asegurar endpoint `/api/seed`** / _Secure `/api/seed` endpoint_ | 🟢 Bajo | ✅ Completado / _Done_ | 15min |
| 8 | **Auditar dependencias** / _Dependency audit_ | 🟢 Bajo | ⏳ Pendiente / _Pending_ | 30min |
