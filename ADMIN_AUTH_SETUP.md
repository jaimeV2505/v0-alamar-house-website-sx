# ALAMAR HOUSE - Admin Authentication Setup

## Admin Credentials

- **Email:** admin@alamarhouse.com
- **Password:** 123456

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

This will install `bcryptjs` which is required for password hashing.

### 2. Seed Admin User

Run the seed script to create or update the admin user in the database:

```bash
# Using npm
npm run seed:admin

# Or directly with Node
node scripts/seed-admin.mjs
```

### 3. Environment Variables

Make sure these environment variables are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Login

1. Navigate to `/admin/login`
2. Enter email: `admin@alamarhouse.com`
3. Enter password: `123456`
4. You will be redirected to `/admin/dashboard`

## Authentication Details

- Passwords are hashed using **bcryptjs** with 10 salt rounds
- Sessions are stored in the `sessions` table with 24-hour expiration
- Admin token is stored in an HTTP-only cookie for security
- All authentication attempts are logged for debugging

## Debug Logs

Authentication logs are prefixed with `[v0]` and include:
- `[v0] LOGIN:` - Login attempt logs
- `[v0] AUTH:` - Authentication verification logs
- `[v0] SESSION:` - Session management logs
- `[v0] SEED:` - Database seeding logs

These can be viewed in the server console during development.

## Troubleshooting

If login fails:

1. Check server logs for `[v0]` prefixed messages
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set (required for auth)
3. Run the seed script again to ensure admin user exists
4. Verify email and password are correct

## Database Schema

The authentication system uses these tables:

### users
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String, Optional)
- `password_hash` (String)
- `role` (String: 'super_admin' | 'viewer')
- `is_active` (Boolean)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### sessions
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `token` (String, Unique)
- `expires_at` (Timestamp)
- `created_at` (Timestamp)
