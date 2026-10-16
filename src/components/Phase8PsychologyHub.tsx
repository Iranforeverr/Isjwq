import React, { useState } from 'react';
import {
  Brain,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
  Percent,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { PsychologyRiskEngine } from '../services/psychologyRiskEngine';
import { BehavioralStateEvaluation } from '../types/psychologyRisk';

interface Phase8PsychologyHubProps {
  isIranGold?: boolean;
  currentPrice?: number;
  stopLossPrice?: number;
}

export const Phase8PsychologyHub: React.FC<Phase8PsychologyHubProps> = ({
  isIranGold = false,
  currentPrice = 2748.5,
  stopLossPrice = 2685.0,
}) => {
  const [data] = useState<BehavioralStateEvaluation>(() =>
    PsychologyRiskEngine.evaluateBehavioralRisk(isIranGold, currentPrice, stopLossPrice)
  );

  const [activeTab, setActiveTab] = useState<'fomo_fear' | 'biases' | 'risk_rules'>('fomo_fear');

  const { riskFramework, biases } = data;

  return (
    <div className="bg-white border border-amber-200/90 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                موتور روانشناسی، کنترل FOMO و انضباط ریسک (Psychology & Risk Engine)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 font-mono font-bold">
                فاز ۸: بندهای ۳۹ تا ۴۳ و ۵۵-۵۶
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              مهار سندروم جا ماندن از بازار، غربالگری سوگیری‌های ذهنی، مدارشکن‌های ضرر متوالی و سایزینگ ریاضی پوزیشن
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
          <button
            onClick={() => setActiveTab('fomo_fear')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'fomo_fear' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سندروم FOMO و احساسات
          </button>
          <button
            onClick={() => setActiveTab('biases')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'biases' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            غربالگری سوگیری‌ها
          </button>
          <button
            onClick={() => setActiveTab('risk_rules')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'risk_rules' ? 'bg-amber-400 text-amber-950 font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مدیریت ریسک و مدارشکن
          </button>
        </div>
      </div>

      {/* Main Psychological Alert Banner (Clause 39, 40) */}
      <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">شاخص طمع و احساسات:</span>
            <strong className="text-sm font-mono text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
              {data.fearGreedIndexScore} از ۱۰۰ ({data.sentimentClassificationFa})
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">شاخص تب FOMO:</span>
            <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
              {data.fomoIndexScore}٪ (هشدار تعقیب سقف)
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {data.fomoWarningNarrativeFa}
        </p>

        <div className="bg-white p-3 rounded-xl border border-amber-200/70 text-xs text-slate-700 flex items-start gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block mb-0.5 font-bold">آمادگی روانی در برابر اصلاح‌های طبیعی (بند ۴۰):</strong>
            {data.healthyPullbackComfortNarrativeFa}
          </div>
        </div>
      </div>

      {/* TAB 1: FOMO & FEAR/GREED METRICS (Clause 39) */}
      {activeTab === 'fomo_fear' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn text-xs">
          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">مهار خرید هیجانی در قله‌ها (FOMO Chasing Block)</span>
              <span className="text-[10px] bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-300 font-mono font-bold">
                قانون بند ۳۹
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              هنگامی که قیمت در سقف کانال قرار دارد، روان معامله‌گر به سمت خرید شتاب‌زده متمایل می‌شود. سیستم در این فاز دکمه ورود مارکت را قفل کرده و فقط اردرهای لیمیت اصلاحی در زون تقاضا را مجاز می‌داند.
            </p>
          </div>

          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">خنثی‌سازی ترس از افت اصلاحی (Panic Sell Block)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-mono font-bold">
                قانون بند ۴۰
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              افت‌های موقت تا زمانی که بالای خط ابطال قرار دارند، فرصت بازتست ساختار هستند نه ریزش کلان. سیستم با نمایش خط ابطال از فروش هراسان در کف اصلاح‌ها جلوگیری می‌کند.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: COGNITIVE BIASES AUDIT (Clause 41) */}
      {activeTab === 'biases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fadeIn text-xs">
          {biases.map((b) => (
            <div key={b.id} className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{b.biasNameFa}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    b.riskStatus === 'critical'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : b.riskStatus === 'moderate'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {b.riskStatus === 'critical' ? 'ریسک فعال بالا' : b.riskStatus === 'moderate' ? 'ریسک متوسط' : 'کنترل شده'}
                </span>
              </div>

              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 text-[11px] text-slate-600">
                <span className="text-slate-800 block font-bold mb-0.5">نشانه رفتاری:</span>
                {b.triggerSymptomFa}
              </div>

              <div className="text-[11px] text-amber-800 flex items-start gap-1 pt-1 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{b.mitigationProtocolFa}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MATHEMATICAL POSITION SIZING & CIRCUIT BREAKERS (Clauses 42, 55, 56) */}
      {activeTab === 'risk_rules' && (
        <div className="bg-amber-50/30 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">حداکثر ریسک هر معامله</span>
              <strong className="text-sm font-mono text-emerald-700 block mt-1 font-bold">
                {riskFramework.recommendedRiskPerTradePercent}٪ کل سرمایه
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">فاصله تا حد ضرر ابطال</span>
              <strong className="text-sm font-mono text-amber-800 block mt-1 font-bold">
                {riskFramework.stopLossDistancePercent}٪
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">سایز بهینه پوزیشن (فرمول)</span>
              <strong className="text-sm font-mono text-amber-900 block mt-1 font-black">
                {riskFramework.calculatedPositionSizePercent}٪ پرتفوی
              </strong>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200/70 shadow-xs">
              <span className="text-slate-500 block text-[10px]">نسبت سود به ریسک (R:R)</span>
              <strong className="text-sm font-mono text-emerald-700 block mt-1 font-bold">
                ۱ به {riskFramework.riskRewardRatio}
              </strong>
            </div>
          </div>

          {/* Circuit Breaker Box */}
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-rose-800 font-bold">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-600" />
                مدارشکن اتوماتیک ضررهای متوالی (Circuit Breaker - بند ۴۳):
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-mono font-bold border border-rose-200">
                {riskFramework.circuitBreakers.cooldownPeriodHours} ساعت کول‌داون اجباری
              </span>
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              {riskFramework.circuitBreakers.ruleFa}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
