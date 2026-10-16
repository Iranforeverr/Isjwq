import React, { useState } from 'react';
import {
  RefreshCw,
  Clock,
  Zap,
  Globe2,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface LiveFeedMeta {
  usdRate: number;
  ouncePrice: number;
  lastUpdated: string;
  lastUpdatedTimestamp: number;
  sources: {
    primary?: string;
    globalGold: string;
    usdRate: string;
    domesticFormula: string;
  };
  status: 'online' | 'cached' | 'fallback';
  provider?: string;
  pingMs: number;
}

interface LiveConnectionBarProps {
  meta: LiveFeedMeta | null;
  isLoading: boolean;
  onManualRefresh: () => void;
  autoRefreshInterval: number;
  onChangeAutoRefreshInterval: (seconds: number) => void;
  secondsUntilNextRefresh: number;
}

export const LiveConnectionBar: React.FC<LiveConnectionBarProps> = ({
  meta,
  isLoading,
  onManualRefresh,
  autoRefreshInterval,
  onChangeAutoRefreshInterval,
  secondsUntilNextRefresh,
}) => {
  const [showSourceDetails, setShowSourceDetails] = useState(false);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-700 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Status and Quick Rates */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>نرخ زنده TGJU</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">انس جهانی:</span>
            <span className="font-mono font-bold text-slate-900">
              ${meta?.ouncePrice ? meta.ouncePrice.toLocaleString('en-US') : '2,748.50'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">دلار آزاد:</span>
            <span className="font-mono font-bold text-slate-900">
              {meta?.usdRate ? meta.usdRate.toLocaleString('fa-IR') : '۲۲۸,۰۰۰'} تومان
            </span>
          </div>
        </div>

        {/* Right: Refresh Controls & Compact Actions */}
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1 text-slate-500">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>بروزرسانی خودکار:</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => onChangeAutoRefreshInterval(Number(e.target.value))}
              className="bg-slate-50 text-slate-800 text-[11px] font-medium border border-slate-200 rounded px-1 py-0.5 cursor-pointer focus:outline-none"
            >
              <option value={15}>۱۵ ثانیه</option>
              <option value={30}>۳۰ ثانیه</option>
              <option value={60}>۱ دقیقه</option>
              <option value={0}>دستی</option>
            </select>
          </div>

          <button
            onClick={onManualRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer active:scale-95 disabled:opacity-50 text-[11px]"
            title="بروزرسانی مجدد قیمت‌ها"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>تازه سازی</span>
          </button>
        </div>
      </div>
    </div>
  );
};
