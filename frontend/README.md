# MSG Manager Frontend

This package hosts the React + TypeScript application for the MSG Manager user interface. The UI is currently a scaffold and will grow alongside the messaging system features delivered by the backend services in this repository.

## Tech Stack
- Vite for dev server and bundling.
- React 19 with functional components and hooks.
- Bootstrap 5 (from npm) for layout and base styling.

## Local Development
```bash
npm install
npm run dev
```
The dev server runs on `http://localhost:5173` by default. Hot Module Replacement is enabled for the `src/` directory.

If you prefer a containerized workflow, use the project-level `docker compose up frontend` target. The service bind-mounts `frontend/src/` so that edits reflect immediately.

## Project Layout
- `src/` – React entry point (`main.tsx`), root component (`App.tsx`), and global styles.
- `public/` – Static assets served as-is.
- `vite.config.ts` – Vite build configuration.

## Scripts
- `npm run dev` – Start the Vite dev server.
- `npm run build` – Type-check and create a production build.
- `npm run lint` – Run ESLint against the project.
- `npm run preview` – Preview the production build locally.
- `npm run update` – Update npm dependencies via `npm-check-updates`.