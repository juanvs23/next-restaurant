# GERÍCHT — Restaurant Project Context

## Overview

Full-stack restaurant web application for **GERÍCHT**, a fine dining restaurant in Berlin. Built with Next.js 14 App Router, MongoDB persistence, and Google OAuth authentication. The site covers a public-facing landing page with menu display, booking system, and gallery, plus a protected admin dashboard.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14.2.3 (App Router) |
| **Language** | TypeScript 5 |
| **UI Styling** | TailwindCSS + Styled Components v6 + SCSS |
| **State Management** | Redux Toolkit + React Redux |
| **Database** | MongoDB + Mongoose 8 |
| **Auth** | NextAuth v4 (Google OAuth) |
| **Validation** | Zod 3 |
| **HTTP Client** | Axios |
| **Animation** | Framer Motion, Swiper |
| **Testing** | Jest + Testing Library (installed, no tests yet) |

## Architecture

```
src/
├── app/
│   ├── (frontend)/         # Public pages (route group)
│   │   ├── page.tsx        # Home — Hero, About, Menu, Chef, Gallery, Awards, FindUs
│   │   ├── about/page.tsx  # About page
│   │   └── [...not-found]/ # Custom 404
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route handler
│   │   ├── menu.ts              # Hardcoded menu data
│   │   ├── slidesContents.ts    # Menu sections for slider
│   │   └── suscription/route.ts # Newsletter subscription endpoint
│   ├── dashboard/           # Protected admin area (WIP placeholder)
│   ├── auth.ts              # NextAuth config (Google provider)
│   ├── globals.css          # Tailwind base styles
│   └── layout.tsx           # Root layout with Providers
├── components/
│   ├── common/              # Shared: Fonts, Logo, SponImage
│   └── frontend/            # Feature components
│       ├── components/      # Header, Footer, Booking, Modal, Sliders, etc.
│       └── pages/           # Section components for home page
├── database/
│   ├── connection.ts        # Mongoose connect/disconnect helpers
│   └── models/              # Mongoose models (Suscription)
├── libs/
│   ├── axios/createInstance.ts  # Axios instance
│   ├── store/                   # Redux store (booking + modal slices)
│   ├── providers.tsx            # SessionProvider + StoreProvider
│   └── index.ts
├── schemas/                 # Zod validation schemas
├── types/                   # TypeScript interfaces (auth, booking, menu, etc.)
├── utils/                   # Utilities (phoneRegex)
├── middleware.ts            # NextAuth middleware (protects /dashboard)
└── routes.ts                # Navigation routes configuration
```

## Key Architecture Decisions

### App Router Route Groups
- `(frontend)` groups all public pages under a shared layout (Header + Footer).
- `dashboard` has its own layout, protected by middleware.

### State Management
- Redux Toolkit for global state: modal visibility + booking form multi-step data.
- No server state library (React Query/SWR) — API calls go through Axios directly.

### Styling Strategy
Three systems coexist (intentional during migration or legacy):
1. **TailwindCSS** — utility classes in layouts and globals
2. **Styled Components** — component-level styling with SSR support via Next.js compiler
3. **SCSS** — global-styles.scss for section-level styles

### Authentication
- Google OAuth via NextAuth v4.
- JWT strategy with custom `accessToken` stored in token.
- Middleware checks `token.accessToken` for protected routes.

## Known Issues & Tech Debt

1. **`return await` on JSX** — `src/app/(frontend)/page.tsx` uses `return await (...)` which is a no-op on JSX.
2. **Singleton AbortController** — `createInstance.ts` creates one `AbortController` at module level; if aborted, all subsequent requests fail.
3. **MongoDB connection closed per request** — `closeDB()` called immediately after `save()` in subscription route, defeating connection pooling.
4. **No tests** — Jest + Testing Library installed but zero test files exist.
5. **Hardcoded menu data** — `menu.ts` has 200+ lines of inline data; no CMS or DB backend for menu items.
6. **NextAuth token refresh gap** — `accessToken` is only set on initial sign-in (when `account` exists), not on token refresh.
7. **No documentation folder** — `docs/` created now, but no architecture diagrams or SDD artifacts exist.
8. **Styled Components v6 with `resolutions` pin to v5** — `resolutions: { "styled-components": "^5" }` in package.json suggests a compatibility workaround.

## Patterns & Conventions

- **Exports**: Barrel files (`index.ts`) at each directory level.
- **Naming**: PascalCase for components, camelCase for utilities, kebab-case for SCSS.
- **Path aliases**: `@/` → `src/`, `@/public/*` → `public/*`.
- **Components**: Atomic-ish design with `pages/` (sections) and `components/` (reusable pieces).
- **Validation**: Zod schemas in `schemas/`, mirroring database models.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_URL` | Application base URL |
| `NEXTAUTH_SECRET` | NextAuth encryption secret |
| `MONGO_URI` | MongoDB connection string |
| `DB_NAME` | MongoDB database name |
| `NEXT_PUBLIC_BASE_URL` | Public base URL for Axios |

## Setup

```bash
cp .env.example .env   # Fill in your variables
yarn install           # or npm install
yarn dev               # http://localhost:3000
```

## Git

- Remote: Not configured (no origin set up yet).
- Current branch: `main` (4 commits).
- Package manager: Yarn 1.22.19 (classic).

## Local Environment Setup

### MongoDB

**Version**: MongoDB 7.0.37 LTS (tarball from fastdl.mongodb.org)
**Status**: ✅ Running on `mongodb://localhost:27017` via `mongod7` systemd service
**Service**: `mongod7.service` (enabled, running)
**Config**: `/etc/mongod7.conf` — dbPath `/var/lib/mongodb7`, log `/var/log/mongodb7/mongod.log`
**Binary**: `/usr/local/mongodb7/bin/mongod` (symlinked from `/usr/local/mongodb-linux-x86_64-ubuntu2204-7.0.37/`)
**Why 7.0 LTS**: Ubuntu 26.04 ships kernel 7.0.0, which is incompatible with MongoDB 8.0+ (tcmalloc/rseq crash, SERVER-121912). MongoDB 7.0.x runs without issues on this kernel — the kernel check was only added in 8.0. The latest patch (7.0.37) includes all bug/security fixes.
**Auth**: Disabled (development) — bindIP `127.0.0.1`
**Future upgrade**: When MongoDB 8.x releases a fix for the tcmalloc issue, upgrade is straightforward — stop `mongod7`, install new version via repo, point to same `dbPath`, run `setFeatureCompatibilityVersion`, start new service.
