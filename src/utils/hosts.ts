export interface HostLead {
  id: string;
  hostNumber: number;
  hostName: string;
  phone: string;
  tillNumber: string;
  location: string;
  propertyType: string;
  pricePerNightKES: number;
  photos: string[];
  agreeTillMatchesId: boolean;
  createdAt: string;
  status: 'pending_verification' | 'verified';
}

const STORAGE_KEY = 'lipastay_hosts_leads';

export function getSavedHostLeads(): HostLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// TODO: Connect to Firebase / Sheets
export async function syncLeadToGoogleSheet(lead: HostLead): Promise<boolean> {
  console.log('[LipaStay API] // TODO: Connect to Firebase / Sheets. Syncing host lead:', lead);
  // Placeholder network request simulation
  try {
    // When backend / Firebase is provisioned:
    // await fetch('/api/hosts/lead', { method: 'POST', body: JSON.stringify(lead) });
    return true;
  } catch (err) {
    console.warn('Sheets sync error:', err);
    return false;
  }
}

export function saveHostLead(lead: Omit<HostLead, 'id' | 'hostNumber' | 'createdAt' | 'status'>): HostLead {
  const existing = getSavedHostLeads();
  // Sequential host number starting at #42 for authentic Kenyan momentum
  const hostNumber = 42 + existing.length;

  const newLead: HostLead = {
    ...lead,
    id: `host_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    hostNumber,
    createdAt: new Date().toISOString(),
    status: 'pending_verification',
  };

  try {
    const updated = [newLead, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save host lead to localStorage', e);
  }

  // Fire async background sync placeholder
  syncLeadToGoogleSheet(newLead);

  return newLead;
}
