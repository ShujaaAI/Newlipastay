import React, { useState } from 'react';
import {
  Check,
  X,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface CommissionComparisonProps {
  onHostCtaClick?: () => void;
}

export const CommissionComparison: React.FC<CommissionComparisonProps> = ({
  onHostCtaClick,
}) => {
  // Interactive Calculator State for Kenyan Hosts
  const [nightlyRateKES, setNightlyRateKES] = useState<number>(6000);
  const [nightsPerMonth, setNightsPerMonth] = useState<number>(14);

  const totalMonthlyGross = nightlyRateKES * nightsPerMonth;
  // Booking.com (avg 20%, up to 30%)
  const bookingComLoss = Math.round(totalMonthlyGross * 0.20);
  // Airbnb (15.5% host-only fee)
  const airbnbLoss = Math.round(totalMonthlyGross * 0.155);
  // LipaStay Commission is KES 0
  const lipastayLoss = 0;
  const averageSaved = Math.round((bookingComLoss + airbnbLoss) / 2);

  const comparisonRows = [
    {
      feature: 'Commission Rate',
      ota: '15% – 30%',
      otaDetail: 'Booking.com: 15-30% | Airbnb: 15.5% host fee',
      lipastay: '0% Always',
      lipastayDetail: 'You keep 100% of your earnings. Zero deductions.',
      favorable: true,
    },
    {
      feature: 'Payment Payout Timing',
      ota: 'Holds funds 14 to 30 days',
      otaDetail: 'Delayed bank transfers, FX charges, bank clearance fees',
      lipastay: 'Instant M-Pesa STK',
      lipastayDetail: 'Guest pays straight into your Safaricom Till in seconds',
      favorable: true,
    },
    {
      feature: 'Customer Ownership',
      ota: 'Their customer (Locked)',
      otaDetail: 'Phone numbers hidden, messaging locked inside their app',
      lipastay: 'Your customer (wa.me)',
      lipastayDetail: 'Direct WhatsApp relationship. Repeat bookings forever.',
      favorable: true,
    },
    {
      feature: 'Arbitrary Chargebacks',
      ota: 'High Risk',
      otaDetail: 'Foreign cards dispute charges; OTAs refund without host consent',
      lipastay: 'Protected & Final',
      lipastayDetail: 'Safaricom M-Pesa transactions cannot be unilaterally reversed by third parties',
      favorable: true,
    },
    {
      feature: 'Host Pricing Freedom',
      ota: 'Penalized by algorithm',
      otaDetail: 'Forced discounts & penalties if you offer lower rates elsewhere',
      lipastay: '100% Free to Negotiate',
      lipastayDetail: 'Quote repeat guest rates, long-stay discounts, or custom packages directly',
      favorable: true,
    },
  ];

  return (
    <section id="for-hosts" className="py-16 bg-[#FFFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B35] bg-[#FFF2EC] px-3 py-1 rounded-md border border-[#FF6B35]/25">
            The Hard Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">
            Why Kenyan Hosts Are Leaving Global OTAs
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563]">
            Booking.com and Airbnb take thousands of Shillings from every single booking you host in
            Nairobi, Mombasa, or Naivasha. See what happens when you switch to LipaStay direct booking.
          </p>
        </div>

        {/* 3-Column Comparison Table */}
        <div className="bg-white rounded-3xl border border-[#EBE5DB] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-[#EBE5DB] bg-[#FDFBF7]">
                  <th className="py-5 px-6 text-sm font-bold text-[#6B7280] uppercase tracking-wider w-1/3">
                    Feature
                  </th>
                  <th className="py-5 px-6 text-sm font-bold text-rose-700 bg-rose-50/50 w-1/3 border-x border-[#EBE5DB]/70">
                    <div className="flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-600" />
                      <span>Booking.com / Airbnb</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 text-sm font-bold text-[#008440] bg-[#EAF8F0]/70 w-1/3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#00A651]" />
                      <span>LipaStay.co.ke</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE5DB]">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Feature Name */}
                    <td className="py-4.5 px-6 align-top">
                      <span className="font-bold text-[#111111] text-sm block">
                        {row.feature}
                      </span>
                    </td>

                    {/* Booking.com / Airbnb */}
                    <td className="py-4.5 px-6 align-top bg-rose-50/20 border-x border-[#EBE5DB]/70">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-rose-600">
                          <X className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>{row.ota}</span>
                        </div>
                        <p className="text-xs text-[#6B7280] leading-snug">
                          {row.otaDetail}
                        </p>
                      </div>
                    </td>

                    {/* LipaStay */}
                    <td className="py-4.5 px-6 align-top bg-[#EAF8F0]/30">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-black text-[#008440]">
                          <Check className="w-4 h-4 text-[#00A651] stroke-[3] shrink-0" />
                          <span>{row.lipastay}</span>
                        </div>
                        <p className="text-xs text-[#2A6546] font-medium leading-snug">
                          {row.lipastayDetail}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Callout */}
          <div className="p-4 sm:p-5 bg-[#FDFBF7] border-t border-[#EBE5DB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#6B7280]">
              *Data based on standard 2026 Kenyan host fees: Booking.com 15-30% commission, Airbnb 15.5% host-only fee.
            </span>
            <span className="font-semibold text-[#008440] bg-[#EAF8F0] px-3 py-1 rounded-full border border-[#00A651]/20">
              LipaStay = Zero commission ever
            </span>
          </div>
        </div>

        {/* Dynamic Kenyan Host Savings Calculator */}
        <div className="bg-gradient-to-br from-white to-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-[#EBE5DB] shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Left: Interactive Controls */}
            <div className="flex-1 space-y-6 w-full">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A651]">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Host Profit Simulator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                  Calculate Your Exact Monthly Loss on Other Platforms
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563]">
                  Drag the sliders to see what you hand over to foreign OTAs versus what you keep on LipaStay.
                </p>
              </div>

              {/* Sliders */}
              <div className="space-y-5 bg-[#FFFBF5] p-5 rounded-2xl border border-[#EBE5DB]">
                {/* Nightly Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="font-semibold text-[#111111]">Nightly Rate (KES):</span>
                    <span className="font-black text-base text-[#00A651] font-mono">
                      KES {nightlyRateKES.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2500"
                    max="30000"
                    step="500"
                    value={nightlyRateKES}
                    onChange={(e) => setNightlyRateKES(Number(e.target.value))}
                    className="w-full accent-[#00A651] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6B7280]">
                    <span>KES 2,500</span>
                    <span>KES 15,000</span>
                    <span>KES 30,000</span>
                  </div>
                </div>

                {/* Nights per month */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="font-semibold text-[#111111]">Nights Booked Per Month:</span>
                    <span className="font-black text-base text-[#111111] font-mono">
                      {nightsPerMonth} nights
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={nightsPerMonth}
                    onChange={(e) => setNightsPerMonth(Number(e.target.value))}
                    className="w-full accent-[#00A651] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#6B7280]">
                    <span>2 nights</span>
                    <span>15 nights</span>
                    <span>30 nights</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Revenue Breakdown & Savings Highlight */}
            <div className="w-full lg:w-96 bg-[#111111] text-white rounded-2xl p-6 space-y-5 shadow-lg shrink-0">
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">
                  Gross Monthly Revenue
                </span>
                <div className="text-2xl font-black text-white font-mono">
                  KES {totalMonthlyGross.toLocaleString()}
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-neutral-800 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>Booking.com Cut (avg 20%):</span>
                  <span className="font-mono font-bold text-rose-400">
                    - KES {bookingComLoss.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Airbnb Fee (15.5%):</span>
                  <span className="font-mono font-bold text-rose-400">
                    - KES {airbnbLoss.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm">
                  <span className="text-[#00A651] font-semibold">LipaStay Commission (0%):</span>
                  <span className="font-mono font-black text-[#00A651]">KES 0</span>
                </div>
              </div>

              {/* Callout Badge */}
              <div className="bg-[#00A651]/20 border border-[#00A651]/40 rounded-xl p-3.5 space-y-1">
                <div className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">
                  You Keep in Your M-Pesa
                </div>
                <div className="text-xl font-black text-[#00A651] font-mono">
                  +KES {averageSaved.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-emerald-200">/ month saved</span>
                </div>
              </div>

              <Button
                variant="mpesa"
                fullWidth
                size="md"
                onClick={onHostCtaClick}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-md"
              >
                Keep 100% — List Free Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
