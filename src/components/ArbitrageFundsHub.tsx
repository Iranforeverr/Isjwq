import React, { useState, useEffect } from 'react';
import {
  Coins,
  Scale,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Layers,
  ArrowRightLeft,
  Percent,
  Sliders,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Building2,
  PieChart,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface ArbitrageFundsHubProps {
  selectedAsset: AssetInfo;
  onAskAi: (prompt: string) => void;
}

export const ArbitrageFundsHub: React.FC<ArbitrageFundsHubProps> = ({
  selectedAsset,
  onAskAi,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'coins_bubble' | 'gold_funds' | 'triangular' | 'allocator'>('coins_bubble');

  // Custom Simulator for Investment Allocation
  const [investmentCapital, setInvestmentCapital] = useState<number>(200000000); // 200 Million Tomans
  const [strategyPreference, setStrategyPreference] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

  const fetchArbitrageData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gold/arbitrage-funds?asset=${selectedAsset.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch arbitrage & funds data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArbitrageData();
  }, [selectedAsset.id, selectedAsset.currentPrice]);

  const p = data?.currentPrice || selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-100/50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm shadow-amber-500/5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  فاز ۵: رادار آربیتراژ طلا، حباب‌سنج فوق پیشرفته سکه و صندوق‌های طلای بورس (Gold Arbitrage & TSETMC Matrix)
                </h2>
                <span className="text-[10px] font-black bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  NAV Discount & Intrinsic Value
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                محاسبه ارزش ذاتی و حباب سکه‌ها، کشف تخفیف‌های NAV در صندوق‌های طلا (طلا، عیار، کهربا) و آربیتراژ دلار ضمنی طلا
              </p>
            </div>
          </div>

          {/* Quick Arbitrage Badge */}
          <div className="flex items-center gap-3 bg-white border-2 border-amber-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold">سیگنال آربیتراژ طلا/دلار:</div>
              <div className="text-xs font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{data?.triangularArbitrage?.dollarGapPercent > 0 ? 'طلا جلوتر از دلار' : 'طلا باصرفه‌تر از دلار'}</span>
              </div>
            </div>
            <div className="h-7 w-px bg-amber-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">دلار ضمنی طلا:</div>
              <div className="text-xs font-black font-mono text-amber-900">
                {(data?.triangularArbitrage?.implicitGoldDollar || 68500).toLocaleString('fa-IR')} ت
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-amber-200 overflow-x-auto scrollbar-none">
          {[
            { id: 'coins_bubble', label: '🪙 حباب‌سنج و ارزش ذاتی سکه‌ها', icon: Coins },
            { id: 'gold_funds', label: '🏢 ماتریس صندوق‌های طلای بورس (P/NAV)', icon: Building2 },
            { id: 'triangular', label: '🔄 آربیتراژ مثلثی و دلار ضمنی طلا', icon: ArrowRightLeft },
            { id: 'allocator', label: '📊 شبیه‌ساز چینش بهینه سرمایه در طلا', icon: PieChart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-max border ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 border-amber-500 font-black shadow-xs'
                    : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: COINS INTRINSIC VALUE & BUBBLE MATRIX */}
      {activeTab === 'coins_bubble' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-600" />
                  <span>جدول مقایسه‌ای ارزش ذاتی و حباب انواع سکه بهار آزادی و امامی</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  محاسبه دقیق بر اساس وزن طلای خالص (عیار ۹۰۰/۱۰۰۰)، انس جهانی و نرخ دلار بازار آزاد
                </p>
              </div>

              <div className="text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 text-amber-950 font-bold">
                فرمول طلافروشی: <strong className="font-mono text-emerald-700">[(انس × دلار ÷ ۳۱.۱۰۳۵) × ۰.۹ × وزن] + حق ضرب</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(data?.coinsMatrix || []).map((coin: any) => {
                const isHighBubble = coin.bubblePercent > 30;
                return (
                  <div
                    key={coin.id}
                    className={`bg-amber-50/70 p-5 rounded-2xl border-2 transition space-y-4 shadow-xs ${
                      isHighBubble ? 'border-amber-300 hover:border-amber-400' : 'border-emerald-300 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{coin.name}</h4>
                        <span className="text-[10px] text-slate-600 font-medium">وزن: {coin.weightGrams} گرم (عیار ۲۱.۶)</span>
                      </div>

                      <div className="text-left">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          isHighBubble
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          حباب {coin.bubblePercent}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-700 font-medium">
                        <span>قیمت روز بازار:</span>
                        <strong className="font-mono text-base text-amber-950 font-black">
                          {coin.marketPrice.toLocaleString('fa-IR')} تومان
                        </strong>
                      </div>

                      <div className="flex justify-between text-slate-600 font-medium">
                        <span>ارزش ذاتی طلای خالص:</span>
                        <span className="font-mono text-slate-900 font-bold">
                          {coin.intrinsicValue.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>

                      <div className="flex justify-between text-slate-600 font-medium">
                        <span>مبلغ حباب (اضافه بر ارزش):</span>
                        <span className="font-mono text-rose-700 font-black">
                          +{coin.bubbleToman.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>

                    {/* Bubble Fill Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                        <span>سهم طلای واقعی: {100 - coin.bubblePercent}%</span>
                        <span>سهم حباب روانی: {coin.bubblePercent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${100 - coin.bubblePercent}%` }} className="bg-emerald-500 h-full"></div>
                        <div style={{ width: `${coin.bubblePercent}%` }} className="bg-rose-500 h-full"></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-600 font-bold">{coin.riskStatus}</span>
                      <button
                        onClick={() => onAskAi(`حباب قیمت ${coin.name} را با سناریوهای حبابی و راهکار معامله تحلیل کن.`)}
                        className="text-xs text-amber-950 hover:bg-amber-200 flex items-center gap-1 cursor-pointer bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 font-bold"
                      >
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        <span>تحلیل AI</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TSETMC GOLD FUNDS MATRIX & NAV DISCOUNT */}
      {activeTab === 'gold_funds' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <span>ماتریس مقایسه‌ای صندوق‌های سرمایه‌گذاری طلا در بورس ایران (Gold ETFs)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  شناسایی صندوق‌های دارای تخفیف NAV (ارزان‌تر از دارایی طلا)، نقدشوندگی بالا و معاف از مالیات
                </p>
              </div>

              <div className="text-xs bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-xl font-bold">
                ✓ امن‌ترین روش خرید بدون ریسک سرقت و تقلب طلا
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(data?.goldFunds || []).map((fund: any) => {
                const hasDiscount = fund.bubblePercent < 0;
                return (
                  <div
                    key={fund.symbol}
                    className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                            {fund.symbol}
                          </span>
                          <h4 className="text-sm font-black text-slate-900">{fund.name}</h4>
                        </div>
                        <span className="text-[10px] text-slate-600 font-medium mt-0.5 block">{fund.manager}</span>
                      </div>

                      <div className="text-left">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          hasDiscount
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-800 border-amber-300'
                        }`}>
                          {hasDiscount ? `تخفیف NAV: ${Math.abs(fund.bubblePercent)}%` : `P/NAV: ${fund.pNavRatio}`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                        <div className="text-[10px] text-slate-500 font-bold">قیمت تابلو</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{fund.currentPrice.toLocaleString('fa-IR')} ریال</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                        <div className="text-[10px] text-slate-500 font-bold">ارزش NAV واقعی</div>
                        <div className="font-mono font-bold text-emerald-700 mt-0.5">{fund.nav.toLocaleString('fa-IR')} ریال</div>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                        <div className="text-[10px] text-slate-500 font-bold">ارزش معاملات روز</div>
                        <div className="font-mono font-bold text-amber-900 mt-0.5">{fund.volumeDailyBillion} میلیارد ت</div>
                      </div>
                    </div>

                    {/* Asset Mix Breakdown */}
                    <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-amber-200">
                      <div className="flex justify-between text-slate-600 text-[11px] font-semibold">
                        <span>ترکیب دارایی صندوق:</span>
                        <span className="text-slate-900 font-bold">{fund.portfolioAssetMix.goldBars}٪ شمش + {fund.portfolioAssetMix.coinCertificates}٪ سکه</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${fund.portfolioAssetMix.goldBars}%` }} className="bg-amber-500 h-full" title="شمش طلا"></div>
                        <div style={{ width: `${fund.portfolioAssetMix.coinCertificates}%` }} className="bg-indigo-500 h-full" title="گواهی سپرده سکه"></div>
                        <div style={{ width: `${fund.portfolioAssetMix.cashAndFix}%` }} className="bg-slate-400 h-full" title="نقد"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-emerald-700 font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {fund.arbitrageSignal}
                      </span>
                      <button
                        onClick={() => onAskAi(`صندوق طلای ${fund.name} (${fund.symbol}) را برای سرمایه‌گذاری بلندمدت تحلیل کن.`)}
                        className="text-xs text-slate-800 hover:bg-amber-200 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-amber-300 font-bold"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>تحلیل تکمیلی</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRIANGULAR ARBITRAGE & IMPLICIT DOLLAR */}
      {activeTab === 'triangular' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-emerald-700" />
              <span>رادار آربیتراژ مثلثی طلا و محاسبه نرخ دلار ضمنی (Implicit Dollar vs Free Market)</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              کشف جاماندگی قیمت طلای تهران از دلار آزاد یا انس جهانی
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="text-xs text-slate-600 font-bold">نرخ دلار آزاد بازار (سبزه میدان / تتر)</div>
                <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                  {(data?.triangularArbitrage?.freeMarketDollar || 68500).toLocaleString('fa-IR')} تومان
                </div>
              </div>

              <div className="bg-amber-100/70 p-4 rounded-2xl border-2 border-amber-400">
                <div className="text-xs text-amber-950 font-black">دلار ضمنی قیمت‌گذاری‌شده در طلا</div>
                <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                  {(data?.triangularArbitrage?.implicitGoldDollar || 68500).toLocaleString('fa-IR')} تومان
                </div>
                <div className="text-[10px] text-amber-900 font-bold mt-1">
                  شکاف قیمتی: {data?.triangularArbitrage?.dollarGapPercent || 0}%
                </div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="text-xs text-slate-600 font-bold">نرخ برابری درهم امارات (AED/IRR)</div>
                <div className="text-2xl font-black font-mono text-indigo-700 mt-1">
                  {(data?.triangularArbitrage?.dirhamRate || 18600).toLocaleString('fa-IR')} تومان
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2 text-xs leading-relaxed">
              <strong className="text-amber-950 text-sm flex items-center gap-1.5 font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                نتیجه‌گیری و استراتژی آربیتراژ:
              </strong>
              <p className="text-slate-800 font-medium">{data?.triangularArbitrage?.recommendationFa}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PORTFOLIO ALLOCATION SIMULATOR */}
      {activeTab === 'allocator' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-700" />
              <span>شبیه‌ساز و بهینه‌ساز تخصیص سرمایه در بازارهای طلا و سکه (Capital Allocation Optimizer)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800">مبلغ کل سرمایه پیشنهادی (تومان):</label>
                <input
                  type="number"
                  value={investmentCapital}
                  onChange={(e) => setInvestmentCapital(Number(e.target.value))}
                  className="w-full mt-1.5 bg-white border-2 border-amber-300 rounded-xl p-3 text-sm font-mono font-bold text-amber-950 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800">استراتژی و سطح ریسک‌پذیری:</label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {[
                    { id: 'conservative', label: 'محافظه‌کار (کم‌ریسک)' },
                    { id: 'balanced', label: 'متعادل (پیشنهادی)' },
                    { id: 'aggressive', label: 'تهاجمی (حداکثر سود)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStrategyPreference(s.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition border ${
                        strategyPreference === s.id
                          ? 'bg-amber-400 text-amber-950 border-amber-500 font-black shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Allocation Plan */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-4">
              <div className="text-xs font-black text-slate-900">سبد بهینه پیشنهادی برای سرمایه شما:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-xs">
                  <div className="text-slate-600 font-medium">صندوق‌های طلای بورس (طلا / عیار):</div>
                  <div className="text-lg font-black font-mono text-amber-950 mt-1">
                    {(investmentCapital * (strategyPreference === 'conservative' ? 0.6 : 0.45)).toLocaleString('fa-IR')} تومان
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">معاف از مالیات و نقدشوندگی سریع</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-300 shadow-xs">
                  <div className="text-slate-600 font-medium">طلای آب‌شده / شمش ۱۸ عیار:</div>
                  <div className="text-lg font-black font-mono text-emerald-700 mt-1">
                    {(investmentCapital * (strategyPreference === 'conservative' ? 0.3 : 0.35)).toLocaleString('fa-IR')} تومان
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">بدون حباب و اجرت ساخت</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-300 shadow-xs">
                  <div className="text-slate-600 font-medium">نقدینگی آماده برای شکار اصلاح:</div>
                  <div className="text-lg font-black font-mono text-indigo-700 mt-1">
                    {(investmentCapital * (strategyPreference === 'conservative' ? 0.1 : 0.2)).toLocaleString('fa-IR')} تومان
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">خرید پله‌ای در سطوح فیبوناچی</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
