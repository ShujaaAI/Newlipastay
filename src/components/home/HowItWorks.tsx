import React from 'react';
import {
  Clock,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface HowItWorksProps {
  onListClick?: () => void;
  onExploreClick?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onListClick,
  onExploreClick,
}) => {
  const steps = [
    {
      number: '01',
      title: 'Host Lists in 2 mins',
      tagline: 'Zero verification fees or listing charges',
      description:
        'Upload your photos, set your direct nightly rate in KES, and connect your Safaricom Buy Goods Till Number. Your calendar is live instantly.',
      icon: Clock,
      highlight: '0% listing fee',
      badgeColor: 'bg-[#EAF8F0] text-[#008440] border-[#00A651]/20',
      iconBg: 'bg-[#00A651] text-white',
    },
    {
      number: '02',
      title: 'Guest clicks WhatsApp Host',
      tagline: 'Instant wa.me direct chat link',
      description:
        'Guests discover your stay on LipaStay and tap one button to open WhatsApp with pre-filled check-in dates. Direct human conversation without OTA filters.',
      icon: MessageCircle,
      highlight: 'Direct guest phone number',
      badgeColor: 'bg-[#FFF2EC] text-[#FF6B35] border-[#FF6B35]/20',
      iconBg: 'bg-[#111111] text-white',
    },
    {
      number: '03',
      title: 'Guest Lipa Deposit Direct to Host’s Till',
      tagline: 'STK Push verified to Safaricom Till',
      description:
        'Guest triggers an M-Pesa STK push. The funds go directly into your host Till number. LipaStay holds zero escrow and deducts KES 0 commission.',
      icon: Smartphone,
      highlight: 'Safaricom M-Pesa Till direct',
      badgeColor: 'bg-[#EAF8F0] text-[#008440] border-[#00A651]/20',
      iconBg: 'bg-[#00A651] text-white',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-[#EBE5DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#008440] bg-[#EAF8F0] px-3 py-1 rounded-md border border-[#00A651]/25">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 3-Step Flow
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">
            How LipaStay Works
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            We removed the greedy middleman. No credit cards, no 30-day payout holds, and no
            unilateral chargebacks.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-[#FFFBF5] rounded-3xl p-6 sm:p-7 border border-[#EBE5DB] flex flex-col justify-between hover:shadow-md hover:border-[#00A651]/50 transition-all group relative"
              >
                {/* Step Number Stamp */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-3xl font-black text-[#E5DED4] font-mono">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1">
                  <div className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded border ${step.badgeColor}`}>
                    {step.highlight}
                  </div>
                  <h3 className="text-xl font-bold text-[#111111] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Footer confirmation */}
                <div className="pt-5 mt-5 border-t border-[#EBE5DB] flex items-center gap-1.5 text-xs font-semibold text-[#008440]">
                  <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0" />
                  <span>{step.tagline}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout Bar */}
        <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-black tracking-tight">
              Ready to take control of your property bookings?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400">
              Join Nairobi, Diani &amp; Naivasha hosts earning more with direct WhatsApp &amp; M-Pesa.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              variant="mpesa"
              size="md"
              onClick={onListClick}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold"
            >
              List Free Today
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onExploreClick}
              className="w-full sm:w-auto text-white border-neutral-700 hover:bg-white/10"
            >
              Browse Stays
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
