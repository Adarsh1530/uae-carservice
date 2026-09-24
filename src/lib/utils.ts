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

export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('05') && cleaned.length === 10) {
    cleaned = `971${cleaned.slice(1)}`;
  }
  return cleaned;
}

export function buildAcceptWhatsAppUrl(booking: {
  fullName: string;
  phone: string;
  serviceName: string;
  referenceId: string;
  requestedDate: string;
  address?: string;
}) {
  const cleanPhone = cleanPhoneNumber(booking.phone);
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
  const cleanPhone = cleanPhoneNumber(booking.phone);

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
  const cleanNumber = cleanPhoneNumber(whatsappNumber);

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

export const buildWhatsAppLink = buildWhatsAppUrl;

export function generateLoyaltyId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `WG-VIP-${randomNum}`;
}

export function generateRedemptionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'RDM-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function buildLoyaltyWhatsAppUrl(customer: {
  fullName: string;
  phone: string;
  loyaltyId: string;
  currentStamps: number;
  stampsPerReward: number;
  rewardTitle?: string;
  cardUrl?: string;
}): string {
  const cleanPhone = cleanPhoneNumber(customer.phone);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://walessgroup.ae';
  const passUrl = customer.cardUrl || `${siteUrl}/loyalty?lookup=${customer.loyaltyId}`;

  const text = `🌟 *WALESS GROUP VIP LOYALTY PASS* 🌟

Hello ${customer.fullName},
Your official WALESS VIP Loyalty Pass is active!

💳 *Member ID:* ${customer.loyaltyId}
⭐ *Current Progress:* ${customer.currentStamps}/${customer.stampsPerReward} Stamps
🎁 *Target Reward:* ${customer.rewardTitle || '1 Free Bespoke Finish'}

📲 *Access Your Digital Pass & QR:*
${passUrl}

Present your digital pass or Member ID upon vehicle arrival at our workshop in Al Dhait South, Ras Al Khaimah to collect stamps and unlock complimentary luxury services.

Thank you for choosing WALESS GROUP!
📞 +971 7 222 868 | 🌐 walessgroup.ae`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

