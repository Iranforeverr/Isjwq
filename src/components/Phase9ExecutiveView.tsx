import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  History,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { UnifiedReportingEngine } from '../services/unifiedReportingEngine';
import { Phase9MasterPayload } from '../types/unifiedReporting';
import { formatPrice } from '../data/goldData';

interface Phase9ExecutiveViewProps {
  isIranGold?: boolean;
  currentPrice?: number;
  stopLossPrice?: number;
  isUSD?: boolean;
}

export const Phase9ExecutiveView: React.FC<Phase9ExecutiveViewProps> = ({
  isIranGold = false,
  currentPrice = 2748.5,
  stopLossPrice = 2685.0,
  isUSD = true,
}) => {
  const [data, setData] = useState<Phase9MasterPayload>(() =>
    UnifiedReportingEngine.generateMasterReport(isIranGold, currentPrice, stopLossPrice)
  );

  React.useEffect(() => {
    setData(UnifiedReportingEngine.generateMasterReport(isIranGold, currentPrice, stopLossPrice));
  }, [isIranGold, currentPrice, stopLossPrice]);

  const [activeTab, setActiveTab] = useState<'quick_brief' | 'journal' | 'backtest'>('quick_brief');

  const { simpleSummary, recentJournal, backtestMetrics } = data;

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                میز خروجی اجرایی و گزارش نهایی تصمیم‌یار (Unified Executive Hub)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۹: خلاصه ساده، ژورنال هوشمند و بک‌تست
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              خلاصه ۳ بندی بدون اصطلاحات پیچیده، گزارش عملکرد تاریخی شفاف و ممیزی عملکرد گذشته
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
          <button
            onClick={() => setActiveTab('quick_brief')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'quick_brief' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            خلاصه اجرایی سریع
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'journal' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ژورنال معاملات گذشته
          </button>
          <button
            onClick={() => setActiveTab('backtest')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'backtest' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            آمار بک‌تست و پایش صحت
          </button>
        </div>
      </div>

      {/* TAB 1: QUICK EXECUTIVE BRIEF (Clauses 2, 3, 44, 45) */}
      {activeTab === 'quick_brief' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Traffic Light Banner */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-md shadow-emerald-500/50 shrink-0"></div>
              <div>
                <span className="text-xs text-emerald-800 font-bold block">فرمان نهایی سامانه:</span>
                <strong className="text-sm sm:text-base font-black text-emerald-950">
                  {simpleSummary.trafficLightActionFa}
                </strong>
              </div>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-mono text-rose-800 font-bold shadow-xs">
              {simpleSummary.invalidationAlertFa}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80">
            {simpleSummary.headlineFa}
          </p>

          {/* 3 Clear Bullet Points (Clause 3) */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <span className="text-xs font-black text-amber-950 block mb-1">
              ۳ نکته کلیدی که هر سرمایه‌گذار باید بداند:
            </span>
            {simpleSummary.summaryBulletPoints.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Who Should Act vs Who Should Wait (Clause 45) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-300 space-y-1 shadow-xs">
              <span className="text-emerald-900 font-black block">چه کسانی باید اقدام کنند؟</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">{simpleSummary.whoShouldActFa}</p>
            </div>

            <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-300 space-y-1 shadow-xs">
              <span className="text-rose-900 font-black block">چه کسانی باید صبر و نظاره کنند؟</span>
              <p className="text-slate-700 leading-relaxed text-[11px]">{simpleSummary.whoShouldWaitFa}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRADE JOURNAL (Clause 58, 62) */}
      {activeTab === 'journal' && (
        <div className="space-y-3 animate-fadeIn text-xs">
          <div className="text-slate-800 font-bold flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-600" />
            <span>ژورنال شفاف موقعیت‌های اخیر و آسیب‌شناسی نتایج (Post-Mortem):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentJournal.map((j) => (
              <div key={j.id} className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{j.asset}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{j.timestamp}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      j.outcomeStatus === 'target_hit'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-sky-50 text-sky-800 border-sky-300'
                    }`}
                  >
                    {j.outcomeStatus === 'target_hit' ? 'تارگت محقق شد ✓' : 'پوزیشن باز (Open)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 py-1 text-center bg-amber-50/50 rounded-xl border border-amber-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px]">ورود</span>
                    <strong className="font-mono text-slate-900 font-bold">{formatPrice(j.entryPrice, isUSD)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">حد ضرر</span>
                    <strong className="font-mono text-rose-700 font-bold">{formatPrice(j.stopLossPrice, isUSD)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">تارگت</span>
                    <strong className="font-mono text-emerald-700 font-bold">{formatPrice(j.targetPrice, isUSD)}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed bg-amber-50/30 p-2 rounded-lg border border-amber-100">
                  <strong className="text-slate-800 block mb-0.5 font-bold">آموزه تحلیلی:</strong>
                  {j.postMortemLessonFa}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BACKTEST METRICS (Clause 59, 63) */}
      {activeTab === 'backtest' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">نرخ برد تاریخی (Win Rate)</span>
              <strong className="text-sm font-mono text-emerald-700 block mt-1 font-bold">
                {backtestMetrics.historicalWinRatePercent}٪
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">فاکتور سودآوری (Profit Factor)</span>
              <strong className="text-sm font-mono text-amber-800 block mt-1 font-bold">
                {backtestMetrics.profitFactor}
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">حداکثر افت سرمایه (Max DD)</span>
              <strong className="text-sm font-mono text-rose-700 block mt-1 font-bold">
                {backtestMetrics.maxDrawdownPercent}٪
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">تعداد کل معاملات تست‌شده</span>
              <strong className="text-sm font-mono text-slate-800 block mt-1 font-bold">
                {backtestMetrics.totalTradesTested} معامله
              </strong>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-200/70 space-y-1.5 shadow-xs">
            <span className="text-slate-800 font-bold block text-[11px]">
              عملکرد تفکیک‌شده بر اساس رژیم‌های سه‌گانه بازار:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                <span className="text-slate-600 block">رژیم روند صعودی</span>
                <strong className="text-emerald-700 font-mono font-bold">{backtestMetrics.regimePerformance.uptrendWinRate}٪</strong>
              </div>
              <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                <span className="text-slate-600 block">رژیم رِنج و خنثی</span>
                <strong className="text-amber-800 font-mono font-bold">{backtestMetrics.regimePerformance.rangeWinRate}٪</strong>
              </div>
              <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                <span className="text-slate-600 block">رژیم روند نزولی</span>
                <strong className="text-rose-700 font-mono font-bold">{backtestMetrics.regimePerformance.downtrendWinRate}٪</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
