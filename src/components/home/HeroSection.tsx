import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  ArrowRight,
  Search,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';

import { Language, translations } from '../../utils/i18n';

export interface HeroSectionProps {
  onFindStay?: () => void;
  onListProperty?: () => void;
  language?: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFindStay,
  onListProperty,
  language = 'EN',
}) => {
  const t = translations[language];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00A651]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 bg-[#EAF8F0] border border-[#00A651]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#008440]">
              <span className="w-2 h-2 rounded-full bg-[#00A651] animate-pulse" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight text-[#111111] leading-[1.12]">
              Airbnb &amp; Booking.com{' '}
              <span className="text-[#FF6B35] underline decoration-[#FF6B35]/40 decoration-wavy decoration-2">
                wamezidi.
              </span>{' '}
              <br className="hidden sm:inline" />
              Lipa Direct na{' '}
              <span className="text-[#00A651] relative inline-block">
                M-Pesa.
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-2 text-[#00A651]"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,8 Q50,0 100,8"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#4B5563] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.heroSub}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Button
                variant="mpesa"
                size="lg"
                onClick={onListProperty}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-md shadow-[#00A651]/25 text-sm sm:text-base font-bold"
              >
                {t.listPropertyFree}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onFindStay}
                leftIcon={<Search className="w-4 h-4 text-[#111111]" />}
                className="w-full sm:w-auto text-sm sm:text-base font-semibold"
              >
                {t.findStay}
              </Button>
            </div>

            {/* Proof and Trust Signals */}
            <div className="pt-4 border-t border-[#EBE5DB]/80 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-[#6B7280]">
              <MpesaTillVerifiedBadge size="sm" />
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                <span>Zero Escrow · No 30-Day Hold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#00A651]" />
                <span>STK Push Direct to Till</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity phone mockup showing WhatsApp + M-Pesa confirmation */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] sm:max-w-[380px] bg-[#111111] p-3 sm:p-4 rounded-[40px] shadow-2xl border-4 border-[#262626] relative">
              {/* Phone Speaker & Camera punch hole */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#111111] rounded-full z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-neutral-900 border border-neutral-700 mr-2" />
                <div className="w-10 h-1 bg-neutral-800 rounded-full" />
              </div>

              {/* Phone Screen Container */}
              <div className="bg-[#EFEAE2] rounded-[32px] overflow-hidden border border-neutral-700 relative flex flex-col min-h-[580px]">
                {/* WhatsApp Chat Top Bar */}
                <div className="bg-[#075E54] text-white pt-6 pb-2.5 px-3.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt="Host Faith"
                        className="w-9 h-9 rounded-full object-cover border border-white/20"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#075E54] absolute bottom-0 right-0" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold leading-tight">Faith (Kilimani Host)</span>
                        <ShieldCheck className="w-3 h-3 text-[#25D366]" />
                      </div>
                      <span className="text-[10px] text-emerald-200">LipaStay Verified Host</span>
                    </div>
                  </div>
                  <Badge variant="mpesa" size="sm" className="bg-[#25D366]/20 text-white border-0 text-[10px]">
                    0% Commission
                  </Badge>
                </div>

                {/* Chat Messages Body with WhatsApp background pattern */}
                <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[#EFEAE2] text-xs">
                  {/* Encrypted trust notice */}
                  <div className="bg-[#FFEECD] text-[#54656F] text-[10px] p-1.5 rounded-md text-center shadow-2xs font-medium">
                    <Lock className="w-2.5 h-2.5 inline mr-1 text-[#54656F]" />
                    Direct chat via wa.me link. Zero booking middleman fees.
                  </div>

                  {/* Message 1: Guest Inquiring */}
                  <div className="flex justify-end">
                    <div className="bg-[#E7FFDB] text-[#111B21] rounded-2xl rounded-tr-xs p-2.5 max-w-[85%] shadow-xs space-y-1">
                      <p className="font-medium">
                        Habari Faith! Saw your 2BR Penthouse on LipaStay.co.ke. Available this Fri - Sun?
                      </p>
                      <div className="text-[9px] text-[#667781] text-right">10:14 AM · Read ✓✓</div>
                    </div>
                  </div>

                  {/* Message 2: Host replying */}
                  <div className="flex justify-start">
                    <div className="bg-white text-[#111B21] rounded-2xl rounded-tl-xs p-2.5 max-w-[88%] shadow-xs space-y-1">
                      <p>
                        Habari Kevin! Ndio, it is available. Direct rate is <strong className="text-[#00A651]">KES 6,500/night</strong> (saves you KES 2,800 vs Booking.com!).
                      </p>
                      <p className="text-[11px] text-[#4B5563]">
                        Deposit is KES 6,500 via Safaricom Till. Triggering STK push to your number now.
                      </p>
                      <div className="text-[9px] text-[#667781] text-right">10:15 AM</div>
                    </div>
                  </div>

                  {/* Message 3: STK Prompt Trigger Card */}
                  <div className="bg-white rounded-xl p-2.5 border border-[#00A651]/30 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#111111]">LipaStay Direct Pay</span>
                      <span className="text-[#00A651] font-bold">M-Pesa STK</span>
                    </div>
                    <div className="bg-[#F8FAF9] p-2 rounded-lg text-[10px] space-y-1 border border-neutral-100">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Buy Goods Till:</span>
                        <span className="font-mono font-bold text-[#111111]">5829104</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Business Name:</span>
                        <span className="font-semibold text-[#111111]">FAITH KILIMANI STAYS</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Amount:</span>
                        <span className="font-black text-[#008440]">KES 6,500</span>
                      </div>
                    </div>
                  </div>

                  {/* Message 4: M-Pesa Official Confirmation SMS Overlay */}
                  <div className="bg-[#111111] text-white rounded-xl p-2.5 shadow-md border-l-4 border-[#00A651] space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A651] flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-[#00A651]" /> M-PESA CONFIRMED
                      </span>
                      <span className="text-[9px] text-neutral-400">Just now</span>
                    </div>
                    <p className="text-[10px] text-neutral-200 font-mono leading-relaxed">
                      RG82LK91XP Confirmed. Ksh6,500.00 sent to FAITH KILIMANI STAYS Till 5829104 on 12/10/26 at 10:16 AM. 0% Middleman cut.
                    </p>
                  </div>
                </div>

                {/* Bottom WhatsApp Message Bar */}
                <div className="p-2 bg-[#F0F2F5] border-t border-neutral-300 flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[11px] text-[#6B7280] flex items-center justify-between">
                    <span>Deposit paid! Sending dates...</span>
                    <span className="text-[#25D366]">✓</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#00A651] flex items-center justify-center text-white">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
