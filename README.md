# PCSENSEI

PCSENSEI is a full-stack web application for planning PC upgrades. It helps users discover compatible components, create upgrade plans, and save builds. The platform provides a public client, authenticated user features, and an admin area for managing components and builds.

This repository contains a university project for the AWT course.

## Project Summary

- **Client:** React (Vite), React Router, Tailwind CSS
- **API:** Express 5 with Mongoose (MongoDB)
- **Authentication:** JWT-based sessions, bcrypt password hashing
- **Tooling:** Nodemon, Vite, ESLint, PostCSS

## AI Features

PCSENSEI includes an AI-assisted "AI Build" feature that calls the Gemini API to suggest components and configurations. The integration requires a Gemini API key via the `GEMINI_API_KEY` environment variable. Do not commit real API keys to source control; use `.env` locally and keep `.env.example` in the repo with a placeholder value.


## Folder Structure

```
.
├─ public/                      # static assets served by Vite
├─ server/                      # Express API
│  ├─ controllers/              # request handlers (auth, builds, components, admin)
│  │  ├─ adminController.js
│  │  ├─ authController.js
│  │  ├─ buildController.js
│  │  └─ componentController.js
│  ├─ middleware/               # Express middleware (auth, error handling)
│  │  ├─ auth.js
│  │  └─ errorHandler.js
│  ├─ models/                   # server-side Mongoose models (Build.js)
│  ├─ routes/                   # Express route definitions (admin, auth, builds, components)
│  └─ index.js                  # express app entry (server startup)
├─ src/                         # React app
│  ├─ api/                      # client-side API wrappers (admin, auth, builds, components, client.js)
│  ├─ assets/
│  ├─ components/               # UI components + layout
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ common/Reveal.jsx
│  │  └─ layout/(Navbar,Footer,Logo)
│  ├─ hooks/                    # custom React hooks (useAuth, useBuilds, useComponents, etc.)
│  ├─ lib/                      # client-side helpers (mongodb connection wrappers for server code)
│  ├─ models/                   # shared models used by client (Build, Component, User)
│  ├─ pages/                    # route pages (client and admin folders)
│  ├─ scripts/                  # utility scripts (seed.js)
│  └─ utils/                    # helper utilities (formatters.js)
├─ README.md                    # this file
├─ package.json
├─ vite.config.js
└─ vercel.json
```

Notes:
- Server code lives in `server/` and is a standalone Express API.
- React client lives in `src/` and is built with Vite.

## Environment Variables

Create a `.env.local` (client) and `.env` (server) as required. Minimum variables:

```
MONGODB_URI=mongodb://127.0.0.1:27017/pcsensei
CLIENT_URL=http://localhost:5173
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

## Run Locally (Development)

1. Install dependencies

```bash
npm install
```

2. Start the server (from project root)

```bash
npm run server
```

This runs the Express API on `http://localhost:5000` by default.

3. Start the client (in a separate terminal)

```bash
npm run dev
```

Client runs at `http://localhost:5173`.

4. Quickstart (both client + server)

```bash
npm run dev:all
```

## Scripts (package.json)

- `dev` — start Vite dev server for client
- `build` — build client for production
- `preview` — preview the production build
- `lint` — run ESLint
- `server` — start Express API with nodemon
- `dev:all` — run both server and client concurrently

## API Endpoints (High Level)

- `POST /api/auth` — login/register endpoints
- `GET /api/components` — list and filter components
- `GET /api/builds` — retrieve saved builds
- `POST /api/builds` — create/save builds (authenticated)
- `GET /api/admin/*` — admin-only routes (requires admin role)

Refer to route files in `server/routes/` for exact endpoints and request/response shapes.

## Seed Data

If you need sample data, run the seed script at `src/scripts/seed.js`. Review it and update DB connection as necessary.

## Deployment / Live Preview

- Frontend hosting: Vercel - the client is deployed at https://pc-sensei.vercel.app/
- Backend hosting: Render - the API is hosted and reachable at https://www.pcsensei.pr1nce.tech/

- The repo includes `vercel.json` for Vercel deployments; review environment variables before deploying your own instances.

Live preview links:

- https://pc-sensei.vercel.app/  (frontend)
- https://www.pcsensei.pr1nce.tech/  (backend/preview)

Note: both domains serve the same deployed site. The frontend is hosted on Vercel and the backend/API is hosted on Render. Both links currently point to the full site (two domains for the same deployment).

## Author

**Prince Makhansa**

- GitHub: [@PrinceMakhansa](https://github.com/PrinceMakhansa)
- Email: [princemakhansa@gmail.com](mailto:princemakhansa@gmail.com)

