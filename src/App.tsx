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
import { HostDashboardView } from './components/dashboard/HostDashboardView';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { FloatingWhatsAppFounder } from './components/ui/FloatingWhatsAppFounder';
import { MobileStickyCta } from './components/layout/MobileStickyCta';
import { Toast } from './components/ui/Toast';
import { PaidBooking } from './utils/mpesa';
import { HostLead } from './utils/hosts';
import { Language, translations } from './utils/i18n';
import {
  HostAccount,
  getCurrentHost,
  logoutHost,
  initializeStorage
} from './utils/hostAuth';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'for-hosts' | 'login' | 'register' | 'dashboard'>('home');
  const [currentHost, setCurrentHostState] = useState<HostAccount | null>(null);
  const [registerPrefillPhone, setRegisterPrefillPhone] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('EN');

  const t = translations[language];

  // Initialize and load host session on mount
  useEffect(() => {
    initializeStorage();
    const host = getCurrentHost();
    if (host) {
      setCurrentHostState(host);
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'SW' : 'EN'));
  };

  // Protected Route Check for /dashboard
  const navigateToDashboard = () => {
    const host = getCurrentHost();
    if (!host) {
      showToast('Please log in with your phone to access your Host Dashboard.');
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentHostState(host);
      setCurrentPage('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (target: string) => {
    if (target === 'dashboard') {
      navigateToDashboard();
    } else if (target === 'login') {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'register') {
      setCurrentPage('register');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleLogout = () => {
    logoutHost();
    setCurrentHostState(null);
    setCurrentPage('login');
    showToast('Logged out of host portal.');
  };

  const handleAuthSuccess = (host: HostAccount) => {
    setCurrentHostState(host);
    setCurrentPage('dashboard');
    showToast(`Karibu ${host.name}! Host portal authenticated with OTP 123456.`);
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

      {/* LipaStay Header with Host Name, Phone, and Logout */}
      <Header
        onNavClick={handleNavClick}
        onListPropertyClick={handleOpenHostModal}
        language={language}
        onToggleLanguage={toggleLanguage}
        currentHost={currentHost}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* VIEW 1: PROTECTED DASHBOARD (/dashboard) */}
        {currentPage === 'dashboard' && currentHost ? (
          <HostDashboardView
            currentHost={currentHost}
            onLogout={handleLogout}
            onNavigateHome={() => setCurrentPage('home')}
            onShowToast={showToast}
          />
        ) : currentPage === 'login' ? (
          /* VIEW 2: LOGIN PAGE (/login) */
          <LoginPage
            onSuccess={handleAuthSuccess}
            onNavigateToRegister={(phone) => {
              if (phone) setRegisterPrefillPhone(phone);
              setCurrentPage('register');
            }}
            onBackToHome={() => setCurrentPage('home')}
          />
        ) : currentPage === 'register' ? (
          /* VIEW 3: REGISTER PAGE (/register) */
          <RegisterPage
            onSuccess={handleAuthSuccess}
            onNavigateToLogin={() => setCurrentPage('login')}
            onBackToHome={() => setCurrentPage('home')}
            initialPhone={registerPrefillPhone}
          />
        ) : currentPage === 'for-hosts' ? (
          /* VIEW 4: FOR HOSTS LANDING */
          <ForHostsPage
            onOpenListingModal={handleOpenHostModal}
            onBackToHome={() => setCurrentPage('home')}
          />
        ) : (
          /* VIEW 5: GUEST HOME LANDING */
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

      {/* Floating WhatsApp Founder Chat Button */}
      <FloatingWhatsAppFounder label={t.founderHelp} />

      {/* Mobile Sticky CTA Bar (hidden when in dashboard/auth) */}
      {currentPage === 'home' && (
        <MobileStickyCta
          label={t.stickyMobileCta}
          onClick={handleOpenHostModal}
        />
      )}

      {/* Kenyan Trust Footer */}
      <Footer trustText={t.trustFooter} />
    </div>
  );
}
