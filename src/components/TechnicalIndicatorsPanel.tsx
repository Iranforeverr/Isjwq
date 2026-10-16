import React from 'react';
import { TechnicalIndicatorData, AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';
import { Activity, Gauge, TrendingUp, TrendingDown, Layers, Hash, GitCommit } from 'lucide-react';

interface TechnicalIndicatorsPanelProps {
  indicators: TechnicalIndicatorData;
  asset: AssetInfo;
}

export const TechnicalIndicatorsPanel: React.FC<TechnicalIndicatorsPanelProps> = ({
  indicators,
  asset,
}) => {
  const rsi = indicators.rsi;
  const macd = indicators.macd;
  const ma = indicators.movingAverages;
  const bb = indicators.bollingerBands;
  const fib = indicators.fibonacciLevels;
  const pivots = indicators.pivots;

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm shadow-amber-500/5 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              شاخص‌ها و اندیکاتورهای کمی تکنیکال ({asset.nameFa})
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            محاسبه خودکار اسیلاتورها، سطوح پیوت و میانگین‌های متحرک برای تشخیص نقاط چرخش بازار
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black border border-emerald-300">
            برآیند اندیکاتورها: صعودی (Bullish)
          </span>
        </div>
      </div>

      {/* Grid of Indicator Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. RSI */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-bold flex items-center gap-1 text-slate-800">
              <Gauge className="w-4 h-4 text-amber-600" />
              شاخص RSI (14)
            </span>
            <span className="text-emerald-700 font-black">{rsi.signal}</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">{rsi.value}</span>
              <span className="text-xs text-slate-500 font-medium">از ۱۰۰</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2 relative">
              <div
                className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-full rounded-full"
                style={{ width: `${rsi.value}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 mt-1 font-semibold">
              <span>اشباع فروش (۳۰)</span>
              <span>خنثی (۵۰)</span>
              <span>اشباع خرید (۷۰)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-700 border-t border-amber-200 pt-2 font-medium">
            وضعیت: <span className="text-slate-900 font-black">{rsi.status}</span>
          </div>
        </div>

        {/* 2. MACD */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-bold flex items-center gap-1 text-slate-800">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              اندیکاتور MACD (12,26,9)
            </span>
            <span className="text-emerald-700 font-black">{macd.signal}</span>
          </div>

          <div className="my-2 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">خط مکدی:</span>
              <span className="font-mono text-emerald-700 font-black">{macd.value}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">خط سیگنال:</span>
              <span className="font-mono text-slate-800">{macd.signalLine}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">هیستوگرام:</span>
              <span className="font-mono text-emerald-800 font-black">+{macd.histogram}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-700 border-t border-amber-200 pt-2 font-medium">
            وضعیت: <span className="text-emerald-700 font-black">{macd.status}</span>
          </div>
        </div>

        {/* 3. Moving Averages */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-bold flex items-center gap-1 text-slate-800">
              <Layers className="w-4 h-4 text-amber-600" />
              میانگین‌های متحرک (EMA)
            </span>
            <span className="text-emerald-700 font-black">صعودی</span>
          </div>

          <div className="my-2 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">EMA 20 (کوتاه‌مدت):</span>
              <span className="font-mono text-slate-800">{formatPrice(ma.ema20, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">EMA 50 (میان‌مدت):</span>
              <span className="font-mono text-slate-800">{formatPrice(ma.ema50, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">EMA 200 (بلندمدت):</span>
              <span className="font-mono text-slate-800">{formatPrice(ma.ema200, asset.isUSD)}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-700 border-t border-amber-200 pt-2 font-medium">
            آرایش: <span className="text-emerald-700 font-black">قیمت بالاتر از تمام میانگین‌ها</span>
          </div>
        </div>

        {/* 4. Bollinger Bands */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="font-bold flex items-center gap-1 text-slate-800">
              <GitCommit className="w-4 h-4 text-amber-600" />
              باندهای بولینگر (20, 2)
            </span>
            <span className="text-blue-700 font-black">{bb.status}</span>
          </div>

          <div className="my-2 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">باند بالایی (Upper):</span>
              <span className="font-mono text-amber-800 font-black">{formatPrice(bb.upper, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">خط میانی (Middle):</span>
              <span className="font-mono text-slate-800">{formatPrice(bb.middle, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">باند پایینی (Lower):</span>
              <span className="font-mono text-slate-800">{formatPrice(bb.lower, asset.isUSD)}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-700 border-t border-amber-200 pt-2 font-medium">
            عرض باند: <span className="font-mono text-slate-900 font-bold">{bb.bandwidth}%</span>
          </div>
        </div>
      </div>

      {/* Pivot Points & Fibonacci Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* Support & Resistance Pivot Points */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
          <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-amber-600" />
            سطوح کلیدی پیوت پوینت (Pivot Points)
          </h4>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 font-bold">
              <span>مقاومت سوم (R3 - هدف صعودی بلند):</span>
              <span className="font-mono font-black">{formatPrice(pivots.r3, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50/70 text-rose-700 border border-rose-200 font-bold">
              <span>مقاومت دوم (R2 - هدف هفتگی):</span>
              <span className="font-mono font-black">{formatPrice(pivots.r2, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50/40 text-rose-700 border border-rose-200 font-semibold">
              <span>مقاومت اول (R1 - هدف روزانه):</span>
              <span className="font-mono font-black">{formatPrice(pivots.r1, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-amber-200/60 text-amber-950 font-black border border-amber-300">
              <span>نقطه پیوت مرکزی (Pivot Point P):</span>
              <span className="font-mono font-black">{formatPrice(pivots.pivot, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/40 text-emerald-700 border border-emerald-200 font-semibold">
              <span>حمایت اول (S1 - کف روزانه):</span>
              <span className="font-mono font-black">{formatPrice(pivots.s1, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/70 text-emerald-700 border border-emerald-200 font-bold">
              <span>حمایت دوم (S2 - کف هفتگی):</span>
              <span className="font-mono font-black">{formatPrice(pivots.s2, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
              <span>حمایت سوم (S3 - کف عمیق):</span>
              <span className="font-mono font-black">{formatPrice(pivots.s3, asset.isUSD)}</span>
            </div>
          </div>
        </div>

        {/* Fibonacci Retracement */}
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
          <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-600" />
            سطوح اصلاحی فیبوناچی (Fibonacci Retracement)
          </h4>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-amber-200 font-semibold">
              <span className="text-slate-600">تراز 100% (سقف تاریخی):</span>
              <span className="font-mono text-slate-900 font-bold">{formatPrice(fib.level100, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-amber-200 font-semibold">
              <span className="text-slate-600">تراز 78.6%:</span>
              <span className="font-mono text-slate-900 font-bold">{formatPrice(fib.level786, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-amber-100 text-amber-950 font-black border border-amber-300">
              <span>تراز زرین 61.8% (Golden Pocket):</span>
              <span className="font-mono font-black">{formatPrice(fib.level618, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-amber-200 font-semibold">
              <span className="text-slate-600">تراز 50.0% (تعادل میانه):</span>
              <span className="font-mono text-slate-900 font-bold">{formatPrice(fib.level500, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-amber-200 font-semibold">
              <span className="text-slate-600">تراز 38.2%:</span>
              <span className="font-mono text-slate-900 font-bold">{formatPrice(fib.level382, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-amber-200 font-semibold">
              <span className="text-slate-600">تراز 23.6%:</span>
              <span className="font-mono text-slate-900 font-bold">{formatPrice(fib.level236, asset.isUSD)}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-amber-200 font-semibold">
              <span className="text-slate-600">تراز 0.0% (کف موج قبل):</span>
              <span className="font-mono text-slate-900 font-bold">{formatPrice(fib.level0, asset.isUSD)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
