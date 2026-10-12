export interface PaidBooking {
  id: string;
  transactionCode: string;
  propertyId: string;
  propertyTitle: string;
  hostName: string;
  hostTillNumber: string;
  hostBusinessName: string;
  guestPhone: string;
  amountKES: number;
  purpose: string;
  timestamp: string;
  status: 'verified';
}

const STORAGE_KEY = 'lipastay_paid_bookings';

export function generateMpesaCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = 'QGH';
  let middle = '';
  for (let i = 0; i < 4; i++) {
    middle += Math.floor(Math.random() * 10);
  }
  let suffix = '';
  for (let i = 0; i < 3; i++) {
    suffix += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return `${prefix}${middle}${suffix}`;
}

export function savePaidBooking(booking: Omit<PaidBooking, 'id' | 'timestamp' | 'status'>): PaidBooking {
  const newBooking: PaidBooking = {
    ...booking,
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: 'verified',
  };

  try {
    const existing = getPaidBookings();
    const updated = [newBooking, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save paid booking in localStorage', e);
  }

  return newBooking;
}

export function getPaidBookings(): PaidBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
