import React from 'react';
import { MACRO_FACTORS } from '../data/goldData';
import { Globe, TrendingUp, DollarSign, Landmark, ShieldAlert, Percent } from 'lucide-react';

export const MacroDriversPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm shadow-amber-500/5 space-y-5">
      <div className="flex items-center gap-2 border-b border-amber-200 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            موتورهای کلان و بنیادی اثرگذار بر قیمت طلا (Macroeconomic Drivers)
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            بررسی اثر نرخ بهره فدرال رزرو، شاخص دلار، خریدهای بانک‌های مرکزی و ریسک‌های بین‌المللی
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MACRO_FACTORS.map((factor, index) => (
          <div
            key={index}
            className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 flex flex-col justify-between space-y-2.5 hover:border-amber-400 transition shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-black text-slate-900">{factor.nameFa}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  {factor.impactOnGold}
                </span>
              </div>

              <div className="text-xs font-mono text-amber-950 font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-200 inline-block mb-2 shadow-xs">
                {factor.currentValue}
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {factor.descriptionFa}
              </p>
            </div>

            <div className="text-[11px] text-slate-600 border-t border-amber-200 pt-2 flex items-center justify-between font-medium">
              <span>میزان تاثیرگذاری:</span>
              <span className="font-bold text-amber-900">{factor.impactLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
