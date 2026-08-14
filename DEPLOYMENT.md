# WHALESS GROUP — Step-by-Step Production Deployment Guide

Production Domain: `https://www.walessgroup.ae`

---

## 1. Database Provisioning (PostgreSQL)

1. Provision a PostgreSQL database instance on Supabase, Neon, or AWS RDS.
2. Retrieve the PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/whalessgroup?schema=public&sslmode=require"
   ```

## 2. Vercel Deployment

1. Push your repository to GitHub.
2. Connect your GitHub repository to Vercel.
3. In Vercel Project Settings -> Environment Variables, configure:
   - `NEXT_PUBLIC_SITE_URL` = `https://www.walessgroup.ae`
   - `DATABASE_URL` = `postgresql://...`
   - `AUTH_SECRET` = `[Random 64-char string]`
   - `WHATSAPP_NUMBER_1` = `+971543072733`
   - `WHATSAPP_NUMBER_2` = `+971543072711`
4. Set Build Command: `npx prisma db push && npm run db:seed && next build`
5. Deploy.

## 3. Domain & DNS Configuration (.ae Registrar)

To enforce the primary canonical URL `https://www.walessgroup.ae`:

1. **Add Domains to Vercel**:
   - `www.walessgroup.ae` (Primary Canonical)
   - `walessgroup.ae` (Redirects to `www.walessgroup.ae`)

2. **Configure DNS Records at your `.ae` Registrar**:
   - `CNAME` for `www` -> `cname.vercel-dns.com`
   - `A` record for `@` (root) -> `76.76.21.21`

3. **HTTPS & Redirect Verification**:
   Vercel automatically provisions SSL certificates for both domain variants.
   - `http://walessgroup.ae` -> `https://www.walessgroup.ae`
   - `http://www.walessgroup.ae` -> `https://www.walessgroup.ae`
   - `https://walessgroup.ae` -> `https://www.walessgroup.ae`

> [!CAUTION]
> If email DNS records (MX, SPF, DKIM, DMARC) exist for `walessgroup.ae`, DO NOT touch or delete them during domain setup.
