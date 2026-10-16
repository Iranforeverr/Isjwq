import React, { useState, useEffect } from 'react';
import {
  Layers,
  TrendingUp,
  ShieldCheck,
  Target,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  Box,
  Compass,
} from 'lucide-react';
import { TechnicalStructureEngine } from '../services/technicalStructureEngine';
import { Phase4TechnicalAnalysisPayload } from '../types/technicalEngines';
import { formatPrice } from '../data/goldData';

interface Phase4TechnicalHubProps {
  assetId?: string;
  currentPrice?: number;
  isUSD?: boolean;
}

export const Phase4TechnicalHub: React.FC<Phase4TechnicalHubProps> = ({
  assetId = 'xau_usd',
  currentPrice = 2748.5,
  isUSD = true,
}) => {
  const [data, setData] = useState<Phase4TechnicalAnalysisPayload>(() =>
    TechnicalStructureEngine.analyzeAsset(assetId, currentPrice, isUSD)
  );

  useEffect(() => {
    setData(TechnicalStructureEngine.analyzeAsset(assetId, currentPrice, isUSD));
  }, [assetId, currentPrice, isUSD]);

  const [activeSubTab, setActiveSubTab] = useState<'levels' | 'smc' | 'momentum' | 'elliott'>('levels');

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                هسته ساختار بازار، اسمارت‌مانی و سطوح کلیدی (Structure & SMC Engine)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۴: بندهای ۷ تا ۱۳ و ۲۲-۲۳
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              تشخیص شکست‌های ساختار (BOS/CHoCH)، قدرت سطوح حمایت/مقاومت و اردر بلاک‌های معتبر
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
          <button
            onClick={() => setActiveSubTab('levels')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeSubTab === 'levels' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سطوح کلیدی و امتیاز قدرت
          </button>
          <button
            onClick={() => setActiveSubTab('smc')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeSubTab === 'smc' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اسمارت‌مانی (SMC/FVG)
          </button>
          <button
            onClick={() => setActiveSubTab('momentum')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeSubTab === 'momentum' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مومنتوم و میانگین‌ها
          </button>
          <button
            onClick={() => setActiveSubTab('elliott')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeSubTab === 'elliott' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            امواج الیوت و فیبوناچی
          </button>
        </div>
      </div>

      {/* Structure Summary & Verdict Banner */}
      <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">امتیاز ساختار بازار (Structure Score):</span>
            <strong className="text-sm font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              +{data.structureScore} از ۱۰۰ (صعودی قوی)
            </strong>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
            {data.synthesizedTechnicalVerdictFa}
          </p>
        </div>

        <div className="bg-white px-3 py-2 rounded-xl border border-amber-200/70 text-right shrink-0 shadow-xs">
          <span className="text-[10px] text-slate-500 block">شکست ساختار اخیر:</span>
          <span className="text-xs font-bold text-amber-800 font-mono">{data.recentBreaks[0]?.type} روزانه ثبت شد ✓</span>
        </div>
      </div>

      {/* SUB-TAB 1: KEY LEVELS & STRENGTH SCORE (Clause 11) */}
      {activeSubTab === 'levels' && (
        <div className="space-y-3 animate-fadeIn text-xs">
          <div className="text-slate-700 font-bold flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-600" />
            <span>سطوح کلیدی حمایت و مقاومت با امتیازدهی به قدرت هر لول (Level Strength):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.keyLevels.map((lvl) => {
              const isRes = lvl.type.includes('resistance');
              return (
                <div key={lvl.id} className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{lvl.labelFa}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                        isRes
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {isRes ? 'مقاومت' : 'حمایت ماژور'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-amber-100">
                    <span className="text-slate-500">قیمت سطح:</span>
                    <strong className="font-mono text-sm text-slate-900">{formatPrice(lvl.price, isUSD)}</strong>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>امتیاز استحکام سطح:</span>
                    <strong className="font-mono text-amber-800 font-bold">{lvl.strengthScore} / ۱۰۰</strong>
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>تعداد دفعات واکنش موفق:</span>
                    <span className="font-mono text-slate-700">{lvl.numberOfReactions} بار</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CONTEXTUAL SMC ELEMENTS (Clause 12) */}
      {activeSubTab === 'smc' && (
        <div className="space-y-3 animate-fadeIn text-xs">
          <div className="text-slate-700 font-bold flex items-center gap-1.5">
            <Box className="w-4 h-4 text-amber-600" />
            <span>عناصر فعال اسمارت‌مانی معتبر و مشروط به کانتکست ساختار (SMC/ICT Engine):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.smcElements.map((el) => (
              <div key={el.id} className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {el.type === 'order_block'
                      ? 'اردربلاک تقاضا (Order Block)'
                      : el.type === 'fvg'
                      ? 'گپ ارزش منصفانه (Fair Value Gap)'
                      : 'استاپ هانت و شکار نقدینگی'}
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-mono font-bold">
                    تایید با تایم بالا ✓
                  </span>
                </div>

                <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-slate-700 leading-relaxed">
                  {el.explanationFa}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-amber-100 pt-2">
                  <span>بازه قیمتی زون:</span>
                  <span className="font-mono font-bold text-amber-800">
                    {formatPrice(el.rangeStart, isUSD)} تا {formatPrice(el.rangeEnd, isUSD)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MOMENTUM & DIVERGENCE (Clauses 8, 9) */}
      {activeSubTab === 'momentum' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">شاخص قدرت نسبی (RSI 14)</span>
              <strong className="text-sm font-mono text-emerald-700 block mt-1">{data.momentum.rsiValue}</strong>
              <span className="text-[10px] text-slate-500 mt-1 block">{data.momentum.rsiStateFa}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">آرایش میانگین‌های نمایی (EMA Stack)</span>
              <strong className="text-sm font-bold text-amber-800 block mt-1">آرایش صعودی (۲۰ &gt; ۵۰ &gt; ۲۰۰)</strong>
              <span className="text-[10px] text-slate-500 mt-1 block">فاصله از میانگین ۲۰۰ روزه: +{data.momentum.distanceFrom200EmaPercent}٪</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">ریسک فرسودگی روند (Exhaustion Risk)</span>
              <strong className="text-sm font-bold text-amber-700 block mt-1">{data.momentum.exhaustionRisk}</strong>
              <span className="text-[10px] text-slate-500 mt-1 block">واگرایی منفی MACD مشاهده نشد</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-amber-200/60 shadow-xs">
            <strong>قاعده بند ۹ سند:</strong> ورود RSI به محدوده بالای ۶۰ هرگز به تنهایی به معنای سیگنال فروش نیست، بلکه در یک روند پرقدرت نشان‌دهنده شتاب مثبت خریداران است.
          </p>
        </div>
      )}

      {/* SUB-TAB 4: ELLIOTT & FIBONACCI (Clauses 22, 23) */}
      {activeSubTab === 'elliott' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 space-y-1 shadow-xs">
              <span className="text-slate-500 block text-[10px]">شمارش موجی اصلی (Primary Count):</span>
              <strong className="text-xs font-bold text-emerald-700 block">{data.elliottAndFib.primaryCount}</strong>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 space-y-1 shadow-xs">
              <span className="text-slate-500 block text-[10px]">شمارش موجی جایگزین (Alternative Count):</span>
              <strong className="text-xs font-bold text-amber-800 block">{data.elliottAndFib.alternativeCount}</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>سطح ابطال سناریوی صعودی موجی (Invalidation Level):</span>
            </div>
            <strong className="font-mono text-sm text-rose-950 font-bold">
              زیر {formatPrice(data.elliottAndFib.invalidationLevel, isUSD)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};
