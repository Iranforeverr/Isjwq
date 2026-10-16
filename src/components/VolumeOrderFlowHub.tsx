import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Activity,
  Layers,
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Crosshair,
  TrendingUp,
  Target,
  Sliders,
  Shield,
  Gauge,
  Radio,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface VolumeOrderFlowHubProps {
  selectedAsset: AssetInfo;
  onAskAi: (prompt: string) => void;
}

export const VolumeOrderFlowHub: React.FC<VolumeOrderFlowHubProps> = ({
  selectedAsset,
  onAskAi,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'anomalies' | 'cvd' | 'setups'>('profile');

  const fetchVolumeData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gold/volume-orderflow?asset=${selectedAsset.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch volume & order flow data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumeData();
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
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  فاز ۶: ولوم پروفایل نهادی، اوردر فلو و فوت‌پرینت طلا (Institutional Volume Profile & Order Flow CVD)
                </h2>
                <span className="text-[10px] font-black bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Market Depth & Footprint
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                تشخیص هسته تجمع نقدینگی (POC)، محدوده ارزش ۷۰ درصدی (VAH / VAL) و جریان سفارشات تهاجمی بانک‌ها (CVD)
              </p>
            </div>
          </div>

          {/* Key POC Level Badge */}
          <div className="flex items-center gap-3 bg-white border-2 border-amber-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold">هسته حجمی POC (مهم‌ترین سطح روز):</div>
              <div className="text-xs font-black text-amber-900 flex items-center gap-1 mt-0.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>{data?.pocPrice ? formatPrice(data.pocPrice, isUSD) : 'در حال محاسبه...'}</span>
              </div>
            </div>
            <div className="h-7 w-px bg-amber-200"></div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold">سفارشات سازمانی:</div>
              <div className="text-xs font-black font-mono text-emerald-700">
                {data?.cvdRadar?.smartMoneyDominancePercent || 74}% خریدار
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-amber-200 overflow-x-auto scrollbar-none">
          {[
            { id: 'profile', label: '📊 ولوم پروفایل افقی (POC / VAH / VAL)', icon: BarChart3 },
            { id: 'anomalies', label: '🚨 ناهنجاری‌های اوردربوک و بلاک اردرها (Footprint)', icon: Activity },
            { id: 'cvd', label: '📈 دلتای تجمعی حجم (CVD) و فشار خریداران', icon: Gauge },
            { id: 'setups', label: '🎯 ستاپ‌های ورود با تاییدیه حجم سازمانی', icon: Target },
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

      {/* TAB 1: VOLUME PROFILE HORIZONTAL NODES */}
      {activeTab === 'profile' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span>توزیع حجم افقی قیمت و محدوده ارزش ۷۰٪ (Value Area & POC)</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  نمایش توزیع حجم واقعی در هر پله قیمتی؛ رنگ سبز حجم خرید تهاجمی و رنگ قرمز حجم فروش را نشان می‌دهد
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-bold">
                  VAH: {data?.vahPrice ? formatPrice(data.vahPrice, isUSD) : ''}
                </span>
                <span className="bg-amber-300 text-amber-950 border border-amber-400 px-2.5 py-1 rounded-lg font-black">
                  POC: {data?.pocPrice ? formatPrice(data.pocPrice, isUSD) : ''}
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-bold">
                  VAL: {data?.valPrice ? formatPrice(data.valPrice, isUSD) : ''}
                </span>
              </div>
            </div>

            {/* Visual Horizontal Volume Bars */}
            <div className="space-y-2.5 bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200">
              {(data?.volumeProfileNodes || []).map((node: any, idx: number) => {
                const maxVol = 15000;
                const barWidth = Math.min(100, Math.round((node.volumeTotal / maxVol) * 100));

                return (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    {/* Price Level */}
                    <div className="w-24 sm:w-28 text-left font-mono font-bold shrink-0">
                      <span className={`${node.isPOC ? 'text-amber-950 font-black' : node.isVAH ? 'text-amber-800' : node.isVAL ? 'text-indigo-800' : 'text-slate-700'}`}>
                        {formatPrice(node.priceLevel, isUSD)}
                      </span>
                    </div>

                    {/* Tag if POC/VAH/VAL */}
                    <div className="w-16 shrink-0 text-center">
                      {node.isPOC && (
                        <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded shadow-xs border border-amber-500">
                          POC 🎯
                        </span>
                      )}
                      {node.isVAH && (
                        <span className="text-[10px] bg-amber-200 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 rounded">
                          VAH
                        </span>
                      )}
                      {node.isVAL && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold px-1.5 py-0.5 rounded">
                          VAL
                        </span>
                      )}
                    </div>

                    {/* Volume Bar */}
                    <div className="flex-1 bg-slate-200 h-6 rounded-lg overflow-hidden flex items-center p-0.5 relative border border-amber-100">
                      <div
                        style={{ width: `${barWidth}%` }}
                        className={`h-full rounded flex overflow-hidden ${node.isPOC ? 'ring-2 ring-amber-400' : ''}`}
                      >
                        {/* Buy vs Sell Delta fill */}
                        <div
                          style={{ width: `${node.buyVolumePercent}%` }}
                          className="bg-emerald-500 h-full"
                          title={`خرید: ${node.buyVolumePercent}%`}
                        ></div>
                        <div
                          style={{ width: `${node.sellVolumePercent}%` }}
                          className="bg-rose-500 h-full"
                          title={`فروش: ${node.sellVolumePercent}%`}
                        ></div>
                      </div>

                      {/* Number info */}
                      <span className="absolute left-2 text-[10px] font-mono text-slate-800 font-bold">
                        {node.volumeTotal.toLocaleString()} قرارداد ({node.buyVolumePercent}٪ خرید)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-slate-800 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-950 font-black">تفسیر معاملاتی ولوم پروفایل:</strong> وقتی قیمت داخل منطقه ارزشی (بین VAL و VAH) در حال معامله است، بازار در فاز تعادل و رِنج است. خروج پرقدرت همراه با افزایش حجم از VAH یا VAL آغازگر روندهای شارپ طلا (Trend Day) خواهد بود.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FOOTPRINT & INSTITUTIONAL ANOMALIES */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>ردیابی بلادرنگ سفارشات بلاک و ناهنجاری‌های فوت‌پرینت نهادی (Block Orders Radar)</span>
            </h3>

            <div className="space-y-3">
              {(data?.anomalies || []).map((anomaly: any) => (
                <div
                  key={anomaly.id}
                  className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                        {anomaly.timeframe}
                      </span>
                      <h4 className="text-sm font-black text-slate-900">{anomaly.anomalyType}</h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-amber-950 font-mono font-bold">سطح: {formatPrice(anomaly.priceLevel, isUSD)}</span>
                      <span className="text-slate-500 text-[11px] font-mono">({anomaly.timestampTehran})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-amber-200">
                      <span className="text-slate-500 block text-[11px] font-medium">حجم نسبت به میانگین:</span>
                      <strong className="text-amber-900 font-mono text-sm mt-0.5 block font-black">{anomaly.volumeMultiplier} برابر عادی 🔥</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-amber-200">
                      <span className="text-slate-500 block text-[11px] font-medium">برتری دلتای خرید:</span>
                      <strong className="text-emerald-700 font-mono text-sm mt-0.5 block font-black">{anomaly.buyDeltaPercent}٪ خرید تهاجمی</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-amber-200">
                      <span className="text-slate-500 block text-[11px] font-medium">ضریب اطمینان الگوریتم:</span>
                      <strong className="text-amber-950 font-mono text-sm mt-0.5 block font-black">{anomaly.confidenceScore}٪ (سازمانی)</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-amber-200 leading-relaxed font-medium">
                    💡 <strong className="text-slate-900 font-bold">ردپای پول هوشمند:</strong> {anomaly.instructionFa}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onAskAi(`ناهنجاری اوردر فلو ${anomaly.anomalyType} در قیمت ${formatPrice(anomaly.priceLevel, isUSD)} را با پلن معاملاتی بررسی کن.`)}
                      className="text-xs text-amber-950 hover:bg-amber-200 flex items-center gap-1 cursor-pointer bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>تاییدیه ورود با هوش مصنوعی</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CVD RADAR & ORDER BOOK IMBALANCE */}
      {activeTab === 'cvd' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-emerald-700" />
              <span>شاخص دلتای تجمعی حجم (Cumulative Volume Delta - CVD) و برتری دفترچه سفارشات</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-200 space-y-3">
                <div className="text-xs font-bold text-emerald-800">وضعیت فعلی جریان CVD:</div>
                <div className="text-lg font-black text-slate-900">{data?.cvdRadar?.currentCVDStatus}</div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {data?.cvdRadar?.cvdDivergenceSignal}
                </p>
                <div className="p-3 bg-white border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold">
                  {data?.cvdRadar?.orderBookImbalanceRatio}
                </div>
              </div>

              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="text-xs font-black text-slate-900">سهم بازیگران بازار در معاملات جاری طلا:</div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1 font-medium">
                      <span>پول هوشمند و نهادهای بانکی (Smart Money):</span>
                      <strong className="text-emerald-700 font-mono font-bold">{data?.cvdRadar?.smartMoneyDominancePercent}%</strong>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: `${data?.cvdRadar?.smartMoneyDominancePercent}%` }} className="bg-emerald-500 h-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1 font-medium">
                      <span>معامله‌گران خرد و احساسی (Retail):</span>
                      <strong className="text-slate-600 font-mono font-bold">{data?.cvdRadar?.retailDominancePercent}%</strong>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: `${data?.cvdRadar?.retailDominancePercent}%` }} className="bg-slate-400 h-full"></div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 pt-2 border-t border-amber-200 font-medium">
                  تعداد معاملات بلاک بالای ۵۰ لات امروز: <strong className="text-amber-950 font-mono font-bold">{data?.cvdRadar?.largeTradeOrdersCount} معامله</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ORDER FLOW SETUPS */}
      {activeTab === 'setups' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              <span>ستاپ‌های معاملاتی با تاییدیه همزمان ولوم پروفایل و دلتای اوردرفلو</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data?.activeOrderFlowSetups || []).map((setup: any) => (
                <div
                  key={setup.id}
                  className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <h4 className="text-sm font-black text-slate-900">{setup.title}</h4>
                    <span className="text-xs font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300 font-mono">
                      {setup.winRate} Win
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-500 text-[11px] font-medium">محدوده ورود (Entry):</span>
                      <strong className="text-amber-950 font-mono block mt-0.5 font-bold">{setup.entryZone}</strong>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-500 text-[11px] font-medium">حد ضرر (SL):</span>
                      <strong className="text-rose-700 font-mono block mt-0.5 font-bold">{formatPrice(setup.sl, isUSD)}</strong>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-500 text-[11px] font-medium">تارگت اول (TP1):</span>
                      <strong className="text-emerald-700 font-mono block mt-0.5 font-bold">{formatPrice(setup.tp1, isUSD)}</strong>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                      <span className="text-slate-500 text-[11px] font-medium">تارگت نهایی (TP2):</span>
                      <strong className="text-emerald-700 font-mono block mt-0.5 font-bold">{formatPrice(setup.tp2, isUSD)}</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-amber-200 leading-relaxed font-medium">
                    🎯 <strong className="text-slate-900 font-bold">منطق ورود اوردر فلو:</strong> {setup.orderFlowRationaleFa}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-amber-950 font-mono font-black">R/R: {setup.rr}</span>
                    <button
                      onClick={() => onAskAi(`ستاپ ${setup.title} را بر اساس ساختار فعلی بازار ارزیابی کن.`)}
                      className="text-xs text-amber-950 hover:bg-amber-200 flex items-center gap-1 cursor-pointer bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300 font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>مشاوره اجرای ستاپ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
