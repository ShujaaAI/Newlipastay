import React, { useState, useMemo, useEffect } from 'react';
import { mockListings } from '../../data/listings.js';
import { SearchBar, SearchFilters } from './SearchBar';
import { FilterChips, FilterState } from './FilterChips';
import { ListingCard, ListingItem } from './ListingCard';
import { ListingSkeleton } from './ListingSkeleton';
import { Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Language, translations } from '../../utils/i18n';

export interface ListingsFeedProps {
  onSelectListing: (listing: ListingItem) => void;
  language?: Language;
}

export const ListingsFeed: React.FC<ListingsFeedProps> = ({
  onSelectListing,
  language = 'EN',
}) => {
  const t = translations[language];

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: 'All',
    checkInDate: '2026-10-16',
    checkOutDate: '2026-10-18',
    guests: 2,
  });

  const [filterChips, setFilterChips] = useState<FilterState>({
    onlyMpesaVerified: false,
    onlySelfCheckIn: false,
    under3000: false,
    onlyWifi: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Trigger slight loading skeleton on filter change to emulate Airbnb performance
  const handleFiltersChange = (newFilters: FilterState) => {
    setIsLoading(true);
    setFilterChips(newFilters);
    setTimeout(() => setIsLoading(false), 250);
  };

  const handleSearchSubmit = (newSearch: SearchFilters) => {
    setIsLoading(true);
    setSearchFilters(newSearch);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Filter listings based on location and filter chips
  const filteredListings = useMemo(() => {
    return (mockListings as ListingItem[]).filter((item) => {
      // Location filter
      if (searchFilters.location !== 'All') {
        const matchesCity = item.city.toLowerCase() === searchFilters.location.toLowerCase();
        const matchesLocation = item.location.toLowerCase().includes(searchFilters.location.toLowerCase());
        if (!matchesCity && !matchesLocation) return false;
      }

      // Guest filter
      if (item.max_guests && item.max_guests < searchFilters.guests) {
        return false;
      }

      // Filter Chips
      if (filterChips.onlyMpesaVerified && !item.mpesa_till_verified) {
        return false;
      }
      if (filterChips.onlySelfCheckIn && !item.self_check_in) {
        return false;
      }
      if (filterChips.under3000 && item.price_per_night > 3000) {
        return false;
      }
      if (filterChips.onlyWifi && !item.has_wifi) {
        return false;
      }

      return true;
    });
  }, [searchFilters, filterChips]);

  return (
    <section id="listings" className="py-12 sm:py-16 bg-[#FFFBF5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00A651] bg-[#EAF8F0] px-3 py-1 rounded-md border border-[#00A651]/25 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Kenya Stays Feed
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
              Verified Nairobi, Diani &amp; Naivasha Stays
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Zero booking fees. Tap any stay to view verified M-Pesa Till credentials or message the host on WhatsApp.
            </p>
          </div>
          <div className="text-xs text-[#008440] font-semibold bg-[#EAF8F0] px-3.5 py-2 rounded-xl border border-[#00A651]/20 shrink-0">
            ✓ 100% Direct Host Payments
          </div>
        </div>

        {/* 1. Search Bar */}
        <SearchBar
          onSearch={handleSearchSubmit}
          activeLocation={searchFilters.location}
        />

        {/* 2. Filter Chips */}
        <FilterChips
          filters={filterChips}
          onChange={handleFiltersChange}
          totalMatches={filteredListings.length}
        />

        {/* 3. Listings Grid / Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onSelect={onSelectListing}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 border border-[#EBE5DB] text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#111111]">No Stays Match These Exact Filters</h3>
              <p className="text-xs text-[#4B5563]">
                Try selecting &quot;All Kenya&quot; or clearing some filter chips to view all 12 properties.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchFilters({
                  location: 'All',
                  checkInDate: '2026-10-16',
                  checkOutDate: '2026-10-18',
                  guests: 2,
                });
                setFilterChips({
                  onlyMpesaVerified: false,
                  onlySelfCheckIn: false,
                  under3000: false,
                  onlyWifi: false,
                });
              }}
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
