import { mockListings } from '../data/listings.js';
import { ListingItem } from '../components/listings/ListingCard';
import { WhatsAppLead } from './tracking';

export interface HostAccount {
  id: string;
  name: string;
  phone: string; // Standardized Kenyan format e.g. "254712345001"
  tillNumber: string;
  tillVerified: boolean;
  businessName?: string;
  isPro?: boolean;
  createdAt: string;
}

const STORAGE_HOSTS = 'lipastay_hosts';
const STORAGE_CURRENT_HOST = 'lipastay_current_host';
const STORAGE_LISTINGS = 'lipastay_listings';
const STORAGE_LEADS = 'lipastay_leads';

// Normalize any Kenyan phone input into 254XXXXXXXXX
export function formatKenyanPhone(input: string): string {
  let cleaned = input.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.length === 9) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

// Format display phone: +254 712 345 001
export function displayKenyanPhone(phone: string): string {
  const norm = formatKenyanPhone(phone);
  if (norm.length === 12) {
    return `+${norm.slice(0, 3)} ${norm.slice(3, 6)} ${norm.slice(6, 9)} ${norm.slice(9)}`;
  }
  return phone;
}

// Seed default hosts and listings if localStorage is empty
export function initializeStorage(): void {
  try {
    // 1. Hosts
    if (!localStorage.getItem(STORAGE_HOSTS)) {
      const defaultHosts: HostAccount[] = [
        {
          id: 'host_brian_01',
          name: 'Brian Mwangi',
          phone: '254712345001',
          tillNumber: '5849201',
          tillVerified: true,
          businessName: 'BRIAN KILIMANI STAYS',
          isPro: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'host_faith_02',
          name: 'Faith Chebet',
          phone: '254722345002',
          tillNumber: '5912408',
          tillVerified: true,
          businessName: 'FAITH WESTLANDS STAYS',
          isPro: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'host_kevin_03',
          name: 'Kevin Omondi',
          phone: '254733345003',
          tillNumber: '4892110',
          tillVerified: false,
          businessName: 'KEVIN JUNCTION STAYS',
          isPro: false,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_HOSTS, JSON.stringify(defaultHosts));
    }

    // 2. Listings
    if (!localStorage.getItem(STORAGE_LISTINGS)) {
      localStorage.setItem(STORAGE_LISTINGS, JSON.stringify(mockListings));
    }

    // 3. Leads
    if (!localStorage.getItem(STORAGE_LEADS)) {
      const defaultLeads: WhatsAppLead[] = [
        {
          id: 'lead-seed-01',
          guest_phone: '254721998877',
          property_id: 'lipa-01',
          property_title: 'Modern Minimalist Studio with Rooftop Pool',
          host_name: 'Brian Mwangi',
          host_whatsapp: '254712345001',
          check_in_date: '2026-10-18',
          check_out_date: '2026-10-21',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'confirmed',
        },
        {
          id: 'lead-seed-02',
          guest_phone: '254733112233',
          property_id: 'lipa-01',
          property_title: 'Modern Minimalist Studio with Rooftop Pool',
          host_name: 'Brian Mwangi',
          host_whatsapp: '254712345001',
          check_in_date: '2026-10-25',
          check_out_date: '2026-10-27',
          timestamp: new Date(Date.now() - 3600000 * 14).toISOString(),
          status: 'pending_mpesa',
        },
        {
          id: 'lead-seed-03',
          guest_phone: '254711445566',
          property_id: 'lipa-02',
          property_title: 'Westlands Skyline 2-Bedroom Luxury Suite',
          host_name: 'Faith Chebet',
          host_whatsapp: '254722345002',
          check_in_date: '2026-11-01',
          check_out_date: '2026-11-04',
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          status: 'whatsapp_opened',
        },
      ];
      localStorage.setItem(STORAGE_LEADS, JSON.stringify(defaultLeads));
    }
  } catch (err) {
    console.error('Storage initialization failed:', err);
  }
}

export function getCurrentHost(): HostAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_HOST);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentHost(host: HostAccount | null): void {
  try {
    if (host) {
      localStorage.setItem(STORAGE_CURRENT_HOST, JSON.stringify(host));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_HOST);
    }
  } catch (e) {
    console.error('Failed to set current host in localStorage', e);
  }
}

export function getAllHosts(): HostAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_HOSTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function findHostByPhone(phone: string): HostAccount | undefined {
  const norm = formatKenyanPhone(phone);
  const hosts = getAllHosts();
  return hosts.find((h) => formatKenyanPhone(h.phone) === norm);
}

export function saveHost(host: HostAccount): void {
  try {
    const hosts = getAllHosts();
    const existingIndex = hosts.findIndex(
      (h) => formatKenyanPhone(h.phone) === formatKenyanPhone(host.phone)
    );
    let updated: HostAccount[];
    if (existingIndex >= 0) {
      updated = [...hosts];
      updated[existingIndex] = host;
    } else {
      updated = [host, ...hosts];
    }
    localStorage.setItem(STORAGE_HOSTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save host to localStorage', e);
  }
}

export function updateCurrentHost(updates: Partial<HostAccount>): HostAccount | null {
  const current = getCurrentHost();
  if (!current) return null;
  const updated: HostAccount = { ...current, ...updates };
  setCurrentHost(updated);
  saveHost(updated);
  return updated;
}

export function logoutHost(): void {
  try {
    localStorage.removeItem(STORAGE_CURRENT_HOST);
  } catch (e) {
    console.error(e);
  }
}

// Listings Storage Management
export function getStoredListings(): ListingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_LISTINGS);
    return raw ? JSON.parse(raw) : (mockListings as ListingItem[]);
  } catch {
    return mockListings as ListingItem[];
  }
}

export function saveListing(listing: ListingItem): void {
  try {
    const list = getStoredListings();
    const updated = [listing, ...list];
    localStorage.setItem(STORAGE_LISTINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save listing to localStorage', e);
  }
}

export function updateListing(id: string, updates: Partial<ListingItem>): void {
  try {
    const list = getStoredListings();
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    localStorage.setItem(STORAGE_LISTINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update listing in localStorage', e);
  }
}
