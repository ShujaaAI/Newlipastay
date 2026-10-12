export interface WhatsAppLead {
  id: string;
  guest_phone: string;
  property_id: string;
  property_title: string;
  host_name: string;
  host_whatsapp: string;
  check_in_date: string;
  check_out_date: string;
  timestamp: string;
  status: 'whatsapp_opened' | 'pending_mpesa' | 'confirmed';
}

const STORAGE_KEY = 'lipastay_leads';
const GUEST_PHONE_KEY = 'lipastay_guest_phone';

export function getSavedGuestPhone(): string {
  try {
    return localStorage.getItem(GUEST_PHONE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveGuestPhone(phone: string): void {
  try {
    localStorage.setItem(GUEST_PHONE_KEY, phone.trim());
  } catch (e) {
    console.error('Failed to save guest phone to localStorage', e);
  }
}

export function getSavedLeads(): WhatsAppLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function trackWhatsAppLead(lead: Omit<WhatsAppLead, 'id' | 'timestamp' | 'status'>): WhatsAppLead {
  const newLead: WhatsAppLead = {
    ...lead,
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: 'whatsapp_opened',
  };

  try {
    const existing = getSavedLeads();
    const updated = [newLead, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (lead.guest_phone) {
      saveGuestPhone(lead.guest_phone);
    }
  } catch (e) {
    console.error('Failed to save lead to localStorage', e);
  }

  return newLead;
}
