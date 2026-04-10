# PCSENSEI Project Summary

## Overview
PCSENSEI is a full-stack web app for planning PC upgrades. The frontend is a React + Vite SPA with Tailwind CSS. The backend is an Express API that uses MongoDB via Mongoose and provides authentication, component data, and build management.

## Tech Stack
- Frontend: React 19, React Router, Vite, Tailwind CSS, PostCSS
- Backend: Express 5, Mongoose, JWT auth, bcrypt, CORS, Helmet, Morgan
- Tooling: ESLint, Nodemon

## Scripts
- dev: Vite dev server
- build: Vite production build
- preview: Vite preview server
- lint: ESLint
- server: Nodemon for server/index.js

## Folder Structure
(Note: node_modules and dist are included as top-level entries but not expanded.)

.
├─ .env.local
├─ .gitignore
├─ dist/
├─ eslint.config.js
├─ index.html
├─ node_modules/
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public/
│  ├─ PCSENSEI.png
│  ├─ PCSENSEI_png_dark.png
│  ├─ favicon.svg
│  └─ icons.svg
├─ README.md
├─ server/
│  ├─ controllers/
│  │  ├─ adminController.js
│  │  ├─ authController.js
│  │  ├─ buildController.js
│  │  └─ componentController.js
│  ├─ index.js
│  ├─ middleware/
│  │  ├─ auth.js
│  │  └─ errorHandler.js
│  ├─ package-lock.json
│  ├─ routes/
│  │  ├─ admin.js
│  │  ├─ auth.js
│  │  ├─ builds.js
│  │  └─ components.js
│  └─ {routes,middleware,controllers}/
├─ src/
│  ├─ api/
│  │  ├─ admin.js
│  │  ├─ auth.js
│  │  ├─ builds.js
│  │  ├─ client.js
│  │  ├─ components.js
│  │  └─ gemini.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets/
│  │  ├─ mascot.png
│  │  └─ sensei.png
│  ├─ components/
│  │  ├─ common/
│  │  │  └─ Reveal.jsx
│  │  ├─ features/
│  │  ├─ layout/
│  │  │  ├─ Footer.jsx
│  │  │  ├─ Logo.jsx
│  │  │  └─ Navbar.jsx
│  │  ├─ ProtectedRoute.jsx
│  │  └─ ui/
│  ├─ data/
│  │  └─ mockData.js
│  ├─ hooks/
│  │  ├─ useAsyncState.js
│  │  ├─ useAuth.jsx
│  │  ├─ useBuilds.js
│  │  └─ useComponents.js
│  ├─ index.css
│  ├─ lib/
│  │  └─ mongodb.js
│  ├─ main.jsx
│  ├─ models/
│  │  ├─ Build.js
│  │  ├─ Component.js
│  │  ├─ User.js
│  │  └─ index.js
│  ├─ pages/
│  │  ├─ admin/
│  │  │  ├─ AdminLayout.jsx
│  │  │  ├─ AdminsPage.jsx
│  │  │  ├─ BuildsPage.jsx
│  │  │  ├─ ComponentsPage.jsx
│  │  │  ├─ DashboardPage.jsx
│  │  │  └─ UsersPage.jsx
│  │  └─ client/
│  │     ├─ AboutPage.jsx
│  │     ├─ AiBuildPage.jsx
│  │     ├─ AuthPage.jsx
│  │     ├─ HomePage.jsx
│  │     ├─ ManualBuilderPage.jsx
│  │     ├─ PrivacyPage.jsx
│  │     ├─ ProfilePage.jsx
│  │     ├─ TermsPage.jsx
│  │     └─ UpgradePlannerPage.jsx
│  ├─ scripts/
│  │  └─ seed.js
│  └─ utils/
│     └─ formatters.js
└─ vite.config.js

## Notes
- The README is still the default Vite template.
- The backend appears to be structured around controllers, middleware, and routes with MongoDB models for User, Build, and Component.
