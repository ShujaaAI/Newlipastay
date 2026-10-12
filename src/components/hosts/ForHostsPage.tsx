import React from 'react';
import {
  Gift,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Percent,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';

export interface ForHostsPageProps {
  onOpenListingModal: () => void;
  onBackToHome: () => void;
}

export const ForHostsPage: React.FC<ForHostsPageProps> = ({
  onOpenListingModal,
  onBackToHome,
}) => {
  return (
    <div className="py-12 sm:py-16 bg-[#FFFBF5] space-y-16">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-neutral-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A651]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#00A651]/20 border border-[#00A651]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400">
              <Gift className="w-4 h-4 text-[#00A651]" />
              <span>Launch Special: First 100 Hosts get 6 Months Pro Free (Worth KES 9,000)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Stop Handing 15% - 25% of Your Hard Work to Global OTAs.
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              LipaStay connects you directly to guests. Bookings happen on WhatsApp, payments land
              instantly into your Safaricom Buy Goods Till. We charge you zero commission per stay.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <Button
                variant="mpesa"
                size="lg"
                onClick={onOpenListingModal}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold py-4 text-base shadow-lg shadow-[#00A651]/30"
              >
                List Your Property Free — 0% Commission
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onBackToHome}
                className="text-white border-neutral-700 hover:bg-white/10"
              >
                Explore Guest Listings
              </Button>
            </div>

            {/* Fast Stats */}
            <div className="pt-6 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#00A651] font-mono">0%</div>
                <div className="text-neutral-400">Host Commission Cut</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">&lt; 2 Hours</div>
                <div className="text-neutral-400">Till Verification Window</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#FF6B35] font-mono">Instant</div>
                <div className="text-neutral-400">Safaricom Till Settlement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars for Kenyan Hosts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">
            Why LipaStay is Every Kenyan Host’s Best Friend
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Designed exclusively for the realities of the Kenyan short-stay ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#EBE5DB] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#00A651] flex items-center justify-center">
              <Percent className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base text-[#111111]">100% Retained Revenue</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              When a guest pays KES 10,000, you receive exactly KES 10,000 into your Till. No 15.5% Airbnb deduction.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#EBE5DB] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF2EC] text-[#FF6B35] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base text-[#111111]">Direct Guest Contact</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Every guest chats you on WhatsApp. You get their real phone number for repeat bookings and direct relationships.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#EBE5DB] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8F0] text-[#008440] flex items-center justify-center">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base text-[#111111]">Direct Safaricom Till</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Funds clear through Safaricom M-Pesa immediately. Never wait 30 days for foreign wire transfers.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#EBE5DB] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#111111] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base text-[#111111]">Zero Chargeback Fraud</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              M-Pesa payments cannot be arbitrarily cancelled or refunded behind your back by an overseas algorithm.
            </p>
          </div>
        </div>

        {/* Big Bottom CTA Banner */}
        <div className="p-8 rounded-3xl bg-white border border-[#00A651]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-black text-[#111111]">
              Ready to list your Nairobi, Diani, or Naivasha property?
            </h3>
            <p className="text-xs text-[#4B5563]">
              Takes 2 minutes to fill out the form. 6 months free Pro membership automatically applied.
            </p>
          </div>
          <Button
            variant="mpesa"
            size="lg"
            onClick={onOpenListingModal}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold"
          >
            Claim Free Host Slot Now
          </Button>
        </div>
      </section>
    </div>
  );
};
