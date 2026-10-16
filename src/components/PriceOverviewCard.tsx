import React from 'react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';
import { TrendingUp, TrendingDown, Scale, Zap } from 'lucide-react';
import { GoldAssetIcon } from './GoldAssetIcon';

interface PriceOverviewCardProps {
  asset: AssetInfo;
  currencyRate?: number;
}

export const PriceOverviewCard: React.FC<PriceOverviewCardProps> = ({ asset }) => {
  const isPositive = asset.change24hPercent >= 0;
  const rangeProgress = Math.min(
    100,
    Math.max(
      0,
      ((asset.currentPrice - asset.low24h) / (asset.high24h - asset.low24h || 1)) * 100
    )
  );

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm shadow-amber-500/5 relative overflow-hidden">
      {/* Background subtle tint */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Main Price & Title */}
        <div className="flex items-start gap-4">
          <GoldAssetIcon assetKey={asset.id} size="lg" className="mt-1 shrink-0" />
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                {asset.symbol}
              </span>
              <span className="text-xs text-slate-600 font-semibold">{asset.nameFa}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {formatPrice(asset.currentPrice, asset.isUSD)}
            </h2>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-black ${
                  isPositive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border border-rose-300'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {formatPrice(asset.change24h, asset.isUSD)} ({isPositive ? '+' : ''}
                  {asset.change24hPercent}%)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>سیگنال تکنیکال: <strong className="text-emerald-700 font-black">خرید قوی (Strong Buy)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* 24h High/Low Range + Metrics */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:border-r lg:border-amber-200 lg:pr-6">
          {/* Daily Range Bar */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 min-w-[240px]">
            <div className="flex justify-between items-center text-xs text-slate-700 mb-1.5 font-bold">
              <span>کمترین ۲۴س: {formatPrice(asset.low24h, asset.isUSD)}</span>
              <span>بیشترین ۲۴س: {formatPrice(asset.high24h, asset.isUSD)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${rangeProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 mt-1 font-semibold">
              <span>محدوده روزانه</span>
              <span className="font-mono text-amber-900 font-black">{rangeProgress.toFixed(0)}%</span>
            </div>
          </div>

          {/* Bubble Status if Iran Coin */}
          {asset.bubblePercent !== undefined && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 min-w-[200px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1 font-bold">
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                  میزان حباب قیمت:
                </span>
                <span className="font-black text-amber-800">{asset.bubblePercent}%</span>
              </div>
              <div className="text-sm font-black text-slate-900">
                {formatPrice(asset.bubbleTomans || 0, false)}
              </div>
              <div className="text-[10px] font-bold text-slate-600 mt-1">
                {asset.bubblePercent > 20
                  ? '⚠️ حباب بالا - معامله با احتیاط'
                  : '🟢 حباب در محدوده معقول و متعادل'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
