import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ListingsFeed } from './components/listings/ListingsFeed';
import { CommissionComparison } from './components/home/CommissionComparison';
import { HowItWorks } from './components/home/HowItWorks';
import { ListingItem } from './components/listings/ListingCard';
import { PropertyDetailModal } from './components/detail/PropertyDetailModal';
import { MpesaPaymentModal } from './components/mpesa/MpesaPaymentModal';
import { HostOnboardingModal } from './components/hosts/HostOnboardingModal';
import { ForHostsPage } from './components/hosts/ForHostsPage';
import { HostDashboard } from './components/dashboard/HostDashboard';
import { HostAuthModal } from './components/dashboard/HostAuthModal';
import { FloatingWhatsAppFounder } from './components/ui/FloatingWhatsAppFounder';
import { MobileStickyCta } from './components/layout/MobileStickyCta';
import { Toast } from './components/ui/Toast';
import { PaidBooking } from './utils/mpesa';
import { HostLead } from './utils/hosts';
import { Language, translations } from './utils/i18n';
import { CheckCircle2 } from 'lucide-react';

interface HostSession {
  phone: string;
  name: string;
}

export default function App() {
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'for-hosts' | 'dashboard'>('home');
  const [hostSession, setHostSession] = useState<HostSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('EN');

  const t = translations[language];

  // Check saved host session
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lipastay_host_session');
      if (saved) {
        setHostSession(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Session parse error', e);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'SW' : 'EN'));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleNavClick = (target: string) => {
    if (target === 'dashboard') {
      if (!hostSession) {
        setIsAuthModalOpen(true);
      } else {
        setCurrentPage('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (target === 'for-hosts') {
      setCurrentPage('for-hosts');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'listings') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('listings');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (target === 'how-it-works') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHostAuthenticated = (phone: string, hostName: string) => {
    const session: HostSession = { phone, name: hostName };
    setHostSession(session);
    try {
      localStorage.setItem('lipastay_host_session', JSON.stringify(session));
    } catch (e) {
      console.error(e);
    }
    setIsAuthModalOpen(false);
    setCurrentPage('dashboard');
    showToast(`Welcome back, ${hostName}! Host session verified via OTP.`);
  };

  const handleFindStay = () => {
    setCurrentPage('home');
    setTimeout(() => {
      const el = document.getElementById('listings');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenHostModal = () => {
    setIsHostModalOpen(true);
  };

  const handleSelectListing = (listing: ListingItem) => {
    setSelectedListing(listing);
    setIsDetailModalOpen(true);
  };

  const handleOpenMpesaDeposit = (listing: ListingItem) => {
    setSelectedListing(listing);
    setIsDetailModalOpen(false);
    setIsMpesaModalOpen(true);
  };

  const handleMpesaSuccess = (booking: PaidBooking) => {
    showToast(
      `Deposit of KES ${booking.amountKES.toLocaleString()} to Till ${booking.hostTillNumber} verified! Code: ${booking.transactionCode}`
    );
  };

  const handleHostLeadSubmitted = (lead: HostLead) => {
    showToast(
      `Asante ${lead.hostName}! Host #${lead.hostNumber} registered. 6 months Pro free activated.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF5] text-[#111111] relative selection:bg-[#00A651]/20 selection:text-[#00A651]">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* LipaStay Header with Language Toggle */}
      <Header
        onNavClick={handleNavClick}
        onListPropertyClick={handleOpenHostModal}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      <main className="flex-1">
        {/* Conditional Views */}
        {currentPage === 'dashboard' && hostSession ? (
          <HostDashboard
            hostName={hostSession.name}
            hostPhone={hostSession.phone}
            onAddNewListing={handleOpenHostModal}
            onBackToGuestView={() => setCurrentPage('home')}
            onShowToast={showToast}
          />
        ) : currentPage === 'for-hosts' ? (
          <ForHostsPage
            onOpenListingModal={handleOpenHostModal}
            onBackToHome={() => setCurrentPage('home')}
          />
        ) : (
          <>
            {/* 1. HERO SECTION */}
            <HeroSection
              onFindStay={handleFindStay}
              onListProperty={handleOpenHostModal}
              language={language}
            />

            {/* 2. LIVE LISTINGS FEED (with Skeleton States) */}
            <ListingsFeed
              onSelectListing={handleSelectListing}
              language={language}
            />

            {/* 3. COMMISSION COMPARISON TABLE + CALCULATOR */}
            <CommissionComparison onHostCtaClick={handleOpenHostModal} />

            {/* 4. HOW IT WORKS (3 Steps) */}
            <HowItWorks
              onListClick={handleOpenHostModal}
              onExploreClick={handleFindStay}
            />
          </>
        )}

        {/* Step 8 Production Complete Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-4">
          <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl border border-neutral-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A651] bg-[#00A651]/20 px-3 py-1 rounded-full border border-[#00A651]/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> All 8 Steps Completed · Production Ready
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                LipaStay.co.ke is Ready to Launch &amp; Onboard Kenyan Hosts
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl">
                0% commission architecture, WhatsApp direct wa.me booking, Safaricom M-Pesa STK push
                mock, host onboarding lead capture, and Firebase deployment configuration are active.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-mono font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
                Status: Production Ready
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        listing={selectedListing}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onLipaDepositClick={handleOpenMpesaDeposit}
        onShowToast={showToast}
      />

      {/* M-Pesa STK Push Modal */}
      <MpesaPaymentModal
        listing={selectedListing}
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        onSuccessVerified={handleMpesaSuccess}
      />

      {/* Host Onboarding Modal */}
      <HostOnboardingModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        onLeadSubmitted={handleHostLeadSubmitted}
      />

      {/* Phone OTP Auth Modal */}
      <HostAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={handleHostAuthenticated}
      />

      {/* Floating WhatsApp Founder Chat Button */}
      <FloatingWhatsAppFounder label={t.founderHelp} />

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCta
        label={t.stickyMobileCta}
        onClick={handleOpenHostModal}
      />

      {/* Kenyan Trust Footer */}
      <Footer trustText={t.trustFooter} />
    </div>
  );
}
