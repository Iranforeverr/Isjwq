import React, { useState, useEffect } from 'react';
import {
  Globe2,
  TrendingUp,
  Landmark,
  Calendar,
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Flame,
  ShieldAlert,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { MacroOrderFlowEngine } from '../services/macroOrderFlowEngine';
import { Phase5MacroOrderFlowPayload } from '../types/macroOrderFlow';
import { formatPrice } from '../data/goldData';

interface Phase5MacroHubProps {
  assetId?: string;
  price?: number;
  isUSD?: boolean;
}

export const Phase5MacroHub: React.FC<Phase5MacroHubProps> = ({
  assetId = 'xau_usd',
  price = 2748.5,
  isUSD = true,
}) => {
  const [data, setData] = useState<Phase5MacroOrderFlowPayload>(() =>
    MacroOrderFlowEngine.analyzeMacroAndFlow(assetId, price, isUSD)
  );

  useEffect(() => {
    setData(MacroOrderFlowEngine.analyzeMacroAndFlow(assetId, price, isUSD));
  }, [assetId, price, isUSD]);

  const [activeTab, setActiveTab] = useState<'macro_factors' | 'central_banks' | 'events' | 'order_flow'>('macro_factors');

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                موتور اقتصاد کلان، رویدادها و جریان سفارشات (Macro & Order Flow Engine)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۵: بندهای ۱۴ تا ۲۱
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              بازدهی واقعی اوراق (Real Yields)، خریدهای شمش بانک‌های مرکزی و ولوم پروفایل (POC/CVD)
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
          <button
            onClick={() => setActiveTab('macro_factors')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'macro_factors' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            فاکتورهای ماکرو
          </button>
          <button
            onClick={() => setActiveTab('central_banks')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'central_banks' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بانک‌های مرکزی (WGC)
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'events' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            رویدادها و بلک‌اوت
          </button>
          <button
            onClick={() => setActiveTab('order_flow')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'order_flow' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            جریان سفارشات (CVD / POC)
          </button>
        </div>
      </div>

      {/* Synthesis Banner */}
      <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">امتیاز همگرایی اقتصاد کلان (Macro Score):</span>
            <strong className="text-sm font-mono text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
              +{data.macroScore} از ۱۰۰ (بسیار مساعد)
            </strong>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">آخرین اعتبارسنجی: گزارش‌های رسمی خزانه‌داری و WGC</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
          {data.macroSynthesisFa}
        </p>
      </div>

      {/* TAB 1: MACRO FACTORS (Clauses 14, 15, 16) */}
      {activeTab === 'macro_factors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn text-xs">
          {data.factors.map((f) => (
            <div key={f.id} className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{f.nameFa}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-mono">
                  اثر مثبت بر طلا ✓
                </span>
              </div>

              <div className="flex items-baseline justify-between py-1 border-y border-amber-100">
                <span className="text-slate-500">مقدار جاری / نرخ:</span>
                <span className="font-mono font-black text-amber-800 text-sm">{f.currentValue}</span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">{f.explanationFa}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>همبستگی تاریخی با طلا:</span>
                <span className="font-mono text-slate-700 font-bold">{f.goldCorrelation}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CENTRAL BANKS (Clause 18) */}
      {activeTab === 'central_banks' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
            <div>
              <div className="text-slate-900 font-black text-sm">خریدهای شمش فیزیکی بانک‌های مرکزی (گزارش شورای جهانی طلا)</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                مجموع خریدهای سالانه: <strong className="text-amber-800 font-mono">+{data.centralBanks.totalTonsAnnual} تن شمش</strong> (رکورد تاریخی)
              </p>
            </div>
            <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-xl text-xs font-bold border border-amber-300">
              کف‌ساز استراتژیک انس
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {data.centralBanks.topBuyers.map((b, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
                <span className="text-[10px] text-slate-500 block">{b.countryFa}</span>
                <strong className="text-sm font-mono text-amber-800 block mt-1 font-black">+{b.tonsAdded} تن</strong>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-amber-200/60 shadow-xs">
            {data.centralBanks.marketImpactFa}
          </p>
        </div>
      )}

      {/* TAB 3: UPCOMING EVENT RISKS & BLACKOUT (Clause 19) */}
      {activeTab === 'events' && (
        <div className="space-y-3 animate-fadeIn text-xs">
          <div className="text-slate-700 font-bold flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>پنجره ریسک رویدادهای کلان و هشدارهای بلک‌اوت معاملاتی (Event Risk Window):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.eventRisks.map((evt) => (
              <div key={evt.id} className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{evt.titleFa}</span>
                  <span className="text-[10px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-mono font-bold">
                    ریسک بالا (Critical)
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>زمان تا انتشار:</span>
                  <span className="font-mono text-amber-800 font-bold">{evt.hoursUntilRelease} ساعت دیگر</span>
                </div>

                <div className="text-[11px] text-slate-700 bg-amber-50/50 p-2 rounded-xl border border-amber-200/60">
                  {evt.forecastVsPreviousFa}
                </div>

                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-[11px] text-rose-800 flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{evt.blackoutWarningFa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDER FLOW & CVD (Clauses 20, 21) */}
      {activeTab === 'order_flow' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">نقطه کنترل حجم معاملات (POC)</span>
              <strong className="text-sm font-mono text-amber-800 block mt-1 font-black">
                {formatPrice(data.volumeProfile.pointOfControlPOC, isUSD)}
              </strong>
              <span className="text-[10px] text-slate-500 mt-1 block">بیشترین حجم مبادله‌شده دوره</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">سقف ناحیه ارزش (VAH)</span>
              <strong className="text-sm font-mono text-rose-700 block mt-1 font-black">
                {formatPrice(data.volumeProfile.valueAreaHighVAH, isUSD)}
              </strong>
              <span className="text-[10px] text-slate-500 mt-1 block">۷۰٪ تراکنش‌ها در این زون</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">کف ناحیه ارزش (VAL)</span>
              <strong className="text-sm font-mono text-emerald-700 block mt-1 font-black">
                {formatPrice(data.volumeProfile.valueAreaLowVAL, isUSD)}
              </strong>
              <span className="text-[10px] text-slate-500 mt-1 block">حمایت ولوم پروفایل</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-200/70 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-slate-800 font-bold">
              <span>تحلیل دلتای تجمعی حجم (CVD Order Flow):</span>
              <span className="text-emerald-700 font-mono text-[11px] font-bold">جذب قوی سفارشات خرید (Absorption)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
              {data.volumeProfile.cvdDivergenceFa}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
