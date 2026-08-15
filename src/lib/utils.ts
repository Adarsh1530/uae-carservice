import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: Date | string | number): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function generateBookingReferenceId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `WG-${year}-${randomNum}`;
}

export function buildAcceptWhatsAppUrl(booking: {
  fullName: string;
  phone: string;
  serviceName: string;
  referenceId: string;
  requestedDate: string;
  address?: string;
}) {
  const cleanPhone = booking.phone.replace(/[^0-9]/g, '');
  const location = booking.address && booking.address.trim()
    ? booking.address.trim()
    : 'AL DHAIT SOUTH, RAS AL KHAIMAH, UAE';

  const text = `Hello ${booking.fullName},
Your booking request for ${booking.serviceName} has been accepted successfully.
Reference Number: ${booking.referenceId}
Date: ${booking.requestedDate}
Time: 10:00 AM
Location: ${location}

Thank you for choosing WALESS GROUP. We look forward to serving you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildRejectWhatsAppUrl(booking: {
  fullName: string;
  phone: string;
  serviceName: string;
  referenceId: string;
  requestedDate: string;
}) {
  const cleanPhone = booking.phone.replace(/[^0-9]/g, '');

  const text = `Hello ${booking.fullName},
We regret to inform you that your booking request for ${booking.serviceName} and ${booking.referenceId} on ${booking.requestedDate} at 10:00 AM has been rejected.

Please contact us or submit another booking request for an alternative date and time.

Thank you for understanding.
WALESS GROUP`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  booking: {
    referenceId: string;
    serviceName: string;
    fullName: string;
    phone: string;
    address: string;
    requestedDate: string;
    description?: string | null;
  }
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const text = `*WALESS GROUP BOOKING*

📌 *Reference ID:* ${booking.referenceId}
🏎️ *Service:* ${booking.serviceName}
👤 *Client Name:* ${booking.fullName}
📞 *Phone:* ${booking.phone}
📍 *Address:* ${booking.address}
📅 *Preferred Date:* ${booking.requestedDate}
${booking.description ? `📝 *Notes:* ${booking.description}` : ''}

Please confirm my appointment. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
