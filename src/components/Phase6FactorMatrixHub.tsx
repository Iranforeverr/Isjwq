import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Layers,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Info,
  ShieldAlert,
  Shuffle,
  Percent,
} from 'lucide-react';
import { FactorMatrixEngine } from '../services/factorMatrixEngine';
import { Phase6FactorMatrixPayload } from '../types/factorMatrix';

interface Phase6FactorMatrixHubProps {
  isIranGold?: boolean;
}

export const Phase6FactorMatrixHub: React.FC<Phase6FactorMatrixHubProps> = ({
  isIranGold = false,
}) => {
  const [data, setData] = useState<Phase6FactorMatrixPayload>(() =>
    FactorMatrixEngine.evaluateMatrix(isIranGold, 'uptrend')
  );

  React.useEffect(() => {
    setData(FactorMatrixEngine.evaluateMatrix(isIranGold, 'uptrend'));
  }, [isIranGold]);

  const [expandedFactorId, setExpandedFactorId] = useState<string | null>(null);

  const toggleFactor = (id: string) => {
    setExpandedFactorId(expandedFactorId === id ? null : id);
  };

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                ماتریس ۸ فاکتور متعامد، وزن‌دهی پویا و موتور تعارض (Factor Matrix & Conflict)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۶: بندهای ۲۹، ۳۰، ۳۱، ۳۲ و ۶۰
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              جلوگیری از خطای دوباره‌شماری (Anti Double-Counting) و سنجش درجه تناقض میان روش‌های تحلیلی
            </p>
          </div>
        </div>

        {/* Conflict & Composite Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-xl text-xs font-bold shadow-xs">
            امتیاز تجمیعی: +{data.compositeWeightedScore}
          </div>
          <div className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border border-slate-200">
            تعارض: {data.conflictScore}/۱۰۰
          </div>
        </div>
      </div>

      {/* Synthesis & Conflict Resolution Banner */}
      <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">نتیجه سنتز فاکتورها:</span>
            <strong className="text-sm text-amber-950 bg-amber-200/70 px-2.5 py-0.5 rounded-lg border border-amber-400 font-bold">
              {data.compositeDirectionFa}
            </strong>
          </div>
          <span className="text-[11px] text-slate-500">
            ضریب اطمینان تجمیعی: <strong className="text-emerald-700 font-mono font-bold">{data.compositeConfidence}٪</strong>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {data.regimeWeightingAdjustmentNoteFa}
        </p>

        {/* Conflict Detail Alert */}
        {data.detectedConflicts.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-amber-200/80 p-3 rounded-xl text-xs text-slate-700 space-y-1.5 shadow-xs"
          >
            <div className="flex items-center justify-between text-amber-800 font-bold">
              <span className="flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5 text-amber-600" />
                تعارض پایش‌شده: {c.sideA.factorName} vs {c.sideB.factorName}
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-bold">
                شدت تعارض: {c.severity === 'moderate' ? 'متوسط' : 'اندک'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{c.explanationFa}</p>
            <div className="text-[11px] text-emerald-800 flex items-center gap-1 pt-0.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{c.recommendedCautionFa}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 8 Orthogonal Factors Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>جدول ۸ فاکتور مستقل (مجموع وزن‌ها برابر با ۱۰۰٪):</span>
          <span className="font-mono text-emerald-700 font-bold">وزن کل: {data.totalNormalizedWeight}٪</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {data.factors.map((f) => {
            const isExpanded = expandedFactorId === f.id;
            return (
              <div
                key={f.id}
                className="bg-white border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2 transition hover:border-amber-300 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <strong className="text-slate-900 text-sm font-bold block">{f.titleFa}</strong>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{f.keySignalFa}</span>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-[10px] text-slate-500 block">وزن پویا:</span>
                    <strong className="text-amber-800 font-mono text-sm font-bold">{f.dynamicWeightPercent}٪</strong>
                  </div>
                </div>

                {/* Score & Confidence Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-[11px]">
                  <span className="text-slate-500">
                    امتیاز فاکتور: <strong className="font-mono text-emerald-700 font-bold">+{f.score} / ۱۰۰</strong>
                  </span>
                  <span className="text-slate-500">
                    درجه داده: <strong className="font-mono text-slate-700 font-bold">{f.dataQuality}</strong>
                  </span>
                  <button
                    onClick={() => toggleFactor(f.id)}
                    className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer text-[10px]"
                  >
                    {isExpanded ? 'بستن' : 'جزئیات ادغام'}
                  </button>
                </div>

                {/* Anti Double-Counting Details */}
                {isExpanded && (
                  <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-slate-700 space-y-1 animate-fadeIn">
                    <span className="text-amber-800 font-bold block text-[10px]">
                      کنترل عدم دوباره‌شماری (بند ۲۹ و ۶۰):
                    </span>
                    <p className="text-slate-600 leading-relaxed">{f.antiDoubleCountingNoteFa}</p>
                    <div className="text-slate-500 text-[10px]">
                      شامل {f.subComponentsCount} متغیر تحلیلی هم‌ریشه ترکیب‌شده
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
