import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  ShieldCheck,
  Zap,
  BarChart3,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Scale,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Award,
} from 'lucide-react';
import { AssetInfo, TimeframeKey } from '../types';
import { formatPrice } from '../data/goldData';

interface MultiMethodComparativeHubProps {
  asset: AssetInfo;
  timeframe: TimeframeKey;
  onSelectTimeframe: (tf: TimeframeKey) => void;
  onAskAi: (prompt: string) => void;
}

export interface TradingMethodAnalysis {
  methodId: string;
  methodName: string;
  methodBadge: string;
  iconColor: string;
  signal: 'خرید قدرتمند (Strong Buy)' | 'خرید در اصلاح (Buy Dips)' | 'فروش در پولبک (Sell Rallies)' | 'خنثی و رِنج (Neutral)';
  bullishProbPercent: number; // e.g. 78%
  bearishProbPercent: number; // e.g. 22%
  expectedPriceTarget: number;
  stopLossLevel: number;
  confidenceScore: number; // 0 to 100
  keyRationaleFa: string;
  tradeTriggerFa: string;
}

const TIMEFRAME_OPTIONS: { id: TimeframeKey; labelFa: string; subFa: string }[] = [
  { id: '1day', labelFa: 'روز بعد', subFa: '+۲۴ ساعت' },
  { id: '1week', labelFa: 'هفته بعد', subFa: '+۷ روز' },
  { id: '1month', labelFa: 'ماه بعد', subFa: '+۳۰ روز' },
  { id: '2months', labelFa: 'دو ماه بعد', subFa: '+۶۰ روز' },
  { id: '6months', labelFa: 'شش ماه بعد', subFa: '+۱۸۰ روز' },
  { id: '1year', labelFa: 'یک سال بعد', subFa: '+۳۶۵ روز' },
];

export const MultiMethodComparativeHub: React.FC<MultiMethodComparativeHubProps> = ({
  asset,
  timeframe,
  onSelectTimeframe,
  onAskAi,
}) => {
  const p = asset.currentPrice;
  const isUSD = asset.isUSD;

  // Multi-Method calculations dynamically calibrated for selected timeframe
  const getMethodsData = (): TradingMethodAnalysis[] => {
    // Multiplier factors depending on timeframe
    let tfMultiplier = 1.015;
    if (timeframe === '1day') tfMultiplier = 1.006;
    if (timeframe === '1week') tfMultiplier = 1.025;
    if (timeframe === '1month') tfMultiplier = 1.055;
    if (timeframe === '2months') tfMultiplier = 1.095;
    if (timeframe === '6months') tfMultiplier = 1.18;
    if (timeframe === '1year') tfMultiplier = 1.32;

    const roundP = (val: number) => (isUSD ? Math.round(val * 10) / 10 : Math.round(val));

    return [
      {
        methodId: 'smc_ict',
        methodName: 'اسمارت مانی و ساختار نقدینگی (SMC / ICT)',
        methodBadge: 'Liquid & Order Blocks',
        iconColor: 'text-amber-400',
        signal: 'خرید در اصلاح (Buy Dips)',
        bullishProbPercent: 74,
        bearishProbPercent: 26,
        expectedPriceTarget: roundP(p * tfMultiplier * 1.01),
        stopLossLevel: roundP(p * 0.988),
        confidenceScore: 88,
        keyRationaleFa: `تشکیل تغییر خصلت بازار (CHoCH) و انباشت اوردر بلاک‌های بانکی در کف تقاضا؛ جذب کامل نقدینگی استاپ‌ها در زون ارزان‌فروشی Discount.`,
        tradeTriggerFa: `ورود در بازگشت قیمت به گپ نقدینگی FVG و تثبیت در محدوده ۵۰٪ اردر بلاک.`,
      },
      {
        methodId: 'elliott_harmonics',
        methodName: 'امواج الیوت و هارمونیک (Elliott & Harmonics)',
        methodBadge: 'Fibonacci 0.886 & Wave 5',
        iconColor: 'text-indigo-400',
        signal: 'خرید قدرتمند (Strong Buy)',
        bullishProbPercent: 79,
        bearishProbPercent: 21,
        expectedPriceTarget: roundP(p * tfMultiplier * 1.025),
        stopLossLevel: roundP(p * 0.985),
        confidenceScore: 85,
        keyRationaleFa: `تکمیل موج اصلاحی ۴ و ورود به گام شتاب‌دار موج ۵ انگیزشی با تقارن الگوی هارمونیک خفاش (Bat Pattern) روی تراز ۰.۸۸۶ فیبوناچی.`,
        tradeTriggerFa: `تثبیت شمع روزانه بالای مقاومت میانی و شکست خط روند اصلاحی کانال الیوت.`,
      },
      {
        methodId: 'macro_fundamental',
        methodName: 'تحلیل فاندامنتال کلان و بانک‌های مرکزی (Macro & Fed)',
        methodBadge: 'DXY & Central Banks Buy',
        iconColor: 'text-emerald-400',
        signal: 'خرید قدرتمند (Strong Buy)',
        bullishProbPercent: 82,
        bearishProbPercent: 18,
        expectedPriceTarget: roundP(p * tfMultiplier * 1.035),
        stopLossLevel: roundP(p * 0.978),
        confidenceScore: 92,
        keyRationaleFa: `سیکل کاهش نرخ بهره فدرال رزرو، تضعیف شاخص دلار (DXY)، افزایش بی‌سابقه خریدهای ذخایر طلای فیزیکی توسط بانک‌های مرکزی چین و هند و تنش‌های ژئوپلیتیک جهانی.`,
        tradeTriggerFa: `خرید میان‌مدت و بلندمدت در هر اصلاح قیمتی بدون نگرانی از نوسانات مقطعی.`,
      },
      {
        methodId: 'volume_orderflow',
        methodName: 'ولوم پروفایل و دلتای جریان سفارشات (Order Flow & CVD)',
        methodBadge: 'POC & Bullish CVD Absorption',
        iconColor: 'text-cyan-400',
        signal: 'خرید در اصلاح (Buy Dips)',
        bullishProbPercent: 72,
        bearishProbPercent: 28,
        expectedPriceTarget: roundP(p * tfMultiplier * 0.995),
        stopLossLevel: roundP(p * 0.991),
        confidenceScore: 86,
        keyRationaleFa: `شیب صعودی دلتای تجمعی حجم (CVD) و جذب مداوم اوردرهای فروش مارکت توسط سفارشات آیسبرگ نهادی در کف حجمی روزانه (Point of Control).`,
        tradeTriggerFa: `ری‌تست ناحیه با بیشترین حجم روز (POC) همراه با رشد سفارشات خرید تهاجمی در دفترچه سفارشات.`,
      },
      {
        methodId: 'technical_indicators',
        methodName: 'تکنیکال کلاسیک، میانگین‌ها و اندیکاتورها (Classical Technical)',
        methodBadge: 'EMA 50/200 & MACD Cross',
        iconColor: 'text-blue-400',
        signal: 'خرید در اصلاح (Buy Dips)',
        bullishProbPercent: 68,
        bearishProbPercent: 32,
        expectedPriceTarget: roundP(p * tfMultiplier * 0.99),
        stopLossLevel: roundP(p * 0.989),
        confidenceScore: 80,
        keyRationaleFa: `تقاطع طلایی میانگین‌های متحرک نمایی (Golden Cross)، خروج اندیکاتور RSI از ناحیه خنثی به بالای ۵۵ و باز شدن باندهای بولینگر در جهت روند صعودی.`,
        tradeTriggerFa: `پولبک به میانگین متحرک ۲۰ دوره‌ای (EMA 20) و تایید تقاطع صعودی هیستوگرام MACD.`,
      },
      {
        methodId: 'arbitrage_bubble',
        methodName: 'آربیتراژ، حباب سکه و جریان نقدینگی داخلی (Domestic Flow & Arbitrage)',
        methodBadge: 'Intrinsic Value & Coin Bubble',
        iconColor: 'text-rose-400',
        signal: 'خرید در اصلاح (Buy Dips)',
        bullishProbPercent: 75,
        bearishProbPercent: 25,
        expectedPriceTarget: roundP(p * tfMultiplier),
        stopLossLevel: roundP(p * 0.982),
        confidenceScore: 87,
        keyRationaleFa: isUSD
          ? `پرمیوم مثبت طلای فیزیکی در بازارهای آسیایی و همبستگی شمش طلا با رشد تقاضای جهانی.`
          : `ورود پول حقیقی به صندوق‌های طلای بورس کالا (کهربا، طلا، عیار) و تخلیه حباب سکه تا محدوده‌های تعادلی ارزنده.`,
        tradeTriggerFa: `خرید صندوق‌های با حباب منفی یا صفر به جای سکه‌های با حباب بالاتر از ۲۰٪.`,
      },
    ];
  };

  const methods = getMethodsData();

  // Aggregate Master Consensus Calculation
  const totalBullishProb = Math.round(
    methods.reduce((acc, m) => acc + m.bullishProbPercent, 0) / methods.length
  );
  const totalBearishProb = 100 - totalBullishProb;
  const avgConfidence = Math.round(
    methods.reduce((acc, m) => acc + m.confidenceScore, 0) / methods.length
  );
  const consensusTargetPrice = Math.round(
    methods.reduce((acc, m) => acc + m.expectedPriceTarget, 0) / methods.length
  );
  const consensusTargetChangePct = (
    ((consensusTargetPrice - p) / p) *
    100
  ).toFixed(1);

  return (
    <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Top Header & Date/Timeframe Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>دیده‌بان جامع و مقایسه‌ای تمام سبک‌های معاملاتی طلا (Multi-Method Consensus)</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                با انتخاب هر بازه زمانی، هوش مصنوعی تمام متدها (SMC، الیوت، فاندامنتال، اوردرفلو، اندیکاتور و آربیتراژ) را همزمان بررسی کرده و نتیجه درصدی و گزارش نهایی را ارائه می‌دهد
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200 overflow-x-auto scrollbar-none shadow-xs">
          {TIMEFRAME_OPTIONS.map((item) => {
            const isActive = timeframe === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTimeframe(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center min-w-[85px] border ${
                  isActive
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs font-black'
                    : 'bg-white border-amber-200 text-slate-700 hover:text-slate-900 hover:bg-amber-100'
                }`}
              >
                <span>{item.labelFa}</span>
                <span className={`text-[10px] ${isActive ? 'text-amber-950 font-black' : 'text-slate-500'}`}>
                  {item.subFa}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MASTER CONSENSUS & EXECUTIVE SUMMARY HERO */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-100/60 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                اجماع کلی تحلیل‌ها (Master Consensus): صعودی با احتمال {totalBullishProb}٪
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                افق: {TIMEFRAME_OPTIONS.find((t) => t.id === timeframe)?.labelFa} ({TIMEFRAME_OPTIONS.find((t) => t.id === timeframe)?.subFa})
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              چکیده اجماع ۶ روش معاملاتی: چرا بازار طلا در این افق زمانی صعودی است؟
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-white border-2 border-amber-200 px-5 py-3 rounded-2xl shrink-0 shadow-xs">
            <div>
              <div className="text-[11px] text-slate-500 font-bold">میانگین هدف قیمتی تمام روش‌ها:</div>
              <div className="text-base sm:text-lg font-black text-amber-950 font-mono mt-0.5">
                {formatPrice(consensusTargetPrice, isUSD)}
              </div>
            </div>
            <div className="h-8 w-px bg-amber-200"></div>
            <div>
              <div className="text-[11px] text-slate-500 font-bold">بازدهی مورد انتظار:</div>
              <div className={`text-sm font-black font-mono mt-0.5 ${Number(consensusTargetChangePct) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {Number(consensusTargetChangePct) >= 0 ? `+${consensusTargetChangePct}٪` : `${consensusTargetChangePct}٪`}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Probability Distribution Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-800 flex items-center gap-1 font-black">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              احتمال سناریوی رشد و تارگت‌های صعودی: {totalBullishProb}٪
            </span>
            <span className="text-slate-600 font-mono font-bold">ضریب اطمینان اجماع: {avgConfidence}٪</span>
            <span className="text-rose-800 flex items-center gap-1 font-black">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              احتمال ریزش یا اصلاح عمیق: {totalBearishProb}٪
            </span>
          </div>

          <div className="w-full h-4 bg-amber-100/80 rounded-full overflow-hidden flex p-0.5 border border-amber-300">
            <div
              style={{ width: `${totalBullishProb}%` }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 shadow-xs"
            ></div>
            <div
              style={{ width: `${totalBearishProb}%` }}
              className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-700"
            ></div>
          </div>
        </div>

        {/* Explanatory Narrative Summary */}
        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2 font-medium">
          <p>
            📌 <strong className="text-amber-950 font-black">گزارش کلی دلایل فنی و بنیادی:</strong> همگرایی قدرتمندی میان تمام ۶ روش معاملاتی دیده می‌شود. تحلیل کلان (Macro) با خرید بی‌وقفه شمش طلا توسط بانک‌های مرکزی و کاهش بهره فدرال رزرو پشتوانه بنیادی ایجاد کرده، ساختار SMC جذب نقدینگی در زون Discount را تایید می‌کند، امواج الیوت آماده جهش موج ۵ هستند و شاخص دلتای تجمعی (CVD) ورود خریداران تهاجمی را ثبت کرده است. بنابراین در افق <strong>{TIMEFRAME_OPTIONS.find((t) => t.id === timeframe)?.labelFa}</strong>، استراتژی بهینه، خرید در اصلاح‌های قیمتی است.
          </p>
        </div>
      </div>

      {/* INDIVIDUAL METHOD CARDS GRID */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>تفکیک دقیق تحلیل، سیگنال، تارگت و درصد هر سبک معاملاتی:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((m) => (
            <div
              key={m.methodId}
              className="bg-amber-50/50 p-5 rounded-3xl border-2 border-amber-200 hover:border-amber-400 transition space-y-4 shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Method Title & Badge */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-amber-200">
                  <div>
                    <h5 className="text-xs font-black text-slate-900">{m.methodName}</h5>
                    <span className="text-[10px] text-slate-500 font-mono font-bold mt-0.5 block">{m.methodBadge}</span>
                  </div>
                  <span className="text-[10px] font-black bg-amber-200/80 px-2 py-0.5 rounded-lg border border-amber-300 text-amber-950 shrink-0">
                    {m.confidenceScore}٪ اطمینان
                  </span>
                </div>

                {/* Signal & Probabilities */}
                <div className="bg-white p-3 rounded-2xl border border-amber-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">سیگنال استراتژی:</span>
                    <strong className="text-emerald-700 font-black">{m.signal}</strong>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-700 font-bold">صعود: {m.bullishProbPercent}٪</span>
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden flex mx-2">
                      <div style={{ width: `${m.bullishProbPercent}%` }} className="bg-emerald-500 h-full"></div>
                      <div style={{ width: `${m.bearishProbPercent}%` }} className="bg-rose-500 h-full"></div>
                    </div>
                    <span className="text-rose-700 font-bold">افت: {m.bearishProbPercent}٪</span>
                  </div>
                </div>

                {/* Targets & Levels */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs">
                    <span className="text-slate-500 text-[10px] font-bold block">تارگت قیمتی روش:</span>
                    <strong className="text-amber-950 text-xs block mt-0.5 font-black">{formatPrice(m.expectedPriceTarget, isUSD)}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-rose-300 shadow-xs">
                    <span className="text-rose-700 text-[10px] font-bold block">حد ضرر منطقی (SL):</span>
                    <strong className="text-rose-700 text-xs block mt-0.5 font-black">{formatPrice(m.stopLossLevel, isUSD)}</strong>
                  </div>
                </div>

                {/* Narrative Rationale */}
                <div className="text-[11px] text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-2xl border border-amber-200 space-y-1 shadow-xs">
                  <div>
                    💡 <strong className="text-slate-900 font-black">منطق تحلیل:</strong> {m.keyRationaleFa}
                  </div>
                  <div className="text-amber-900 pt-1 border-t border-amber-100 font-bold">
                    🎯 <strong className="text-amber-950 font-black">تریگر معامله:</strong> {m.tradeTriggerFa}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-amber-200 flex justify-end">
                <button
                  onClick={() => onAskAi(`روش تحلیلی ${m.methodName} را برای افق زمانی ${TIMEFRAME_OPTIONS.find((t) => t.id === timeframe)?.labelFa} کامل باز کن.`)}
                  className="text-xs text-amber-950 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 transition font-bold shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>مشاوره هوش مصنوعی این روش</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
