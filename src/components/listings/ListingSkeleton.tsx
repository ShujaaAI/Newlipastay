import React from 'react';

export const ListingSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-[#EBE5DB] overflow-hidden flex flex-col justify-between animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full bg-neutral-200/80 relative" />

      {/* Details Skeleton */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-neutral-200 rounded-md w-1/3" />
          <div className="h-3 bg-neutral-200 rounded-md w-12" />
        </div>

        <div className="space-y-1.5">
          <div className="h-4 bg-neutral-200 rounded-md w-4/5" />
          <div className="h-3 bg-neutral-200 rounded-md w-1/2" />
        </div>

        <div className="pt-3 border-t border-[#EBE5DB] flex justify-between items-end">
          <div className="space-y-1 w-1/2">
            <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
            <div className="h-2.5 bg-neutral-200 rounded-md w-1/2" />
          </div>
          <div className="h-4 bg-neutral-200 rounded-md w-10" />
        </div>
      </div>
    </div>
  );
};
