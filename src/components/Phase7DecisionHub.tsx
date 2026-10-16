import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Percent,
  ShieldCheck,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Target,
  Sparkles,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { DecisionSynthesisEngine } from '../services/decisionSynthesisEngine';
import { Phase7DecisionEnginePayload } from '../types/decisionSynthesis';
import { formatPrice } from '../data/goldData';

interface Phase7DecisionHubProps {
  assetId?: string;
  currentPrice?: number;
  isUSD?: boolean;
}

export const Phase7DecisionHub: React.FC<Phase7DecisionHubProps> = ({
  assetId = 'xau_usd',
  currentPrice = 2748.5,
  isUSD = true,
}) => {
  const [data, setData] = useState<Phase7DecisionEnginePayload>(() =>
    DecisionSynthesisEngine.generateDecision(assetId, currentPrice, isUSD)
  );

  useEffect(() => {
    setData(DecisionSynthesisEngine.generateDecision(assetId, currentPrice, isUSD));
  }, [assetId, currentPrice, isUSD]);

  const [activeTab, setActiveTab] = useState<'scenarios' | 'allocation' | 'invalidation'>('scenarios');

  const { tripleScenarios, lumpSumVsDcaGuide, invalidationFramework, horizonSpecificAdvice } = data;

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                هسته تصمیم‌گیری نهایی، سناریوهای سه‌گانه و تخصیص سرمایه (Decision Engine)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۷: بندهای ۳۳ تا ۳۸ و ۵۴-۵۷
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              توصیه صریح، سناریوهای سه‌گانه با احتمالات وزنی، سطح ابطال قطعی و نقشه خرید پله‌ای
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'scenarios' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سناریوهای ۳گانه
          </button>
          <button
            onClick={() => setActiveTab('allocation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'allocation' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            نقشه تخصیص سرمایه (DCA)
          </button>
          <button
            onClick={() => setActiveTab('invalidation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'invalidation' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            چارچوب سطح ابطال
          </button>
        </div>
      </div>

      {/* Main Action Recommendation Banner (Clause 33) */}
      <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">توصیه رسمی تصمیم‌یار:</span>
            <strong className="text-sm font-black text-amber-950 bg-amber-300/60 px-3 py-1 rounded-xl border border-amber-400 shadow-xs">
              {data.recommendationTitleFa}
            </strong>
          </div>
          <span className="text-[11px] text-slate-500">
            ضریب قطعیت تصمیم: <strong className="text-emerald-700 font-mono font-bold">{data.confidencePercent}٪</strong>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {data.executiveSummaryFa}
        </p>

        {/* Time-Horizon Advice (Clause 38) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60 text-xs">
          <div className="bg-white p-3 rounded-xl border border-amber-200/70 space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>معامله‌گران نوسان‌گیری (Swing Traders):</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{horizonSpecificAdvice.shortTermSwing}</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200/70 space-y-1 shadow-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Briefcase className="w-3.5 h-3.5 text-amber-700" />
              <span>سرمایه‌گذاران میان‌مدت و فیزیکی:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{horizonSpecificAdvice.mediumTermInvestor}</p>
          </div>
        </div>
      </div>

      {/* TAB 1: TRIPLE SCENARIOS (Clauses 34, 35) */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn text-xs">
          {/* Base Case */}
          <div className="bg-white border border-amber-300 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-amber-500"></div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">سناریوی پایه (Base Case)</span>
              <strong className="text-sm font-mono text-emerald-800 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                {tripleScenarios.baseCase.probabilityPercent}٪ احتمال
              </strong>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">{tripleScenarios.baseCase.narrativeFa}</p>

            <div className="space-y-1.5 pt-2 border-t border-amber-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">تارگت قیمتی سناریو:</span>
                <strong className="font-mono text-slate-900 text-sm font-bold">
                  {formatPrice(tripleScenarios.baseCase.targetPrice, isUSD)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">افق زمانی تحقق:</span>
                <span className="text-slate-700 font-bold">{tripleScenarios.baseCase.expectedTimeframeFa}</span>
              </div>
            </div>

            <div className="bg-amber-50/60 p-2 rounded-xl text-[10px] text-slate-600 border border-amber-200/50">
              <strong className="text-slate-800 block mb-0.5">شرط فعال‌سازی:</strong>
              {tripleScenarios.baseCase.triggerConditionFa}
            </div>
          </div>

          {/* Bullish Extended */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-sky-500"></div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">سناریوی خوش‌بینانه</span>
              <strong className="text-sm font-mono text-sky-800 font-black bg-sky-50 px-2 py-0.5 rounded border border-sky-300">
                {tripleScenarios.bullExtended.probabilityPercent}٪ احتمال
              </strong>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">{tripleScenarios.bullExtended.narrativeFa}</p>

            <div className="space-y-1.5 pt-2 border-t border-amber-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">تارگت جهش شتابان:</span>
                <strong className="font-mono text-slate-900 text-sm font-bold">
                  {formatPrice(tripleScenarios.bullExtended.targetPrice, isUSD)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">افق زمانی تحقق:</span>
                <span className="text-slate-700 font-bold">{tripleScenarios.bullExtended.expectedTimeframeFa}</span>
              </div>
            </div>

            <div className="bg-amber-50/60 p-2 rounded-xl text-[10px] text-slate-600 border border-amber-200/50">
              <strong className="text-slate-800 block mb-0.5">شرط فعال‌سازی:</strong>
              {tripleScenarios.bullExtended.triggerConditionFa}
            </div>
          </div>

          {/* Bearish Correction */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-rose-400"></div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">سناریوی اصلاحی بدبینانه</span>
              <strong className="text-sm font-mono text-amber-900 font-black bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {tripleScenarios.bearCorrection.probabilityPercent}٪ احتمال
              </strong>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">{tripleScenarios.bearCorrection.narrativeFa}</p>

            <div className="space-y-1.5 pt-2 border-t border-amber-100 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">کف اصلاحی احتمالی:</span>
                <strong className="font-mono text-slate-900 text-sm font-bold">
                  {formatPrice(tripleScenarios.bearCorrection.targetPrice, isUSD)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">افق زمانی تحقق:</span>
                <span className="text-slate-700 font-bold">{tripleScenarios.bearCorrection.expectedTimeframeFa}</span>
              </div>
            </div>

            <div className="bg-amber-50/60 p-2 rounded-xl text-[10px] text-slate-600 border border-amber-200/50">
              <strong className="text-slate-800 block mb-0.5">شرط فعال‌سازی:</strong>
              {tripleScenarios.bearCorrection.triggerConditionFa}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAPITAL ALLOCATION & STAGGERED DCA (Clauses 37, 54) */}
      {activeTab === 'allocation' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div>
              <div className="text-slate-900 font-black text-sm">راهنمای تقسیم سرمایه و پله‌های خرید (Capital Allocation)</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                استراتژی منتخب سامانه: <strong className="text-emerald-800 font-bold">{lumpSumVsDcaGuide.recommendedStrategy}</strong>
              </p>
            </div>
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2 rounded-xl text-[11px] font-bold">
              {lumpSumVsDcaGuide.lumpSumWarningFa}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {lumpSumVsDcaGuide.capitalAllocationSteps.map((s) => (
              <div key={s.stepNumber} className="bg-white p-4 rounded-xl border border-amber-200/70 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">پله {s.stepNumber} خرید</span>
                  <span className="text-sm font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                    {s.allocationPercent}٪ کل سرمایه
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-amber-100 text-[11px]">
                  <span className="text-slate-500">تارگت ورود این پله:</span>
                  <strong className="font-mono text-slate-900 text-sm font-black">{formatPrice(s.priceTarget, isUSD)}</strong>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">{s.rationaleFa}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INVALIDATION FRAMEWORK (Clause 36) */}
      {activeTab === 'invalidation' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>سطح ابطال قطعی سناریوی صعودی (Hard Invalidation Level):</span>
              </div>
              <strong className="font-mono text-base font-black text-rose-950 bg-rose-100 px-3 py-1 rounded-xl border border-rose-300 shadow-xs">
                شکست زیر {formatPrice(invalidationFramework.hardInvalidationPrice, isUSD)}
              </strong>
            </div>

            <p className="text-xs text-rose-800 leading-relaxed pt-1">
              <strong>پروتکل اقدام پس از ابطال:</strong> {invalidationFramework.consequenceIfBrokenFa}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 space-y-1 shadow-xs">
              <span className="text-slate-500 block text-[10px]">حد ضرر متحرک (Trailing Stop):</span>
              <strong className="text-sm font-mono text-amber-800 font-bold block">
                {formatPrice(invalidationFramework.trailingStopPrice, isUSD)}
              </strong>
              <span className="text-[10px] text-slate-500">برای حفظ سودهای کسب‌شده در معامله</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 space-y-1 shadow-xs">
              <span className="text-slate-500 block text-[10px]">شرط قطعی ابطال:</span>
              <span className="text-xs text-slate-700 block font-bold">
                {invalidationFramework.invalidationTriggerConditionFa}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
