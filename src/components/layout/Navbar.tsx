import React from 'react';
import { Home, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface NavbarProps {
  onHostClick?: () => void;
  onExploreClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHostClick, onExploreClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFBF5]/90 backdrop-blur-md border-b border-[#EBE5DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#00A651] flex items-center justify-center text-white shadow-sm shadow-[#00A651]/20 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#111111]">
                  Lipa<span className="text-[#00A651]">Stay</span>
                </span>
                <span className="text-[10px] font-bold bg-[#EAF8F0] text-[#00A651] px-1.5 py-0.5 rounded border border-[#00A651]/20 tracking-wider">
                  .co.ke
                </span>
              </div>
              <p className="text-[10px] text-[#6B7280] font-medium tracking-tight hidden sm:block">
                0% Commission Direct Booking
              </p>
            </div>
          </a>
        </div>

        {/* Desktop Trust & Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm text-[#4B5563]">
          <div className="flex items-center gap-1.5 text-xs text-[#008440] font-medium bg-[#EAF8F0] px-3 py-1.5 rounded-full border border-[#00A651]/15">
            <ShieldCheck className="w-4 h-4 text-[#00A651]" />
            <span>Direct M-Pesa Till to Verified Hosts</span>
          </div>
          <span className="text-[#EBE5DB]">|</span>
          <button
            onClick={onExploreClick}
            className="text-sm font-medium text-[#111111] hover:text-[#00A651] transition-colors"
          >
            Nairobi Stays
          </button>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onHostClick}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />}
            className="hidden sm:inline-flex"
          >
            List as Host
          </Button>

          <Button
            variant="mpesa"
            size="sm"
            leftIcon={<PhoneCall className="w-3.5 h-3.5 text-white" />}
            onClick={() => {
              window.open('https://wa.me/254700000000?text=Hi%20LipaStay,%20I%20am%20looking%20for%20a%20verified%20direct%20stay%20in%20Kenya', '_blank');
            }}
          >
            WhatsApp Support
          </Button>
        </div>
      </div>
    </header>
  );
};
