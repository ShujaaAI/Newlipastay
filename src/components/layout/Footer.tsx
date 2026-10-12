import React from 'react';
import { ShieldCheck, Smartphone, MessageCircle, MapPin, Heart } from 'lucide-react';

export interface FooterProps {
  trustText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  trustText = 'Built in Nairobi for Kenyan Hosts. Payments direct to your M-Pesa. We take 0%.',
}) => {
  return (
    <footer className="bg-[#111111] text-[#FFFBF5] border-t border-[#222222] pb-16 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Kenyan Trust Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-neutral-900/80 border border-[#00A651]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00A651] text-white flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-400">
              {trustText}
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            0% Middleman Fees · Direct wa.me
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Logo with .co.ke */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tight text-[#00A651]">
                Lipa
              </span>
              <span className="font-black text-2xl tracking-tight text-white">
                Stay
              </span>
              <span className="text-xs font-mono font-bold bg-[#00A651]/20 text-[#00A651] border border-[#00A651]/40 px-2 py-0.5 rounded">
                .co.ke
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm">
              Kenya&apos;s 0% commission direct booking network. We connect guests to hosts via
              WhatsApp with payment direct to host M-Pesa Tills.
            </p>
          </div>

          {/* Value props */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-[#00A651]" />
              0% Commission
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
              <Smartphone className="w-4 h-4 text-[#00A651]" />
              M-Pesa STK Push
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
              <MessageCircle className="w-4 h-4 text-[#00A651]" />
              WhatsApp Direct
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} LipaStay.co.ke · Proudly built for Kenyan Hosts & Guests.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 transition-colors">
              Direct Booking Terms
            </span>
            <span>·</span>
            <span className="hover:text-neutral-400 transition-colors">
              Host Verification
            </span>
            <span>·</span>
            <span className="hover:text-neutral-400 transition-colors">
              Nairobi, Kenya
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
