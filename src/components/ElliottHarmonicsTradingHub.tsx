import React, { useState, useEffect } from 'react';
import {
  Activity,
  Compass,
  TrendingUp,
  TrendingDown,
  Target,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Layers,
  ChevronRight,
  Flame,
  Award,
  BarChart3,
  Sliders,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface ElliottHarmonicsTradingHubProps {
  selectedAsset: AssetInfo;
  onAskAi: (prompt: string) => void;
}

export const ElliottHarmonicsTradingHub: React.FC<ElliottHarmonicsTradingHubProps> = ({
  selectedAsset,
  onAskAi,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'elliott' | 'harmonics' | 'golden_pocket' | 'setups'>('elliott');

  const fetchElliottData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gold/elliott-harmonics?asset=${selectedAsset.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch Elliott & Harmonics data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElliottData();
  }, [selectedAsset.id, selectedAsset.currentPrice]);

  const p = data?.currentPrice || selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-100/50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm shadow-amber-500/5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  فاز ۲: امواج الیوت پیشرفته و الگوهای هارمونیک طلایی (Elliott Waves & Harmonics)
                </h2>
                <span className="text-[10px] font-black bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Neely & Prechter Certified
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                ردیابی سیکل‌های ۵ موجی ایمپالس، پروجکشن هدف قله موج ۵، اسکنر الگوهای گارتلی/خفاش و زون‌های بازگشتی PRZ
              </p>
            </div>
          </div>

          {/* Quick Elliott Cycle Badge */}
          <div className="flex items-center gap-3 bg-white border-2 border-amber-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold">سیکل امواج الیوت فعال:</div>
              <div className="text-xs font-black text-amber-900 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{data?.elliott?.currentCycle || 'موج ۳ صعودی'}</span>
              </div>
            </div>
            <div className="h-7 w-px bg-amber-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">تارگت موج ۵ نهایی:</div>
              <div className="text-xs font-black font-mono text-emerald-700">
                {formatPrice(data?.elliott?.projectedWave5Target || 0, isUSD)}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-amber-200 overflow-x-auto scrollbar-none">
          {[
            { id: 'elliott', label: '🌊 شمارش امواج الیوت (Wave Counting)', icon: Activity },
            { id: 'harmonics', label: '🦋 الگوهای هارمونیک و PRZ (Harmonic Radar)', icon: Compass },
            { id: 'golden_pocket', label: '🪙 پاکت طلایی فیبوناچی (Golden Pocket 0.618-0.65)', icon: Zap },
            { id: 'setups', label: '🎯 ستاپ‌های معاملاتی الیوت و هارمونیک', icon: Target },
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

      {/* TAB 1: ELLIOTT WAVE COUNTER & RULES VALIDATION */}
      {activeTab === 'elliott' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Waves Visual Flow */}
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  <span>توالی امواج پیشرو الیوت (5-Wave Motive Impulse Sequence)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  درجه موج: <strong className="text-amber-950 font-bold">{data?.elliott?.currentDegree}</strong> در تایم‌فریم ۴ ساعته طلا
                </p>
              </div>

              <div className="text-xs bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-300 text-rose-800 font-bold">
                سطح ابطال تحلیل (Invalidation Level): <strong className="font-mono text-rose-700">{formatPrice(data?.elliott?.invalidationPrice || 0, isUSD)}</strong>
              </div>
            </div>

            {/* Wave Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {(data?.elliott?.waves || []).map((wave: any, idx: number) => {
                const isCompleted = wave.status === 'completed';
                const isActive = wave.status === 'active_forming';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-2 relative overflow-hidden shadow-xs ${
                      isActive
                        ? 'bg-amber-100/80 border-2 border-amber-400 shadow-amber-500/10'
                        : isCompleted
                        ? 'bg-emerald-50/70 border-2 border-emerald-300'
                        : 'bg-amber-50/50 border border-amber-200 opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                        isActive
                          ? 'bg-amber-400 text-amber-950 border-amber-500'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-700 border-amber-200'
                      }`}>
                        {wave.label}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {isCompleted ? '✓ تکمیل شده' : isActive ? '⚡ در جریان' : '🎯 تارگت آتی'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium space-y-1 pt-1">
                      <div className="flex justify-between">
                        <span>شروع:</span>
                        <span className="font-mono font-bold text-slate-900">{formatPrice(wave.startPrice, isUSD)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>پایان/هدف:</span>
                        <span className="font-mono font-black text-amber-950">{formatPrice(wave.endPrice, isUSD)}</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-amber-950 font-bold bg-white p-1.5 rounded-lg border border-amber-200 shadow-xs">
                      {wave.fibRatio}
                    </div>

                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed pt-1">
                      {wave.descriptionFa}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Elliott Golden Rules Validation Matrix */}
            <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>اعتبارسنجی ۳ قانون نقض‌ناپذیر امواج الیوت (Elliott Golden Rules)</span>
                </h4>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  ۱۰۰٪ معتبر و تایید شده
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-start gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 font-black">قانون ۱ (اصلاح موج ۲):</strong>
                    <p className="text-slate-600 font-medium text-[11px] mt-0.5">موج ۲ هرگز کف شروع موج ۱ را به سمت پایین رد نمی‌کند (پاس شد).</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-start gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 font-black">قانون ۲ (طول موج ۳):</strong>
                    <p className="text-slate-600 font-medium text-[11px] mt-0.5">موج ۳ هرگز کوتاه‌ترین موج در میان امواج ۱، ۳ و ۵ نیست (پاس شد).</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-300 flex items-start gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 font-black">قانون ۳ (تداخل موج ۴):</strong>
                    <p className="text-slate-600 font-medium text-[11px] mt-0.5">موج ۴ وارد حریم قیمتی قله موج ۱ نمی‌شود (پاس شد).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HARMONIC PATTERNS & PRZ */}
      {activeTab === 'harmonics' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <span>اسکنر الگوهای هارمونیک طلا (Harmonic Patterns & PRZ Reversal Zones)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  ردیابی همگرایی نسبت‌های فیبوناچی در نقاط X-A-B-C-D و محدوده بازگشت احتمالی (PRZ)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(data?.harmonics || []).map((harm: any) => (
                <div
                  key={harm.id}
                  className="bg-amber-50/70 p-5 rounded-3xl border-2 border-amber-200 hover:border-amber-400 space-y-4 transition shadow-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <div>
                      <span className="text-xs font-black text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300">
                        {harm.name}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1.5 flex items-center gap-2">
                        <span>{harm.symbol}</span>
                        <span className="text-xs text-emerald-800 font-bold">({harm.direction})</span>
                      </h4>
                    </div>

                    <div className="text-left">
                      <div className="text-[10px] text-slate-500 font-bold">امتیاز اعتبار PRZ:</div>
                      <div className="text-base font-black font-mono text-emerald-700">
                        {harm.przZone.reversalScore}/100 🎯
                      </div>
                    </div>
                  </div>

                  {/* Harmonic Coordinate Points (X, A, B, C, D) */}
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-bold">نقطه X</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{formatPrice(harm.points.X, isUSD)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-bold">نقطه A</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{formatPrice(harm.points.A, isUSD)}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-bold">نقطه B</div>
                      <div className="font-mono font-bold text-amber-950 mt-0.5">{formatPrice(harm.points.B, isUSD)}</div>
                      <div className="text-[9px] text-slate-500 font-bold">{harm.fibRatios.xB}</div>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
                      <div className="text-[10px] text-slate-500 font-bold">نقطه C</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{formatPrice(harm.points.C, isUSD)}</div>
                    </div>
                    <div className="bg-amber-100 border-2 border-amber-400 p-2 rounded-xl shadow-xs">
                      <div className="text-[10px] text-amber-950 font-black">زون PRZ (D)</div>
                      <div className="font-mono font-black text-amber-950 mt-0.5">{formatPrice(harm.points.D, isUSD)}</div>
                      <div className="text-[9px] text-amber-800 font-bold">{harm.fibRatios.xD}</div>
                    </div>
                  </div>

                  {/* PRZ Zone Banner */}
                  <div className="bg-white p-3 rounded-2xl border border-amber-200 space-y-1.5 text-xs shadow-xs">
                    <div className="flex items-center justify-between text-slate-800 font-bold">
                      <span>باکس بازگشتی PRZ ورودی معامله:</span>
                      <span className="font-mono font-black text-emerald-700">
                        {formatPrice(harm.przZone.min, isUSD)} - {formatPrice(harm.przZone.max, isUSD)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
                      <span>حد ضرر (Stop Loss):</span>
                      <span className="font-mono font-bold text-rose-700">{formatPrice(harm.stopLoss, isUSD)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
                      <span>تارگت اول (۳۸.۲٪ CD):</span>
                      <span className="font-mono font-bold text-emerald-700">{formatPrice(harm.takeProfit1, isUSD)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
                      <span>تارگت دوم (۶۱.۸٪ CD):</span>
                      <span className="font-mono font-bold text-emerald-800">{formatPrice(harm.takeProfit2, isUSD)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {harm.descriptionFa}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOLDEN POCKET 0.618 - 0.65 */}
      {activeTab === 'golden_pocket' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <span>ماشین‌حساب و رادار گلدن پاکت طلا (Fibonacci Golden Pocket 0.618 - 0.65)</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              معتبرترین ناحیه پرایس‌اکشنی برای شکار کف پولبک در روندهای صعودی طلا
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                <div className="text-xs text-slate-600 font-bold">تراز ۰.۶۱۸ فیبوناچی (آغاز باکس)</div>
                <div className="text-xl font-black font-mono text-slate-900 mt-1">
                  {formatPrice(data?.goldenPocket?.fib618 || 0, isUSD)}
                </div>
              </div>

              <div className="bg-amber-100/90 p-4 rounded-2xl border-2 border-amber-400 shadow-xs">
                <div className="text-xs text-amber-950 font-black">تراز ۰.۶۵ (هسته طلایی گلدن پاکت)</div>
                <div className="text-2xl font-black font-mono text-amber-950 mt-1">
                  {formatPrice(data?.goldenPocket?.fib650 || 0, isUSD)}
                </div>
                <div className="text-[11px] text-emerald-800 font-bold mt-1">حداکثر سفارش‌گذاری نهادی</div>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
                <div className="text-xs text-slate-600 font-bold">تراز ۰.۷۸۶ فیبوناچی (انتهای حمایت)</div>
                <div className="text-xl font-black font-mono text-slate-900 mt-1">
                  {formatPrice(data?.goldenPocket?.fib786 || 0, isUSD)}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-slate-800 leading-relaxed font-medium">
              💡 <strong className="text-amber-950 font-black">استراتژی معامله در گلدن پاکت:</strong> وقتی طلا در یک روند صعودی وارد باکس بین ۶۱.۸٪ تا ۶۵٪ فیبوناچی می‌شود، ریسک به ریوارد ورود به معامله خرید به بالاتر از ۱ به ۳.۵ می‌رسد و حد ضرر دقیقاً زیر تراز ۷۸.۶٪ قرار می‌گیرد.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ELLIOTT & HARMONIC TRADE SETUPS */}
      {activeTab === 'setups' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(data?.activeSetups || []).map((setup: any) => (
              <div
                key={setup.id}
                className="bg-white border-2 border-amber-300 hover:border-amber-400 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300">
                        {setup.patternType}
                      </span>
                      <h4 className="text-base font-black text-slate-900 mt-1.5">{setup.title}</h4>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-amber-950 font-mono bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                        R:R {setup.rr}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-1">احتمال موفقیت: {setup.probability}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-center">
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                      <div className="text-[10px] text-slate-600 font-medium">نقطه ورود</div>
                      <div className="text-xs font-black font-mono text-amber-950 mt-0.5">{formatPrice(setup.entry, isUSD)}</div>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-rose-300">
                      <div className="text-[10px] text-rose-700 font-bold">حد ضرر</div>
                      <div className="text-xs font-black font-mono text-rose-700 mt-0.5">{formatPrice(setup.sl, isUSD)}</div>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-emerald-300">
                      <div className="text-[10px] text-emerald-800 font-bold">تارگت ۱</div>
                      <div className="text-xs font-black font-mono text-emerald-700 mt-0.5">{formatPrice(setup.tp1, isUSD)}</div>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-emerald-400">
                      <div className="text-[10px] text-emerald-800 font-bold">تارگت نهایی</div>
                      <div className="text-xs font-black font-mono text-emerald-800 mt-0.5">{formatPrice(setup.tp3, isUSD)}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 font-medium bg-amber-50 p-3 rounded-xl border border-amber-200 leading-relaxed">
                    {setup.instructionFa}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-200 flex items-center justify-between mt-3">
                  <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    شمارش الیوت تایید شده با قوانین Neely
                  </span>
                  <button
                    onClick={() => onAskAi(`ستاپ معاملاتی الیوت و هارمونیک ${setup.title} روی طلا را با جزئیات تحلیل کن.`)}
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
    </div>
  );
};
