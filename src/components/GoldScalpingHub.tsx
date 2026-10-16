import React, { useState, useEffect } from 'react';
import {
  Zap,
  Flame,
  Timer,
  Target,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BarChart2,
  Sliders,
  DollarSign,
  Activity,
  ArrowRight,
  Crosshair,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface GoldScalpingHubProps {
  selectedAsset: AssetInfo;
  onAskAi: (prompt: string) => void;
}

export const GoldScalpingHub: React.FC<GoldScalpingHubProps> = ({
  selectedAsset,
  onAskAi,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'setups' | 'asian_box' | 'volatility' | 'risk_calc'>('setups');

  // Interactive Scalp Position Size Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(selectedAsset.isUSD ? 2000 : 100000000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0); // 1%
  const [stopLossPips, setStopLossPips] = useState<number>(15); // 15 pips in gold

  const fetchScalpingData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gold/scalping?asset=${selectedAsset.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch scalping data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScalpingData();
  }, [selectedAsset.id, selectedAsset.currentPrice]);

  const p = data?.currentPrice || selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  // Position Size Math
  const riskAmount = (accountBalance * riskPercent) / 100;
  // In Gold 1 lot = $10 per pip. So lot = RiskAmount / (SL pips * 10)
  const calculatedLots = isUSD
    ? Math.max(0.01, Math.round((riskAmount / (stopLossPips * 10)) * 100) / 100)
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-100/50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm shadow-amber-500/5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  فاز ۳: استراتژی‌های اختصاصی اسکالپ طلا و بریک‌اوت رنج آسیا (Gold Scalping Hub)
                </h2>
                <span className="text-[10px] font-black bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  High Frequency 1M-15M
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                الگوریتم‌های شکست باکس آسیایی (Asian Range)، مومنتوم اوپن لندن، پولبک‌های ریبون میانگین متحرک و مدیریت حجم بر پایه ATR
              </p>
            </div>
          </div>

          {/* Quick Asian Range Badge */}
          <div className="flex items-center gap-3 bg-white border-2 border-amber-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold">وضعیت رنج آسیا:</div>
              <div className="text-xs font-black text-amber-900 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{data?.asianRange?.status === 'consolidation_active' ? 'تثبیت درون باکس' : 'شکست فعال'}</span>
              </div>
            </div>
            <div className="h-7 w-px bg-amber-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">نوسان موردانتظار (ATR):</div>
              <div className="text-xs font-black font-mono text-rose-700">
                {isUSD ? `±${data?.volatilityRadar?.dailyRangeExpected || 28.5} $` : 'نوسان بالا'}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-amber-200 overflow-x-auto scrollbar-none">
          {[
            { id: 'setups', label: '⚡ ستاپ‌های لایو اسکالپ (1M / 5M / 15M)', icon: Zap },
            { id: 'asian_box', label: '📦 باکس رنج آسیا و Judas Swing', icon: Clock },
            { id: 'volatility', label: '📊 رادار ولاتیلیتی و ATR طلا', icon: Activity },
            { id: 'risk_calc', label: '🧮 ماشین‌حساب حجم و لات اسکالپ', icon: Sliders },
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

      {/* TAB 1: LIVE SCALPING SETUPS */}
      {activeTab === 'setups' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {(data?.activeScalpSetups || []).map((setup: any) => (
              <div
                key={setup.id}
                className="bg-white border-2 border-amber-300 hover:border-amber-400 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                          تایم {setup.timeframe}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                          {setup.direction}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-2">{setup.name}</h4>
                    </div>

                    <div className="text-left">
                      <div className="text-[10px] text-slate-500 font-bold">ریسک به ریوارد:</div>
                      <div className="text-xs font-black font-mono text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        {setup.riskReward}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Win: ~{setup.winRate}</div>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-center">
                      <div className="text-[10px] text-slate-600 font-medium">نقطه ورود (Entry)</div>
                      <div className="font-mono font-black text-slate-900 mt-0.5">{formatPrice(setup.entryPrice, isUSD)}</div>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-rose-300 text-center">
                      <div className="text-[10px] text-rose-700 font-bold">حد ضرر (SL)</div>
                      <div className="font-mono font-black text-rose-700 mt-0.5">{formatPrice(setup.stopLoss, isUSD)}</div>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-emerald-300 text-center">
                      <div className="text-[10px] text-emerald-800 font-bold">تارگت اول (TP1)</div>
                      <div className="font-mono font-black text-emerald-700 mt-0.5">{formatPrice(setup.takeProfit1, isUSD)}</div>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-emerald-400 text-center">
                      <div className="text-[10px] text-emerald-800 font-bold">تارگت دوم (TP2)</div>
                      <div className="font-mono font-black text-emerald-800 mt-0.5">{formatPrice(setup.takeProfit2, isUSD)}</div>
                    </div>
                  </div>

                  {/* Indicator triggers */}
                  <div className="space-y-1 text-xs bg-amber-50/80 p-3 rounded-2xl border border-amber-200 mb-3">
                    <div className="text-[10px] text-amber-950 font-black mb-1">سیگنال‌های تاییدیه اندیکاتوری:</div>
                    {setup.indicatorsTrigger.map((trig: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{trig}</span>
                      </div>
                    ))}
                  </div>

                  {/* Execution Rules */}
                  <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                    {setup.executionRules.map((rule: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200 flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-600 font-medium">{setup.leverageGuide}</span>
                  <button
                    onClick={() => onAskAi(`ستاپ اسکالپ ${setup.name} در طلا را با نکات ترید لحظه‌ای تحلیل کن.`)}
                    className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-amber-300 shadow-xs"
                  >
                    <span>تحلیل هوش مصنوعی</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ASIAN RANGE BREAKOUT & JUDAS SWING */}
      {activeTab === 'asian_box' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>مانیتور باکس آسیایی و شکست‌های جعلی (Asian Range & Judas Swing)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  بازه زمانی توکیو و سیدنی: <strong className="text-amber-950">{data?.asianRange?.sessionTimeTehran}</strong>
                </p>
              </div>

              <div className="text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 text-amber-950 font-bold">
                ریسک فریب اولیه (Judas Swing): <strong className="text-rose-700">{data?.asianRange?.judasSwingRisk}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                <div className="text-xs text-slate-600 font-bold">سقف رنج آسیا (Asian High)</div>
                <div className="text-xl font-black font-mono text-emerald-700 mt-1">
                  {formatPrice(data?.asianRange?.high || 0, isUSD)}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">محدوده سفارشات Buy Stop</div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                <div className="text-xs text-slate-600 font-bold">کف رنج آسیا (Asian Low)</div>
                <div className="text-xl font-black font-mono text-rose-700 mt-1">
                  {formatPrice(data?.asianRange?.low || 0, isUSD)}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">محدوده سفارشات Sell Stop</div>
              </div>

              <div className="bg-amber-100/90 border-2 border-amber-400 p-4 rounded-2xl shadow-xs">
                <div className="text-xs text-amber-950 font-black">تارگت شکست صعودی</div>
                <div className="text-xl font-black font-mono text-amber-950 mt-1">
                  {formatPrice(data?.asianRange?.bullishBreakoutTarget || 0, isUSD)}
                </div>
                <div className="text-[10px] text-emerald-800 font-bold mt-1">+1.5 برابر پهنای باکس</div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                <div className="text-xs text-slate-600 font-bold">تارگت شکست نزولی</div>
                <div className="text-xl font-black font-mono text-slate-900 mt-1">
                  {formatPrice(data?.asianRange?.bearishBreakoutTarget || 0, isUSD)}
                </div>
                <div className="text-[10px] text-rose-700 font-bold mt-1">-1.5 برابر پهنای باکس</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 space-y-2 text-xs text-slate-800 leading-relaxed font-medium">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>نکته حیاتی ترید بریک‌اوت آسیا در طلا:</span>
              </div>
              <p>
                در ۸۰٪ مواقع، در ساعت ۱۰:۳۰ تا ۱۱:۰۰ صبح تهران (بازگشایی فرانکفورت و لندن)، قیمت یک شکست دروغین (Judas Swing) به سمت یکی از لبه‌های باکس آسیا می‌زند تا استاپ‌لاس‌های معامله‌گران را جمع‌آوری کند و بلافاصله به سمت مخالف پرواز می‌کند. هرگز در اولین بریک‌اوت بدون تاییدیه کندل ورود نکنید!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VOLATILITY RADAR & ATR */}
      {activeTab === 'volatility' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              <span>رادار ولاتیلیتی و محدوده نوسان میانگین واقعی (Average True Range - ATR)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                <div className="text-xs text-slate-600 font-bold">ATR کندل ۵ دقیقه (M5)</div>
                <div className="text-2xl font-black font-mono text-amber-950 mt-1">
                  {isUSD ? `±${data?.volatilityRadar?.atr14M5 || 2.8} $` : '۱۲,۰۰۰ تومان'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">فاصله استاندارد حد ضرر اسکالپ</div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                <div className="text-xs text-slate-600 font-bold">ATR کندل ۱ ساعته (H1)</div>
                <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                  {isUSD ? `±${data?.volatilityRadar?.atr14H1 || 11.5} $` : '۴۸,۰۰۰ تومان'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">محدوده نوسان هر سشن</div>
              </div>

              <div className="bg-amber-100/90 border-2 border-amber-400 p-4 rounded-2xl shadow-xs">
                <div className="text-xs text-amber-950 font-black">نوسان موردانتظار ۲۴ ساعت</div>
                <div className="text-2xl font-black font-mono text-amber-950 mt-1">
                  {isUSD ? `±${data?.volatilityRadar?.dailyRangeExpected || 28.5} $` : '۱۱۰,۰۰۰ تومان'}
                </div>
                <div className="text-[10px] text-amber-800 font-bold mt-1">سقف پتانسیل حرکتی روزانه</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <div className="text-slate-600 font-medium">اسپرد مجاز برای اسکالپ:</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{data?.volatilityRadar?.currentSpreadEstimate}</div>
              </div>
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <div className="text-slate-600 font-medium">بهترین پنجره معاملاتی برای شکار مومنتوم:</div>
                <div className="text-sm font-bold text-amber-950 mt-1">{data?.volatilityRadar?.bestTradingWindow}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POSITION SIZE & SCALPING RISK CALCULATOR */}
      {activeTab === 'risk_calc' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-600" />
              <span>ماشین‌حساب هوشمند مدیریت ریسک و محاسبه لات (Lot & Position Sizing)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">موجودی حساب ({isUSD ? 'دلار' : 'تومان'}):</label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(Number(e.target.value))}
                  className="w-full mt-1.5 bg-amber-50/60 border-2 border-amber-200 rounded-xl p-2.5 text-sm font-mono font-bold text-slate-900 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">درصد ریسک در هر ترید (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full mt-1.5 bg-amber-50/60 border-2 border-amber-200 rounded-xl p-2.5 text-sm font-mono font-bold text-amber-950 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">فاصله حد ضرر (پیپ / دلار):</label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(Number(e.target.value))}
                  className="w-full mt-1.5 bg-amber-50/60 border-2 border-amber-200 rounded-xl p-2.5 text-sm font-mono font-bold text-rose-700 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Calculation Output Box */}
            <div className="bg-gradient-to-br from-amber-100/90 via-amber-50 to-white p-5 rounded-2xl border-2 border-amber-300 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-xs">
              <div>
                <div className="text-xs text-slate-600 font-bold">حداکثر مبلغ مجاز برای ضرر:</div>
                <div className="text-xl font-black font-mono text-rose-700 mt-1">
                  {formatPrice(riskAmount, isUSD)}
                </div>
              </div>

              {isUSD ? (
                <div>
                  <div className="text-xs text-amber-950 font-black">حجم معامله دقیق پیشنهادی:</div>
                  <div className="text-3xl font-black font-mono text-amber-950 mt-1">
                    {calculatedLots} <span className="text-base font-normal">Lot</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-amber-950 font-black">حجم خرید پله‌ای:</div>
                  <div className="text-xl font-black font-mono text-amber-950 mt-1">
                    {((riskAmount / 4350000) * 10).toFixed(1)} گرم طلای ۱۸ عیار
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-slate-600 font-bold">سود موردانتظار با تارگت ۱:۳:</div>
                <div className="text-xl font-black font-mono text-emerald-700 mt-1">
                  {formatPrice(riskAmount * 3, isUSD)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
