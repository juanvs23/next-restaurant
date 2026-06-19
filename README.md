# GERÍCHT — Fine Dining Restaurant

A full-stack restaurant web application built with **Next.js 14 (App Router)**, **MongoDB**, and **NextAuth**. Showcases menu, reservations, gallery, and chef profiles for GERÍCHT, a fine dining restaurant in Berlin.

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14.2.3 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | TailwindCSS + Styled Components + SCSS |
| **State** | Redux Toolkit |
| **Database** | MongoDB + Mongoose 8 |
| **Auth** | NextAuth v4 (Google OAuth) |
| **Validation** | Zod 3 |
| **HTTP** | Axios |
| **Animation** | Framer Motion, Swiper |
| **Testing** | Jest + Testing Library |

## Architecture

```
src/
├── app/               # Next.js App Router (routes, API handlers, layouts)
├── components/        # UI components (common + feature-based)
├── database/          # MongoDB connection + Mongoose models
├── libs/              # Redux store, Axios instance, React providers
├── schemas/           # Zod validation schemas
├── types/             # TypeScript interfaces
├── utils/             # Utilities
├── middleware.ts      # NextAuth route protection
└── routes.ts          # Navigation routes
```

### Pages

- **Home** — Hero, About Us, Menu, Chef, Gallery, Awards, Find Us sections
- **About** — Restaurant information
- **Dashboard** — Protected admin panel (WIP)
- **404** — Custom not-found page

### API Routes

- `POST /api/suscription` — Newsletter email subscription
- `GET/POST /api/auth/[...nextauth]` — Google OAuth authentication
- Menu data served from statically defined data (file-based)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Google OAuth credentials

### Setup

```bash
# Clone and install
yarn install

# Configure environment
cp .env.example .env
# Fill in: MONGO_URI, DB_NAME, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
# NEXTAUTH_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_BASE_URL

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn test` | Run Jest tests |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXTAUTH_URL` | Yes | Application base URL |
| `NEXTAUTH_SECRET` | Yes | NextAuth encryption secret |
| `MONGO_URI` | Yes | MongoDB connection string |
| `DB_NAME` | Yes | MongoDB database name |
| `NEXT_PUBLIC_BASE_URL` | Yes | Public base URL for API requests |

## Project Status

This project is under active development. See [CHANGELOG.md](./CHANGELOG.md) for version history and [docs/context.md](./docs/context.md) for detailed technical context.
