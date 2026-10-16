import React, { useState, useEffect } from 'react';
import {
  Coins,
  Percent,
  Scale,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Flame,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { IranGoldEngine } from '../services/iranGoldEngine';
import { IranGoldEngineFullPayload } from '../types/iranGoldEngine';
import { formatPrice } from '../data/goldData';

interface Phase2IranGoldDecompositionProps {
  currentOunce?: number;
  currentUsd?: number;
}

export const Phase2IranGoldDecomposition: React.FC<Phase2IranGoldDecompositionProps> = ({
  currentOunce = 2748.5,
  currentUsd = 230000,
}) => {
  const [data, setData] = useState<IranGoldEngineFullPayload>(() =>
    IranGoldEngine.runFullAssessment(currentOunce, currentUsd)
  );
  const [activeTab, setActiveTab] = useState<'attribution' | 'intrinsic' | 'usd_engine'>('attribution');

  useEffect(() => {
    setData(IranGoldEngine.runFullAssessment(currentOunce, currentUsd));
  }, [currentOunce, currentUsd]);

  const { attributionAnalysis, gold18k, emamiCoin, quarterCoin, usdEngine } = data;

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                موتور ارزش ذاتی، حباب و تفکیک سهم دلار/اونس (Decomposition Engine)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۲: بندهای ۲۴ تا ۲۸
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              آیا طلا در ایران گران است یا مناسب؟ چه سهمی از رشد قیمت ناشی از دلار بوده و چه سهمی از اونس جهانی؟
            </p>
          </div>
        </div>

        {/* Navigation Switcher */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
          <button
            onClick={() => setActiveTab('attribution')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'attribution'
                ? 'bg-amber-400 text-amber-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تفکیک سهم دلار و اونس
          </button>
          <button
            onClick={() => setActiveTab('intrinsic')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'intrinsic'
                ? 'bg-amber-400 text-amber-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ماتریس حباب و ارزش منصفانه
          </button>
          <button
            onClick={() => setActiveTab('usd_engine')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'usd_engine'
                ? 'bg-amber-400 text-amber-950 font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تحلیل مستقل دلار
          </button>
        </div>
      </div>

      {/* TAB 1: PRICE DECOMPOSITION ATTRIBUTION (Clause 26) */}
      {activeTab === 'attribution' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Attribution Banner */}
          <div className="bg-amber-50/40 border border-amber-200/80 p-4 sm:p-5 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-amber-600" />
                <span>محرک اصلی رشد اخیر طلای داخل:</span>
                <strong className="text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                  {attributionAnalysis.primaryDriverFa}
                </strong>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                مبنا: اونس ${data.ouncePriceUsd} | دلار {data.usdRateToman.toLocaleString('fa-IR')} تومان
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {attributionAnalysis.analysisConclusionFa}
            </p>

            {/* Proportion Bars */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>سهم نرخ دلار: <strong className="text-emerald-700 font-mono">{attributionAnalysis.driversContribution.usdExchangeRateEffectPercent}%</strong></span>
                <span>سهم اونس جهانی: <strong className="text-sky-700 font-mono">{attributionAnalysis.driversContribution.globalOunceEffectPercent}%</strong></span>
                <span>سهم پرمیوم و تقاضای داخلی: <strong className="text-amber-700 font-mono">{attributionAnalysis.driversContribution.domesticPremiumEffectPercent}%</strong></span>
              </div>

              <div className="w-full h-3.5 bg-amber-100/70 rounded-full overflow-hidden flex p-0.5 border border-amber-200">
                <div
                  style={{ width: `${attributionAnalysis.driversContribution.usdExchangeRateEffectPercent}%` }}
                  className="bg-emerald-500 h-full rounded-r-full"
                  title="سهم دلار"
                ></div>
                <div
                  style={{ width: `${attributionAnalysis.driversContribution.globalOunceEffectPercent}%` }}
                  className="bg-sky-500 h-full"
                  title="سهم اونس جهانی"
                ></div>
                <div
                  style={{ width: `${attributionAnalysis.driversContribution.domesticPremiumEffectPercent}%` }}
                  className="bg-amber-500 h-full rounded-l-full"
                  title="سهم پرمیوم"
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTRINSIC BUBBLE & FAIR VALUE MATRIX (Clauses 24, 27, 28) */}
      {activeTab === 'intrinsic' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn text-xs">
          {/* 18K Gold */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-black text-slate-900">{gold18k.assetNameFa}</strong>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                کم‌ریسک‌ترین
              </span>
            </div>

            <div className="space-y-1 py-1 border-y border-amber-100">
              <div className="flex justify-between">
                <span className="text-slate-500">قیمت تابلو بازار:</span>
                <span className="font-mono font-bold text-slate-900">{formatPrice(gold18k.marketPriceToman, false)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ارزش ذاتی تئوریک:</span>
                <span className="font-mono text-slate-700">{formatPrice(gold18k.theoreticalValueToman, false)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">حباب / پرمیوم:</span>
                <span className="font-mono font-bold text-emerald-700">+{gold18k.bubbleOrPremiumPercent}٪</span>
              </div>
            </div>

            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50 text-[11px] text-slate-600 space-y-1">
              <span className="block text-amber-900 font-bold">بازه منصفانه (Fair Range):</span>
              <span className="font-mono text-slate-800 block font-bold">
                {gold18k.fairValueRange.minToman.toLocaleString('fa-IR')} تا {gold18k.fairValueRange.maxToman.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>

          {/* Emami Coin */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-black text-slate-900">{emamiCoin.assetNameFa}</strong>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                حباب متوسط
              </span>
            </div>

            <div className="space-y-1 py-1 border-y border-amber-100">
              <div className="flex justify-between">
                <span className="text-slate-500">قیمت تابلو بازار:</span>
                <span className="font-mono font-bold text-slate-900">{formatPrice(emamiCoin.marketPriceToman, false)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">طلای خالص موجود:</span>
                <span className="font-mono text-slate-700">{formatPrice(emamiCoin.theoreticalValueToman, false)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">مبلغ خالص حباب:</span>
                <span className="font-mono font-bold text-amber-800">
                  +{formatPrice(emamiCoin.bubbleOrPremiumToman, false)} ({emamiCoin.bubbleOrPremiumPercent}٪)
                </span>
              </div>
            </div>

            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/50 text-[11px] text-slate-600 space-y-1">
              <span className="block text-amber-900 font-bold">وضعیت ارزندگی:</span>
              <span className="text-slate-800 block">{emamiCoin.valuationStatusFa}</span>
            </div>
          </div>

          {/* Quarter Coin */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <strong className="text-sm font-black text-slate-900">{quarterCoin.assetNameFa}</strong>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                حباب بالا (پرریسک)
              </span>
            </div>

            <div className="space-y-1 py-1 border-y border-amber-100">
              <div className="flex justify-between">
                <span className="text-slate-500">قیمت تابلو بازار:</span>
                <span className="font-mono font-bold text-slate-900">{formatPrice(quarterCoin.marketPriceToman, false)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">طلای خالص موجود:</span>
                <span className="font-mono text-slate-700">{formatPrice(quarterCoin.theoreticalValueToman, false)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">حباب اسمی:</span>
                <span className="font-mono font-bold text-rose-700">
                  +{quarterCoin.bubbleOrPremiumPercent}٪
                </span>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl text-[11px] text-rose-800">
              توصیه تصمیم‌یار: بیش از یک‌سوم قیمت ربع سکه حباب است؛ برای سرمایه‌گذاری طلای آبشده یا ۱۸ عیار ریسک حباب ندارد.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INDEPENDENT USD/IRR ENGINE (Clause 25) */}
      {activeTab === 'usd_engine' && (
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div>
              <div className="text-slate-900 font-black text-sm">موتور مستقل نرخ برابری دلار (USD/IRR Engine)</div>
              <p className="text-slate-500 text-[11px] mt-0.5">{usdEngine.attributionTextFa}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block">دلار آزاد:</span>
                <strong className="font-mono text-amber-900 text-sm">{usdEngine.currentUsdRateToman.toLocaleString('fa-IR')} تومان</strong>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block">تتر (USDT):</span>
                <strong className="font-mono text-emerald-700 text-sm">{usdEngine.currentUsdtRateToman.toLocaleString('fa-IR')} تومان</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-amber-200/70 space-y-1">
              <span className="text-slate-600 block font-bold">سطوح حمایت تکنیکال دلار:</span>
              <div className="flex gap-2 font-mono text-emerald-700 font-bold">
                {usdEngine.supportLevelsToman.map((s, idx) => (
                  <span key={idx} className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {s.toLocaleString('fa-IR')}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 space-y-1">
              <span className="text-slate-600 block font-bold">سطوح مقاومت تکنیکال دلار:</span>
              <div className="flex gap-2 font-mono text-rose-700 font-bold">
                {usdEngine.resistanceLevelsToman.map((r, idx) => (
                  <span key={idx} className="bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {r.toLocaleString('fa-IR')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
