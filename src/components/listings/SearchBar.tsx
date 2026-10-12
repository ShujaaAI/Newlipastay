import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface SearchFilters {
  location: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}

export interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  activeLocation: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, activeLocation }) => {
  const [location, setLocation] = useState<string>(activeLocation || 'All');
  const [checkInDate, setCheckInDate] = useState<string>('2026-10-16');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-10-18');
  const [guests, setGuests] = useState<number>(2);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      location,
      checkInDate,
      checkOutDate,
      guests,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#EBE5DB] shadow-md">
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Location Dropdown */}
        <div className="md:col-span-4 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#FFFBF5] border border-[#EBE5DB] hover:border-[#00A651]/50 transition-colors">
          <MapPin className="w-5 h-5 text-[#00A651] shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-destination" className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              Destination in Kenya
            </label>
            <select
              id="search-destination"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                onSearch({ location: e.target.value, checkInDate, checkOutDate, guests });
              }}
              className="w-full bg-transparent text-sm font-bold text-[#111111] focus:outline-none cursor-pointer"
            >
              <option value="All">All Kenya (Nairobi, Diani, Naivasha...)</option>
              <option value="Nairobi">Nairobi (Kilimani, Westlands, Karen...)</option>
              <option value="Mombasa">Mombasa (Nyali, Bamburi...)</option>
              <option value="Diani">Diani Beach (South Coast)</option>
              <option value="Naivasha">Naivasha (Lake Naivasha, Hell&apos;s Gate)</option>
            </select>
          </div>
        </div>

        {/* Date Picker (UI only) */}
        <div className="md:col-span-4 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#FFFBF5] border border-[#EBE5DB] hover:border-[#00A651]/50 transition-colors">
          <Calendar className="w-5 h-5 text-[#FF6B35] shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              Check In – Check Out
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#111111]">
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer w-28"
              />
              <span className="text-[#6B7280]">→</span>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer w-28"
              />
            </div>
          </div>
        </div>

        {/* Guests Selector */}
        <div className="md:col-span-2 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#FFFBF5] border border-[#EBE5DB] hover:border-[#00A651]/50 transition-colors">
          <Users className="w-5 h-5 text-[#111111] shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="search-guests" className="block text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              Guests
            </label>
            <select
              id="search-guests"
              value={guests}
              onChange={(e) => {
                const val = Number(e.target.value);
                setGuests(val);
                onSearch({ location, checkInDate, checkOutDate, guests: val });
              }}
              className="w-full bg-transparent text-sm font-bold text-[#111111] focus:outline-none cursor-pointer"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4+ Guests</option>
            </select>
          </div>
        </div>

        {/* Search Action Button */}
        <div className="md:col-span-2">
          <Button
            type="submit"
            variant="mpesa"
            size="md"
            fullWidth
            leftIcon={<Search className="w-4 h-4" />}
            className="font-bold py-3 text-sm rounded-2xl shadow-sm"
          >
            Search Stays
          </Button>
        </div>
      </form>
    </div>
  );
};
