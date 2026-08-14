# ADMINISTRATOR MANUAL — WHALESS GROUP CMS

## Login URL & Default Credentials

- **Admin Login Route**: `https://www.walessgroup.ae/admin/login`
- **Initial Username**: `WALESSGROUP`
- **Initial Password**: `Walessgroup@2026`

> [!IMPORTANT]
> Change the default password immediately after first login via `/admin/profile`.

---

## Key Administrative Features

1. **Dashboard (`/admin/dashboard`)**:
   - Overview metrics for total, pending, accepted, and rejected bookings.
   - Real-time indicator for new incoming requests.

2. **Bookings Management (`/admin/bookings`)**:
   - Search by Reference ID (e.g. `WG-2026-000001`), customer name, or phone.
   - **Accept Request**: Click the green checkmark -> Status changes to `ACCEPTED` with recorded timestamp.
   - **Reject Request**: Click the red X -> Opens modal requiring a rejection reason -> Status changes to `REJECTED` and records reason.

3. **Services Catalog (`/admin/services`)**:
   - Add new services, upload custom images, edit descriptions, features, and pricing info.
   - Soft toggle active/inactive status.

4. **Gallery Management (`/admin/gallery`)**:
   - Drag-and-drop or select file uploads with category tagging (`Luxury Customization`, `Detailing & PPF`, `Performance Tuning`, `VIP Cabin`, `Corporate`).

5. **Site Settings (`/admin/settings`)**:
   - Update telephone lines (+971 7 222 868, +971 54 307 2733, +971 54 307 2711), physical address, WhatsApp numbers, map coordinates.
