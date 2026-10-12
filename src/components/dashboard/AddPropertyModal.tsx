import React, { useState } from 'react';
import { X, Upload, Plus, Building, MapPin, Coins, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ListingItem } from '../listings/ListingCard';
import { HostAccount, saveListing } from '../../utils/hostAuth';

export interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHost: HostAccount;
  onPropertyAdded: (newListing: ListingItem) => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  currentHost,
  onPropertyAdded,
}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Kilimani, Nairobi');
  const [city, setCity] = useState('Nairobi');
  const [propertyType, setPropertyType] = useState('Entire Apartment');
  const [pricePerNight, setPricePerNight] = useState('4500');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(2);
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  ]);
  const [agreeTill, setAgreeTill] = useState(true);
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
    if (!title.trim()) {
      setErrorMsg('Please enter a listing title.');
      return;
    }
    if (!agreeTill) {
      setErrorMsg('Please confirm Till ownership.');
      return;
    }

    const price = Number(pricePerNight) || 4500;
    const newListing: ListingItem = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      location,
      city,
      price_per_night: price,
      original_ota_price: Math.round(price * 1.25),
      image: photos[0],
      images: photos,
      host_name: currentHost.name,
      whatsapp_number: currentHost.phone,
      mpesa_till_verified: currentHost.tillVerified,
      mpesa_till_number: currentHost.tillNumber,
      rating: 5.0,
      reviews_count: 1,
      type: propertyType,
      bedrooms,
      bathrooms,
      max_guests: maxGuests,
      self_check_in: true,
      has_wifi: true,
      amenities: ['Fast WiFi', 'M-Pesa Verified Host', 'Self Check-in', 'Smart TV', 'Free Parking'],
      description: description.trim() || `Modern ${propertyType} in ${location}. Book direct via WhatsApp and Safaricom Till with 0% middleman fees.`,
    };

    saveListing(newListing);
    onPropertyAdded(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#EBE5DB] overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="px-6 py-4.5 border-b border-[#EBE5DB] flex items-center justify-between bg-[#FFFBF5]">
          <div>
            <h3 className="font-bold text-lg text-[#111111] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#00A651]" />
              <span>Add New Property</span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Listed under {currentHost.name} · Till {currentHost.tillNumber}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-[#6B7280] hover:text-[#111111]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
              Property Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Luxurious 2BR Skyline Suite in Westlands"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                Neighborhood & City
              </label>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setCity(e.target.value.includes('Mombasa') ? 'Mombasa' : e.target.value.includes('Diani') ? 'Diani' : e.target.value.includes('Naivasha') ? 'Naivasha' : 'Nairobi');
                }}
                className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="Kilimani, Nairobi">Kilimani, Nairobi</option>
                <option value="Westlands, Nairobi">Westlands, Nairobi</option>
                <option value="Karen, Nairobi">Karen, Nairobi</option>
                <option value="Kileleshwa, Nairobi">Kileleshwa, Nairobi</option>
                <option value="Lavington, Nairobi">Lavington, Nairobi</option>
                <option value="Syokimau / JKIA, Nairobi">Syokimau / JKIA, Nairobi</option>
                <option value="Nyali, Mombasa">Nyali, Mombasa</option>
                <option value="Diani Beach, Kwale">Diani Beach, Kwale</option>
                <option value="Lakeview, Naivasha">Lakeview, Naivasha</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="Entire Apartment">Entire Apartment</option>
                <option value="Executive Studio">Executive Studio</option>
                <option value="Cozy Studio">Cozy Studio</option>
                <option value="Beachfront Villa">Beachfront Villa</option>
                <option value="Private Cottage">Private Cottage</option>
                <option value="Lakefront Cottage">Lakefront Cottage</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                Price Per Night (KES)
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
                  className="w-full pl-14 pr-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                Max Guests
              </label>
              <select
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={6}>6+ Guests</option>
              </select>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
              Photos (Up to 3 Photos)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, idx) => (
                <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-[#EBE5DB]">
                  <img src={p} alt="upload preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs font-semibold cursor-pointer hover:border-black">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom Images</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="p-3 bg-[#FFFBF5] rounded-xl border border-[#EBE5DB] flex items-start gap-2.5">
            <input
              type="checkbox"
              id="till-confirm-prop"
              checked={agreeTill}
              onChange={(e) => setAgreeTill(e.target.checked)}
              className="mt-0.5 accent-[#00A651]"
            />
            <label htmlFor="till-confirm-prop" className="text-xs text-[#111111] cursor-pointer">
              Direct guest payments for this property will route straight to host Till{' '}
              <strong>{currentHost.tillNumber}</strong> with 0% commission.
            </label>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="mpesa" fullWidth size="lg" className="font-bold">
              Publish Property to Feed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
