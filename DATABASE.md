# DATABASE SCHEMA & MIGRATION GUIDE

## Schema Summary

The database uses Prisma ORM and includes 7 tables:

1. **`admins`**: Stores admin user credentials, hashed passwords, roles.
2. **`site_settings`**: Global site settings (Company name, phone, address, map lat/lng, SEO).
3. **`services`**: Services catalog (Name, slug, short desc, detailed desc, main image, features JSON array, price info, display order, active flag).
4. **`gallery_images`**: Portfolio images (Title, image URL, category, display order).
5. **`bookings`**: Client bookings (Server reference ID `WG-2026-XXXXXX`, customer name, address, phone, requested date, status `PENDING`/`ACCEPTED`/`REJECTED`, rejection reason, timestamps).
6. **`media`**: Uploaded media assets metadata.
7. **`audit_logs`**: Admin audit trail logs.

## Migrations & Commands

```bash
# Push schema changes locally or to production DB
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed initial data and copy assets from Desktop
npm run db:seed
```
