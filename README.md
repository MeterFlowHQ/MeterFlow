# Meterflow — Meter Reading Management System

Stack: Next.js 16 (App Router), TypeScript, Auth.js v5 (NextAuth), Prisma/PostgreSQL, Tailwind, Recharts, exceljs, bcrypt. Server actions + route handlers, RBAC-first.

## Getting started
1) Copy envs and set secrets:
```bash
cp .env.example .env
# set AUTH_SECRET and adjust DATABASE_URL if needed
```
2) Install deps:
```bash
pnpm install
```
3) Start Postgres (Docker):
```bash
docker compose up -d db
```
4) Apply schema and seed admin user:
```bash
# Run migrations
pnpm prisma generate
pnpm exec prisma migrate deploy

# Seed admin user
pnpm run seed

# Or use the automated setup script (Windows):
.\setup-db.bat
```
Default admin credentials:
- Email: `admin@meterflow.com`
- Password: `admin123` (change after first login!)

5) Run the app:
```bash
pnpm dev
```

## Project structure (key paths)
- app/api/auth/[...nextauth]: Auth.js handlers
- app/api/{users,meters,readings,analytics,export}: protected route stubs
- app/dashboard: admin + reader areas (server components)
- app/login: credential sign-in (server action)
- app/meters/[meterId]: per-meter analytics placeholder
- auth.ts: NextAuth config (30-day sessions, auto-refresh every 24h)
- prisma/schema.prisma: DB models (User, Meter, MeterReading + NextAuth tables)
- lib/prisma.ts: Prisma singleton
- lib/uploads/local.ts: local file storage helper (S3-ready swap)
- middleware.ts: RBAC gate for dashboards/APIs

## Next steps
- Flesh out server actions + data validation with zod
- Implement meter assignment enforcement and analytics aggregations
- Build Excel export and upload pipeline (cloud-ready abstraction)
