# FairRoom

A room booking system with a Rust/Axum backend and React/Vite frontend.

## Live URLs

| Service  | URL |
|----------|-----|
| Frontend | https://fortunate-recreation-production.up.railway.app |
| Backend  | https://fairroom-production.up.railway.app |

## Frontend: Next Steps

### 1. Implement Auth

Add `register` and `login` functions to `src/api/fairroomApi.ts`:

```ts
async register(payload: { full_name: string; email: string; password: string }) {
  const { data } = await client.post("/auth/register", payload);
  return data; // { token, user }
},

async login(payload: { email: string; password: string }) {
  const { data } = await client.post("/auth/login", payload);
  return data; // { token, user }
},
```

After a successful login or register, store the token:

```ts
localStorage.setItem("fairroom.authToken", data.token);
```

The `authHeaders()` helper in `fairroomApi.ts` already reads from that key, so all existing authenticated API calls (`/me`, `/bookings`, etc.) will work automatically.

### 2. Build Login & Register Pages

Wire the above functions to a login and register form. On success, redirect the user to the main app.

### 3. Handle Token Expiry / Logout

On logout, clear the token:

```ts
localStorage.removeItem("fairroom.authToken");
```

If the backend returns a `401`, redirect the user back to the login page.

### 4. Remove Mock Fallbacks (optional but recommended)

Every API call in `fairroomApi.ts` uses `withFallback` — if the real call fails, it silently returns mock data. Once the backend is fully integrated, consider removing the fallbacks so real errors surface instead of hiding behind fake data.

### 5. Test Against the Live Backend

Use the live backend URL above. A test account can be created via:

```bash
curl -X POST https://fairroom-production.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Test User", "email": "test@example.com", "password": "password123"}'
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login and get a token |
| GET | `/me` | Yes | Get current user |
| GET | `/me/account-status` | Yes | Get strikes and booking eligibility |
| GET | `/me/account-activities` | Yes | Get account activity log |
| GET | `/me/bookings` | Yes | Get user's bookings |
| GET | `/me/reminders` | Yes | Get user's reminders |
| GET | `/rooms` | No | List/search rooms |
| GET | `/rooms/:id` | No | Get a single room |
| GET | `/rooms/:id/bookings` | No | Get bookings for a room |
| POST | `/bookings` | Yes | Create a booking |
| GET | `/bookings/:id` | Yes | Get a booking |
| PATCH | `/bookings/:id` | Yes | Update a booking |
| POST | `/bookings/:id/cancel` | Yes | Cancel a booking |

Authenticated requests require the header:
```
Authorization: Bearer <token>
```
