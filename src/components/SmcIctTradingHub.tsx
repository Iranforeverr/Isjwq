import React, { useState, useEffect } from 'react';
import {
  Layers,
  Zap,
  Target,
  Crosshair,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Compass,
  RefreshCw,
  Award,
  Flame,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface SmcIctTradingHubProps {
  selectedAsset: AssetInfo;
  onAskAi: (prompt: string) => void;
}

export const SmcIctTradingHub: React.FC<SmcIctTradingHubProps> = ({
  selectedAsset,
  onAskAi,
}) => {
  const [smcData, setSmcData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'setups' | 'orderblocks' | 'fvg' | 'liquidity' | 'killzones' | 'ote'>('setups');
  const [customCapital, setCustomCapital] = useState<number>(50000000); // 50 million tomans or $5000
  const [riskPercent, setRiskPercent] = useState<number>(1.5); // 1.5% max risk

  const fetchSmcData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gold/smc-ict?asset=${selectedAsset.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSmcData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch SMC data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmcData();
  }, [selectedAsset.id, selectedAsset.currentPrice]);

  const p = smcData?.currentPrice || selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: SMC & ICT Master Hub Header */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-100/50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm shadow-amber-500/5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  فاز ۱: پرایس‌اکشن پیشرفته اسمارت مانی و ICT (Smart Money Concepts)
                </h2>
                <span className="text-[10px] font-black bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  ICT Certified
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                ردیابی الگوریتم‌های بازارساز بین‌بانکی (IPDA)، اوردر بلاک‌های نهادی، گپ‌های FVG و پنجره‌های زمانی سیلور بولت طلا
              </p>
            </div>
          </div>

          {/* Quick Structure Badge */}
          <div className="flex items-center gap-3 bg-white border-2 border-amber-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold">ساختار حاکم بر {selectedAsset.nameFa}:</div>
              <div className="text-xs font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{smcData?.marketStructure?.bias || 'Bullish (صعودی)'}</span>
              </div>
            </div>
            <div className="h-7 w-px bg-amber-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">ناحیه قیمتی فعلی:</div>
              <div className="text-xs font-black text-amber-900">
                {smcData?.marketStructure?.currentZone?.split('(')[0] || 'Discount'}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-amber-200 overflow-x-auto scrollbar-none">
          {[
            { id: 'setups', label: '🎯 ستاپ‌های آماده معامله (Live Setups)', icon: Target },
            { id: 'orderblocks', label: '🧱 اوردر بلاک‌ها (Order Blocks)', icon: Layers },
            { id: 'fvg', label: '⚡ گپ‌های ارزش منصفانه (FVG / Imbalance)', icon: Zap },
            { id: 'liquidity', label: '🌊 استخرهای نقدینگی (BSL / SSL)', icon: Flame },
            { id: 'killzones', label: '⏰ سشن‌ها و سیلور بولت (ICT Killzones)', icon: Clock },
            { id: 'ote', label: '📐 نقطه ورود بهینه (ICT OTE Levels)', icon: Compass },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
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

      {/* SUB-TAB 1: LIVE SMC TRADE SETUPS */}
      {activeSubTab === 'setups' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              <span>سیگنال‌ها و ستاپ‌های معاملاتی الگوریتمی اسمارت مانی (ICT High-Probability Setups)</span>
            </h3>
            <span className="text-xs text-slate-600 font-bold">همگام با قیمت لحظه‌ای: {formatPrice(p, isUSD)}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(smcData?.activeSetups || []).map((setup: any) => (
              <div
                key={setup.id}
                className="bg-white border-2 border-amber-300 hover:border-amber-400 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between transition"
              >
                <div>
                  {/* Setup Card Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-amber-200">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                        {setup.setupName}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1.5 flex items-center gap-2">
                        <span>{setup.pair}</span>
                        <span className="text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 font-bold">
                          {setup.direction}
                        </span>
                      </h4>
                    </div>

                    <div className="text-left">
                      <div className="text-[10px] text-slate-500 font-bold">نسبت ریسک به ریوارد:</div>
                      <div className="text-sm font-black font-mono text-amber-950 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                        R:R {setup.riskRewardRatio}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-black mt-0.5">
                        نرخ برد: ~{setup.winRateEstimate}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-center">
                      <div className="text-[10px] text-slate-600 font-medium">نقطه ورود (Entry)</div>
                      <div className="text-xs sm:text-sm font-black font-mono text-amber-950 mt-0.5">
                        {formatPrice(setup.entryPrice, isUSD)}
                      </div>
                    </div>

                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-rose-300 text-center">
                      <div className="text-[10px] text-rose-700 font-bold">حد ضرر (SL)</div>
                      <div className="text-xs sm:text-sm font-black font-mono text-rose-700 mt-0.5">
                        {formatPrice(setup.stopLoss, isUSD)}
                      </div>
                    </div>

                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-emerald-300 text-center">
                      <div className="text-[10px] text-emerald-800 font-bold">تارگت اول (TP1)</div>
                      <div className="text-xs sm:text-sm font-black font-mono text-emerald-700 mt-0.5">
                        {formatPrice(setup.takeProfit1, isUSD)}
                      </div>
                    </div>

                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-emerald-400 text-center">
                      <div className="text-[10px] text-emerald-800 font-bold">تارگت اصلی (TP2)</div>
                      <div className="text-xs sm:text-sm font-black font-mono text-emerald-800 mt-0.5">
                        {formatPrice(setup.takeProfit2, isUSD)}
                      </div>
                    </div>
                  </div>

                  {/* Rationale */}
                  <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-slate-800 leading-relaxed mb-3 font-medium">
                    <strong className="text-amber-950 font-black">منطق ورود اسمارت مانی: </strong>
                    {setup.rationaleFa}
                  </div>

                  {/* Action Steps */}
                  <div className="space-y-1.5 text-xs text-slate-800">
                    <div className="font-black text-slate-900 text-[11px] mb-1">دستورالعمل اجرایی تریدر:</div>
                    {setup.stepByStepAction.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-200 flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    تاییدیه سوییپ نقدینگی و پر شدن گپ ارزش منصفانه
                  </span>
                  <button
                    onClick={() => onAskAi(`لطفاً ستاپ اسمارت مانی ${setup.setupName} روی ${setup.pair} را با جزئیات مدیریت سرمایه برای من تحلیل کن.`)}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-amber-300 shadow-xs"
                  >
                    <span>تحلیل با هوش مصنوعی</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ORDER BLOCKS */}
      {activeSubTab === 'orderblocks' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  <span>اسکنر اوردر بلاک‌های معتبر نهادی (Institutional Order Blocks)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  ردیابی آخرین کندل‌های سفارش‌گذاری بانک‌ها و موسسات قبل از حرکت‌های پرقدرت اینپالسی
                </p>
              </div>
              <div className="text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 text-slate-800 font-bold">
                سطح کلیدی ۵۰٪: <strong className="text-amber-950 font-mono">Mean Threshold (MT)</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(smcData?.orderBlocks || []).map((ob: any) => (
                <div
                  key={ob.id}
                  className={`bg-amber-50/70 p-4 rounded-2xl border-2 space-y-3 shadow-xs ${
                    ob.type === 'bullish'
                      ? 'border-emerald-300 hover:border-emerald-400'
                      : 'border-rose-300 hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                      ob.type === 'bullish' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      {ob.type === 'bullish' ? 'Bullish OB (تقاضای خرید)' : 'Bearish OB (عرضه فروش)'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                      تایم‌فریم {ob.timeframe}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span>سقف اوردر بلاک:</span>
                      <span className="font-mono font-bold text-slate-900">{formatPrice(ob.topPrice, isUSD)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span>کف اوردر بلاک:</span>
                      <span className="font-mono font-bold text-slate-900">{formatPrice(ob.bottomPrice, isUSD)}</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-950 font-black bg-amber-100/80 p-1.5 rounded-lg border border-amber-300">
                      <span>سطح میانی (Mean Threshold 50%):</span>
                      <span className="font-mono">{formatPrice(ob.meanThreshold, isUSD)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-200 text-[11px] text-slate-600 leading-relaxed font-medium">
                    {ob.descriptionFa}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 font-bold">
                    <span>وضعیت: <strong className="text-emerald-700">{ob.status === 'fresh_unmitigated' ? 'دست‌نخورده (Fresh)' : 'تست شده'}</strong></span>
                    {ob.volumeSpike && <span className="text-amber-800 font-black">🔥 حجم انفجاری</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-slate-800 leading-relaxed font-medium">
              💡 <strong className="text-amber-950 font-black">قانون طلایی ICT در اوردر بلاک‌ها:</strong> اگر بدنه کندل (Body) قیمت به زیر سطح ۵۰٪ (Mean Threshold) یک اوردر بلاک صعودی نفوذ و کلوز کند، آن بلاک نامعتبر (Invalidated / Breaker Block) محسوب می‌شود و باید فوراً از پوزیشن خارج شد.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FAIR VALUE GAPS */}
      {activeSubTab === 'fvg' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span>ماتریس گپ‌های ارزش منصفانه و ناکارآمدی قیمت (Fair Value Gaps - FVG)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  گپ‌های ۳ کندلی عدم تعادل نقدینگی که مانند آهنربا قیمت را برای پر شدن جذب می‌کنند (BISI و SIBI)
                </p>
              </div>
              <div className="text-xs bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300 text-slate-800 font-bold">
                نقطه تعادل گپ: <strong className="text-amber-950 font-mono">Consequent Encroachment (CE 50%)</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(smcData?.fairValueGaps || []).map((fvg: any) => (
                <div key={fvg.id} className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-md border border-amber-300">
                      {fvg.type === 'bullish_bisi' ? 'BISI (خلأ نقدینگی خرید)' : 'SIBI (خلأ نقدینگی فروش)'}
                    </span>
                    <span className="text-xs font-mono text-slate-600 font-bold">تایم‌فریم {fvg.timeframe}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <div className="text-[10px] text-slate-500 font-bold">کف گپ (Low)</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{formatPrice(fvg.low, isUSD)}</div>
                    </div>
                    <div className="bg-amber-100 border border-amber-300 p-2 rounded-xl">
                      <div className="text-[10px] text-amber-950 font-bold">میانه گپ (CE 50%)</div>
                      <div className="font-mono font-black text-amber-950 mt-0.5">{formatPrice(fvg.consequentEncroachment, isUSD)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200">
                      <div className="text-[10px] text-slate-500 font-bold">سقف گپ (High)</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{formatPrice(fvg.high, isUSD)}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {fvg.descriptionFa}
                  </p>

                  <div className="text-[11px] text-emerald-800 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>بهترین نقطه لیمیت ورود: دقیقاً روی تراز ۵۰٪ (Consequent Encroachment)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LIQUIDITY POOLS */}
      {activeSubTab === 'liquidity' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" />
              <span>رادار نقدینگی و تله‌های نقدینگی بازارساز (Liquidity Sweeps & Pools)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(smcData?.liquidityLevels || []).map((liq: any) => (
                <div key={liq.id} className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-950 border border-amber-300">
                      {liq.type} Pool
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      liq.status === 'swept' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {liq.status === 'swept' ? 'سوئیپ شده (Liquidity Purged)' : 'هدف دست‌نخورده (Target)'}
                    </span>
                  </div>

                  <div className="text-xl font-black font-mono text-amber-950 mt-1">
                    {formatPrice(liq.price, isUSD)}
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {liq.descriptionFa}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: ICT KILLZONES & SILVER BULLET */}
      {activeSubTab === 'killzones' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>ساعت‌های طلایی نقدینگی الگوریتم طلا (ICT Killzones & Silver Bullet)</span>
              </h3>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
                سشن فعال کنونی 🟢
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* London Killzone */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>اوپن لندن (London Open)</span>
                  <span className="text-blue-700 font-mono font-bold">07:00 - 10:00 UTC</span>
                </div>
                <div className="text-sm font-black text-slate-900">۱۰:۳۰ الی ۱۳:۳۰ به وقت تهران</div>
                <p className="text-[11px] text-slate-600 font-medium">
                  تشکیل کف یا سقف روزانه (High/Low of the Day) با سوییپ رنج آسیایی (Judas Swing).
                </p>
              </div>

              {/* New York Killzone & Silver Bullet */}
              <div className="bg-amber-100/70 p-4 rounded-2xl border-2 border-amber-400 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-black text-amber-950">
                  <span>نیویورک و سیلور بولت (Silver Bullet)</span>
                  <span className="text-amber-800 font-mono font-bold">13:00 - 16:00 UTC</span>
                </div>
                <div className="text-sm font-black text-amber-950">۱۶:۳۰ الی ۱۹:۳۰ به وقت تهران</div>
                <div className="p-2 bg-white rounded-xl text-[11px] text-amber-950 font-bold border border-amber-200 shadow-xs">
                  🎯 پنجره سیلور بولت: ۱۷:۳۰ الی ۱۸:۳۰ تهران (بهترین فرصت ترید اسکالپ طلا).
                </div>
              </div>

              {/* London Close */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>کلوز لندن (London Close)</span>
                  <span className="text-purple-700 font-mono font-bold">15:00 - 17:00 UTC</span>
                </div>
                <div className="text-sm font-black text-slate-900">۱۸:۳۰ الی ۲۰:۳۰ به وقت تهران</div>
                <p className="text-[11px] text-slate-600 font-medium">
                  پولبک و تسویه پوزیشن‌های سنگین روزانه و آماده‌سازی برای رنج شبانه.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: OTE LEVELS */}
      {activeSubTab === 'ote' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <span>محدوده نقطه ورود بهینه اسمارت مانی (ICT Optimal Trade Entry - OTE)</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              ورود با حداکثر دقت در لول‌های ۰.۶۲، ۰.۷۰۵ و ۰.۷۹ فیبوناچی در انتهای پولبک
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="text-xs text-slate-600 font-bold">تراز ۰.۶۲ فیبوناچی</div>
                <div className="text-xl font-black font-mono text-slate-900 mt-1">
                  {formatPrice(smcData?.oteLevels?.fib62 || 0, isUSD)}
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">شروع ورود پله اول</div>
              </div>

              <div className="bg-amber-100/70 border-2 border-amber-400 p-4 rounded-2xl">
                <div className="text-xs text-amber-950 font-black">تراز ۰.۷۰۵ (نقطه طلایی OTE)</div>
                <div className="text-2xl font-black font-mono text-amber-950 mt-1">
                  {formatPrice(smcData?.oteLevels?.fib705 || 0, isUSD)}
                </div>
                <div className="text-[11px] text-emerald-800 font-bold mt-1">حداکثر حجم ورود اصلی</div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="text-xs text-slate-600 font-bold">تراز ۰.۷۹ فیبوناچی</div>
                <div className="text-xl font-black font-mono text-slate-900 mt-1">
                  {formatPrice(smcData?.oteLevels?.fib79 || 0, isUSD)}
                </div>
                <div className="text-[10px] text-rose-700 font-bold mt-1">آخرین مرز معتبر قبل از حد ضرر</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
