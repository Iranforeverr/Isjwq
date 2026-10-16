import React, { useState } from 'react';
import { AssetInfo, TimeframeKey } from '../types';
import { formatPrice } from '../data/goldData';
import { Wallet, Calculator, TrendingUp, DollarSign, PiggyBank, Sparkles } from 'lucide-react';

interface GoldPortfolioCalculatorProps {
  asset: AssetInfo;
}

export const GoldPortfolioCalculator: React.FC<GoldPortfolioCalculatorProps> = ({ asset }) => {
  const [quantity, setQuantity] = useState<number>(10); // grams or coins
  const [purchasePrice, setPurchasePrice] = useState<number>(asset.currentPrice);
  const [selectedHorizon, setSelectedHorizon] = useState<TimeframeKey>('1month');

  // Multipliers for forecast
  const multipliers: Record<TimeframeKey, { bullish: number; base: number; bearish: number; label: string }> = {
    '1day': { bullish: 1.012, base: 1.004, bearish: 0.992, label: 'روز بعد (+۲۴ساعت)' },
    '1week': { bullish: 1.035, base: 1.018, bearish: 0.985, label: 'هفته بعد (+۷روز)' },
    '1month': { bullish: 1.085, base: 1.048, bearish: 0.970, label: 'ماه بعد (+۳۰روز)' },
    '2months': { bullish: 1.155, base: 1.092, bearish: 0.955, label: 'دو ماه بعد (+۶۰روز)' },
    '6months': { bullish: 1.280, base: 1.195, bearish: 0.930, label: 'شش ماه بعد (+۱۸۰روز)' },
    '1year': { bullish: 1.480, base: 1.320, bearish: 0.900, label: 'یک سال بعد (+۳۶۵روز)' },
  };

  const currentHorizon = multipliers[selectedHorizon];
  const totalCost = quantity * purchasePrice;
  const expectedValue = quantity * (asset.currentPrice * currentHorizon.base);
  const expectedProfit = expectedValue - totalCost;
  const expectedROI = totalCost > 0 ? ((expectedProfit / totalCost) * 100).toFixed(1) : '0';

  const bullishValue = quantity * (asset.currentPrice * currentHorizon.bullish);
  const bullishProfit = bullishValue - totalCost;

  const bearishValue = quantity * (asset.currentPrice * currentHorizon.bearish);
  const bearishProfit = bearishValue - totalCost;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              محاسبه‌گر سود و پیش‌بینی ارزش دارایی طلا
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            میزان طلای خود را وارد کنید تا ارزش آتی و تخمین سود/زیان را در تمام افق‌های زمانی بسنجید
          </p>
        </div>

        <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
          دارایی منتخب: {asset.nameFa}
        </span>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Quantity */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <label className="text-xs text-slate-300 font-semibold block">
            مقدار دارایی ({asset.isUSD ? 'انس' : asset.id.includes('coin') ? 'عدد سکه' : 'گرم'}):
          </label>
          <input
            type="number"
            min="0.1"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {/* Purchase Price */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <label className="text-xs text-slate-300 font-semibold block">
            قیمت خرید / مبنا:
          </label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {/* Target Horizon */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <label className="text-xs text-slate-300 font-semibold block">
            افق زمانی مد نظر:
          </label>
          <select
            value={selectedHorizon}
            onChange={(e) => setSelectedHorizon(e.target.value as TimeframeKey)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="1day">روز بعد (+۲۴ ساعت)</option>
            <option value="1week">هفته بعد (+۷ روز)</option>
            <option value="1month">ماه بعد (+۳۰ روز)</option>
            <option value="2months">دو ماه بعد (+۶۰ روز)</option>
            <option value="6months">شش ماه بعد (+۱۸۰ روز)</option>
            <option value="1year">یک سال بعد (+۳۶۵ روز)</option>
          </select>
        </div>
      </div>

      {/* Projection Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Bullish */}
        <div className="bg-emerald-950/25 border border-emerald-500/30 p-4 rounded-xl">
          <span className="text-xs text-emerald-400 font-bold block mb-1">
            سناریوی خوش‌بینانه ({currentHorizon.label})
          </span>
          <div className="text-base font-black text-slate-100 font-mono">
            {formatPrice(bullishValue, asset.isUSD)}
          </div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">
            سود تخمینی: +{formatPrice(bullishProfit, asset.isUSD)}
          </div>
        </div>

        {/* Base Case */}
        <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded-xl">
          <span className="text-xs text-amber-300 font-bold block mb-1">
            سناریوی پایه و محتمل ({currentHorizon.label})
          </span>
          <div className="text-lg font-black text-slate-100 font-mono">
            {formatPrice(expectedValue, asset.isUSD)}
          </div>
          <div className="text-xs text-emerald-400 font-bold mt-1">
            سود انتظاری: +{formatPrice(expectedProfit, asset.isUSD)} ({expectedROI}%)
          </div>
        </div>

        {/* Bearish */}
        <div className="bg-rose-950/25 border border-rose-500/30 p-4 rounded-xl">
          <span className="text-xs text-rose-400 font-bold block mb-1">
            سناریوی اصلاحی و بدبینانه
          </span>
          <div className="text-base font-black text-slate-100 font-mono">
            {formatPrice(bearishValue, asset.isUSD)}
          </div>
          <div className="text-xs text-rose-400 font-semibold mt-1">
            تغییر: {bearishProfit >= 0 ? '+' : ''}{formatPrice(bearishProfit, asset.isUSD)}
          </div>
        </div>
      </div>
    </div>
  );
};
