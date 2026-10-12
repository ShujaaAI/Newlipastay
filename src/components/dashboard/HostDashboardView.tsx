import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Eye,
  MessageCircle,
  ShieldCheck,
  Coins,
  TrendingUp,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Smartphone,
  ExternalLink,
  Edit2,
  Gift,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';
import { ListingItem } from '../listings/ListingCard';
import { AddPropertyModal } from './AddPropertyModal';
import {
  HostAccount,
  getStoredListings,
  updateListing,
  updateCurrentHost,
  logoutHost,
  formatKenyanPhone,
  displayKenyanPhone
} from '../../utils/hostAuth';
import { getSavedLeads, WhatsAppLead } from '../../utils/tracking';
import { getPaidBookings, PaidBooking } from '../../utils/mpesa';

export interface HostDashboardViewProps {
  currentHost: HostAccount;
  onLogout: () => void;
  onNavigateHome: () => void;
  onShowToast: (msg: string) => void;
}

type TabType = 'overview' | 'listings' | 'inquiries' | 'payments' | 'account';

export const HostDashboardView: React.FC<HostDashboardViewProps> = ({
  currentHost,
  onLogout,
  onNavigateHome,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Data states
  const [hostListings, setHostListings] = useState<ListingItem[]>([]);
  const [hostLeads, setHostLeads] = useState<WhatsAppLead[]>([]);
  const [hostPayments, setHostPayments] = useState<PaidBooking[]>([]);

  // Account editing form
  const [accountName, setAccountName] = useState(currentHost.name);
  const [accountTill, setAccountTill] = useState(currentHost.tillNumber);
  const [accountBusiness, setAccountBusiness] = useState(currentHost.businessName || '');
  const [isProMember, setIsProMember] = useState(currentHost.isPro ?? true);
  const [tillVerified, setTillVerified] = useState(currentHost.tillVerified);

  // Inline listing edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(4500);

  // Pro Upgrade STK Modal State
  const [isUpgradingPro, setIsUpgradingPro] = useState(false);

  const loadHostData = () => {
    const allListings = getStoredListings();
    const normalizedHostPhone = formatKenyanPhone(currentHost.phone);

    // Filter listings belonging to this host
    const myProps = allListings.filter(
      (item) => formatKenyanPhone(item.whatsapp_number) === normalizedHostPhone
    );
    setHostListings(myProps);

    // Filter leads belonging to this host
    const allLeads = getSavedLeads();
    const myLeads = allLeads.filter(
      (lead) => formatKenyanPhone(lead.host_whatsapp) === normalizedHostPhone
    );
    setHostLeads(myLeads);

    // Filter payments belonging to this host
    const allPayments = getPaidBookings();
    const myPayments = allPayments.filter(
      (p) => p.hostTillNumber === currentHost.tillNumber || formatKenyanPhone(p.hostName) === normalizedHostPhone
    );
    setHostPayments(myPayments);
  };

  useEffect(() => {
    loadHostData();
  }, [currentHost]);

  // Toggle active status for host listing
  const handleToggleActive = (id: string, currentVal: boolean) => {
    updateListing(id, { self_check_in: !currentVal });
    setHostListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, self_check_in: !currentVal } : item))
    );
    onShowToast(`Listing status updated.`);
  };

  // Boost listing
  const handleBoost = (id: string) => {
    onShowToast('Boost activated! KES 300 charged via Till. Listing boosted to top of search for 7 days.');
  };

  // Save inline edit
  const handleSavePriceEdit = (id: string) => {
    updateListing(id, { price_per_night: editPrice });
    setHostListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price_per_night: editPrice } : item))
    );
    setEditingId(null);
    onShowToast('Nightly rate updated successfully.');
  };

  // Save account form
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentHost({
      name: accountName.trim(),
      tillNumber: accountTill.trim(),
      businessName: accountBusiness.trim(),
    });
    onShowToast('Account settings saved.');
  };

  // Trigger Mock STK Push for Pro Upgrade
  const handleTriggerProSTK = () => {
    setIsUpgradingPro(true);
    setTimeout(() => {
      setIsUpgradingPro(false);
      setIsProMember(true);
      updateCurrentHost({ isPro: true });
      onShowToast('Payment received! Upgraded to Pro Plan (KES 1,500/mo) with unlimited listings.');
    }, 2500);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'listings', label: 'My Listings', icon: Home, count: hostListings.length },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, count: hostLeads.length },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: hostPayments.length },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col md:flex-row">
      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentHost={currentHost}
        onPropertyAdded={(newListing) => {
          setHostListings((prev) => [newListing, ...prev]);
          onShowToast(`Property "${newListing.title}" added to your live listings!`);
        }}
      />

      {/* MOBILE TOP BAR */}
      <div className="md:hidden bg-white border-b border-[#EBE5DB] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl border border-[#EBE5DB] text-[#111111]"
            aria-label="Open sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-extrabold text-lg text-[#111111]">
            Lipa<span className="text-[#00A651]">Stay</span> Host
          </span>
        </div>

        {/* Status Badge */}
        {tillVerified ? (
          <span className="text-[11px] font-bold text-[#008440] bg-[#EAF8F0] px-2.5 py-1 rounded-full border border-[#00A651]/30">
            ✓ Till {currentHost.tillNumber}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
            Verification Pending
          </span>
        )}
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#EBE5DB] flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand & Host Identity */}
          <div className="space-y-3 pb-4 border-b border-[#EBE5DB]">
            <div className="flex items-center justify-between">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00A651] text-white flex items-center justify-center font-black text-sm">
                  LS
                </div>
                <div className="flex items-baseline">
                  <span className="font-extrabold text-lg text-[#00A651]">Lipa</span>
                  <span className="font-extrabold text-lg text-[#111111]">Stay</span>
                </div>
              </a>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 text-[#6B7280]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Host Profile Box */}
            <div className="bg-[#FFFBF5] rounded-2xl p-3 border border-[#EBE5DB] space-y-1">
              <div className="font-bold text-xs text-[#111111] truncate">{currentHost.name}</div>
              <div className="font-mono text-[11px] text-[#6B7280]">{displayKenyanPhone(currentHost.phone)}</div>
              <div className="text-[10px] text-[#008440] font-semibold">
                Till: {currentHost.tillNumber} {tillVerified ? '✓ Verified' : '· Pending'}
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111111] hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00A651]' : 'text-[#6B7280]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? 'bg-[#00A651] text-white' : 'bg-neutral-200 text-[#111111]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-[#EBE5DB] space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#4B5563] hover:text-[#111111] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#00A651]" />
            <span>Browse Guest Feed</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl">
        {/* DESKTOP TOP BAR */}
        <div className="hidden md:flex items-center justify-between bg-white rounded-3xl p-5 border border-[#EBE5DB] shadow-xs">
          <div>
            <h1 className="text-xl font-black text-[#111111]">
              Welcome back, {currentHost.name} 👋
            </h1>
            <p className="text-xs text-[#6B7280]">
              Managing direct bookings for Till <span className="font-mono font-bold text-[#111111]">{currentHost.tillNumber}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Bar Verification Status Badge */}
            {tillVerified ? (
              <div className="flex items-center gap-1.5 bg-[#EAF8F0] border border-[#00A651]/30 text-[#008440] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                <span>✓ Till Verified - {currentHost.tillNumber}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Till Verification Pending</span>
              </div>
            )}

            <Button
              variant="mpesa"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="font-bold shadow-xs"
            >
              Add Property
            </Button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Views */}
              <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold uppercase tracking-wider">Views</span>
                  <Eye className="w-4 h-4 text-[#FF6B35]" />
                </div>
                <div className="text-3xl font-black text-[#111111] font-mono">1,240</div>
                <p className="text-[11px] text-[#008440] font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+24% this week</span>
                </p>
              </div>

              {/* WhatsApp Clicks */}
              <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold uppercase tracking-wider">WhatsApp Clicks</span>
                  <MessageCircle className="w-4 h-4 text-[#00A651]" />
                </div>
                <div className="text-3xl font-black text-[#111111] font-mono">89</div>
                <p className="text-[11px] text-[#6B7280]">
                  Direct wa.me inquiries
                </p>
              </div>

              {/* M-Pesa Verified */}
              <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold uppercase tracking-wider">M-Pesa Verified</span>
                  <ShieldCheck className="w-4 h-4 text-[#00A651]" />
                </div>
                <div className="text-3xl font-black text-[#008440] font-mono">12</div>
                <p className="text-[11px] text-[#008440] font-medium">
                  Direct Till deposits
                </p>
              </div>

              {/* Earnings */}
              <div className="bg-white rounded-2xl p-5 border border-[#EBE5DB] shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="font-bold uppercase tracking-wider">Earnings</span>
                  <Coins className="w-4 h-4 text-[#00A651]" />
                </div>
                <div className="text-3xl font-black text-[#111111] font-mono">
                  KES 45,000
                </div>
                <p className="text-[11px] text-[#008440] font-bold">
                  Direct to Till (KES 0 middleman cut)
                </p>
              </div>
            </div>

            {/* Quick Actions & Recent Inquiries List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Inquiries List */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EBE5DB] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-[#111111]">Recent Guest Inquiries</h3>
                    <p className="text-xs text-[#6B7280]">Guests currently awaiting responses on WhatsApp.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs font-bold text-[#00A651] hover:underline"
                  >
                    View All ({hostLeads.length})
                  </button>
                </div>

                <div className="divide-y divide-[#EBE5DB]">
                  {hostLeads.length > 0 ? (
                    hostLeads.slice(0, 4).map((lead) => (
                      <div key={lead.id} className="py-3.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs font-mono text-[#111111]">
                              {displayKenyanPhone(lead.guest_phone)}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                lead.status === 'confirmed'
                                  ? 'bg-[#00A651] text-white'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {lead.status === 'confirmed' ? 'Paid ✓' : 'Inquired'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4B5563] truncate">
                            {lead.property_title} ({lead.check_in_date} → {lead.check_out_date})
                          </p>
                        </div>

                        <Button
                          variant="mpesa"
                          size="sm"
                          onClick={() => {
                            const num = formatKenyanPhone(lead.guest_phone);
                            window.open(
                              `https://wa.me/${num}?text=Habari!+Following+up+on+your+LipaStay+booking+for+${encodeURIComponent(
                                lead.property_title
                              )}`,
                              '_blank'
                            );
                          }}
                          leftIcon={<MessageCircle className="w-3.5 h-3.5" />}
                          className="shrink-0 text-xs px-3"
                        >
                          Chat
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-[#6B7280]">
                      No guest inquiries yet. Inquiries will populate here as guests click wa.me links!
                    </div>
                  )}
                </div>
              </div>

              {/* Host Perks / Pro Banner */}
              <div className="bg-[#111111] text-white rounded-3xl p-6 border border-neutral-800 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <Badge variant="warm" size="sm">0% Commission Model</Badge>
                  <h3 className="font-bold text-lg text-white">Save Thousands Monthly</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    On Airbnb, KES 45,000 in bookings loses <strong className="text-rose-400">KES 6,975</strong> to host fees. On LipaStay, you keep the entire amount in your Safaricom Till.
                  </p>
                </div>

                <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Till Number:</span>
                    <span className="font-mono font-bold text-white">{currentHost.tillNumber}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Plan:</span>
                    <span className="font-bold text-emerald-400">{isProMember ? 'Pro Plan (Active)' : 'Free Plan'}</span>
                  </div>
                </div>

                <Button
                  variant="warm"
                  fullWidth
                  size="md"
                  onClick={() => setActiveTab('account')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Manage Account &amp; Plan
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  My Properties ({hostListings.length})
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Filtered strictly by your host phone: <strong className="font-mono text-[#111111]">{displayKenyanPhone(currentHost.phone)}</strong>
                </p>
              </div>

              <Button
                variant="mpesa"
                size="md"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="font-bold shadow-sm"
              >
                + Add Property
              </Button>
            </div>

            {hostListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hostListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-3xl border border-[#EBE5DB] overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#00A651]/50 transition-all"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative aspect-[16/9] w-full bg-neutral-100 overflow-hidden">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <MpesaTillVerifiedBadge size="sm" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                              listing.self_check_in !== false
                                ? 'bg-[#00A651] text-white'
                                : 'bg-neutral-800 text-white'
                            }`}
                          >
                            {listing.self_check_in !== false ? 'Active' : 'Paused'}
                          </span>
                        </div>
                      </div>

                      {/* Info Body */}
                      <div className="p-5 space-y-2">
                        <div className="text-xs text-[#6B7280] font-medium">{listing.location}</div>
                        <h4 className="font-bold text-base text-[#111111] line-clamp-1">
                          {listing.title}
                        </h4>

                        {/* Inline Edit Price or Price Display */}
                        {editingId === listing.id ? (
                          <div className="pt-2 flex items-center gap-2">
                            <span className="text-xs font-bold text-[#6B7280]">KES:</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-24 p-1.5 border border-[#00A651] rounded-lg text-xs font-mono font-bold"
                            />
                            <Button variant="mpesa" size="sm" onClick={() => handleSavePriceEdit(listing.id)}>
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="pt-1 flex items-center justify-between">
                            <div className="text-sm font-black font-mono text-[#111111]">
                              KES {listing.price_per_night.toLocaleString()}{' '}
                              <span className="text-xs font-normal text-[#6B7280]">/ night</span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingId(listing.id);
                                setEditPrice(listing.price_per_night);
                              }}
                              className="text-xs text-[#00A651] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit Price</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-[#FFFBF5] border-t border-[#EBE5DB] flex items-center justify-between gap-2">
                      {/* Active/Inactive Toggle */}
                      <button
                        onClick={() => handleToggleActive(listing.id, listing.self_check_in !== false)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors flex items-center gap-1.5 ${
                          listing.self_check_in !== false
                            ? 'bg-white border-[#EBE5DB] text-[#111111] hover:border-black'
                            : 'bg-[#EAF8F0] border-[#00A651] text-[#008440]'
                        }`}
                      >
                        {listing.self_check_in !== false ? 'Pause Listing' : 'Activate'}
                      </button>

                      {/* Boost Button (KES 300) */}
                      <Button
                        variant="warm"
                        size="sm"
                        onClick={() => handleBoost(listing.id)}
                        leftIcon={<Zap className="w-3.5 h-3.5" />}
                        className="text-xs font-bold px-3"
                      >
                        Boost (KES 300)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EBE5DB] space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#00A651] flex items-center justify-center mx-auto">
                  <Home className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-[#111111]">No Properties Found Yet</h3>
                  <p className="text-xs text-[#6B7280]">
                    You haven&apos;t added any stays for phone {displayKenyanPhone(currentHost.phone)} yet.
                  </p>
                </div>
                <Button
                  variant="mpesa"
                  size="md"
                  onClick={() => setIsAddModalOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Your First Property
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  WhatsApp Leads &amp; Inquiries ({hostLeads.length})
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Guests who clicked WhatsApp direct buttons for your properties.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EBE5DB] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-[#FFFBF5] border-b border-[#EBE5DB] text-[10px] uppercase font-bold text-[#6B7280]">
                      <th className="py-3.5 px-5">Guest Phone</th>
                      <th className="py-3.5 px-5">Property Title</th>
                      <th className="py-3.5 px-5">Dates Desired</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE5DB]">
                    {hostLeads.length > 0 ? (
                      hostLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-5 font-mono font-bold text-[#111111]">
                            {displayKenyanPhone(lead.guest_phone)}
                          </td>
                          <td className="py-4 px-5 max-w-[220px] truncate text-[#4B5563]">
                            {lead.property_title}
                          </td>
                          <td className="py-4 px-5 text-[#6B7280]">
                            {lead.check_in_date} → {lead.check_out_date}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                lead.status === 'confirmed'
                                  ? 'bg-[#00A651] text-white'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {lead.status === 'confirmed' ? 'Paid Verified ✓' : 'New Inquired'}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Button
                              variant="mpesa"
                              size="sm"
                              onClick={() => {
                                const num = formatKenyanPhone(lead.guest_phone);
                                window.open(
                                  `https://wa.me/${num}?text=Habari!+Following+up+on+your+LipaStay+booking+for+${encodeURIComponent(
                                    lead.property_title
                                  )}`,
                                  '_blank'
                                );
                              }}
                              leftIcon={<MessageCircle className="w-3.5 h-3.5" />}
                              className="text-xs px-3"
                            >
                              Chat on WhatsApp
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-xs text-[#6B7280]">
                          No inquiries received yet. When guests tap WhatsApp, they will appear here!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#111111]">
                  M-Pesa Settlements ({hostPayments.length})
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Verified direct transactions sent to host Till {currentHost.tillNumber}.
                </p>
              </div>
              <MpesaTillVerifiedBadge size="sm" />
            </div>

            <div className="bg-white rounded-3xl border border-[#EBE5DB] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[620px]">
                  <thead>
                    <tr className="bg-[#FFFBF5] border-b border-[#EBE5DB] text-[10px] uppercase font-bold text-[#6B7280]">
                      <th className="py-3.5 px-5">Transaction Code</th>
                      <th className="py-3.5 px-5">Amount</th>
                      <th className="py-3.5 px-5">Payer Phone</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE5DB]">
                    {hostPayments.length > 0 ? (
                      hostPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-4 px-5 font-mono font-black text-[#008440]">
                            {p.transactionCode}
                          </td>
                          <td className="py-4 px-5 font-mono font-bold text-[#111111]">
                            KES {p.amountKES.toLocaleString()}
                          </td>
                          <td className="py-4 px-5 font-mono text-[#6B7280]">
                            {p.guestPhone}
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-[10px] font-bold bg-[#EAF8F0] text-[#008440] px-2.5 py-1 rounded-full border border-[#00A651]/30">
                              ✓ Verified
                            </span>
                          </td>
                          <td className="py-4 px-5 text-[#6B7280]">
                            {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-xs text-[#6B7280]">
                          No direct M-Pesa STK deposits recorded yet. Deposits settle directly into Till {currentHost.tillNumber}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACCOUNT */}
        {activeTab === 'account' && (
          <div className="space-y-8 animate-in fade-in duration-200 max-w-2xl">
            <div>
              <h2 className="text-xl font-black text-[#111111]">Host Account &amp; Plan</h2>
              <p className="text-xs text-[#6B7280]">
                Edit your profile, Till information, and subscription level.
              </p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveAccount} className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE5DB] shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#111111]">Host Details</h3>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Phone (WhatsApp)
                </label>
                <input
                  type="text"
                  disabled
                  value={displayKenyanPhone(currentHost.phone)}
                  className="w-full px-3.5 py-2.5 bg-neutral-100 border border-[#EBE5DB] rounded-xl text-sm font-mono font-semibold text-[#6B7280]"
                />
                <p className="text-[10px] text-[#6B7280]">Phone is your primary login credential.</p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  M-Pesa Buy Goods Till Number
                </label>
                <input
                  type="text"
                  required
                  value={accountTill}
                  onChange={(e) => setAccountTill(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Business / Brand Name
                </label>
                <input
                  type="text"
                  value={accountBusiness}
                  onChange={(e) => setAccountBusiness(e.target.value)}
                  placeholder="e.g. BRIAN HOMES"
                  className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>

              <Button type="submit" variant="mpesa" size="md">
                Save Account Changes
              </Button>
            </form>

            {/* Plan & Upgrade Section */}
            <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-7 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#FF6B35]">LipaStay Subscription</div>
                  <h3 className="text-lg font-black text-white">
                    {isProMember ? 'Pro Plan Member' : 'Free Plan (1 Listing)'}
                  </h3>
                </div>
                <span className="text-xs font-bold bg-[#00A651] text-white px-2.5 py-1 rounded-full">
                  0% Commission Always
                </span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                We never take 15-25% from your bookings. Pro membership gives you unlimited properties, verified badge search boosting, and automated WhatsApp STK push receipts.
              </p>

              {!isProMember ? (
                <Button
                  variant="warm"
                  fullWidth
                  size="lg"
                  disabled={isUpgradingPro}
                  onClick={handleTriggerProSTK}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-md"
                >
                  {isUpgradingPro ? 'Sending STK Push to Phone...' : 'Upgrade to Pro · KES 1,500/mo (STK Push)'}
                </Button>
              ) : (
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                  <span>Pro Active: Unlimited listings enabled with 0% booking fees.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
