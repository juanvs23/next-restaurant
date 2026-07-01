# GERÍCHT — Frontend Public Roadmap

> **Meta**: Landing page moderna con menú interactivo y carrito para pedidos tipo delivery con revisión de staff.
> **Stack**: Next.js App Router, TailwindCSS, Framer Motion, Redux Toolkit (carrito), shadcn/ui.

---

## Decisiones arquitectónicas tomadas

| Decisión | Resolución |
|----------|------------|
| **Flujo de pedido** | Frontend crea orden `source: "frontend"` con status `"pending"`. Staff la revisa y confirma (pasa a facturación normal) o rechaza. No crea comanda automáticamente. |
| **Precios** | Se convierten USD → Bs. usando `Config.exchangeRateBcv` (tasa BCV del día). El rate se congela en la orden al crearla (campo `exchangeRateBcv` ya existe en Order). |
| **State management** | Usar Redux Toolkit existente para el carrito, no agregar Zustand. |
| **Popularidad** | Pendiente de definir: ¿contador automático (`timesOrdered`) o flag manual (`featured`)? |
| **Pedidos desde mesa** | Pospuesto para después de las fases 1-5. |

---

## Fase 1 — Base Components (día 1)

_Dependencia de todas las fases siguientes._

| # | Tarea | Descripción |
|---|-------|-------------|
| 1.1 | **ProductCard** | Card con carrusel de imágenes (fadeIn con Framer Motion), nombre, precio en Bs., botón "Seleccionar", botón "Ver más", selector de cantidad. Reutilizable en landing y breakdown. |
| 1.2 | **ImageCarousel** | Componente de carrusel interno para la card. Transiciones fadeIn con `AnimatePresence`. Swipe en mobile. Precarga de siguiente imagen. Solo animar cards visibles (Intersection Observer). |
| 1.3 | **ResponsiveGrid** | Layout grid responsive: 1 col mobile, 2 tablet, 3 small desktop, 4 large desktop. Max-width 1600px centrado. |
| 1.4 | **CategorySlider** | Slider horizontal de categorías con scroll nativo + `scroll-snap-type`. Usado en breakdown page. |
| 1.5 | **SearchBar** | Input de búsqueda con debounce 300ms para filtrar productos por nombre. |
| 1.6 | **API `/api/frontend/menu`** | Endpoint público GET. Devuelve hasta 3 categorías con sus top N productos. Requiere definir qué es "popular" (ver decisión). |
| 1.7 | **API `/api/frontend/menu/breakdown`** | Endpoint público GET. Lista completa: todos los productos agrupados por categoría. Filtros: `?search=` y `?category=`. Caché ISR 60s. |

---

## Fase 2 — Landing Page Menu Section (día 2)

_Requiere: Fase 1 (ProductCard, API landing)_

| # | Tarea | Descripción |
|---|-------|-------------|
| 2.1 | **Sección "Menú" en landing** | Muestra hasta 3 categorías con sus productos más populares (top 4). Cada categoría en sección horizontal con scroll. |
| 2.2 | **Botón "Ver más →"** | Al final de cada sección de categoría. Redirige a `/menu` (breakdown page). |
| 2.3 | **SSR/ISR** | Fetch de datos en server. Cache 60s. |

---

## Fase 3 — Menu Breakdown Page `/menu` (día 2-3)

_Requiere: Fase 1 (CategorySlider, SearchBar, ResponsiveGrid, ProductCard, API breakdown)_

| # | Tarea | Descripción |
|---|-------|-------------|
| 3.1 | **Ruta `/menu`** | Página SSR con desglose completo del menú. Indexable (contenido público valioso). |
| 3.2 | **CategorySlider sticky** | Slider de categorías en parte superior. Al seleccionar una, scroll suave a esa sección o filtra la grilla. |
| 3.3 | **SearchBar** | Buscador que filtra productos en tiempo real por nombre. Debounce 300ms. |
| 3.4 | **ResponsiveGrid con ProductCards** | Grilla de productos 1→2→3→4 cols. Cada card con carrusel, nombre, precio Bs., botones. |
| 3.5 | **Load desde API** | Fetch `/api/frontend/menu/breakdown` con `?search=` y `?category=` opcionales. |

---

## Fase 4 — Product Detail View (día 3)

_Requiere: Fase 3 (menu breakdown page)_

| # | Tarea | Descripción |
|---|-------|-------------|
| 4.1 | **Ruta `/menu/[slug]`** | Página de detalle de producto. Indexable. Hero image grande + galería de thumbnails debajo. |
| 4.2 | **Info del plato** | Descripción, ingredientes, precio Bs., selector de cantidad + botón "Agregar al carrito". |
| 4.3 | **Breadcrumb** | Inicio > Menú > Categoría > Producto. |
| 4.4 | **Volver** | Botón de navegación hacia `/menu`. |

---

## Fase 5 — Shopping Cart + Checkout (día 3-4)

_Requiere: Fase 3 (poder agregar productos desde cards o detalle)_
_**Importante**: Usar Redux Toolkit existente, NO Zustand._

| # | Tarea | Descripción |
|---|-------|-------------|
| 5.1 | **Cart Slice en Redux** | Estado global del carrito: items, cantidades, total Bs., reset. Persistencia en localStorage. |
| 5.2 | **CartSheet** | Panel lateral (shadcn Sheet) con items, cantidades ajustables, subtotal en Bs. Abre desde header. |
| 5.3 | **Badge en header** | Indicador circular con cantidad de items. |
| 5.4 | **Checkout flow** | Formulario: nombre, email, teléfono, notas. Envía a `POST /api/frontend/orders`. |
| 5.5 | **API `POST /api/frontend/orders`** | Crea Order con `source: "frontend"`, `status: "pending"`, `exchangeRateBcv` congelado, items con precios en USD+Bs. NO crea comanda ni pedido aún. |
| 5.6 | **Pantalla de confirmación** | "Pedido recibido, ID #[n], estamos revisándolo. Te contactaremos pronto." |
| 5.7 | **Staff: vista "Pedidos pendientes"** | Sección en dashboard backoffice donde staff ve órdenes `source: "frontend"` con status `"pending"`. Botones: **Aceptar** (crea comanda+pedido, cambia status) y **Rechazar** (status → "cancelled", con motivo opcional). |

---

## Resumen de fases

| Fase | Features | Días est. | Depende de |
|------|----------|-----------|------------|
| **1 — Base Components** | ProductCard, ImageCarousel, Grid, Slider, Search, APIs | 1 | — |
| **2 — Landing Menu** | Sección menú en home, Ver más → | 1 | Fase 1 |
| **3 — Breakdown `/menu`** | Slider categorías, buscador, grilla completa | 1-2 | Fase 1 |
| **4 — Detalle `/menu/[slug]`** | Galería, info completa, breadcrumb | 1 | Fase 3 |
| **5 — Carrito + Checkout + Staff Review** | Redux cart, sheet, checkout, API order, vista staff | ✅ Completado |
| **6 — Checkout + Pagos** | Página checkout, Stripe, WhatsApp | ⏳ Pendiente |
| **7 — Pedidos desde mesa** | ⏴ Pospuesto | — | Fases 1-5 |

**Total estimado (fase 6): 1-2 días hábiles.**

---

## Fase 6 — Checkout + Pagos

_Requiere: Fase 5 (carrito funcional, POST /api/frontend/orders)_

| # | Tarea | Descripción |
|---|-------|-------------|
| 6.1 | **Página `/checkout`** | Resumen del pedido, datos del cliente, selección de método de pago |
| 6.2 | **WhatsApp Checkout** | Botón "Pagar por WhatsApp" → abre wa.me con mensaje pre-armado |
| 6.3 | **Stripe Checkout** | Stripe Elements, PaymentIntent, webhook de confirmación |
| 6.4 | **Confirmación post-pago** | Página de éxito/error según resultado del pago |

---

## Notas técnicas

### Precios
- `precioBs = product.price * config.exchangeRateBcv`
- El rate se obtiene de `GET /api/frontend/config` (exponer `exchangeRateBcv` en el endpoint público).
- Al crear la orden, congelar `exchangeRateBcv` en el documento (el campo ya existe en Order).

### Modelo Order — cambio necesario
Agregar campo `source` al schema de Order:
```ts
source: { type: String, enum: ["backoffice", "frontend"], default: "backoffice" }
```

### APIs nuevas

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `GET /api/frontend/menu` | Público | Landing: categorías + top productos |
| `GET /api/frontend/menu/breakdown` | Público | Breakdown: todos los productos, filtros |
| `POST /api/frontend/orders` | Público | Crear pedido desde frontend (carrito) |
| `GET /api/backoffice/orders/pending` | Staff | Listar órdenes frontend pendientes |
| `PUT /api/backoffice/orders/[id]/review` | Staff | Aceptar o rechazar orden pendiente |

### Popularidad — pendiente de definir
Opción A: Agregar `timesOrdered: { type: Number, default: 0 }` a Product e incrementar al confirmar orden.
Opción B: Agregar `featured: { type: Boolean, default: false }` para marcado manual desde backoffice.

### SEO
- `/menu` → indexable (contenido público valioso)
- `/menu/[slug]` → indexable (cada plato es contenido único)

### Performance
- Cards con imágenes: lazy loading nativo + blur placeholder CSS
- Carrusel: precargar siguiente imagen, animar solo cards visibles (Intersection Observer)
- API `/menu/breakdown`: caché ISR 60s
- Carrito: persistencia en localStorage via Redux
