import React, { useState } from 'react';
import { Sliders, Calculator, RotateCcw, TrendingUp, Info, HelpCircle } from 'lucide-react';
import { formatPrice } from '../data/goldData';

interface SimulationSandboxProps {
  initialUsdRate?: number;
  initialOuncePrice?: number;
}

export const SimulationSandbox: React.FC<SimulationSandboxProps> = ({
  initialUsdRate = 85200,
  initialOuncePrice = 2748.50,
}) => {
  // Simulation initial states
  const [usdRate, setUsdRate] = useState<number>(initialUsdRate); // Toman per USD
  const [ouncePrice, setOuncePrice] = useState<number>(initialOuncePrice); // USD per oz
  const [inflationRate, setInflationRate] = useState<number>(35); // %
  const [fedRate, setFedRate] = useState<number>(4.5); // %
  const [geoRiskMultiplier, setGeoRiskMultiplier] = useState<number>(1.05); // 1.0 to 1.2

  const resetDefaults = () => {
    setUsdRate(initialUsdRate);
    setOuncePrice(initialOuncePrice);
    setInflationRate(35);
    setFedRate(4.5);
    setGeoRiskMultiplier(1.05);
  };

  // Financial formula for 1 Mithqal 17k Gold in Tomans: (Ounce * USD) / 9.5742
  const calcMithqal = (oz: number, usd: number, riskMult = 1) => {
    return Math.round(((oz * usd) / 9.5742) * riskMult);
  };

  // 1 Gram of 18k Gold = Mithqal / 4.3318 (or Mithqal * 750 / 705 / 4.608)
  const calcGram18k = (mithqal: number) => {
    return Math.round(mithqal / 4.3318);
  };

  // Emami Coin = (Gram18k * 8.133 * 0.900 / 0.750) + Coin Making & Bubble
  const calcEmamiCoin = (gram18k: number, bubblePct = 15) => {
    const rawGoldValue = gram18k * 8.133 * (900 / 750);
    return Math.round(rawGoldValue * (1 + bubblePct / 100));
  };

  // Calculate base values with current sliders
  const currentMithqal = calcMithqal(ouncePrice, usdRate, geoRiskMultiplier);
  const currentGram18k = calcGram18k(currentMithqal);
  const currentCoin = calcEmamiCoin(currentGram18k, 16);

  // Future simulated horizons based on user parameters & drift
  const horizons = [
    {
      label: 'روز بعد (+24h)',
      oz: Math.round(ouncePrice * 1.004),
      usd: Math.round(usdRate * 1.003),
      mult: 1.006,
    },
    {
      label: 'هفته بعد (+7d)',
      oz: Math.round(ouncePrice * 1.018),
      usd: Math.round(usdRate * 1.012),
      mult: 1.025,
    },
    {
      label: 'ماه بعد (+30d)',
      oz: Math.round(ouncePrice * 1.045),
      usd: Math.round(usdRate * (1 + inflationRate / 1200)),
      mult: 1.06,
    },
    {
      label: 'دو ماه بعد (+60d)',
      oz: Math.round(ouncePrice * 1.085),
      usd: Math.round(usdRate * (1 + (inflationRate * 2) / 1200)),
      mult: 1.12,
    },
    {
      label: 'شش ماه بعد (+180d)',
      oz: Math.round(ouncePrice * 1.18),
      usd: Math.round(usdRate * (1 + (inflationRate * 6) / 1200)),
      mult: 1.25,
    },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              جعبه‌ابزار شبیه‌سازی قیمت طلا (Simulation Sandbox)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            با تغییر نرخ دلار، انس جهانی و تورم، پیش‌بینی قیمت روز بعد، هفته بعد، ماه بعد و دو ماه بعد را بلافاصله مشاهده کنید
          </p>
        </div>

        <button
          onClick={resetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>بازنشانی پیش‌فرض</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Slider 1: USD Rate */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">نرخ دلار آزاد (تومان):</span>
            <span className="font-mono font-bold text-amber-400">
              {usdRate.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <input
            type="range"
            min="60000"
            max="140000"
            step="1000"
            value={usdRate}
            onChange={(e) => setUsdRate(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>۶۰,۰۰۰</span>
            <span>۱۰۰,۰۰۰</span>
            <span>۱۴۰,۰۰۰</span>
          </div>
        </div>

        {/* Slider 2: Gold Ounce */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">انس جهانی طلا ($ XAU/USD):</span>
            <span className="font-mono font-bold text-amber-400">
              ${ouncePrice.toLocaleString('en-US')}
            </span>
          </div>
          <input
            type="range"
            min="2300"
            max="3600"
            step="25"
            value={ouncePrice}
            onChange={(e) => setOuncePrice(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>$2,300</span>
            <span>$2,900</span>
            <span>$3,600</span>
          </div>
        </div>

        {/* Slider 3: Inflation Rate */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-semibold">نرخ تورم انتظاری سالانه:</span>
            <span className="font-mono font-bold text-amber-400">{inflationRate}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="70"
            step="1"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>۱۵٪</span>
            <span>۴۰٪</span>
            <span>۷۰٪</span>
          </div>
        </div>
      </div>

      {/* Instant Calculated Results for All Horizons */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Calculator className="w-4 h-4 text-amber-400" />
          پیش‌بینی خروجی شبیه‌سازی در افق‌های زمانی مختلف:
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">افق زمانی</th>
                <th className="p-3">انس جهانی ($)</th>
                <th className="p-3">دلار مفروض (تومان)</th>
                <th className="p-3 font-bold text-amber-300">هر گرم طلای ۱۸ عیار</th>
                <th className="p-3">مثقال طلا</th>
                <th className="p-3 font-bold text-emerald-400">سکه تمام امامی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
              <tr className="bg-amber-500/5 font-semibold">
                <td className="p-3 text-amber-400">نقطه شروع (فعلی)</td>
                <td className="p-3 font-mono text-slate-200">${ouncePrice}</td>
                <td className="p-3 font-mono text-slate-200">{usdRate.toLocaleString('fa-IR')}</td>
                <td className="p-3 font-mono text-amber-300 font-bold">{currentGram18k.toLocaleString('fa-IR')} تومان</td>
                <td className="p-3 font-mono text-slate-200">{currentMithqal.toLocaleString('fa-IR')} تومان</td>
                <td className="p-3 font-mono text-emerald-400 font-bold">{currentCoin.toLocaleString('fa-IR')} تومان</td>
              </tr>

              {horizons.map((h, i) => {
                const futMithqal = calcMithqal(h.oz, h.usd, geoRiskMultiplier);
                const futGram = calcGram18k(futMithqal);
                const futCoin = calcEmamiCoin(futGram, 16);
                const gainPct = (((futGram - currentGram18k) / currentGram18k) * 100).toFixed(1);

                return (
                  <tr key={i} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 font-medium text-slate-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      {h.label}
                    </td>
                    <td className="p-3 font-mono text-slate-300">${h.oz}</td>
                    <td className="p-3 font-mono text-slate-300">{h.usd.toLocaleString('fa-IR')}</td>
                    <td className="p-3 font-mono font-bold text-amber-400">
                      {futGram.toLocaleString('fa-IR')} تومان
                      <span className="text-[10px] text-emerald-400 mr-1.5">({gainPct > '0' ? '+' : ''}{gainPct}%)</span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">{futMithqal.toLocaleString('fa-IR')} تومان</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{futCoin.toLocaleString('fa-IR')} تومان</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula Explanation Note */}
      <div className="text-[11px] text-slate-400 bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <span>
          فرمول استاندارد بازار طلا: <strong>مثقال طلا = (انس جهانی × نرخ دلار) ÷ ۹.۵۷۴۲</strong> و <strong>هر گرم ۱۸ عیار = مثقال ÷ ۴.۳۳۱۸</strong>. این فرمول ریاضی مبنای قطعی ارزش ذاتی طلای ایران بدون احتساب اجرت و مالیات است.
        </span>
      </div>
    </div>
  );
};
