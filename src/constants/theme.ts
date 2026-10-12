export const BRAND = {
  name: 'LipaStay.co.ke',
  tagline: "Kenya's 0% Commission Direct Stay Platform",
  mission: 'Direct guest-to-host bookings via WhatsApp & M-Pesa. Zero middleman cuts.',
  colors: {
    mpesa: '#00A651',
    mpesaDark: '#008440',
    mpesaLight: '#EAF8F0',
    brandDark: '#111111',
    brandMuted: '#6B7280',
    brandWarm: '#FF6B35',
    brandWarmLight: '#FFF2EC',
    brandBg: '#FFFBF5',
    brandBorder: '#EBE5DB',
  },
  commissions: {
    airbnb: 15.5, // 15.5% host-only or split
    bookingCom: 18.0, // 15-25% average ~18%
    lipastay: 0.0, // 0% always
  },
  popularLocations: [
    'Kilimani, Nairobi',
    'Westlands, Nairobi',
    'Karen, Nairobi',
    'Kileleshwa, Nairobi',
    'Lavington, Nairobi',
    'Diani Beach, Kwale',
    'Watamu, Kilifi',
    'Naivasha, Nakuru',
  ],
} as const;
