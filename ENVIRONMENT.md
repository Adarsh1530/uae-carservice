# ENVIRONMENT VARIABLE REFERENCE

| Variable Name | Description | Example / Recommended Value | Required |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical Production Site URL | `https://www.walessgroup.ae` | Yes |
| `DATABASE_URL` | Prisma DB connection string | `file:./dev.db` (local) or `postgresql://...` (prod) | Yes |
| `AUTH_SECRET` | Secret key for JWT session encryption | Minimum 32 characters | Yes |
| `WHATSAPP_NUMBER_1` | Primary WhatsApp Booking Line | `+971543072733` | Yes |
| `WHATSAPP_NUMBER_2` | Secondary WhatsApp Line | `+971543072711` | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Cloud Storage URL | `https://xyz.supabase.co` | Optional |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `ey...` | Optional |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | `ey...` | Optional |
