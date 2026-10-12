import React, { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Home, Globe, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';
import { Language, translations } from '../../utils/i18n';
import { HostAccount, displayKenyanPhone } from '../../utils/hostAuth';

export interface HeaderProps {
  onNavClick?: (target: string) => void;
  onListPropertyClick?: () => void;
  language?: Language;
  onToggleLanguage?: () => void;
  currentHost?: HostAccount | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavClick,
  onListPropertyClick,
  language = 'EN',
  onToggleLanguage,
  currentHost = null,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navLinks = [
    { label: t.howItWorks, href: '#how-it-works', id: 'how-it-works' },
    { label: t.listings, href: '#listings', id: 'listings' },
    { label: t.forHosts, href: '#for-hosts', id: 'for-hosts' },
    {
      label: currentHost ? 'My Dashboard' : t.hostDashboard,
      href: '#dashboard',
      id: 'dashboard',
    },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavClick) {
      onNavClick(id);
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (onListPropertyClick) {
      onListPropertyClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBF5]/95 backdrop-blur-md border-b border-[#EBE5DB]">
      {/* Top micro-banner for mobile trust */}
      <div className="bg-[#00A651] text-white py-1 px-4 text-center text-[11px] font-semibold tracking-wide flex items-center justify-center gap-1.5 sm:hidden">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Kenya&apos;s 0% Commission Direct Booking · No Escrow</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Logo: Lipa (Green), Stay (Black) */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#00A651] flex items-center justify-center text-white shadow-sm shadow-[#00A651]/25 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl tracking-tight text-[#00A651]">
                Lipa
              </span>
              <span className="font-extrabold text-2xl tracking-tight text-[#111111]">
                Stay
              </span>
              <span className="ml-1 text-[10px] font-mono font-bold text-[#008440] bg-[#EAF8F0] px-1.5 py-0.5 rounded border border-[#00A651]/20">
                .co.ke
              </span>
            </div>
            <span className="text-[10px] text-[#6B7280] font-medium tracking-tight -mt-0.5 hidden sm:inline">
              Direct Host Bookings via M-Pesa
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
              className={`text-sm font-medium transition-colors relative py-1 hover:underline underline-offset-4 decoration-[#00A651] ${
                link.id === 'dashboard' && currentHost
                  ? 'text-[#008440] font-bold'
                  : 'text-[#4B5563] hover:text-[#00A651]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <MpesaTillVerifiedBadge size="sm" />
        </nav>

        {/* Desktop CTA & Language Switcher & Host Info */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle (EN / Kiswahili) */}
          <button
            type="button"
            onClick={onToggleLanguage}
            title="Switch Language: English / Kiswahili"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EBE5DB] bg-white hover:border-[#111111] text-xs font-bold text-[#111111] transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#00A651]" />
            <span>{language === 'EN' ? '🇰🇪 SW' : '🇬🇧 EN'}</span>
          </button>

          {/* Logged in Host info in Header */}
          {currentHost ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleLinkClick('dashboard')}
                className="flex items-center gap-2 bg-[#FFFBF5] border border-[#00A651]/40 rounded-xl px-3 py-1.5 text-left hover:border-[#00A651] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#00A651] text-white flex items-center justify-center font-bold text-xs">
                  {currentHost.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#111111] line-clamp-1">{currentHost.name}</div>
                  <div className="text-[10px] text-[#6B7280] font-mono">
                    {displayKenyanPhone(currentHost.phone)}
                  </div>
                </div>
              </button>

              <button
                onClick={onLogout}
                title="Logout from Host Portal"
                className="p-2 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleLinkClick('login')}
                className="text-xs font-bold px-3.5"
              >
                Host Login
              </Button>
              <Button
                variant="mpesa"
                size="md"
                onClick={handleCtaClick}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t.listFree}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Switcher */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-lg border border-[#EBE5DB] bg-white text-xs font-bold text-[#111111]"
          >
            {language === 'EN' ? 'SW' : 'EN'}
          </button>

          {currentHost ? (
            <button
              onClick={() => handleLinkClick('dashboard')}
              className="text-xs px-2.5 py-1 bg-[#EAF8F0] border border-[#00A651]/30 rounded-lg font-bold text-[#008440]"
            >
              Portal
            </button>
          ) : (
            <Button
              variant="mpesa"
              size="sm"
              onClick={handleCtaClick}
              className="text-xs px-3"
            >
              List Free
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-[#EBE5DB] text-[#111111] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EBE5DB] bg-[#FFFBF5] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {currentHost && (
            <div className="p-3 bg-white rounded-2xl border border-[#EBE5DB] flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#111111]">{currentHost.name}</div>
                <div className="font-mono text-xs text-[#6B7280]">{displayKenyanPhone(currentHost.phone)}</div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout?.();
                }}
                className="text-xs text-rose-600 font-bold px-2 py-1 bg-rose-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}

          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id);
                }}
                className="text-base font-semibold text-[#111111] hover:text-[#00A651] py-2.5 px-3 rounded-lg hover:bg-[#EAF8F0]/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-[#EBE5DB] space-y-2">
            {!currentHost ? (
              <>
                <Button
                  variant="mpesa"
                  size="lg"
                  fullWidth
                  onClick={handleCtaClick}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t.listFree}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => handleLinkClick('login')}
                >
                  Host Login
                </Button>
              </>
            ) : (
              <Button
                variant="mpesa"
                size="lg"
                fullWidth
                onClick={() => handleLinkClick('dashboard')}
                leftIcon={<LayoutDashboard className="w-4 h-4" />}
              >
                Open Host Dashboard
              </Button>
            )}
            <p className="text-center text-xs text-[#6B7280] mt-2.5">
              0% booking commission · Direct guest inquiries
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
