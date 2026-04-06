# Nature's Registry — Frontend

React + Vite frontend for the Carbon Credit Platform, Module 1: Auth & User Management.

## Prerequisites

- Node.js 18+
- Backend running on port 3000 (see `/backend/README.md`)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env if your backend runs on a different URL

# 3. Start development server
npm run dev
```

The app runs at **http://localhost:5173**.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## Pages

| Path | Access | Description |
|---|---|---|
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/dashboard` | Authenticated | User profile and welcome screen |
| `/*` | Public | 404 Not Found |

## Auth Flow

1. Login / Register → tokens stored in `localStorage` (`accessToken`, `refreshToken`)
2. All API requests automatically attach the access token via Axios interceptor
3. On `401` response, the interceptor silently refreshes the access token using the refresh token
4. If refresh fails, tokens are cleared and user is redirected to `/login`
5. On app load, if an access token exists, `GET /users/me` is called to rehydrate the user state

## Token Storage Note

Access and refresh tokens are stored in `localStorage` for simplicity. In production,
consider using `httpOnly` cookies for the refresh token to protect against XSS attacks.
This requires backend CORS cookie configuration and `credentials: 'include'` on requests.

## Protected Routes

```tsx
// Any authenticated user
<ProtectedRoute />

// Specific roles only
<ProtectedRoute roles={[UserRole.SUPERADMIN]} />
```

Unauthorized role → 403 page displayed inline.  
Not authenticated → redirect to `/login`.
