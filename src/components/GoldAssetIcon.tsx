import React from 'react';
import { AssetKey } from '../types';

interface GoldAssetIconProps {
  assetKey: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GoldAssetIcon: React.FC<GoldAssetIconProps> = ({
  assetKey,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  // 1. OUNCE GLOBAL (XAU / 999.9 Bullion)
  if (assetKey === 'ounce_global' || assetKey.includes('ounce') || assetKey.includes('xau')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="goldBarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Ingot Trapezoid shape */}
          <polygon points="6,9 30,9 26,27 10,27" fill="url(#goldBarGrad)" stroke="#B45309" strokeWidth="1" />
          <polygon points="8,11 28,11 25,16 11,16" fill="url(#shineGrad)" />
          {/* 999.9 stamp */}
          <text x="18" y="23" textAnchor="middle" fill="#451A03" fontSize="5.5" fontWeight="900" fontFamily="sans-serif">
            999.9
          </text>
        </svg>
      </div>
    );
  }

  // 2. GOLD 18K / MELTED (Abshodeh & 18K Ingot)
  if (assetKey.includes('18k') || assetKey.includes('melted') || assetKey.includes('mithqal') || assetKey.includes('tala')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="gold18kGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>
          {/* Dual Ingot Layer */}
          <rect x="7" y="14" width="22" height="14" rx="2.5" fill="url(#gold18kGrad)" stroke="#B45309" strokeWidth="1" />
          <rect x="9" y="8" width="18" height="11" rx="2" fill="url(#gold18kGrad)" stroke="#B45309" strokeWidth="0.8" />
          <line x1="11" y1="12" x2="25" y2="12" stroke="#FFFBEB" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.6" />
          <text x="18" y="24" textAnchor="middle" fill="#451A03" fontSize="6" fontWeight="900" fontFamily="sans-serif">
            18K
          </text>
        </svg>
      </div>
    );
  }

  // 3. USD DOLLAR BANKNOTE / EMBLEM
  if (assetKey.includes('usd') || assetKey.includes('dollar') || assetKey.includes('irr')) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="usdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="40%" stopColor="#10B981" />
              <stop offset="80%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>
          <rect x="4" y="9" width="28" height="18" rx="2.5" fill="url(#usdGrad)" stroke="#065F46" strokeWidth="1" />
          <circle cx="18" cy="18" r="6" stroke="#D1FAE5" strokeWidth="1" fill="#047857" fillOpacity="0.4" />
          <text x="18" y="22" textAnchor="middle" fill="#ECFDF5" fontSize="11" fontWeight="900" fontFamily="sans-serif">
            $
          </text>
        </svg>
      </div>
    );
  }

  // 4. GOLD COINS (Emami, Bahar, Half, Quarter, Gerami)
  const isQuarterOrGerami = assetKey.includes('quarter') || assetKey.includes('gerami') || assetKey.includes('rob');
  const isHalf = assetKey.includes('half') || assetKey.includes('nim');

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses} ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-sm" fill="none">
        <defs>
          <radialGradient id="coinFaceGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="30%" stopColor="#FDE047" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>
          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Outer coin rim with serrations */}
        <circle cx="18" cy="18" r="15.5" fill="url(#rimGrad)" stroke="#78350F" strokeWidth="0.8" />
        <circle cx="18" cy="18" r="14" fill="url(#coinFaceGrad)" />
        <circle cx="18" cy="18" r="12.5" stroke="#B45309" strokeWidth="0.6" strokeDasharray="1.5 1" fill="none" />

        {/* Coin center emblem */}
        {isQuarterOrGerami ? (
          <>
            <polygon points="18,10 20.5,15 26,15.5 21.8,19.2 23.2,24.5 18,21.5 12.8,24.5 14.2,19.2 10,15.5 15.5,15" fill="#78350F" fillOpacity="0.85" />
            <circle cx="18" cy="18" r="2" fill="#FEF08A" />
          </>
        ) : isHalf ? (
          <>
            <path d="M12 18 C12 14.7 14.7 12 18 12 C21.3 12 24 14.7 24 18 C24 21.3 21.3 24 18 24 Z" fill="#78350F" fillOpacity="0.85" />
            <circle cx="18" cy="18" r="3" fill="#FEF08A" />
          </>
        ) : (
          <>
            {/* Full Emami / Bahar Sunburst & Crown Emblem */}
            <circle cx="18" cy="18" r="6" fill="#78350F" fillOpacity="0.8" />
            <circle cx="18" cy="18" r="4.5" fill="#FDE047" />
            <path d="M18 10 L18 13 M18 23 L18 26 M10 18 L13 18 M23 18 L26 18 M12.5 12.5 L14.5 14.5 M21.5 21.5 L23.5 23.5 M12.5 23.5 L14.5 21.5 M21.5 14.5 L23.5 12.5" stroke="#78350F" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="18" cy="18" r="2" fill="#92400E" />
          </>
        )}

        {/* Shimmer light reflection line */}
        <path d="M8 12 Q 18 6 28 12" stroke="#FFFBEB" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" fill="none" />
      </svg>
    </div>
  );
};
