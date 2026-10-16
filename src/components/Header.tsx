import React from 'react';
import { ASSETS, formatPrice } from '../data/goldData';
import { AssetKey, AssetInfo } from '../types';
import {
  TrendingUp,
  Sparkles,
  Home,
  BarChart3,
  Crosshair,
  Layers,
  Scale,
  Activity,
  Globe2,
  BookOpen,
  Brain,
  MessageSquare,
} from 'lucide-react';

export type MainTabKey =
  | 'home'
  | 'technical'
  | 'smc'
  | 'elliott'
  | 'arbitrage'
  | 'volume'
  | 'macro'
  | 'matrix'
  | 'psychology'
  | 'chat';

interface NavMenuItem {
  key: MainTabKey;
  labelFa: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_MENU_ITEMS: NavMenuItem[] = [
  { key: 'home', labelFa: 'تحلیل هوشمند (صفحه اصلی)', icon: Home },
  { key: 'technical', labelFa: 'چارت تکنیکال', icon: BarChart3 },
  { key: 'smc', labelFa: 'اسمارت‌مانی (SMC)', icon: Crosshair },
  { key: 'elliott', labelFa: 'امواج الیوت', icon: Layers },
  { key: 'arbitrage', labelFa: 'حباب و ارزش ذاتی', icon: Scale },
  { key: 'volume', labelFa: 'جریان سفارشات', icon: Activity },
  { key: 'macro', labelFa: 'اقتصاد کلان', icon: Globe2 },
  { key: 'matrix', labelFa: 'ماتریس سناریوها', icon: BookOpen },
  { key: 'psychology', labelFa: 'روانشناسی بازار', icon: Brain },
  { key: 'chat', labelFa: 'مشاور هوش مصنوعی', icon: MessageSquare },
];

interface HeaderProps {
  selectedAsset: AssetKey;
  onSelectAsset: (asset: AssetKey) => void;
  onRefreshAI: () => void;
  isLoadingAI: boolean;
  assets?: Record<AssetKey, AssetInfo>;
  activeTab: MainTabKey;
  onSelectTab: (tab: MainTabKey) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedAsset,
  onSelectAsset,
  onRefreshAI,
  isLoadingAI,
  assets = ASSETS,
  activeTab,
  onSelectTab,
}) => {
  const currentAssets = assets || ASSETS;

  return (
    <header className="border-b border-amber-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50">
      {/* 1. TOP ULTRA-CLEAN SLIM ROW */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              سامانه هوشمند <span className="text-amber-600">تحلیل طلا</span>
            </h1>
            <span className="hidden md:inline-block text-[10px] text-slate-400 font-medium">
              | موتور محاسباتی انس و ارز
            </span>
          </div>
        </div>

        {/* Quick Ticker Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          {Object.values(currentAssets).slice(0, 4).map((a) => (
            <button
              key={a.id}
              onClick={() => onSelectAsset(a.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                selectedAsset === a.id
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span>{a.nameFa}:</span>
              <span className="font-mono font-bold">{formatPrice(a.currentPrice, a.isUSD)}</span>
            </button>
          ))}
        </div>

        {/* AI Action Button */}
        <button
          onClick={onRefreshAI}
          disabled={isLoadingAI}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-yellow-400 text-slate-950 font-bold text-[11px] transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0 shadow-xs"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoadingAI ? 'animate-spin' : ''}`} />
          <span>{isLoadingAI ? 'در حال اسکن...' : 'بروزرسانی داده‌ها'}</span>
        </button>
      </div>

      {/* 2. MINIMALIST HORIZONTAL SCROLL NAV TABS */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-3 sm:px-5">
        <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-none py-1.5">
          <div className="flex items-center gap-1 min-w-max">
            {NAV_MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold shadow-xs border border-amber-300 ring-1 ring-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{item.labelFa}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
