import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Upload,
  ArrowRight,
  Gift,
  Copy,
  Check,
  Building,
  MapPin,
  Coins,
  MessageCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';
import { Confetti } from '../ui/Confetti';
import { saveHostLead, HostLead } from '../../utils/hosts';

export interface HostOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted?: (lead: HostLead) => void;
}

export const HostOnboardingModal: React.FC<HostOnboardingModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted,
}) => {
  // Form State
  const [hostName, setHostName] = useState('');
  const [phone, setPhone] = useState('');
  const [tillNumber, setTillNumber] = useState('');
  const [location, setLocation] = useState('Nairobi - Kilimani');
  const [propertyType, setPropertyType] = useState('1BR');
  const [pricePerNight, setPricePerNight] = useState('4500');
  const [agreeTillMatchesId, setAgreeTillMatchesId] = useState(false);
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
  ]);

  // Status
  const [submittedLead, setSubmittedLead] = useState<HostLead | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, 3);
    const newPhotos: string[] = [];

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newPhotos.push(reader.result);
          if (newPhotos.length === fileList.length) {
            setPhotos(newPhotos);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) {
      setErrorMsg('Please enter your host name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your WhatsApp phone number.');
      return;
    }
    if (!tillNumber.trim()) {
      setErrorMsg('Please enter your Safaricom Till Number or Paybill.');
      return;
    }
    if (!agreeTillMatchesId) {
      setErrorMsg('Please confirm that the Till number is yours and matches your Safaricom ID.');
      return;
    }

    setErrorMsg('');

    // Save to localStorage "lipastay_hosts_leads" + Google Sheet placeholder
    const saved = saveHostLead({
      hostName: hostName.trim(),
      phone: phone.trim(),
      tillNumber: tillNumber.trim(),
      location,
      propertyType,
      pricePerNightKES: Number(pricePerNight) || 4500,
      photos,
      agreeTillMatchesId,
    });

    setSubmittedLead(saved);
    setShowConfetti(true);

    if (onLeadSubmitted) {
      onLeadSubmitted(saved);
    }
  };

  const handleCopyWhatsAppLink = () => {
    if (!submittedLead) return;
    const cleanNum = submittedLead.phone.replace(/[^0-9]/g, '');
    const waLink = `https://wa.me/${cleanNum}?text=Habari!+I+am+interested+in+your+${encodeURIComponent(
      submittedLead.propertyType
    )}+in+${encodeURIComponent(submittedLead.location)}+via+LipaStay`;

    navigator.clipboard.writeText(waLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setShowConfetti(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Confetti Trigger */}
      {showConfetti && <Confetti />}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!showConfetti) onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl border border-[#EBE5DB] overflow-hidden z-10 my-auto max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EBE5DB] flex items-center justify-between bg-[#FFFBF5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00A651] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              0%
            </div>
            <div>
              <h3 className="font-bold text-base text-[#111111] flex items-center gap-1.5">
                <span>List Your Property Free</span>
                <Badge variant="warm" size="sm">0% Commission</Badge>
              </h3>
              <p className="text-[11px] text-[#6B7280]">
                Connect your Safaricom Till · Guests pay you direct
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B7280] hover:text-[#111111] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          {/* SUCCESS VIEW */}
          {submittedLead ? (
            <div className="text-center space-y-6 py-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-[#EAF8F0] border-4 border-[#00A651] text-[#00A651] flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008440] bg-[#EAF8F0] px-3 py-1 rounded-full border border-[#00A651]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Early Host Pioneer Privileges Active</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111111]">
                  Asante! You are Host #{submittedLead.hostNumber}
                </h3>
                <p className="text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
                  We will verify your M-Pesa Till ({submittedLead.tillNumber}) in{' '}
                  <strong className="text-[#111111]">under 2 hours</strong> and activate your 0%
                  commission listing.
                </p>
              </div>

              {/* Direct wa.me link box */}
              <div className="bg-[#FFFBF5] rounded-2xl p-5 border border-[#00A651]/30 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#00A651]" />
                    Your Direct WhatsApp Link
                  </span>
                  <span className="text-[10px] text-[#008440] font-semibold">Share with Guests</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-[#EBE5DB]">
                  <code className="text-xs text-[#008440] font-mono truncate flex-1 font-semibold">
                    wa.me/{submittedLead.phone.replace(/[^0-9]/g, '')}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyWhatsAppLink}
                    className="p-1.5 text-[#111111] hover:text-[#00A651] transition-colors shrink-0"
                    title="Copy WhatsApp Link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-[#00A651]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-[#6B7280]">
                  Guests who click this link initiate direct reservations into your Safaricom Till with KES 0 middleman deductions.
                </p>
              </div>

              {/* Pro Perks Box */}
              <div className="bg-[#FFF2EC] border border-[#FF6B35]/30 rounded-2xl p-4 max-w-md mx-auto flex items-center gap-3 text-left">
                <Gift className="w-6 h-6 text-[#FF6B35] shrink-0" />
                <div className="text-xs text-[#111111]">
                  <span className="font-bold text-[#FF6B35]">6 Months Pro Free Unlocked!</span> You are
                  enrolled in the first 100 Kenyan hosts cohort (Worth KES 9,000 free).
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <Button variant="mpesa" size="lg" onClick={handleReset}>
                  Back to LipaStay Home
                </Button>
              </div>
            </div>
          ) : (
            /* FORM VIEW */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Early Host Incentive Banner */}
              <div className="bg-gradient-to-r from-[#FFF2EC] via-[#FFF8F5] to-[#EAF8F0] border border-[#FF6B35]/30 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                      Launch Offer
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-[#008440] font-bold px-2 py-0.5 rounded-full">
                      78/100 Claimed
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#111111]">
                    First 100 Hosts get 6 months Pro Free Worth KES 9,000
                  </h4>
                  <p className="text-xs text-[#4B5563]">
                    No credit card required. 0% booking commission forever on all direct WhatsApp reservations.
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Host Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Host Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brian Mwangi or Jane Wanjiku"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full p-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712345678 or 2547..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
                  <p className="text-[10px] text-[#6B7280]">Guests will chat you directly on this number.</p>
                </div>

                {/* Till Number or Paybill */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                      M-Pesa Buy Goods Till or Paybill *
                    </label>
                    <MpesaTillVerifiedBadge size="sm" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Buy Goods Till: 5849201"
                    value={tillNumber}
                    onChange={(e) => setTillNumber(e.target.value)}
                    className="w-full p-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
                  <p className="text-xs text-[#008440] font-medium">
                    &quot;Tumie Till Number yako ya Lipa na M-Pesa&quot;
                  </p>
                </div>

                {/* Property Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Property Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  >
                    <option value="Nairobi - Kilimani">Nairobi - Kilimani</option>
                    <option value="Nairobi - Westlands">Nairobi - Westlands</option>
                    <option value="Nairobi - Syokimau / JKIA">Nairobi - Syokimau / JKIA</option>
                    <option value="Nairobi - Karen">Nairobi - Karen</option>
                    <option value="Nairobi - Kileleshwa">Nairobi - Kileleshwa</option>
                    <option value="Nairobi - Lavington">Nairobi - Lavington</option>
                    <option value="Mombasa - Nyali">Mombasa - Nyali</option>
                    <option value="Diani Beach">Diani Beach</option>
                    <option value="Naivasha">Naivasha</option>
                    <option value="Watamu / Malindi">Watamu / Malindi</option>
                    <option value="Other Town in Kenya">Other Town in Kenya</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full p-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  >
                    <option value="1BR">1 Bedroom Apartment</option>
                    <option value="2BR">2 Bedroom Apartment</option>
                    <option value="Bedsitter / Studio">Bedsitter / Studio</option>
                    <option value="Villa">Villa / Holiday Home</option>
                    <option value="Hotel / Boutique Stay">Hotel / Boutique Stay</option>
                  </select>
                </div>

                {/* Price per night */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Direct Price Per Night (KES)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B7280]">
                      KES
                    </span>
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs sm:text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                    />
                  </div>
                  <p className="text-[10px] text-[#6B7280]">
                    You keep 100% of this amount. LipaStay deducts KES 0.
                  </p>
                </div>
              </div>

              {/* Upload 3 Photos */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Property Photos (Up to 3 Photos)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {photos.slice(0, 3).map((photoUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden border border-[#EBE5DB] group bg-neutral-100"
                    >
                      <img src={photoUrl} alt="upload preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                        Photo {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 flex items-center justify-between text-xs text-[#6B7280]">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl hover:border-black cursor-pointer font-medium text-[#111111]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Your Own Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px]">Default samples preloaded</span>
                </div>
              </div>

              {/* ID & Till Verification Checkbox */}
              <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#EBE5DB] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="till-agreement"
                  checked={agreeTillMatchesId}
                  onChange={(e) => setAgreeTillMatchesId(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#00A651] accent-[#00A651] cursor-pointer"
                />
                <label htmlFor="till-agreement" className="text-xs text-[#111111] leading-relaxed cursor-pointer">
                  <span className="font-semibold">I agree Till is mine and matches my ID.</span> LipaStay
                  conducts a 2-hour fraud check before publishing properties to protect Kenyan guests.
                </label>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="mpesa"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold py-3.5 shadow-md shadow-[#00A651]/25 text-base"
              >
                Submit Listing &amp; Claim 6 Mos Pro Free
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
