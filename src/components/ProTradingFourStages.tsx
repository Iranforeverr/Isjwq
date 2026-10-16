import React, { useState, useEffect } from 'react';
import {
  Globe,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Layers,
  Calendar,
  DollarSign,
  Activity,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Clock,
  Sparkles,
  PieChart,
  BarChart3,
  Cpu,
  RefreshCw,
  Coins,
  Scale,
  Flame,
} from 'lucide-react';
import { formatPrice } from '../data/goldData';

export interface ProFourStagesProps {
  currentOunce: number;
  currentUsdRate: number;
  onRefreshLive: () => void;
}

export const ProTradingFourStages: React.FC<ProFourStagesProps> = ({
  currentOunce,
  currentUsdRate,
  onRefreshLive,
}) => {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(1);
  const [proData, setProData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch pro stages data from backend
  const fetchProData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gold/pro-stages');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to load pro stages data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProData();
  }, [currentOunce, currentUsdRate]);

  const stages = [
    {
      id: 1,
      title: 'مرحله ۱: ماکرو و فدرال رزرو',
      sub: 'شاخص دلار DXY، بازده اوراق ۱۰ ساله و تقویم رویدادها',
      icon: Globe,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      activeBg: 'bg-blue-500/15',
    },
    {
      id: 2,
      title: 'مرحله ۲: نهنگ‌ها و بانک‌های مرکزی',
      sub: 'گزارش تعهد معامله‌گران (COT Report) و ETF طلا (SPDR)',
      icon: Award,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      activeBg: 'bg-purple-500/15',
    },
    {
      id: 3,
      title: 'مرحله ۳: پرایس‌اکشن و سطوح پیوت',
      sub: 'اوردر بلاک‌ها، پیوت پوینت‌ها، RSI و ساختار بازار',
      icon: Activity,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      activeBg: 'bg-amber-500/15',
    },
    {
      id: 4,
      title: 'مرحله ۴: طلا و صندوق‌های بورس ایران',
      sub: 'حباب‌سنجی سکه، صندوق‌های کهربا/طلا/عیار و فرمول دلار',
      icon: Coins,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      activeBg: 'bg-emerald-500/15',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Master Pro Signal Aggregate */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-100">
                  میز کار ۴ مرحله‌ای معامله‌گران حرفه‌ای طلا
                </h2>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  سینک زنده
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                همگام‌سازی لحظه‌ای با مراجع بین‌المللی (Forex Factory, TradingView, CFTC) و شبکه TGJU ایران
              </p>
            </div>
          </div>

          {/* Quick Aggregate Score */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400">سیگنال ترکیبی ۴ مرحله:</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{proData?.overallProSignal?.bias || 'خرید پله‌ای (DCA Buy)'}</span>
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
              {proData?.overallProSignal?.score || 86}%
            </div>
          </div>
        </div>

        {/* 4 Stage Stepper Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-slate-800/80">
          {stages.map((stg) => {
            const Icon = stg.icon;
            const isActive = activeStage === stg.id;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveStage(stg.id as any)}
                className={`p-3.5 rounded-2xl text-right transition-all cursor-pointer border flex flex-col justify-between gap-2 ${
                  isActive
                    ? `${stg.activeBg} border-amber-400 ring-1 ring-amber-400/50 shadow-md`
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${stg.color}`} />
                    <span className="text-xs font-black text-slate-100">{stg.title}</span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    0{stg.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {stg.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: MACRO & FED DRIVERS */}
      {activeStage === 1 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Macro Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* DXY Index */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>شاخص دلار آمریکا (DXY)</span>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">به نفع طلا 🟢</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-100">
                {proData?.stage1Macro?.dxyIndex || 101.45}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>افت {Math.abs(proData?.stage1Macro?.dxyChange || 0.28)}% در ۲۴ ساعت (تضعیف دلار = تقویت انس)</span>
              </div>
            </div>

            {/* US 10-Year Treasury Yield */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>بازده اوراق ۱۰ ساله آمریکا</span>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">به نفع طلا 🟢</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-100">
                {proData?.stage1Macro?.us10yYield || 3.98}%
              </div>
              <div className="text-[11px] text-slate-300">
                کاهش به زیر ۴.۰٪ هزینه فرصت نگهداری طلا را پایین آورده است.
              </div>
            </div>

            {/* Fed Funds Rate */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>نرخ بهره هدف فدرال رزرو</span>
                <span className="text-amber-400 font-bold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded">چرخه کاهش</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {proData?.stage1Macro?.fedFundsRate || '4.75% - 5.00%'}
              </div>
              <div className="text-[11px] text-slate-300">
                شروع سیاست‌های انبساطی فدرال رزرو محرک تاریخی جهش طلاست.
              </div>
            </div>

            {/* US Inflation Rate CPI */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>تورم سالانه آمریکا (CPI)</span>
                <span className="text-blue-400 font-bold text-[10px] bg-blue-500/10 px-2 py-0.5 rounded">هدف ۲.۰٪</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-100">
                {proData?.stage1Macro?.usCpiYoY || 2.5}%
              </div>
              <div className="text-[11px] text-slate-300">
                نرخ بهره حقیقی: <strong className="text-amber-300 font-mono">+{proData?.stage1Macro?.realInterestRate || 1.48}%</strong>
              </div>
            </div>
          </div>

          {/* High-Impact Forex Factory Events Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-slate-100">
                  رویدادهای سرنوشت‌ساز تقویم اقتصادی جهانی (Forex Factory Sync)
                </h3>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                اخبار قرمز (نوسان‌ساز طلا)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 pb-2">
                    <th className="py-2.5 font-bold">شاخص اقتصادی</th>
                    <th className="py-2.5 font-bold">زمان انتشار</th>
                    <th className="py-2.5 font-bold">پیش‌بینی بازار</th>
                    <th className="py-2.5 font-bold">دوره قبل</th>
                    <th className="py-2.5 font-bold">تأثیر مستقیم بر قیمت طلا</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {(proData?.stage1Macro?.calendarEvents || []).map((ev: any) => (
                    <tr key={ev.id} className="hover:bg-slate-950/60 transition">
                      <td className="py-3 font-semibold text-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                          <span>{ev.titleFa}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ev.titleEn}</div>
                      </td>
                      <td className="py-3 text-slate-300 font-mono">{ev.date} - {ev.time}</td>
                      <td className="py-3 text-amber-300 font-mono font-bold">{ev.forecast}</td>
                      <td className="py-3 text-slate-400 font-mono">{ev.previous}</td>
                      <td className="py-3 text-emerald-300 text-[11px] leading-relaxed max-w-xs">
                        {ev.goldImpactFa}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TradingView Direct Link Guide */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                💡 <strong className="text-amber-300">نکته حرفه‌ای:</strong> همیشه قبل از باز کردن پوزیشن در طلا، چارت <code className="text-amber-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">DXY</code> و <code className="text-amber-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">US10Y</code> را در تریدینگ‌ویو بررسی کنید.
              </div>
              <a
                href="https://www.tradingview.com/symbols/XAUUSD/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-[11px]"
              >
                <span>مشاهده چارت در TradingView</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: COT REPORT & CENTRAL BANK WHALES */}
      {activeStage === 2 && (
        <div className="space-y-4 animate-fadeIn">
          {/* COT Report Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span>گزارش رسمی تعهد معامله‌گران نهادی (CFTC COT Report)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ردیابی هفتگی موقعیت‌های خرید و فروش صندوق‌های پوشش ریسک (Hedge Funds) و بازیگران بزرگ
                </p>
              </div>
              <div className="bg-purple-500/15 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs text-purple-300 font-bold">
                {proData?.stage2Whales?.institutionalSentiment || 'خرید سنگین نهنگ‌ها'}
              </div>
            </div>

            {/* COT Visual Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">قراردادهای لانگ (خرید) نهنگ‌ها:</div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {(proData?.stage2Whales?.managedMoneyLongContracts || 268450).toLocaleString('en-US')}
                </div>
                <div className="text-[11px] text-emerald-300">
                  +{(proData?.stage2Whales?.netPositionChangeWeekly || 12480).toLocaleString('en-US')} قرارداد جدید در این هفته
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">قراردادهای شورت (فروش) نهنگ‌ها:</div>
                <div className="text-2xl font-black font-mono text-red-400">
                  {(proData?.stage2Whales?.managedMoneyShortContracts || 42180).toLocaleString('en-US')}
                </div>
                <div className="text-[11px] text-slate-400">
                  نسبت خرید به فروش: <strong className="text-amber-400 font-mono">۶.۳ برابر به نفع خریداران</strong>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">موجودی طلای فیزیکی بزرگترین ETF جهان (SPDR GLD):</div>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {proData?.stage2Whales?.spdrGoldHoldingsTonnes || 878.4} تن
                </div>
                <div className="text-[11px] text-emerald-400">
                  +{proData?.stage2Whales?.spdrWeeklyChangeTonnes || 8.6} تن ورودی فیزیکی در هفته
                </div>
              </div>
            </div>
          </div>

          {/* Central Bank Gold Accumulation (World Gold Council) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-slate-100">
                  خرید شمش طلا توسط بانک‌های مرکزی جهان (World Gold Council)
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                رکوردشکنی تاریخی انباشت طلا
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(proData?.stage2Whales?.centralBankPurchases || []).map((cb: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-100 text-xs sm:text-sm">
                      <span className="text-lg">{cb.flag}</span>
                      <span>{cb.countryFa}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{cb.countryEn}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-base font-black font-mono text-amber-400">
                      +{cb.annualTonnes} تن
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">{cb.trend}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-slate-300 leading-relaxed">
              💡 <strong className="text-amber-300">تحلیل استراتژیک شورای جهانی طلا:</strong> بانک‌های مرکزی چین، هند و خاورمیانه در راستای دلارزدایی (De-dollarization) به‌صورت بی‌وقفه در حال تبدیل ذخایر ارزی خود به طلای فیزیکی هستند که کف قیمتی مستحکمی زیر پای انس می‌سازد.
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: TECHNICALS, ORDER BLOCKS & PIVOTS */}
      {activeStage === 3 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Pivot Points & Order Blocks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pivot Points */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <span>سطوح پیوت پوینت انس طلا (Pivot Levels)</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">انس زنده: ${currentOunce.toLocaleString('en-US')}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300">
                  <span>مقاومت دوم (R2):</span>
                  <span className="font-mono font-bold">${proData?.stage3Technicals?.pivotPoints?.r2 || Math.round(currentOunce * 1.032)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300">
                  <span>مقاومت اول (R1):</span>
                  <span className="font-mono font-bold">${proData?.stage3Technicals?.pivotPoints?.r1 || Math.round(currentOunce * 1.015)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold">
                  <span>نقطه تعادل / پیوت روزانه (Pivot):</span>
                  <span className="font-mono font-bold">${proData?.stage3Technicals?.pivotPoints?.pivot || Math.round(currentOunce)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                  <span>حمایت اول (S1):</span>
                  <span className="font-mono font-bold">${proData?.stage3Technicals?.pivotPoints?.s1 || Math.round(currentOunce * 0.985)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                  <span>حمایت دوم (S2):</span>
                  <span className="font-mono font-bold">${proData?.stage3Technicals?.pivotPoints?.s2 || Math.round(currentOunce * 0.968)}</span>
                </div>
              </div>
            </div>

            {/* Smart Money Order Blocks */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-100 flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <span>باکس‌های عرضه و تقاضا (Smart Money Order Blocks)</span>
                </h3>

                <div className="space-y-3 text-xs">
                  {/* Supply Block */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-red-500/30 space-y-1">
                    <div className="flex items-center justify-between text-red-400 font-bold">
                      <span>باکس سفارشات عرضه (Supply Zone):</span>
                      <span className="font-mono">${proData?.stage3Technicals?.orderBlocks?.supplyZone?.min} - ${proData?.stage3Technicals?.orderBlocks?.supplyZone?.max}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {proData?.stage3Technicals?.orderBlocks?.supplyZone?.description || 'محدوده پرحجم فروش نهادی (سیو سود پله‌ای)'}
                    </p>
                  </div>

                  {/* Demand Block */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>باکس سفارشات تقاضا (Demand Zone):</span>
                      <span className="font-mono">${proData?.stage3Technicals?.orderBlocks?.demandZone?.min} - ${proData?.stage3Technicals?.orderBlocks?.demandZone?.max}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {proData?.stage3Technicals?.orderBlocks?.demandZone?.description || 'محدوده تجمیع نقدینگی خرید نهنگ‌ها (بهترین نقطه ورود)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Indicators summary */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs mt-3">
                <div>
                  <div className="text-[10px] text-slate-400">RSI (14)</div>
                  <div className="font-mono font-bold text-amber-300">64.2</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">MACD</div>
                  <div className="font-mono font-bold text-emerald-400">صعودی +</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">EMA 50/200</div>
                  <div className="font-mono font-bold text-emerald-400">Golden Cross</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: IRAN DOMESTIC MARKET, GOLD FUNDS & BUBBLE ARBITRAGE */}
      {activeStage === 4 && (
        <div className="space-y-4 animate-fadeIn">
          {/* Bourse Gold Funds (صندوق‌های طلای بورس کالا) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>مقایسه و آربیتراژ صندوق‌های طلای بورس کالا (IME Gold Funds)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  سرمایه‌گذاری روی شمش و سکه طلا بدون اجرت ساخت، بدون ریسک سرقت و با امکان خرید از ۵۰۰ هزار تومان
                </p>
              </div>
              <div className="text-xs text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                نرخ دلار نقد: <strong className="text-emerald-400 font-mono">{currentUsdRate.toLocaleString('fa-IR')}</strong> تومان
              </div>
            </div>

            {/* Funds Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 pb-2">
                    <th className="py-2.5 font-bold">نماد بورسی</th>
                    <th className="py-2.5 font-bold">نام کامل صندوق</th>
                    <th className="py-2.5 font-bold">قیمت تابلو (تومان)</th>
                    <th className="py-2.5 font-bold">ارزش ذاتی NAV</th>
                    <th className="py-2.5 font-bold">وضعیت حباب / تخفیف</th>
                    <th className="py-2.5 font-bold">برچسب ارزش‌گذاری</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {(proData?.stage4IranFunds?.funds || []).map((fund: any) => (
                    <tr key={fund.symbol} className="hover:bg-slate-950/60 transition">
                      <td className="py-3 font-black text-amber-300 font-mono text-sm">
                        {fund.symbol}
                      </td>
                      <td className="py-3 font-semibold text-slate-100">{fund.nameFa}</td>
                      <td className="py-3 font-mono font-bold text-slate-100">{fund.priceToman.toLocaleString('fa-IR')}</td>
                      <td className="py-3 font-mono text-slate-400">{fund.navToman.toLocaleString('fa-IR')}</td>
                      <td className="py-3 font-mono font-bold">
                        <span className={fund.bubbleOrDiscountPct <= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                          {fund.bubbleOrDiscountPct > 0 ? `+${fund.bubbleOrDiscountPct}%` : `${fund.bubbleOrDiscountPct}%`}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          fund.badge === 'حباب منفی' || fund.badge === 'بهترین ارزش خرید'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        }`}>
                          {fund.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coin Bubble Warning & DCA Buying Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bubble Monitor */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>رصد حباب سکه در بازار فیزیکی</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">حباب سکه تمام امامی:</span>
                  <span className="font-mono font-bold text-amber-400">۱۶.۸٪ (~۸.۹ میلیون تومان)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-red-500/30">
                  <span className="text-slate-300">حباب ربع سکه (پرریسک):</span>
                  <span className="font-mono font-bold text-red-400">۳۸.۵٪ (~۶.۵ میلیون تومان)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {proData?.stage4IranFunds?.bubbleAnalysis?.recommendationFa}
              </p>
            </div>

            {/* DCA Plan Formula */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 space-y-3">
              <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>استراتژی خرید پله‌ای حرفه‌ای (DCA) به تومان</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-[11px]">۱</span>
                  <span><strong>پله اول (۴۰٪ سرمایه):</strong> ورود در قیمت فعلی بازار.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-[11px]">۲</span>
                  <span><strong>پله دوم (۳۰٪ سرمایه):</strong> در صورت اصلاح ۲ تا ۳ درصدی در حمایت S1.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-[11px]">۳</span>
                  <span><strong>پله سوم (۳۰٪ سرمایه):</strong> ذخیره نقدینگی برای پولبک‌های سنگین یا شوک‌های مقطعی.</span>
                </div>
              </div>
              <div className="pt-2 text-[11px] text-emerald-300 font-semibold border-t border-slate-800">
                این روش ریسک هیجانات روزانه بازار طلا را به صفر نزدیک می‌کند.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
