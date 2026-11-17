import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
}

export function BrandLogo({ variant = 'dark' }: BrandLogoProps) {
  const isLight = variant === 'light';

  return (
    <span
      className={`inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 ${
        isLight ? 'text-white' : 'text-[#0A2540]'
      }`}
    >
      <span
        className={`w-9 h-9 rounded-full border-[1.5px] grid place-items-center font-editorial text-[22px] leading-none shrink-0 ${
          isLight ? 'border-white text-white' : 'border-[#0A2540] text-[#0A2540]'
        }`}
      >
        T
      </span>
      <span className="leading-[1.05]">
        <span className="block text-[17px] tracking-[0.09em] font-medium">
          TRADE <strong className="font-bold">MEDS</strong>
        </span>
        <small
          className={`block text-[8px] font-medium tracking-[0.2em] mt-1 ${
            isLight ? 'text-[#94A3B8]' : 'text-[#64748B]'
          }`}
        >
          CARE IN EVERY DETAIL
        </small>
      </span>
    </span>
  );
}
