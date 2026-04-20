# Fullstack Assignment

Practice task implementation with React frontend and Express backend.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, shadcn/ui, React Hook Form, Zod, Redux Toolkit, React Router, TanStack Query
- Backend: Node.js, Express, TypeScript, Sequelize, PostgreSQL, JWT, bcrypt
- Testing: Vitest + Supertest (backend), Vitest + Testing Library (frontend)

## Project Structure

- `be`: Express API server
- `fe`: React web app

## Prerequisites

- Node.js 20+
- pnpm 10+ (for frontend)
- npm (for backend scripts)
- Docker Desktop (for PostgreSQL)

## Setup Instructions

### 1) Start Database

Run PostgreSQL from Docker Compose:

1. Go to `be`
2. Run `docker compose up -d`

Default local mapping is `localhost:8080` to PostgreSQL container port `5432`.

### 2) Run Backend

1. Go to `be`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

Backend runs at `http://localhost:5000`.

Useful backend commands:

- `npm run test`
- `npm run build`

### 3) Run Frontend

1. Go to `fe`
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev`

Frontend runs at Vite default URL (usually `http://localhost:5173`).

Useful frontend commands:

- `pnpm test`
- `pnpm typecheck`
- `pnpm build`

## Implemented Features

- Authentication flow:
  - Sign up
  - Sign in
  - JWT-protected profile check (`/auth/me`)
- Route behavior:
  - `/` redirects to `/auth/signup`
  - Legacy `/signin` redirects to `/auth/login`
  - `/me` redirects to `/auth/login`
  - Successful login or signup navigates to `/dashboard`
- Dashboard UI with sidebar and user menu
- Validation with React Hook Form + Zod
- Global auth state with Redux Toolkit
- Basic test readiness with `data-testid` on key buttons:
  - `login-btn`
  - `create-btn`

## API Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (requires Bearer token)

## Assumptions And Trade-offs

- Auth session is persisted in `localStorage` for assignment simplicity.
- Password reset and social login buttons are UI-only placeholders.
- Current auth verification uses existing JWT and backend `/auth/me`; no refresh-token flow yet.
- Frontend uses manual fetch wrappers for auth APIs; TanStack Query is set up in app providers for future data-fetching expansion.
- Test coverage focuses on critical assignment smoke paths rather than exhaustive integration suites.

## Screenshots

- Frontend auth page sample: ![Frontend](docs/1-fe.png)
- Backend-related reference image: ![Backend](docs/2-be.png)

## Deployment Notes

### Why `dist` should not be committed

- `be/dist` and `fe/dist` are generated build artifacts.
- They should be produced during CI/deploy, not stored in Git.
- Backend `dist` is now ignored in `be/.gitignore`.

### Frontend deploy to Vercel

This repo already includes `fe/vercel.json` so React Router paths (for example `/dashboard`) are rewritten to `index.html` and do not return 404 on refresh.

1. Push code to GitHub.
2. In Vercel, import this repository.
3. Set project root directory to `fe`.
4. Build command: `pnpm build`.
5. Output directory: `dist`.
6. Add environment variable:

- `VITE_API_URL=https://<your-backend-domain>`

7. Deploy.

CLI alternative:

1. `cd fe`
2. `npm i -g vercel`
3. `vercel`
4. `vercel --prod`

### Backend deploy recommendation

For this Express + Sequelize API, use Render/Railway/Fly instead of Vercel (cleaner for long-running Node API and database connections).

Suggested backend settings:

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Port: provider-managed (use `PORT` env from platform)

Required environment variables:

- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USER`
- `DB_PASSWORD`

Database suggestion:

- Use managed PostgreSQL (Neon, Supabase, Railway Postgres, or Render Postgres).
