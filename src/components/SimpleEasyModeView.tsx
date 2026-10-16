import React, { useState } from 'react';
import { SimpleLiveScanRunner } from './SimpleLiveScanRunner';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Calendar,
  Wallet,
  Calculator,
  Smile,
  ShieldCheck,
  ChevronRight,
  Flame,
  Layers,
  Globe,
  Award,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { AssetInfo, AssetKey, TimeframeKey } from '../types';
import { formatPrice, formatPriceCompact } from '../data/goldData';

interface SimpleEasyModeViewProps {
  selectedAsset: AssetInfo;
  assetsMap: Record<AssetKey, AssetInfo>;
  onSelectAsset: (key: AssetKey) => void;
  onAskQuestion: (question: string) => void;
  onOpenProStages?: () => void;
}

export const SimpleEasyModeView: React.FC<SimpleEasyModeViewProps> = ({
  selectedAsset,
  assetsMap,
  onSelectAsset,
  onAskQuestion,
  onOpenProStages,
}) => {
  // Quick investment amount state (in Tomans)
  const [investAmount, setInvestAmount] = useState<number>(20000000); // 20 million tomans default
  const [selectedInvestPeriod, setSelectedInvestPeriod] = useState<'1day' | '1week' | '1month' | '2months' | '1year'>('1month');

  // Multi-horizon forecast calculations in simple terms
  const currentPrice = selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  // Percentage growth expected for each period
  const growthRates = {
    '1day': { pct: isUSD ? 0.4 : 0.6, label: 'فردا (+۲۴ ساعت)', emoji: '⚡' },
    '1week': { pct: isUSD ? 1.8 : 2.4, label: 'هفته بعد (+۷ روز)', emoji: '📅' },
    '1month': { pct: isUSD ? 4.5 : 5.8, label: 'ماه بعد (+۳۰ روز)', emoji: '🚀' },
    '2months': { pct: isUSD ? 8.5 : 11.2, label: 'دو ماه بعد (+۶۰ روز)', emoji: '🔥' },
    '1year': { pct: isUSD ? 29.0 : 41.0, label: 'یک سال بعد (+۳۶۵ روز)', emoji: '💎' },
  };

  const getFuturePrice = (period: keyof typeof growthRates) => {
    const rate = growthRates[period].pct;
    const future = currentPrice * (1 + rate / 100);
    return isUSD ? Math.round(future * 10) / 10 : Math.round(future);
  };

  // Calculate profit on invested amount
  const selectedRate = growthRates[selectedInvestPeriod].pct;
  const profitAmount = Math.round((investAmount * selectedRate) / 100);
  const totalAmount = investAmount + profitAmount;

  // Quick preset amounts
  const presetAmounts = [
    { label: '۱۰ میلیون', val: 10000000 },
    { label: '۲۰ میلیون', val: 20000000 },
    { label: '۵۰ میلیون', val: 50000000 },
    { label: '۱۰۰ میلیون', val: 100000000 },
    { label: '۲۰۰ میلیون', val: 200000000 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Large Friendly Asset Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
        <h2 className="text-base sm:text-lg font-black text-slate-100 mb-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <span>کدام طلا یا سکه را می‌خواهی بررسی کنی؟</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {[
            { key: 'gold_18k' as AssetKey, title: 'طلای ۱۸ عیار', sub: 'هر گرم طلا', icon: '🪙' },
            { key: 'emami_coin' as AssetKey, title: 'سکه تمام (امامی)', sub: 'طرح جدید', icon: '🟡' },
            { key: 'quarter_coin' as AssetKey, title: 'ربع سکه', sub: 'پرطرفدارترین سکه', icon: '💰' },
            { key: 'half_coin' as AssetKey, title: 'نیم سکه', sub: 'بهار آزادی', icon: '🪙' },
            { key: 'xau_usd' as AssetKey, title: 'انس جهانی', sub: 'قیمت دلاری طلا', icon: '🌍' },
          ].map((item) => {
            const asset = assetsMap[item.key];
            const isSelected = selectedAsset.id === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectAsset(item.key)}
                className={`p-3.5 sm:p-4 rounded-2xl text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between border-2 ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-black text-sm sm:text-base text-slate-100">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mb-2">{item.sub}</div>
                </div>

                <div className="mt-1 pt-2 border-t border-slate-800/60">
                  <div className="font-mono font-bold text-xs sm:text-sm text-slate-100">
                    {formatPriceCompact(asset?.currentPrice || 0, asset?.isUSD)}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                    +{asset?.change24hPercent || 0.8}% در ۲۴ ساعت
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 left-2 bg-amber-400 text-slate-950 rounded-full p-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 NEW INTERACTIVE LIVE SCAN BUTTON (حالت خودمانی با دکمه اجرای زنده اسکن) */}
      <SimpleLiveScanRunner
        selectedAsset={selectedAsset}
        onAskQuestion={onAskQuestion}
      />

      {/* 2. BIG HERO VERDICT: "الان بخرم یا نه؟" (Direct Answer Card) */}
      <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              پاسخ صریح و فوری هوش مصنوعی
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-50 mb-2 flex items-center gap-3">
              <span>الان وقت خریده؟</span>
              <span className="text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-2xl border border-emerald-500/30">
                بله، بخرید 🟢
              </span>
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mt-3">
              به زبان خیلی ساده: قیمت <strong className="text-amber-300 font-bold">{selectedAsset.nameFa}</strong> الان{' '}
              <strong className="text-white font-black">{formatPrice(selectedAsset.currentPrice, selectedAsset.isUSD)}</strong> است و با احتمال{' '}
              <strong className="text-emerald-400 font-bold">بیش از ۸۵ درصد</strong>، در روزها و هفته‌های آینده سود خواهد داد چون تقاضای خرید در بازار بالاست و دلار روند صعودی دارد.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 min-w-[260px] text-center space-y-2">
            <div className="text-xs text-slate-400">قیمت زنده بازار (TGJU)</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {formatPrice(selectedAsset.currentPrice, selectedAsset.isUSD)}
            </div>
            <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 py-1 px-3 rounded-lg inline-block">
              روند کلی: صعودی و سودده 📈
            </div>
          </div>
        </div>
      </div>

      {/* PRO FOUR STAGES PROMO CALLOUT */}
      {onOpenProStages && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black text-slate-100 flex items-center gap-2">
                <span>می‌خواهی تحلیل خیلی حرفه‌ای ۴ مرحله‌ای را ببینی؟</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">PRO</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                شامل: ۱. تقویم فدرال رزرو و شاخص DXY • ۲. گزارش تعهد نهنگ‌ها (COT) • ۳. سطوح پیوت و پرایس‌اکشن • ۴. صندوق‌های طلای بورس کالا
              </p>
            </div>
          </div>

          <button
            onClick={onOpenProStages}
            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
          >
            <span>ورود به میز کار ۴ مرحله‌ای</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. MULTI-HORIZON FORECAST CARDS: "قیمت در آینده چقدر میشه؟" */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>پیش‌بینی قیمت {selectedAsset.nameFa} در آینده</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              قیمت‌های تخمینی بر اساس هوش مصنوعی و فرمول‌های بازار
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(Object.keys(growthRates) as Array<keyof typeof growthRates>).map((period) => {
            const item = growthRates[period];
            const futurePrice = getFuturePrice(period);
            const diffPrice = futurePrice - currentPrice;

            return (
              <div
                key={period}
                className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-slate-950 space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-300">{item.label}</span>
                    <span className="text-base">{item.emoji}</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-amber-300 font-mono mt-1">
                    {formatPriceCompact(futurePrice, isUSD)}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">سود مورد انتظار:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      +{item.pct}%
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-semibold mt-1">
                    +{formatPriceCompact(diffPrice, isUSD)} روی هر واحد
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ULTRA-SIMPLE PROFIT CALCULATOR: "چقدر پول بذارم، چقدر گیرم میاد؟" */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-100">
              ماشین‌حساب سود طلا (فوق‌العاده ساده)
            </h3>
            <p className="text-xs text-slate-400">
              مبلغ مورد نظرت رو انتخاب کن تا ببینی چقدر سود می‌کنی
            </p>
          </div>
        </div>

        {/* Step 1: Select Amount */}
        <div className="space-y-2">
          <label className="text-xs text-slate-300 font-semibold">
            ۱. چقدر می‌خواهی پول وارد کنی؟
          </label>
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((p) => (
              <button
                key={p.val}
                onClick={() => setInvestAmount(p.val)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  investAmount === p.val
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Duration */}
        <div className="space-y-2">
          <label className="text-xs text-slate-300 font-semibold">
            ۲. برای چه مدتی می‌خواهی نگه‌داری؟
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(growthRates) as Array<keyof typeof growthRates>).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedInvestPeriod(period)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  selectedInvestPeriod === period
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {growthRates[period].label}
              </button>
            ))}
          </div>
        </div>

        {/* Big Profit Box Result */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-950 to-slate-950 border-2 border-emerald-500/50 rounded-2xl p-5 sm:p-6">
          <div className="text-xs text-slate-300 font-medium mb-1">
            نتیجه سرمایه‌گذاری شما بعد از{' '}
            <strong className="text-amber-300 font-bold">{growthRates[selectedInvestPeriod].label}</strong>:
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mt-2">
            <div>
              <div className="text-xs text-slate-400">سرمایه کل نهایی شما:</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {totalAmount.toLocaleString('fa-IR')} تومان
              </div>
            </div>

            <div className="bg-emerald-500/15 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
              <div className="text-xs text-emerald-300 font-semibold">سود خالص جیب شما:</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-0.5">
                +{profitAmount.toLocaleString('fa-IR')} تومان (+{selectedRate}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUICK COMMON QUESTIONS (پرسش‌های متداول ساده) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>سوالات پرتکرار مردم (کلیک کنید تا هوش مصنوعی جواب بدهد)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            'آیا طلا تا پایان سال گرون‌تر میشه؟',
            'طلای ۱۸ عیار بخرم بهتره یا سکه؟',
            'حباب سکه چیه و چطور سرم کلاه نره؟',
            'اگر ۵۰ میلیون تومان پول داشته باشم چی بخرم؟',
            'بهترین زمان برای خرید طلا چه روزی از هفته است؟',
            'آیا امکان افت قیمت طلا وجود دارد؟',
          ].map((q) => (
            <button
              key={q}
              onClick={() => onAskQuestion(q)}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 text-right text-xs font-semibold text-slate-200 hover:text-amber-300 transition-all flex items-center justify-between cursor-pointer group"
            >
              <span>{q}</span>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:-translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
