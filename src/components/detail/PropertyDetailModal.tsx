import React, { useState, useEffect } from 'react';
import { ListingItem } from '../listings/ListingCard';
import {
  X,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Sparkles,
  DollarSign,
  Calendar,
  Users,
  Check,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';
import { getSavedGuestPhone, saveGuestPhone, trackWhatsAppLead } from '../../utils/tracking';

export interface PropertyDetailModalProps {
  listing: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLipaDepositClick?: (listing: ListingItem) => void;
  onShowToast: (message: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onLipaDepositClick,
  onShowToast,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [guestPhone, setGuestPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-10-16');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');

  // Load saved phone number
  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
      setPhoneError('');
      const saved = getSavedGuestPhone();
      if (saved) {
        setGuestPhone(saved);
      }
    }
  }, [isOpen, listing]);

  if (!isOpen || !listing) return null;

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [listing.image];

  const savingsKES = listing.original_ota_price
    ? listing.original_ota_price - listing.price_per_night
    : Math.round(listing.price_per_night * 0.20);

  const formattedDates = `${checkInDate} to ${checkOutDate}`;

  const handleWhatsAppAction = () => {
    // If phone is empty, validate or prompt
    const cleanPhone = guestPhone.trim();
    if (!cleanPhone) {
      setPhoneError('Please enter your phone/WhatsApp number so the host can identify your inquiry.');
      return;
    }
    setPhoneError('');

    // Save lead to localStorage
    trackWhatsAppLead({
      guest_phone: cleanPhone,
      property_id: listing.id,
      property_title: listing.title,
      host_name: listing.host_name,
      host_whatsapp: listing.whatsapp_number,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
    });

    // Show verification tracking toast
    onShowToast('Opening WhatsApp... Your chat will be tracked for verification');

    // wa.me URL
    // text=Jambo!+Niko+LipaStay.+Is+{property_title}+available+on+{date}?
    const encodedText = encodeURIComponent(
      `Jambo! Niko LipaStay. Is ${listing.title} available on ${formattedDates}?`
    );
    const waUrl = `https://wa.me/${listing.whatsapp_number}?text=${encodedText}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 400);
  };

  const handleDepositAction = () => {
    if (onLipaDepositClick) {
      onLipaDepositClick(listing);
    } else {
      onShowToast(`Preparing direct M-Pesa STK push for Till ${listing.mpesa_till_number || 'verified'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl border border-[#EBE5DB] overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EBE5DB] flex items-center justify-between bg-[#FFFBF5]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#00A651] bg-[#EAF8F0] px-2.5 py-1 rounded-md border border-[#00A651]/20">
              LipaStay Direct Listing
            </span>
            <span className="text-xs text-[#6B7280]">·</span>
            <span className="text-xs font-medium text-[#111111]">{listing.type}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#6B7280] hover:text-[#111111] hover:bg-black/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-[#EBE5DB]">
              <img
                src={images[activeImageIndex]}
                alt={listing.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Prev / Next controls if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#111111] flex items-center justify-center hover:bg-white shadow-md transition-transform active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#111111] flex items-center justify-center hover:bg-white shadow-md transition-transform active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badge Overlays */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {listing.mpesa_till_verified && (
                  <MpesaTillVerifiedBadge size="md" />
                )}
                <span className="inline-flex items-center gap-1 bg-[#111111]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                  0% Commission
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === activeImageIndex
                        ? 'border-[#00A651] scale-102 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Location Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-[#4B5563]">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                <span className="font-semibold text-[#111111]">{listing.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-[#FFFBF5] px-2.5 py-1 rounded-lg border border-[#EBE5DB]">
                <Star className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
                <span>{listing.rating.toFixed(2)}</span>
                <span className="text-[#6B7280]">
                  ({listing.reviews_count || 32} reviews)
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
              {listing.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              {listing.description ||
                'Modern, serene stay in Kenya. Directly connect with the host on WhatsApp without middleman fees.'}
            </p>
          </div>

          {/* Host Card with Response Time ("Replies in 5 mins") */}
          <div className="bg-[#FFFBF5] rounded-2xl p-4 sm:p-5 border border-[#EBE5DB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#00A651] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {listing.host_name.charAt(0)}
                </div>
                <span className="w-3.5 h-3.5 rounded-full bg-[#00A651] border-2 border-white absolute bottom-0 right-0" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-[#111111]">
                    Hosted by {listing.host_name}
                  </h4>
                  {listing.mpesa_till_verified && (
                    <ShieldCheck className="w-4 h-4 text-[#00A651]" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-0.5">
                  <span className="font-mono">Till: {listing.mpesa_till_number || 'Verified'}</span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-[#008440] font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#00A651]" />
                    <span>Replies in 5 mins</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right sm:text-right shrink-0">
              <div className="text-lg sm:text-xl font-black text-[#111111] font-mono">
                KES {listing.price_per_night.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#6B7280]">/ night</span>
              </div>
              <div className="text-xs font-bold text-[#008440]">
                Save KES {savingsKES.toLocaleString()} vs OTA
              </div>
            </div>
          </div>

          {/* Dates & Guest Lead Tracking Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Booking Dates */}
            <div className="bg-white rounded-2xl p-4 border border-[#EBE5DB] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
                Desired Stay Dates
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-[#6B7280]">Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-[#00A651]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#6B7280]">Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl font-medium focus:outline-none focus:ring-1 focus:ring-[#00A651]"
                  />
                </div>
              </div>
            </div>

            {/* Guest Phone Input for Lead Tracking */}
            <div className="bg-white rounded-2xl p-4 border border-[#EBE5DB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#00A651]" />
                  Your Phone / WhatsApp
                </span>
                <span className="text-[10px] text-[#008440] font-semibold bg-[#EAF8F0] px-2 py-0.5 rounded">
                  Tracked for Security
                </span>
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="e.g. 0712345678 or 2547..."
                  value={guestPhone}
                  onChange={(e) => {
                    setGuestPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  className={`w-full p-2.5 bg-[#FFFBF5] border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00A651] ${
                    phoneError ? 'border-rose-500' : 'border-[#EBE5DB]'
                  }`}
                />
                {phoneError ? (
                  <p className="text-[11px] text-rose-600 mt-1">{phoneError}</p>
                ) : (
                  <p className="text-[10px] text-[#6B7280] mt-1">
                    Saved in your session to verify host response &amp; deposit receipt.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Included Property Amenities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(listing.amenities || [
                'Fast Fiber WiFi',
                'M-Pesa Verified Host',
                'Self Check-in',
                'Smart TV',
                'Hot Shower',
                'Free Secure Parking',
              ]).map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFFBF5] border border-[#EBE5DB] text-xs font-medium text-[#111111]"
                >
                  <Check className="w-4 h-4 text-[#00A651] shrink-0" />
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action Bar with Big Green Buttons */}
        <div className="p-4 sm:p-6 border-t border-[#EBE5DB] bg-[#FFFBF5] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Button 1: Big Green WhatsApp direct */}
            <Button
              variant="mpesa"
              size="lg"
              fullWidth
              onClick={handleWhatsAppAction}
              leftIcon={<MessageCircle className="w-5 h-5 fill-current" />}
              className="font-bold text-sm sm:text-base py-3.5 shadow-md shadow-[#00A651]/20"
            >
              Chat on WhatsApp - Direct to Host
            </Button>

            {/* Button 2: Big Green M-Pesa deposit */}
            <Button
              variant="dark"
              size="lg"
              fullWidth
              onClick={handleDepositAction}
              leftIcon={<Smartphone className="w-5 h-5 text-[#00A651]" />}
              className="font-bold text-sm sm:text-base py-3.5"
            >
              Lipa Deposit via M-Pesa
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B7280]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
            <span>
              Real WhatsApp conversation · 0% middleman fees · Verified Safaricom Till Number
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
