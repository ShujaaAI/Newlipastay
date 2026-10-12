export interface Host {
  id: string;
  name: string;
  phone: string; // Kenyan format: 2547XXXXXXXX
  mpesaTillNumber: string;
  mpesaBusinessName: string;
  isVerified: boolean;
  joinedDate: string;
  avatarUrl: string;
  superhost?: boolean;
  responseRateMinutes?: number;
}

export interface Listing {
  id: string;
  title: string;
  subtitle: string;
  area: string; // e.g. "Kilimani, Nairobi" or "Westlands, Nairobi"
  county: string;
  pricePerNightKES: number;
  originalOtaPriceKES?: number; // e.g. what it's listed on Airbnb/Booking.com
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  propertyType: 'Entire Apartment' | 'Villa' | 'Penthouse' | 'Studio' | 'Cottage';
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  host: Host;
  instantWhatsApp: boolean;
  description: string;
  rules?: string[];
  checkInTime: string;
  checkOutTime: string;
}

export interface CommissionComparisonData {
  nightlyRateKES: number;
  nights: number;
  airbnbFeePercent: number; // e.g., 15.5%
  bookingComFeePercent: number; // e.g., 20.0%
}
