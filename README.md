# PCSENSEI

PCSENSEI is a full-stack web application for planning PC upgrades. It provides a modern user-facing interface for discovering compatible components, building upgrade plans, and saving builds, backed by an Express + MongoDB API.

This is a university project for the AWT course.

## Features

- Auth flow with JWT-based sessions
- Component browsing and filtering
- Build creation and management
- Admin area for managing data
- Health check endpoint for server status

## Tech Stack

**Frontend**
- React 19
- Vite
- React Router
- Tailwind CSS + PostCSS

**Backend**
- Express 5
- MongoDB + Mongoose
- JWT auth + bcrypt
- Helmet, CORS, Morgan

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB (local instance or Atlas)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` file at the project root:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017
CLIENT_URL=http://localhost:5173
PORT=5000
```

Notes:
- `MONGODB_URI` is required by the API.
- `CLIENT_URL` controls CORS for the frontend.
- `PORT` defaults to `5000` if omitted.

### 3) Run the backend API

```bash
npm run server
```

The API will start on `http://localhost:5000`.

### 3b) Quickstart (client + server)

Run both the frontend and backend together:

```bash
npm run dev:all
```

### 4) Run the frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Project Structure

```
server/        Express API (routes, controllers, middleware)
src/           React app (pages, components, hooks, api)
public/        Static assets
```

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run server` - Start Express API with Nodemon
- `npm run dev:all` - Run client and server together

## API Routes

Base paths (see route handlers in `server/routes` for details):

- `POST /api/auth` - Authentication endpoints
- `GET /api/components` - Component catalog and filters
- `GET /api/builds` - Build management
- `GET /api/admin` - Admin-only management

## API Health Check

The API exposes a health endpoint:

```
GET /api/health
```

Returns status, timestamp, and DB connection state.

## Optional: Seed Data

If you want sample data, review the seed script at `src/scripts/seed.js` and run it after configuring your database connection.

## License

This project is for educational use as part of a university assignment.
