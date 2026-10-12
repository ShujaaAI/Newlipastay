import React, { useState, useEffect } from 'react';
import {
  Eye,
  MessageCircle,
  ShieldCheck,
  Coins,
  TrendingUp,
  Zap,
  Edit2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Gift,
  Clock,
  Smartphone
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';
import { getPaidBookings, PaidBooking } from '../../utils/mpesa';
import { getSavedLeads, WhatsAppLead } from '../../utils/tracking';
import { getSavedHostLeads, HostLead } from '../../utils/hosts';
import { mockListings } from '../../data/listings.js';

export interface HostDashboardProps {
  hostName: string;
  hostPhone: string;
  onAddNewListing: () => void;
  onBackToGuestView: () => void;
  onShowToast: (message: string) => void;
}

interface ListingState {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  isActive: boolean;
  isBoosted: boolean;
  image: string;
  views: number;
  clicks: number;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({
  hostName,
  hostPhone,
  onAddNewListing,
  onBackToGuestView,
  onShowToast,
}) => {
  // Local state for host's properties
  const [listings, setListings] = useState<ListingState[]>([]);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(3500);
  const [editTitle, setEditTitle] = useState<string>('');

  // Leads and Paid Bookings from localStorage
  const [leads, setLeads] = useState<WhatsAppLead[]>([]);
  const [paidBookings, setPaidBookings] = useState<PaidBooking[]>([]);

  // Load data from localStorage
  useEffect(() => {
    // 1. Initial listings for host
    const initialListings: ListingState[] = [
      {
        id: 'host-prop-01',
        title: 'Modern Minimalist Studio with Rooftop Pool',
        location: 'Kilimani, Nairobi',
        pricePerNight: 3500,
        isActive: true,
        isBoosted: true,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        views: 894,
        clicks: 28,
      },
      {
        id: 'host-prop-02',
        title: 'Executive 2-Bedroom Haven near Yaya',
        location: 'Kilimani, Nairobi',
        pricePerNight: 6500,
        isActive: true,
        isBoosted: false,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        views: 526,
        clicks: 14,
      },
    ];

    // Check newly onboarded leads from Step 6 in localStorage
    const savedLeads = getSavedHostLeads();
    if (savedLeads.length > 0) {
      const formattedSaved: ListingState[] = savedLeads.map((hl) => ({
        id: hl.id,
        title: `${hl.propertyType} in ${hl.location}`,
        location: hl.location,
        pricePerNight: hl.pricePerNightKES,
        isActive: true,
        isBoosted: false,
        image: hl.photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        views: 64,
        clicks: 3,
      }));
      setListings([...initialListings, ...formattedSaved]);
    } else {
      setListings(initialListings);
    }

    // 2. Load guest tracking leads
    const trackingLeads = getSavedLeads();
    if (trackingLeads.length > 0) {
      setLeads(trackingLeads);
    } else {
      // Seed default Kenyan leads for realistic experience
      setLeads([
        {
          id: 'lead-01',
          guest_phone: '254722998811',
          property_id: 'host-prop-01',
          property_title: 'Modern Minimalist Studio with Rooftop Pool',
          host_name: 'Brian Mwangi',
          host_whatsapp: '254712345001',
          check_in_date: '2026-10-18',
          check_out_date: '2026-10-21',
          timestamp: '2026-10-12T02:15:00Z',
          status: 'confirmed',
        },
        {
          id: 'lead-02',
          guest_phone: '254733445566',
          property_id: 'host-prop-01',
          property_title: 'Modern Minimalist Studio with Rooftop Pool',
          host_name: 'Brian Mwangi',
          host_whatsapp: '254712345001',
          check_in_date: '2026-10-24',
          check_out_date: '2026-10-26',
          timestamp: '2026-10-11T18:40:00Z',
          status: 'whatsapp_opened',
        },
      ]);
    }

    // 3. Load paid M-Pesa STK bookings
    const bookings = getPaidBookings();
    if (bookings.length > 0) {
      setPaidBookings(bookings);
    } else {
      setPaidBookings([
        {
          id: 'bk-01',
          transactionCode: 'QGH8491XP2',
          propertyId: 'host-prop-01',
          propertyTitle: 'Modern Minimalist Studio with Rooftop Pool',
          hostName: 'Brian Mwangi',
          hostTillNumber: '5849201',
          hostBusinessName: 'BRIAN HOMES',
          guestPhone: '254722998811',
          amountKES: 7000,
          purpose: 'Deposit for Modern Minimalist Studio',
          timestamp: '2026-10-12T02:20:00Z',
          status: 'verified',
        },
      ]);
    }
  }, []);

  // Compute Stats
  const totalViews = listings.reduce((acc, curr) => acc + curr.views, 0);
  const totalClicks = listings.reduce((acc, curr) => acc + curr.clicks, 0) + leads.length;
  const totalVerifiedBookings = paidBookings.length;
  const totalEarningsKES = paidBookings.reduce((acc, curr) => acc + curr.amountKES, 0) + 14000;
  const otaLossSavedKES = Math.round(totalEarningsKES * 0.18);

  // Toggle Active/Inactive
  const handleToggleActive = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l))
    );
    const target = listings.find((l) => l.id === id);
    onShowToast(`Listing status updated to ${!target?.isActive ? 'Active' : 'Paused'}.`);
  };

  // Boost Listing (KES 300)
  const handleBoostListing = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isBoosted: true, views: l.views + 150 } : l))
    );
    onShowToast('Boost activated! KES 300 charged via Safaricom Till. Listing featured for 7 days.');
  };

  // Save Edit
  const handleSaveEdit = (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              title: editTitle || l.title,
              pricePerNight: editPrice || l.pricePerNight,
            }
          : l
      )
    );
    setEditingListingId(null);
    onShowToast('Listing details updated successfully.');
  };

  // Cycle Lead Status
  const handleToggleLeadStatus = (leadId: string) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const nextStatus =
            lead.status === 'whatsapp_opened'
              ? 'pending_mpesa'
              : lead.status === 'pending_mpesa'
              ? 'confirmed'
              : 'whatsapp_opened';
          return { ...lead, status: nextStatus };
        }
        return lead;
      })
    );
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFFBF5] space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Host Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE5DB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00A651] text-white flex items-center justify-center font-black text-2xl shadow-sm">
              {hostName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#111111]">
                  {hostName}&apos;s Portal
                </h1>
                <MpesaTillVerifiedBadge size="sm" />
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Host Line: <span className="font-mono font-medium text-[#111111]">{hostPhone}</span> · Direct Till 5849201
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="mpesa"
              size="sm"
              onClick={onAddNewListing}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Listing
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToGuestView}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              View Guest Feed
            </Button>
          </div>
        </div>

        {/* 1. STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Views */}
          <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span className="font-semibold uppercase tracking-wider">Total Views</span>
              <Eye className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#008440] font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18% this week</span>
            </p>
          </div>

          {/* WhatsApp Clicks */}
          <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span className="font-semibold uppercase tracking-wider">WhatsApp Inquiries</span>
              <MessageCircle className="w-4 h-4 text-[#00A651]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">
              {totalClicks}
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Direct guest conversations via wa.me
            </p>
          </div>

          {/* M-Pesa Verifications */}
          <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span className="font-semibold uppercase tracking-wider">M-Pesa Verified</span>
              <ShieldCheck className="w-4 h-4 text-[#00A651]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#008440] font-mono">
              {totalVerifiedBookings}
            </div>
            <p className="text-[11px] text-[#008440] font-medium">
              100% STK settlements verified
            </p>
          </div>

          {/* Direct Earnings */}
          <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span className="font-semibold uppercase tracking-wider">Till Direct Earnings</span>
              <Coins className="w-4 h-4 text-[#00A651]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">
              KES {totalEarningsKES.toLocaleString()}
            </div>
            <p className="text-[11px] text-[#008440] font-semibold">
              Saved KES {otaLossSavedKES.toLocaleString()} vs OTA cut
            </p>
          </div>
        </div>

        {/* 2. UPGRADE CARD */}
        <div className="bg-gradient-to-r from-[#111111] via-[#1c1c1c] to-[#262626] text-white rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-neutral-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B35] bg-[#FF6B35]/20 px-3 py-1 rounded-full border border-[#FF6B35]/30">
              <Gift className="w-3.5 h-3.5" />
              <span>Subscription Model · 0% Commission</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              You are on Free Plan · 1 listing
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Upgrade to <span className="text-white font-semibold">Pro (KES 1,500/month)</span> for
              unlimited properties, verified badge priority ranking, and automated WhatsApp STK push reminders.
            </p>
          </div>
          <Button
            variant="warm"
            size="md"
            onClick={() => onShowToast('Pro Plan billing: KES 1,500/mo prompt triggered to Till 5849201.')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 font-bold shadow-md"
          >
            Upgrade to Pro · KES 1,500/mo
          </Button>
        </div>

        {/* 3. MY LISTINGS SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DB] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-[#111111]">My Properties</h2>
              <p className="text-xs text-[#6B7280]">
                Control nightly KES pricing, toggle availability, and boost visibility.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#008440] bg-[#EAF8F0] px-3 py-1 rounded-full border border-[#00A651]/20 w-fit">
              {listings.filter((l) => l.isActive).length} Active Listings
            </span>
          </div>

          <div className="divide-y divide-[#EBE5DB]">
            {listings.map((prop) => (
              <div
                key={prop.id}
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#EBE5DB]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-[#111111]">
                        {prop.title}
                      </h4>
                      {prop.isBoosted && (
                        <span className="text-[10px] font-bold text-[#FF6B35] bg-[#FFF2EC] px-2 py-0.5 rounded border border-[#FF6B35]/30">
                          ⚡ Boosted
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#6B7280] flex items-center gap-2">
                      <span>{prop.location}</span>
                      <span>·</span>
                      <span className="font-mono font-bold text-[#008440]">
                        KES {prop.pricePerNight.toLocaleString()} / night
                      </span>
                    </div>
                    <div className="text-[11px] text-[#4B5563]">
                      Views: <span className="font-bold">{prop.views}</span> · WhatsApp Clicks:{' '}
                      <span className="font-bold">{prop.clicks}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Form or Action Buttons */}
                {editingListingId === prop.id ? (
                  <div className="flex items-center gap-2 bg-[#FFFBF5] p-2 rounded-2xl border border-[#EBE5DB]">
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-24 p-2 bg-white border border-[#EBE5DB] rounded-xl text-xs font-mono font-bold"
                      placeholder="KES"
                    />
                    <Button variant="mpesa" size="sm" onClick={() => handleSaveEdit(prop.id)}>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingListingId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Active/Inactive Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(prop.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                        prop.isActive
                          ? 'bg-[#EAF8F0] text-[#008440] border-[#00A651]/30'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-300'
                      }`}
                    >
                      {prop.isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>

                    {/* Boost (KES 300) */}
                    <button
                      type="button"
                      onClick={() => handleBoostListing(prop.id)}
                      disabled={prop.isBoosted}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
                        prop.isBoosted
                          ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                          : 'bg-[#FFF2EC] text-[#FF6B35] border-[#FF6B35]/30 hover:bg-[#FF6B35] hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{prop.isBoosted ? 'Boost Active' : 'Boost (KES 300)'}</span>
                    </button>

                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingListingId(prop.id);
                        setEditPrice(prop.pricePerNight);
                        setEditTitle(prop.title);
                      }}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. LEADS INBOX */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DB] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#111111]">Leads Inbox</h2>
              <p className="text-xs text-[#6B7280]">
                Guests who opened WhatsApp wa.me links to inquire about your stays.
              </p>
            </div>
            <span className="text-xs font-mono text-[#008440] bg-[#EAF8F0] px-2.5 py-1 rounded-md">
              {leads.length} Leads Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EBE5DB] text-[#6B7280] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Guest Phone</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Desired Dates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE5DB]">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#111111]">
                      {lead.guest_phone || '2547XXXXXXXX'}
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-[#4B5563]">
                      {lead.property_title}
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280]">
                      {lead.check_in_date} → {lead.check_out_date}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleLeadStatus(lead.id)}
                        title="Click to cycle status"
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          lead.status === 'confirmed'
                            ? 'bg-[#00A651] text-white'
                            : lead.status === 'pending_mpesa'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                        }`}
                      >
                        {lead.status === 'confirmed'
                          ? 'Paid Verified ✓'
                          : lead.status === 'pending_mpesa'
                          ? 'Awaiting M-Pesa'
                          : 'New Inquired'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const num = lead.guest_phone.replace(/[^0-9]/g, '');
                          window.open(
                            `https://wa.me/${num}?text=Habari!+Following+up+on+your+LipaStay+booking+for+${encodeURIComponent(
                              lead.property_title
                            )}`,
                            '_blank'
                          );
                        }}
                        className="inline-flex items-center gap-1 text-[#00A651] hover:underline font-semibold"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-[#00A651]" />
                        <span>Chat</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. M-PESA PAYMENTS LIST */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DB] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#111111]">M-Pesa STK Settlements</h2>
              <p className="text-xs text-[#6B7280]">
                Verified transactions sent straight to your Safaricom Buy Goods Till.
              </p>
            </div>
            <MpesaTillVerifiedBadge size="sm" />
          </div>

          <div className="space-y-3">
            {paidBookings.map((bk) => (
              <div
                key={bk.id}
                className="p-4 rounded-2xl bg-[#FFFBF5] border border-[#EBE5DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#008440]">
                      {bk.transactionCode}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Verified
                    </span>
                  </div>
                  <div className="text-[#4B5563]">
                    {bk.purpose || bk.propertyTitle} · Payer: <span className="font-mono font-medium">{bk.guestPhone}</span>
                  </div>
                  <div className="text-[10px] text-[#6B7280] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(bk.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-base font-black text-[#111111] font-mono">
                    KES {bk.amountKES.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#008440] font-semibold">
                    Settled to Till {bk.hostTillNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
