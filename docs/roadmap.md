# GERÍCHT — Roadmap

## 🇪🇸 Español

### Fases completadas

| Fase | Estado | Descripción |
|------|--------|-------------|
| **0 — Upgrade** | ✅ | Next 16 + React 19 + ESLint flat config + Auth.js v5 |
| **1 — Foundation** | ✅ | Estilos consolidados (Tailwind), modelos DB, fixes connection/AbortController/JWT |
| **2 — Backoffice** | ✅ | CRUD productos/categorías, admin UI con shadcn, roles, menú migrado a DB |
| **3 — Reservas** | ✅ | APIs disponibilidad/booking, formulario conectado, PDF ticket, verificación QR |

### Fase 4 — Comandas (🟡 En progreso)

| Feature | Estado |
|---------|--------|
| Modelo Comanda (sesión de mesa) | ✅ |
| Modelo Pedido (rondas a cocina) | ✅ |
| Modelo Factura (Order) con cargos | ✅ |
| Comanda page (grid de mesas) | ✅ |
| Pedidos con estados (pending→preparing→ready→served) | ✅ |
| Pagos por orden (múltiples métodos) | ✅ |
| Filtros por fecha, nombre, estado | ✅ |
| Paginación (30/comandas) | ✅ |
| Auto-cierre de comandas al cambiar de día | ✅ |
| **Billing / Reportes + Cierre de día** | ⏳ Pendiente |

### Fase 5 — Configuración (⏳ Pendiente)

| Feature | Prioridad |
|---------|-----------|
| Modelo Config (RIF, IVA, datos fiscales) | 🔴 Alta |
| IVA en productos + facturas | 🔴 Alta |
| N° de factura correlativo | 🟡 Media |
| Días no laborables desde backoffice | 🟡 Media |

### Mejoras generales pendientes

| Feature | Prioridad |
|---------|-----------|
| Separar backoffice del frontend (independencia total) | 🟢 Baja |
| File upload real (uploadthing / S3) | 🟢 Baja |
| Proteger API routes con autenticación | 🟢 Baja |
| MSW para tests | 🟢 Baja |

---

## 🇬🇧 English

### Completed Phases

| Phase | Status | Description |
|-------|--------|-------------|
| **0 — Upgrade** | ✅ | Next 16 + React 19 + ESLint flat config + Auth.js v5 |
| **1 — Foundation** | ✅ | Tailwind consolidation, DB models, connection/AbortController/JWT fixes |
| **2 — Backoffice** | ✅ | Product/category CRUD, shadcn admin UI, roles, menu migrated to DB |
| **3 — Reservations** | ✅ | Availability/booking APIs, connected form, PDF ticket, QR verification |

### Phase 4 — Orders Management (🟡 In Progress)

| Feature | Status |
|---------|--------|
| Comanda model (table session) | ✅ |
| Pedido model (kitchen rounds) | ✅ |
| Invoice model (Order) with charges | ✅ |
| Comanda page (table grid view) | ✅ |
| Pedido status flow (pending→preparing→ready→served) | ✅ |
| Multi-payment per order | ✅ |
| Filters by date, name, status | ✅ |
| Pagination (30/comandas) | ✅ |
| Auto-close comandas on day change | ✅ |
| **Billing / Reports + Day closing** | ⏳ Pending |

### Phase 5 — Settings (⏳ Pending)

| Feature | Priority |
|---------|----------|
| Config model (tax ID, VAT, business data) | 🔴 High |
| VAT on products + invoices | 🔴 High |
| Sequential invoice numbering | 🟡 Medium |
| Non-working days from backoffice | 🟡 Medium |

### General Improvements

| Feature | Priority |
|---------|----------|
| Backoffice/frontend full separation | 🟢 Low |
| File upload (uploadthing / S3) | 🟢 Low |
| Protect API routes with auth | 🟢 Low |
| MSW for tests | 🟢 Low |

---

## 🇧🇷 Português

### Fases Concluídas

| Fase | Status | Descrição |
|------|--------|-----------|
| **0 — Upgrade** | ✅ | Next 16 + React 19 + ESLint flat config + Auth.js v5 |
| **1 — Fundação** | ✅ | Estilos consolidados (Tailwind), modelos DB, correções connection/AbortController/JWT |
| **2 — Backoffice** | ✅ | CRUD produtos/categorias, admin UI com shadcn, funções, cardápio migrado para DB |
| **3 — Reservas** | ✅ | APIs disponibilidade/booking, formulário conectado, PDF ticket, verificação QR |

### Fase 4 — Comandas (🟡 Em andamento)

| Funcionalidade | Status |
|----------------|--------|
| Modelo Comanda (sessão de mesa) | ✅ |
| Modelo Pedido (rodadas para cozinha) | ✅ |
| Modelo Fatura (Order) com taxas | ✅ |
| Página Comanda (grade de mesas) | ✅ |
| Fluxo de status do Pedido (pending→preparing→ready→served) | ✅ |
| Múltiplos pagamentos por pedido | ✅ |
| Filtros por data, nome, status | ✅ |
| Paginação (30/comandas) | ✅ |
| Fechamento automático de comandas ao mudar de dia | ✅ |
| **Faturamento / Relatórios + Fechamento do dia** | ⏳ Pendente |

### Fase 5 — Configurações (⏳ Pendente)

| Funcionalidade | Prioridade |
|----------------|------------|
| Modelo Config (CNPJ, impostos, dados fiscais) | 🔴 Alta |
| Impostos em produtos + faturas | 🔴 Alta |
| Numeração sequencial de notas fiscais | 🟡 Média |
| Dias não úteis a partir do backoffice | 🟡 Média |

### Melhorias gerais pendentes

| Funcionalidade | Prioridade |
|----------------|------------|
| Separação total backoffice/frontend | 🟢 Baixa |
| Upload de arquivos (uploadthing / S3) | 🟢 Baixa |
| Proteger rotas da API com autenticação | 🟢 Baixa |
| MSW para testes | 🟢 Baixa |
