import React, { useState, useEffect } from 'react';
import {
  Compass,
  Activity,
  Layers,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Shuffle,
  Shield,
  ArrowUpRight,
  Sliders,
} from 'lucide-react';
import { MarketRegimeEngine } from '../services/marketRegimeEngine';
import { MarketRegimeState, TimeframeSignal } from '../types/marketRegime';

interface Phase3MarketRegimeCardProps {
  assetId?: string;
  assetNameFa?: string;
  price?: number;
  isUSD?: boolean;
}

export const Phase3MarketRegimeCard: React.FC<Phase3MarketRegimeCardProps> = ({
  assetId = 'xau_usd',
  assetNameFa = 'انس جهانی طلا (XAU/USD)',
  price = 2748.5,
  isUSD = true,
}) => {
  const [regime, setRegime] = useState<MarketRegimeState>(() =>
    MarketRegimeEngine.evaluateRegime(assetId, assetNameFa, price, isUSD)
  );

  useEffect(() => {
    setRegime(MarketRegimeEngine.evaluateRegime(assetId, assetNameFa, price, isUSD));
  }, [assetId, assetNameFa, price, isUSD]);

  const { timeframeMatrix, conflictResolution, strategyWeightAdjustmentGuide } = regime;

  const renderTimeframeBadge = (signal: TimeframeSignal) => {
    const isBull = signal.direction === 'bullish';
    const isRange = signal.direction === 'neutral_range';
    return (
      <div className="bg-white border border-amber-200/80 rounded-2xl p-3.5 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="font-bold text-slate-900 text-xs sm:text-sm">{signal.labelFa}</div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isBull
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : isRange
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {isBull ? 'صعودی (Bullish)' : isRange ? 'اصلاح / رنج (Range)' : 'نزولی (Bearish)'}
          </span>
        </div>

        <div className="text-[11px] text-slate-500">{signal.roleDescriptionFa}</div>

        <div className="bg-amber-50/50 p-2 rounded-xl text-[11px] text-slate-700 border border-amber-200/60">
          <span className="text-slate-500 block text-[10px]">وضعیت ساختار:</span>
          <span className="font-medium text-slate-800">{signal.structureStateFa}</span>
        </div>
      </div>
    );
  };

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
                موتور تشخیص رژیم بازار و ماتریس تایم‌فریم‌ها (Market Regime & MTF)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۳: بندهای ۵، ۶ و ۱۰
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              تشخیص فاز کلی بازار قبل از هرگونه اندیکاتور و حل هوشمند تضاد بین تایم‌فریم‌ها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1 rounded-xl text-xs font-bold">
            رژیم: {regime.trendRegimeFa}
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-mono font-bold">
            اطمینان: {regime.regimeConfidencePercent}٪
          </div>
        </div>
      </div>

      {/* Clause 6: Multi-Timeframe Conflict Detection & Resolution Box */}
      <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-black text-xs sm:text-sm">
            <Shuffle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>حل هوشمند تناقض تایم‌فریم‌ها (Timeframe Conflict Resolution):</span>
          </div>
          <span className="text-[11px] text-slate-500">
            ریسک اصلاح کوتاه‌مدت: <strong className="text-amber-800 font-bold">{conflictResolution.correctionRiskLevel}</strong>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {conflictResolution.headlineFa}
        </p>

        <div className="bg-amber-100/70 border border-amber-300/80 p-3 rounded-xl text-xs text-amber-950 leading-relaxed flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-900 block mb-0.5 font-bold">توصیه تصمیم‌یار:</strong>
            {conflictResolution.actionableAdviceFa}
          </div>
        </div>
      </div>

      {/* 4 Timeframe Cards Grid */}
      <div>
        <div className="text-xs text-slate-600 font-bold mb-2.5 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>ماتریس ۴ تایم‌فریم تحلیلی (هفتگی، روزانه، ۴ ساعته، ۱ ساعته):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {renderTimeframeBadge(timeframeMatrix.weekly)}
          {renderTimeframeBadge(timeframeMatrix.daily)}
          {renderTimeframeBadge(timeframeMatrix.fourHour)}
          {renderTimeframeBadge(timeframeMatrix.oneHour)}
        </div>
      </div>

      {/* Clause 5 & 31: Dynamic Weighting by Regime Guide */}
      <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-800 font-bold">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-600" />
            وزن‌دهی پویا به استراتژی‌ها متناسب با رژیم فعلی (بند ۵ و ۳۱):
          </span>
          <span className="text-[11px] text-slate-500 font-medium">نوسان: {regime.volatilityRegimeFa}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-xs">
            <span className="text-[10px] text-slate-500 block">دنبال‌کننده روند (Trend)</span>
            <strong className="text-emerald-700 font-mono text-sm block mt-0.5">
              {strategyWeightAdjustmentGuide.trendFollowingWeight}٪
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-xs">
            <span className="text-[10px] text-slate-500 block">نقدینگی و اسمارت‌مانی</span>
            <strong className="text-sky-700 font-mono text-sm block mt-0.5">
              {strategyWeightAdjustmentGuide.liquiditySmcWeight}٪
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-xs">
            <span className="text-[10px] text-slate-500 block">حمایت و مقاومت رِنج</span>
            <strong className="text-amber-800 font-mono text-sm block mt-0.5">
              {strategyWeightAdjustmentGuide.supportResistanceRangeWeight}٪
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/70 shadow-xs">
            <span className="text-[10px] text-slate-500 block">ریسک اخبار و رویداد</span>
            <strong className="text-purple-700 font-mono text-sm block mt-0.5">
              {strategyWeightAdjustmentGuide.eventRiskWeight}٪
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
