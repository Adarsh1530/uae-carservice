# WHALESS GROUP — Official Production Web Application & CMS

> Premier Full-Stack Luxury Automobile Customization, Detailing & Executive Solutions Platform for **WHALESS GROUP**, Ras Al Khaimah, United Arab Emirates.

Production Domain: `https://www.walessgroup.ae`

---

## Technical Overview

- **Framework**: Next.js 14/15 (App Router, Server Actions & API Routes)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Custom Dark Mode & Neon Green Theme `#00FF66`)
- **Motion & UI**: Framer Motion, Lucide React Icons
- **Database**: PostgreSQL (Production) / SQLite (Local Zero-Config Dual Engine) via Prisma ORM
- **Authentication**: HTTP-Only Secure Cookies, Bcrypt Password Hashing, Route Guards
- **Map Provider**: Interactive Leaflet / OpenStreetMap centered on Al Dhait South, Ras Al Khaimah, UAE
- **WhatsApp Integration**: Server-generated pre-filled booking deep links (`https://wa.me/...`)

---

## Public Navigation & Architecture

- `/` — Homepage (Hero, About preview, Services grid, Featured gallery, Strengths, CTAs)
- `/about` — About Us (Company profile, Mission, Vision, Values)
- `/services` — Services Catalog (Full filterable catalog, service detail modals, booking triggers)
- `/services/[slug]` — Individual Service deep-link pages
- `/gallery` — Project Gallery (Masonry catalog, category filter tabs, full-screen lightbox image viewer)
- `/contact` — Contact & Map (Interactive Leaflet map, phone links, direct WhatsApp, booking CTAs)

---

## Admin Portal & CMS

- `/admin/login` — Hidden Administrator Login (`WALESSGROUP` / `Walessgroup@2026`)
- `/admin/dashboard` — Metric cards, recent bookings table, audit stream
- `/admin/bookings` — Full Booking Management (Search, Status Filter, View details modal, Accept Request with timestamp, Reject Request with rejection reason)
- `/admin/services` — Full CRUD for services (Create, Edit, Delete confirmation, Reorder, Image upload)
- `/admin/gallery` — Drag-and-drop gallery manager with category tags
- `/admin/media` — Reusable Media Library Manager (Upload, Search, Copy URL, Delete)
- `/admin/settings` — Global Site Settings & Contact info editor
- `/admin/profile` — Password change tool (min 12 chars required)

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Push database schema & seed initial assets
npx prisma db push
npm run db:seed

# 3. Launch local dev server
npm run dev
```

Open `http://localhost:3000` in your browser.
Admin portal available at `http://localhost:3000/admin/login`.
