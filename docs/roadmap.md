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

### Pendiente

| Feature | Estado | Prioridad |
|---------|--------|-----------|
| Reportes mensuales + cierre de día | ✅ Completado | 🔴 Alta |
| Traducciones i18n (ES/EN/PT en UI) | ✅ Completado | 🟡 Media |
| Refactor <400 líneas por archivo | ✅ Completado | 🟡 Media |
| Historial de facturación (pestañas Today/History) | 🟡 Pendiente ajustes | 🟡 Media |
| Separar backoffice del frontend | ⏳ Pendiente | 🟢 Baja |
| File upload real (uploadthing / S3) | ⏳ Pendiente | 🟢 Baja |
| Proteger API routes con auth | ⏳ Pendiente | 🟢 Baja |
| MSW para tests | ⏳ Pendiente | 🟢 Baja |

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

### Pending

| Feature | Status | Priority |
|---------|--------|----------|
| Monthly reports + day closing | ✅ Done | 🔴 High |
| i18n translations (EN/ES/PT in UI) | ✅ Done | 🟡 Medium |
| <400 lines per file refactor | ✅ Done | 🟡 Medium |
| Billing history (Today/History tabs) | 🟡 Adjustments pending | 🟡 Medium |
| Backoffice/frontend separation | ⏳ Pending | 🟢 Low |
| File upload (uploadthing / S3) | ⏳ Pending | 🟢 Low |
| Protect API routes with auth | ⏳ Pending | 🟢 Low |
| MSW for tests | ⏳ Pending | 🟢 Low |

---

## 🇧🇷 Português

### Fases Concluídas

| Fase | Status |
|------|--------|
| **0 — Upgrade** (Next 14→16, React 18→19, ESLint 9) | ✅ |
| **1 — Fundação** (Modelos DB, auth, conexão) | ✅ |
| **2 — Backoffice** (CRUD produtos/categorias/usuários/mesas/turns/media) | ✅ |
| **3 — Reservas** (Formulário, PDF ticket, QR verificação) | ✅ |
| **4 — Comandas** (Comanda/Pedido/Order, billing, charges, taxes, payments) | ✅ |
| **5 — Refactor** (DRY/KISS, <400 linhas/arquivo, i18n) | ✅ |

### Pendente

| Funcionalidade | Status | Prioridade |
|----------------|--------|------------|
| Relatórios mensais + fechamento do dia | ✅ Concluído | 🔴 Alta |
| Traduções i18n (PT/ES/EN na UI) | ✅ Concluído | 🟡 Média |
| Refator <400 linhas por arquivo | ✅ Concluído | 🟡 Média |
| Histórico de faturamento (abas Hoje/Histórico) | 🟡 Ajustes pendentes | 🟡 Média |
| Separar backoffice do frontend | ⏳ Pendente | 🟢 Baixa |
| Upload de arquivos (uploadthing / S3) | ⏳ Pendente | 🟢 Baixa |
| Proteger rotas da API com auth | ⏳ Pendente | 🟢 Baixa |
| MSW para testes | ⏳ Pendente | 🟢 Baixa |

---

## 🔒 Seguridad — Plan de acción

> Priorizado por riesgo: CRÍTICO → ALTO → MEDIO → BAJO

### 🇪🇸 Español

| # | Acción | Riesgo | Estado | Esfuerzo |
|---|--------|--------|--------|----------|
| 1 | **Proteger rutas `/api/*` con auth** — middleware que verifique JWT/token en todas las API routes | 🔴 Crítico | ⏳ Pendiente | 2-3h |
| 2 | **Corregir `httpOnly: false`** en cookie `authjs.callback-url` | 🔴 Crítico | ⏳ Pendiente | 15min |
| 3 | **Rate limiting en login** — protección contra brute force en CredentialsProvider | 🟡 Alto | ⏳ Pendiente | 1-2h |
| 4 | **Headers de seguridad** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options en `next.config.mjs` | 🟡 Alto | ⏳ Pendiente | 30min |
| 5 | **Validación Zod en API routes** — schema validation en todos los endpoints | 🟡 Medio | ⏳ Pendiente | 4-6h |
| 6 | **Sanitizar regex en queries** — `RegExp(search, "i")` sin sanitizar en GET /api/orders | 🟡 Medio | ⏳ Pendiente | 15min |
| 7 | **Eliminar/asegurar endpoint `/api/seed`** — evitar población no autorizada de DB | 🟢 Bajo | ⏳ Pendiente | 15min |
| 8 | **Auditar dependencias** — revisar vulnerabilidades conocidas con `npm audit` | 🟢 Bajo | ⏳ Pendiente | 30min |

### 🇬🇧 English

| # | Action | Risk | Status | Effort |
|---|--------|------|--------|--------|
| 1 | **Protect `/api/*` routes with auth** — middleware verifying JWT/token on all API routes | 🔴 Critical | ⏳ Pending | 2-3h |
| 2 | **Fix `httpOnly: false`** on `authjs.callback-url` cookie | 🔴 Critical | ⏳ Pending | 15min |
| 3 | **Rate limiting on login** — brute force protection on CredentialsProvider | 🟡 High | ⏳ Pending | 1-2h |
| 4 | **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options in `next.config.mjs` | 🟡 High | ⏳ Pending | 30min |
| 5 | **Zod validation on API routes** — schema validation on all endpoints | 🟡 Medium | ⏳ Pending | 4-6h |
| 6 | **Sanitize regex in queries** — unsanitized `RegExp(search, "i")` in GET /api/orders | 🟡 Medium | ⏳ Pending | 15min |
| 7 | **Remove/secure `/api/seed` endpoint** — prevent unauthorized DB population | 🟢 Low | ⏳ Pending | 15min |
| 8 | **Dependency audit** — check known vulnerabilities with `npm audit` | 🟢 Low | ⏳ Pending | 30min |

### 🇧🇷 Português

| # | Ação | Risco | Status | Esforço |
|---|------|-------|--------|---------|
| 1 | **Proteger rotas `/api/*` com auth** — middleware que verifique JWT/token em todas as API routes | 🔴 Crítico | ⏳ Pendente | 2-3h |
| 2 | **Corrigir `httpOnly: false`** no cookie `authjs.callback-url` | 🔴 Crítico | ⏳ Pendente | 15min |
| 3 | **Rate limiting no login** — proteção contra brute force no CredentialsProvider | 🟡 Alto | ⏳ Pendente | 1-2h |
| 4 | **Headers de segurança** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options no `next.config.mjs` | 🟡 Alto | ⏳ Pendente | 30min |
| 5 | **Validação Zod nas API routes** — schema validation em todos os endpoints | 🟡 Médio | ⏳ Pendente | 4-6h |
| 6 | **Sanitizar regex em queries** — `RegExp(search, "i")` sem sanitizar em GET /api/orders | 🟡 Médio | ⏳ Pendente | 15min |
| 7 | **Remover/asegurar endpoint `/api/seed`** — evitar povoação não autorizada da DB | 🟢 Baixo | ⏳ Pendente | 15min |
| 8 | **Auditar dependências** — verificar vulnerabilidades conhecidas com `npm audit` | 🟢 Baixo | ⏳ Pendente | 30min |
