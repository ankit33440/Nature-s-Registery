# Nature's Registry — Backend

NestJS backend for the Carbon Credit Platform, Module 1: Auth & User Management.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and fill in your PostgreSQL credentials and JWT secrets

# 3. Create the database (if it doesn't exist)
psql -U postgres -c "CREATE DATABASE natures_registry;"

# 4. Start in development mode
npm run start:dev
```

The server starts on **http://localhost:3000**.  
Swagger UI is available at **http://localhost:3000/api**.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_NAME` | Database name | `natures_registry` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | *(required)* |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | *(required)* |

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login, returns tokens |
| `POST` | `/auth/refresh` | Refresh token | Get new access token |
| `POST` | `/auth/logout` | Access token | Invalidate refresh token |
| `GET` | `/users/me` | Access token | Get current user profile |
| `GET` | `/users` | SUPERADMIN | List all users (paginated) |
| `PATCH` | `/users/:id/role` | SUPERADMIN | Update a user's role |
| `PATCH` | `/users/:id/status` | SUPERADMIN | Activate/deactivate a user |

## Token Strategy

- **Access token**: JWT, 15-minute expiry, sent as `Authorization: Bearer <token>` header
- **Refresh token**: JWT, 7-day expiry, sent in request body as `{ "refreshToken": "..." }`
- Refresh token hash is stored in the database; logout nullifies it

## Role Guard Testing

1. Register a user with `"role": "SUPERADMIN"`
2. Login to get the access token
3. Hit `GET /users` with `Authorization: Bearer <access_token>` — should return user list
4. Try with a non-SUPERADMIN token — should get `403 Forbidden`

## Notes

- `synchronize: true` is enabled for development — TypeORM will auto-create/update tables
- **Never use `synchronize: true` in production** — use TypeORM migrations instead
- All responses are wrapped: `{ data, statusCode, timestamp }`
- Errors return: `{ statusCode, message, error, timestamp, path }`
