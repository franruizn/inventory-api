# inventory-api

> Production-ready REST API for inventory management — built to demonstrate clean layered architecture, JWT authentication, Zod validation, real integration tests, and multistage Docker builds.

![CI](https://github.com/franruizn/inventory-api/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)
![Node](https://img.shields.io/badge/node-20.x-green)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20.x |
| Language | TypeScript | strict mode |
| Framework | Express | 5.x |
| Validation | Zod | 4.x |
| Auth | jsonwebtoken + bcrypt | — |
| Database | MySQL | 8.0 |
| Testing | Jest + Supertest | — |
| Containerization | Docker | multistage |
| CI | GitHub Actions | — |

---

## Architecture

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

| Layer | Responsibility |
|-------|---------------|
| **Route** | Defines endpoints and chains middlewares |
| **Middleware** | Auth (JWT), validation (Zod), rate limiting, error handling |
| **Controller** | Translates HTTP → service call → HTTP response |
| **Service** | Business logic only — no HTTP, no SQL |
| **Repository** | SQL queries only — no logic, no HTTP |

```
src/
├── routes/
│   ├── inventory.routes.ts       # Protected endpoints (JWT required)
│   └── auth.routes.ts            # Public endpoints (register, login)
├── controllers/
│   ├── inventory.controller.ts
│   └── auth.controller.ts
├── services/
│   ├── inventory.service.ts      # Business logic — pagination, soft delete check
│   └── auth.service.ts           # bcrypt hashing, JWT generation
├── repositories/
│   ├── inventory.repository.ts   # SQL queries for items
│   └── auth.repository.ts        # SQL queries for users
├── schemas/
│   ├── inventory.schema.ts       # Zod schemas + inferred TypeScript types
│   └── auth.schema.ts
├── middleware/
│   ├── authenticate.ts           # JWT verification
│   ├── validate.ts               # Generic Zod validation middleware
│   ├── rateLimiter.ts            # 100 req / 15 min per IP
│   ├── errorHandler.ts           # Global error handler
│   └── notFound.ts               # 404 handler
├── errors/
│   └── AppError.ts               # Custom error class with statusCode
├── config/
│   ├── config.ts                 # Zod-validated env vars — fails fast if missing
│   └── db.ts                     # MySQL pool + waitForDb()
├── app.ts                        # Express app (no listen)
└── server.ts                     # Entry point — calls waitForDb() then listen()
migrations/
├── V001_week1.sql                # items table with soft delete
└── V002_week2.sql                # users table
tests/
├── helpers/
│   └── db.helper.ts              # clearDb(), closeDb()
└── integration/
    ├── inventory.test.ts
    └── auth.test.ts
```

> **Architecture diagram:** [Open in Excalidraw](https://excalidraw.com/) — import the diagram from `docs/architecture.excalidraw` to view the full request flow with layers, middlewares, and database interactions.

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose

### Local setup

```bash
# 1. Clone the repository
git clone https://github.com/franruizn/inventory-api.git
cd inventory-api

# 2. Copy environment files
cp .env.example .env
cp .env.test.example .env.test

# 3. Fill in your values
#    - Generate JWT_SECRET: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Start the database
docker compose up -d mysql

# 5. Install dependencies
npm install

# 6. Run migrations
mysql -h 127.0.0.1 -uroot -p your_db < migrations/V001_week1.sql
mysql -h 127.0.0.1 -uroot -p your_db < migrations/V002_week2.sql

# 7. Start dev server
npm run dev
```

The API will be available at `http://localhost:3000`.

### Environment variables

```bash
# .env.example
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=                        # min 32 characters — generate with crypto.randomBytes(32)
```

---

## API Reference

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All inventory endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via `POST /auth/login`.

### Endpoints

#### Auth

| Method | Route | Description | Auth | Status codes |
|--------|-------|-------------|------|-------------|
| `POST` | `/auth/register` | Create a new user | ❌ | 201, 400, 409 |
| `POST` | `/auth/login` | Login and receive JWT | ❌ | 200, 400, 401 |

#### Inventory

| Method | Route | Description | Auth | Status codes |
|--------|-------|-------------|------|-------------|
| `GET` | `/inventory` | List items (paginated) | ✅ | 200, 401 |
| `GET` | `/inventory/:id` | Get item by ID | ✅ | 200, 401, 404 |
| `POST` | `/inventory` | Create item | ✅ | 201, 400, 401, 409 |
| `PUT` | `/inventory/:id` | Update item | ✅ | 200, 400, 401, 404 |
| `DELETE` | `/inventory/:id` | Soft delete item | ✅ | 204, 401, 404 |

#### Utility

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `GET` | `/healthz` | Health check | ❌ |

### Query parameters — `GET /inventory`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `category` | string | — | Filter by category |

### Example request

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "pass": "SecurePassword123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "pass": "SecurePassword123"}'

# Create item
curl -X POST http://localhost:3000/api/v1/inventory \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "sku": "LAP-001", "quantity": 10, "price": 999.99, "category": "electronics"}'
```

### Error responses

```json
// 400 — Validation failed
{
  "error": "Validation failed",
  "details": {
    "sku": ["SKU must match pattern ^[A-Z0-9-]{3,20}$"],
    "quantity": ["Expected number, received string"]
  }
}

// 401 — Unauthorized
{ "error": "Invalid authorization token" }

// 404 — Not found
{ "error": "Item 99 not found" }

// 409 — Conflict
{ "error": "SKU 'LAP-001' already exists" }

// 429 — Rate limit exceeded
{ "error": "Too many requests, please try again later" }

// 500 — Internal error
{ "error": "Internal server error" }
```

---

## Testing

```bash
# Start the test database first
docker compose -f docker-compose.test.yml up -d

# Run all tests
npm test

# Run with coverage report
npm test -- --coverage
```

Tests use a **real MySQL database** — no mocks. The CI pipeline spins up a MySQL service container for each run.

Coverage target: **80% minimum** — enforced in CI.

### What's tested

| Suite | Cases |
|-------|-------|
| `auth.test.ts` | 201 on register, 409 on duplicate email, 200 on login with token, 401 on invalid credentials |
| `inventory.test.ts` | 201 on create, 409 on duplicate SKU, 404 after soft delete, 400 on invalid body, 200 list with pagination, 200 get by id, 404 non-existent, 401 without token, 401 invalid token |

---

## Docker

```bash
# Full stack (app + MySQL + phpMyAdmin)
docker compose up -d

# App only — requires external DB
docker build -t inventory-api .
docker run -p 3000:3000 --env-file .env inventory-api

# Stop without losing data
docker compose down

# Stop and remove all data
docker compose down -v
```

The Dockerfile uses a **multistage build**:
- Stage `builder`: installs all deps, compiles TypeScript → `dist/`
- Stage `production`: copies only `dist/` + production deps — no source, no devDependencies

Final image size: **~90MB**.

---

## CI/CD

GitHub Actions pipeline runs on every push and pull request:

1. `npm ci` — install dependencies
2. `npm run lint` — ESLint check
3. Run migrations against MySQL service container
4. `npm test -- --coverage` — integration tests with real DB
5. `npm run build` — TypeScript compilation

Badge reflects the latest run on `main`.

---

## Design Decisions

**Why Zod for validation instead of manual TypeScript interfaces?**
TypeScript types are erased at runtime. If a client sends `quantity: "hello"`, TypeScript won't catch it — it already compiled. Zod validates incoming data at the boundary and infers TypeScript types from the same schema. One source of truth. If you update the schema, the type updates automatically.

**Why soft delete instead of hard delete?**
Hard deletes are irreversible. Soft delete marks a record with `deleted_at` timestamp without removing it from the database. This enables audit trails, accidental deletion recovery, and consistent foreign key integrity. All queries filter `WHERE deleted_at IS NULL` — deleted records are invisible to the application but preserved in storage.

**Why separate `app.ts` from `server.ts`?**
Supertest needs to import the Express app without starting a real server. If `listen()` is in `app.ts`, every test import starts a server on a port. Separating them means tests import `app.ts` cleanly, and only `server.ts` calls `listen()`.

**Why a generic `validate` middleware?**
One middleware handles body, query, and params validation for any Zod schema. Pass the schema and target: `validate(CreateItemSchema)` or `validate(PaginationSchema, 'query')`. No duplication across routes, no inconsistent validation logic.

**Why `waitForDb()` on startup?**
Docker Compose healthchecks prevent the app container from starting before MySQL is ready, but MySQL can still take a few seconds after the healthcheck passes to accept connections. `waitForDb()` retries the connection up to 5 times with exponential backoff — this makes the startup resilient in both Docker and CI environments.

**Why JWT over sessions?**
This is a stateless REST API — sessions would require a shared store (Redis or DB) to work across multiple instances. JWT tokens are self-contained and verified locally with the secret. No shared state required, works in any horizontally scaled deployment.

**Why bcrypt with cost factor 10?**
Cost factor 10 is the standard default — it takes ~100ms to hash a password, which is negligible for a user login but makes brute force attacks computationally expensive. Lower factors are faster but weaker; higher factors are stronger but add visible latency to login.

---

## License

MIT