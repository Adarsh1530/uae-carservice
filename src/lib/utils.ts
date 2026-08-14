import { db } from './db';

/**
 * Generates a unique secure booking reference ID in format WG-YYYY-000001
 */
export async function generateBookingReferenceId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `WG-${year}-`;

  // Find latest booking for current year
  const latestBooking = await db.booking.findFirst({
    where: {
      referenceId: {
        startsWith: prefix,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let nextSequence = 1;
  if (latestBooking && latestBooking.referenceId) {
    const parts = latestBooking.referenceId.split('-');
    if (parts.length === 3) {
      const lastNum = parseInt(parts[2], 10);
      if (!isNaN(lastNum)) {
        nextSequence = lastNum + 1;
      }
    }
  }

  const paddedNum = String(nextSequence).padStart(6, '0');
  const candidateRef = `${prefix}${paddedNum}`;

  // Double check uniqueness
  const exists = await db.booking.findUnique({
    where: { referenceId: candidateRef },
  });

  if (exists) {
    const randomSuffix = String(Math.floor(100000 + Math.random() * 900000));
    return `${prefix}${randomSuffix}`;
  }

  return candidateRef;
}

/**
 * Generates a WhatsApp deep link URL with pre-filled booking details
 */
export function buildWhatsAppLink(
  whatsappNumber: string,
  booking: {
    referenceId: string;
    serviceName: string;
    fullName: string;
    address: string;
    phone: string;
    requestedDate: string;
    description?: string | null;
  }
): string {
  // Clean phone number (strip spaces, +, -, etc.)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const text = `*WALESS GROUP BOOKING*

📌 *Reference ID:* ${booking.referenceId}
🏎️ *Service:* ${booking.serviceName}
👤 *Full Name:* ${booking.fullName}
📍 *Address:* ${booking.address}
📞 *Phone:* ${booking.phone}
📅 *Requested Date:* ${booking.requestedDate}
📝 *Description:* ${booking.description || 'None'}`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return 'N/A';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
