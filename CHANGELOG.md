# Changelog

All notable changes to the GERÍCHT restaurant project.

## [Unreleased] — PR #1 Foundation

### Added

- **Public frontend APIs**: `GET /api/frontend/menu` (featured products), `GET /api/frontend/menu/breakdown` (full menu with search/category filters), `GET /api/frontend/menu/[slug]` (product detail by slug), `POST /api/frontend/orders` (public checkout)
- **Public pages**: `/menu` (interactive menu with search, category filters, responsive grid), `/menu/[slug]` (product detail with image carousel and add-to-cart)
- **Frontend components**: `ProductCard`, `ResponsiveGrid`, `CategorySlider`, `SearchBar`, `ImageCarousel`, `MenuFilters`, `CartBadge`, `CartSheet`, `CartHydrator`, `CartPersister`
- **Shopping cart**: Redux `cartSlicer` with add/remove/update/clear, computed totals Bs/USD, localStorage persistence
- **Landing page**: restored mockup layout, `MenuHome` section loads featured products from API via Swiper slider
- **Mobile header**: cart `CartBadge`, `BookingIcon`, mobile menu nav cleanup
- **Dashboard — Featured toggle**: toggle featured status on products from `ProductFormDialog`
- **Dashboard — CurrencyInput**: Venezuelan Bolívar formatting input (Bs. 1.234,56)
- **Dashboard — ProductSearch**: searchable product selector for bill creation
- **Dashboard — Billing UX**: `BillCard` restructured, `NewBillDialog` with Comanda/Directo modes
- **Dashboard — Day opening**: BCV exchange rate with Fetch button
- **Utils**: `getBaseUrl()` (SSR-safe base URL from headers), `escapeRegex`, tight `phoneRegex`
- **Test suite**: 6 new test files, 8 suites, 71 tests
- **Product model**: `featured` (Boolean), `slug` (unique sparse), `source` on Order (backoffice/frontend)

### Changed

- Cart selectors: NaN guards on computed price totals
- `ResponsiveGrid`: stable React keys via `React.Children.toArray`
- `CategorySlider`: CSS scroll-snap fixed (`snap-start`)
- `SearchBar`: controlled component with prop sync + `aria-label`
- `ImageCarousel` + `ProductCard`: `<img>` → `next/Image`
- Redux store: `serializableCheck` restored (was disabled)
- Landing page: `MenuHome` now API-driven instead of hardcoded data
- `phoneRegex`: tightened with digit count validation (7-15 digits)

### Fixed

- **CRITICAL-001**: `POST /api/frontend/orders` returns 503 when `exchangeRateBcv` not set
- **CRITICAL-002**: removed `localhost:3000` hardcoded fallback, added `getBaseUrl()` with `headers()`
- **CRITICAL (Judgment Day)**: `productId` validated as ObjectId in checkout Zod schema
- **W-001/002**: name whitespace trim, phone regex with digit count validation
- **W-003**: CastError prevention in `/api/frontend/menu/breakdown` category filter
- **W-005/006**: `aria-label` on SearchBar input and ImageCarousel thumbnails
- **W-007**: dead import `safeSetItem` removed from ProductCard
- **W-008**: NaN guards on cart subtotal selectors
- **W-009**: consistent `notFound()` in both `generateMetadata` and product page
- **W-010**: `serializableCheck: false` removed from Redux store
- **W-011**: experimental `viewTransitionName` removed from ImageCarousel
- **Image fix**: double `/uploads/food/` prefix removed from ProductCard and ImageCarousel

## 1.0.0 — 2024-06-19

### Added

- Next.js 14 App Router project structure with TypeScript
- Landing page with 7 sections: Hero, About Us, Menu, Our Chef, Gallery, Awards, Find Us
- Custom 404 not-found page
- About page (placeholder)
- **Authentication**: Google OAuth via NextAuth v4 with JWT strategy
- **Protected routes**: Middleware guarding `/dashboard` and `/api/protected`
- **Dashboard**: Admin area scaffold (WIP placeholder)
- **Subscription API**: Newsletter endpoint (`POST /api/suscription`) with MongoDB persistence
- **Menu data**: Static product definitions for Wine & Beer and Cocktails
- **Slide content**: Dynamic menu sections generator for slider display
- **Redux state**: Global store with modal and booking slices
- **State management**: Redux Toolkit with typed hooks
- **Validation**: Zod schemas for email subscription and profile info (name, email, phone)
- **API client**: Axios instance with centralized base URL
- **Database**: MongoDB connection with Mongoose 8 (Suscription model)
- **Components**:
  - Header with navigation
  - Footer with social links
  - Booking form (multi-step)
  - Modal system
  - Image containers
  - Video player
  - Subscription form
  - Swiper sliders
  - Animated transitions (Framer Motion)
- **Fonts**: Cormorant, Montserrat, Inter via Next.js font optimization
- **Styling**: TailwindCSS utility classes + Styled Components + SCSS
- **Configuration**:
  - TypeScript strict mode
  - Path aliases (`@/` → `src/`, `@/public/*` → `public/*`)
  - ESLint + Prettier
  - PostCSS with Tailwind

### Fixed

- NextAuth token flow with custom `accessToken` in JWT callback

### Technical Debt

- Menu data is hardcoded (no CMS or DB backend)
- No test coverage (Jest + Testing Library installed but unused)
- Singleton AbortController in Axios instance
- MongoDB connection closed per request in subscription route
- Token `accessToken` not refreshed on JWT rotation
- Three styling systems coexisting (Tailwind, Styled Components, SCSS)
