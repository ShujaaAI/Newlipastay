import React from 'react';
import { ShieldCheck, Star, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';

export interface ListingItem {
  id: string;
  title: string;
  location: string;
  city: string;
  price_per_night: number;
  original_ota_price?: number;
  image: string;
  images?: string[];
  host_name: string;
  whatsapp_number: string;
  mpesa_till_verified: boolean;
  mpesa_till_number?: string;
  rating: number;
  reviews_count?: number;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  self_check_in?: boolean;
  has_wifi?: boolean;
  amenities?: string[];
  description?: string;
}

export interface ListingCardProps {
  listing: ListingItem;
  onSelect: (listing: ListingItem) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect }) => {
  const savingsKES = listing.original_ota_price
    ? listing.original_ota_price - listing.price_per_night
    : Math.round(listing.price_per_night * 0.20);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Habari ${listing.host_name}! I found "${listing.title}" on LipaStay.co.ke (KES ${listing.price_per_night.toLocaleString()}/night). Is it available for booking?`
    );
    window.open(`https://wa.me/${listing.whatsapp_number}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-3xl border border-[#EBE5DB] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#00A651]/50 transition-all duration-200 cursor-pointer"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Till Verified Badge (Top Left) */}
        {listing.mpesa_till_verified && (
          <div className="absolute top-3 left-3">
            <MpesaTillVerifiedBadge size="sm" />
          </div>
        )}

        {/* WhatsApp Quick Action Button (Top Right) */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          title={`WhatsApp Host ${listing.host_name}`}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center shadow-md hover:scale-110 active:scale-95"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
        </button>

        {/* Property Type Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          {listing.type}
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Location & Star Rating */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-[#6B7280] font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-[#111111] shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 fill-[#FF6B35] text-[#FF6B35]" />
              <span>{listing.rating.toFixed(2)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-[#111111] line-clamp-2 leading-snug group-hover:text-[#00A651] transition-colors">
            {listing.title}
          </h3>

          {/* Host info line */}
          <p className="text-[11px] text-[#6B7280]">
            Host: <span className="font-medium text-[#111111]">{listing.host_name}</span> · Direct wa.me
          </p>
        </div>

        {/* Pricing & Direct Savings */}
        <div className="pt-3 border-t border-[#EBE5DB] flex items-end justify-between">
          <div>
            <div className="text-sm sm:text-base font-black text-[#111111] font-mono">
              KES {listing.price_per_night.toLocaleString()}{' '}
              <span className="text-xs font-normal text-[#6B7280]">/ night</span>
            </div>
            <div className="text-[10px] font-semibold text-[#008440]">
              Save KES {savingsKES.toLocaleString()} vs OTA
            </div>
          </div>

          {/* Action indicator */}
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00A651] group-hover:translate-x-0.5 transition-transform">
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
