# Changelog

All notable changes to the GERÍCHT restaurant project.

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
