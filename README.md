# Gadgetory

## Overview
Gadgetory is a small product listing application with an API and a React frontend.
It provides authenticated user sync, product CRUD with image upload, and a simple
commenting system linked to products. The codebase includes an Express + TypeScript
backend (Drizzle ORM + PostgreSQL) and a Vite + React frontend that integrates
with Clerk for authentication.

## Key Features
- Product listing: create, read, update, delete products.
- Image upload for products (server-side storage under `/uploads`).
- Comment creation and deletion scoped to products.
- User sync endpoint to persist Clerk-authenticated users to the local database.
- Protected routes using Clerk (`@clerk/express`) and client-side token forwarding.
- Client-side caching and API calls via `@tanstack/react-query` and `axios`.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, DaisyUI (dev), `@clerk/clerk-react`,
  `@tanstack/react-query`, `axios`.
- Backend: Node.js, Express, TypeScript, `@clerk/express`, `multer` for uploads.
- Database: PostgreSQL accessed via Drizzle ORM (`drizzle-orm`, `drizzle-kit`).
- Authentication: Clerk (frontend and backend integrations).
- Tooling: TypeScript, ESLint, Nodemon (dev), Vite, Drizzle-kit for schema push.

## System Architecture
- Frontend → Backend → Database
  - The frontend uses Axios with an interceptor to attach Clerk tokens (see
    `frontend/src/hooks/useAuthReq.js`) and communicates with the Express API
    at the configured `VITE_API_URL`.
  - The backend exposes REST endpoints under `/api/*` and uses Clerk middleware
    to protect routes. Database access is handled via Drizzle ORM and raw SQL is
    not used directly.
- Authentication & authorization flow
  - Clerk manages user sign-in on the client. The client attaches a Bearer token
    to requests. The backend uses `@clerk/express` middleware (`requireAuth()`)
    and `getAuth(req)` to obtain the `userId` for protected operations.
- API communication pattern
  - REST over JSON. Key endpoints live under `/api/users`, `/api/products`, and
    `/api/comments`. File uploads use `multipart/form-data` to `/api/products/upload`.
- State management approach
  - Client-side caching and server state is handled with `@tanstack/react-query`.
    Mutations invalidate relevant queries (e.g., product detail cache on comment
    mutation) to keep UI state consistent.

## Architecture Diagram
```mermaid
flowchart LR
  Browser[Browser / React App]
  subgraph Frontend
    Browser -->|Axios (VITE_API_URL) + Clerk token| API[Express API]
    Browser ---|React Query| Cache[(Client cache)]
  end

  subgraph Backend
    API -->|Express routes| Controllers[Controllers]
    Controllers -->|Drizzle ORM| DB[(PostgreSQL)]
    Controllers -->|multer uploads| Uploads[/uploads (static)/]
  end

  API -. auth .-> Clerk[Clerk Auth Service]
  Cache -. invalidation .-> Browser

  style DB fill:#f9f,stroke:#333,stroke-width:1px
```

## Folder Structure
- `backend/` — Express + TypeScript server
  - `src/index.ts` — server entry and route mounting.
  - `src/config/env.ts` — environment variables loader.
  - `src/controllers/` — request handlers for users, products, comments, uploads.
  - `src/routes/` — route definitions wired to controllers.
  - `src/db/` — Drizzle schema (`schema.ts`), queries (`queries.ts`), and DB init.
  - `uploads/` — local storage for uploaded images (served statically).
- `frontend/` — React client (Vite)
  - `src/lib/` — API helpers (`axios.js`, `api.js`).
  - `src/hooks/` — custom hooks (`useAuthReq.js`, `useComment.js`, `useProducts.js`).
  - `src/components/` — UI components (product card, comment section, navbar).
  - `src/pages/` — route pages (product, create/edit, profile).

## Environment Variables
- Backend (`backend/.env`):
  - `PORT` — port server listens on (e.g., `4000`).
  - `DATABASE_URL` — Postgres connection string.
  - `NODE_ENV` — environment (development|production).
  - `FRONTEND_URL` — allowed CORS origin used by `cors` middleware.
  - `BASE_URL` — public base URL used to build public upload URLs (optional).
  - `CLERK_PUBLISHABLE_KEY` — Clerk publishable key (frontend-facing).
  - `CLERK_SECRET_KEY` — Clerk secret key for server-side verification.
- Frontend (`frontend/.env`):
  - `VITE_API_URL` — base URL for the API the frontend calls (e.g., `http://localhost:4000/api`).

## Setup & Installation
1. Install dependencies for backend and frontend.

```bash
# from repository root
cd backend
npm install

cd ../frontend
npm install
```

2. Configure environment variables in `backend/.env` and `frontend/.env`.

3. Run services locally:

```bash
# Start backend (development)
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev
```

4. (Optional) Push Drizzle schema to the database:

```bash
cd backend
npm run db:push
```

## API Overview
- `GET /api/health` — lightweight health check with service metadata.
- Users
  - `POST /api/users/sync` (protected) — upsert Clerk user record into local DB.
- Products
  - `GET /api/products` — list products (public).
  - `GET /api/products/my` (protected) — products for current user.
  - `GET /api/products/:id` — product detail including comments and user.
  - `POST /api/products` (protected) — create product.
  - `POST /api/products/upload` (protected) — upload product image (`multipart/form-data`).
  - `PUT /api/products/:id` (protected) — update product (owner only).
  - `DELETE /api/products/:id` (protected) — delete product (owner only).
- Comments
  - `POST /api/comments/:productId` (protected) — add a comment to a product.
  - `DELETE /api/comments/:commentId` (protected) — delete a comment (owner only).

All protected endpoints use Clerk middleware and expect a valid Clerk session/token.

## Security Considerations
- Authentication: Clerk handles authentication and session management. Backend
  uses `requireAuth()` and `getAuth(req)` to verify and extract `userId`.
- Authorization: Controller-level checks enforce ownership for product and
  comment updates/deletes (compare `userId` from auth to resource owner).
- Uploads: `multer` is configured with a MIME whitelist and a 5MB file size
  limit. Uploaded files are served from a local `uploads/` directory; consider
  using a dedicated object storage (S3, CDN) for production.
- Cookies & Tokens: Axios uses `withCredentials: true` and client attaches
  Bearer tokens via the auth hook — ensure HTTPS in production and secure cookie settings.

## Performance & Optimization
- Client caching and background refetching are provided by `@tanstack/react-query`.
- Database queries are executed via Drizzle ORM with relation joins where
  appropriate (`with` in queries) and ordered by creation time for predictable
  result ordering.
- File uploads are kept small (5MB limit). For scale, move uploads to a CDN
  and serve images from a public URL to reduce server load.

## Future Improvements
- Add pagination and server-side filtering for product and comment lists.
- Move uploads to object storage (S3) and serve via CDN.
- Add input validation and sanitization middleware (e.g., `express-validator`).
- Add automated tests (unit and integration) and CI pipelines.
- Add OpenAPI/Swagger documentation for the API surface.
- Harden CORS and cookie settings for production deployments.

## License
No license file is present in the repository. Add a `LICENSE` file if you
intend to publish or permit reuse under a specific license.
