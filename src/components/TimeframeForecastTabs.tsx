import React from 'react';
import { TimeframeKey, ForecastPeriodData, AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Flame,
} from 'lucide-react';

interface TimeframeForecastTabsProps {
  selectedTimeframe: TimeframeKey;
  onSelectTimeframe: (tf: TimeframeKey) => void;
  forecastData: Record<string, ForecastPeriodData>;
  asset: AssetInfo;
}

const TIMEFRAME_OPTIONS: { id: TimeframeKey; labelFa: string; subFa: string; badge?: string }[] = [
  { id: '1day', labelFa: 'روز بعد', subFa: '+۲۴ ساعت', badge: 'کوتاه‌مدت' },
  { id: '1week', labelFa: 'هفته بعد', subFa: '+۷ روز', badge: 'نوسانی' },
  { id: '1month', labelFa: 'ماه بعد', subFa: '+۳۰ روز', badge: 'میان‌مدت' },
  { id: '2months', labelFa: 'دو ماه بعد', subFa: '+۶۰ روز', badge: 'استراتژیک' },
  { id: '6months', labelFa: 'شش ماه بعد', subFa: '+۱۸۰ روز', badge: 'بلندمدت' },
  { id: '1year', labelFa: 'یک سال بعد', subFa: '+۳۶۵ روز', badge: 'سرمایه‌گذاری' },
];

export const TimeframeForecastTabs: React.FC<TimeframeForecastTabsProps> = ({
  selectedTimeframe,
  onSelectTimeframe,
  forecastData,
  asset,
}) => {
  const currentForecast = forecastData[selectedTimeframe] || forecastData['1month'];
  const isPositive = currentForecast.expectedChangePercent >= 0;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header & Tab Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">
              پیش‌بینی چندزمانی و سناریوهای قیمت ({asset.nameFa})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            انتخاب افق زمانی برای مشاهده هدف‌های قیمتی، احتمال وقوع هر سناریو و محرک‌های اصلی بازار
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full scrollbar-none">
          {TIMEFRAME_OPTIONS.map((item) => {
            const isActive = selectedTimeframe === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTimeframe(item.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center min-w-[85px] ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{item.labelFa}</span>
                <span className={`text-[10px] ${isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {item.subFa}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Forecast Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Expected Target & Confidence */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900/80 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-amber-300 flex items-center gap-1">
                <Target className="w-4 h-4" />
                قیمت مورد انتظار ({currentForecast.titleFa})
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[11px]">
                اطمینان مدل: {currentForecast.confidenceScore}%
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-slate-100 my-2 tracking-tight">
              {formatPrice(currentForecast.expectedPrice, asset.isUSD)}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 text-sm font-bold ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                {isPositive ? '+' : ''}{currentForecast.expectedChangePercent}% تغییر تخمینی
              </span>
              <span className="text-xs text-slate-400">نسبت به قیمت فعلی</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>دامنه محتمل نوسان:</span>
            <span className="font-mono text-slate-300 font-medium text-left dir-ltr">
              {formatPrice(currentForecast.lowerBound, asset.isUSD)} ~ {formatPrice(currentForecast.upperBound, asset.isUSD)}
            </span>
          </div>
        </div>

        {/* Card 2: Risk & Technical Verdict */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                ارزیابی ریسک و ساختار تکنیکال
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold text-[11px]">
                ریسک: {currentForecast.riskRating}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              {currentForecast.technicalSummaryFa}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>جهت روند انتظاری:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                صعودی با شیب مناسب
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Key Market Drivers */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 mb-2.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>محرک‌های کلیدی این بازه زمانی ({currentForecast.titleFa})</span>
            </div>

            <ul className="space-y-2">
              {currentForecast.keyDriversFa.map((driver, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0"></span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 text-[11px] text-amber-400/80 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            💡 توصیه: در این افق زمانی استراتژی خرید پله‌ای (DCA) ریسک نوسانات کوتاه‌مدت را خنثی می‌کند.
          </div>
        </div>
      </div>

      {/* Scenario Probability Breakdown (Bullish vs Base vs Bearish) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            تحلیل سناریوهای سه‌گانه و ضرایب احتمال وقوع ({currentForecast.titleFa})
          </h4>
          <span className="text-xs text-slate-400">مجموع احتمالات: ۱۰۰٪</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bullish Scenario */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {currentForecast.scenarios.bullish.labelFa}
              </span>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                {currentForecast.scenarios.bullish.probability}% احتمال
              </span>
            </div>

            <div className="text-lg font-black text-slate-100 font-mono">
              {formatPrice(currentForecast.scenarios.bullish.targetPrice, asset.isUSD)}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mb-2">
              +{currentForecast.scenarios.bullish.percentChange}% رشد هدف
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${currentForecast.scenarios.bullish.probability}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {currentForecast.scenarios.bullish.descriptionFa}
            </p>
          </div>

          {/* Base Scenario */}
          <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Minus className="w-4 h-4" />
                {currentForecast.scenarios.base.labelFa}
              </span>
              <span className="text-xs font-black text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                {currentForecast.scenarios.base.probability}% احتمال
              </span>
            </div>

            <div className="text-lg font-black text-slate-100 font-mono">
              {formatPrice(currentForecast.scenarios.base.targetPrice, asset.isUSD)}
            </div>
            <div className="text-xs text-blue-400 font-semibold mb-2">
              +{currentForecast.scenarios.base.percentChange}% تغییر متعادل
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${currentForecast.scenarios.base.probability}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {currentForecast.scenarios.base.descriptionFa}
            </p>
          </div>

          {/* Bearish Scenario */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                {currentForecast.scenarios.bearish.labelFa}
              </span>
              <span className="text-xs font-black text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full font-mono">
                {currentForecast.scenarios.bearish.probability}% احتمال
              </span>
            </div>

            <div className="text-lg font-black text-slate-100 font-mono">
              {formatPrice(currentForecast.scenarios.bearish.targetPrice, asset.isUSD)}
            </div>
            <div className="text-xs text-rose-400 font-semibold mb-2">
              {currentForecast.scenarios.bearish.percentChange}% اصلاح
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${currentForecast.scenarios.bearish.probability}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              {currentForecast.scenarios.bearish.descriptionFa}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
