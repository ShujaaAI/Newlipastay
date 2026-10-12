import React from 'react';
import { ShieldCheck, Key, Coins, Wifi, RotateCcw } from 'lucide-react';

export interface FilterState {
  onlyMpesaVerified: boolean;
  onlySelfCheckIn: boolean;
  under3000: boolean;
  onlyWifi: boolean;
}

export interface FilterChipsProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalMatches: number;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onChange,
  totalMatches,
}) => {
  const toggleFilter = (key: keyof FilterState) => {
    onChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const hasActiveFilter =
    filters.onlyMpesaVerified ||
    filters.onlySelfCheckIn ||
    filters.under3000 ||
    filters.onlyWifi;

  const resetFilters = () => {
    onChange({
      onlyMpesaVerified: false,
      onlySelfCheckIn: false,
      under3000: false,
      onlyWifi: false,
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      {/* Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* M-Pesa Verified */}
        <button
          type="button"
          onClick={() => toggleFilter('onlyMpesaVerified')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            filters.onlyMpesaVerified
              ? 'bg-[#EAF8F0] text-[#008440] border-[#00A651] shadow-xs'
              : 'bg-white text-[#4B5563] border-[#EBE5DB] hover:border-[#111111]'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${filters.onlyMpesaVerified ? 'text-[#00A651]' : 'text-[#6B7280]'}`} />
          <span>M-Pesa Till Verified</span>
        </button>

        {/* Self Check-in */}
        <button
          type="button"
          onClick={() => toggleFilter('onlySelfCheckIn')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            filters.onlySelfCheckIn
              ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
              : 'bg-white text-[#4B5563] border-[#EBE5DB] hover:border-[#111111]'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Self Check-in</span>
        </button>

        {/* Under KES 3,000 */}
        <button
          type="button"
          onClick={() => toggleFilter('under3000')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            filters.under3000
              ? 'bg-[#FFF2EC] text-[#FF6B35] border-[#FF6B35] shadow-xs'
              : 'bg-white text-[#4B5563] border-[#EBE5DB] hover:border-[#111111]'
          }`}
        >
          <Coins className={`w-3.5 h-3.5 ${filters.under3000 ? 'text-[#FF6B35]' : 'text-[#6B7280]'}`} />
          <span>Under KES 3,000</span>
        </button>

        {/* WiFi */}
        <button
          type="button"
          onClick={() => toggleFilter('onlyWifi')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            filters.onlyWifi
              ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
              : 'bg-white text-[#4B5563] border-[#EBE5DB] hover:border-[#111111]'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>WiFi</span>
        </button>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#6B7280] hover:text-[#111111] underline transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Counter */}
      <div className="text-xs text-[#6B7280]">
        Showing <span className="font-bold text-[#111111]">{totalMatches}</span> verified direct stays
      </div>
    </div>
  );
};
