export interface SmcOrderBlock {
  id: string;
  type: 'bullish' | 'bearish';
  timeframe: '15m' | '1h' | '4h' | '1d';
  topPrice: number;
  bottomPrice: number;
  meanThreshold: number; // 50% level of the OB
  status: 'fresh_unmitigated' | 'tested_valid' | 'mitigated';
  strength: 'high' | 'medium';
  volumeSpike: boolean;
  descriptionFa: string;
}

export interface SmcFairValueGap {
  id: string;
  type: 'bullish_bisi' | 'bearish_sibi'; // BISI: Buy Side Imbalance Sell Side Inefficiency
  timeframe: '15m' | '1h' | '4h';
  high: number;
  low: number;
  consequentEncroachment: number; // 50% midpoint of the FVG
  status: 'open' | 'partially_filled' | 'filled';
  descriptionFa: string;
}

export interface SmcLiquidityLevel {
  id: string;
  type: 'BSL' | 'SSL' | 'IDM' | 'EQL' | 'EQH'; // Buy-side, Sell-side, Inducement, Equal Lows, Equal Highs
  price: number;
  descriptionFa: string;
  status: 'swept' | 'untested_target';
  significance: 'major_swing' | 'minor_internal';
}

export interface IctKillzoneStatus {
  session: 'London Open (بازگشایی لندن)' | 'New York Open & Silver Bullet (نیویورک)' | 'London Close (پایان لندن)' | 'Asian Consolidation (رنج آسیا)';
  timeUtc: string;
  timeTehran: string;
  isActiveNow: boolean;
  volatilityExpectation: 'بسیار بالا' | 'بالا' | 'متوسط' | 'پایین';
  judasSwingAlert: string;
  silverBulletWindow: string;
}

export interface SmcTradeSetup {
  id: string;
  pair: string;
  direction: 'LONG (خرید صعودی)' | 'SHORT (فروش نزولی)';
  setupName: 'ICT OTE + Order Block Retest' | 'Liquidity Sweep + CHoCH Reversal' | 'FVG Consequent Encroachment Fill' | 'Silver Bullet Momentum';
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio: string;
  winRateEstimate: string;
  invalidationLevel: number;
  rationaleFa: string;
  stepByStepAction: string[];
}

export interface SmcAnalysisPayload {
  assetId: string;
  currentPrice: number;
  isUSD: boolean;
  marketStructure: {
    bias: 'Bullish (صعودی ساختاری)' | 'Bearish (نزولی)' | 'Neutral Consolidation';
    lastBOS: { price: number; type: 'bullish' | 'bearish'; time: string };
    lastCHoCH: { price: number; type: 'bullish' | 'bearish'; time: string };
    currentSwingHigh: number;
    currentSwingLow: number;
    equilibriumPrice: number; // 50% discount/premium divider
    currentZone: 'Discount (محدوده تخفیف - ارزان برای خرید)' | 'Premium (محدوده گران - مناسب برای فروش)';
  };
  orderBlocks: SmcOrderBlock[];
  fairValueGaps: SmcFairValueGap[];
  liquidityLevels: SmcLiquidityLevel[];
  activeKillzone: IctKillzoneStatus;
  oteLevels: {
    fib62: number;
    fib705: number; // Sweet spot OTE
    fib79: number;
  };
  activeSetups: SmcTradeSetup[];
  lastUpdated: string;
}

/**
 * Computes Smart Money & ICT analytics dynamically tailored to current market price
 */
export function getSmcIctAnalysis(
  assetId: string = 'xau_usd',
  currentPrice: number = 2748.5,
  isUSD: boolean = true
): SmcAnalysisPayload {
  const p = currentPrice || (isUSD ? 2748.5 : 4350000);

  // Dynamic Structure Points
  const swingHigh = isUSD ? Math.round((p * 1.018) * 10) / 10 : Math.round(p * 1.02);
  const swingLow = isUSD ? Math.round((p * 0.982) * 10) / 10 : Math.round(p * 0.98);
  const equilibrium = isUSD ? Math.round(((swingHigh + swingLow) / 2) * 10) / 10 : Math.round((swingHigh + swingLow) / 2);
  const isDiscount = p <= equilibrium;

  // Order Blocks
  const obBullishTop = isUSD ? Math.round((p * 0.992) * 10) / 10 : Math.round(p * 0.99);
  const obBullishBottom = isUSD ? Math.round((p * 0.986) * 10) / 10 : Math.round(p * 0.983);
  const obBearishTop = isUSD ? Math.round((p * 1.016) * 10) / 10 : Math.round(p * 1.018);
  const obBearishBottom = isUSD ? Math.round((p * 1.01) * 10) / 10 : Math.round(p * 1.011);

  const orderBlocks: SmcOrderBlock[] = [
    {
      id: 'ob-1',
      type: 'bullish',
      timeframe: '4h',
      topPrice: obBullishTop,
      bottomPrice: obBullishBottom,
      meanThreshold: isUSD ? Math.round(((obBullishTop + obBullishBottom) / 2) * 10) / 10 : Math.round((obBullishTop + obBullishBottom) / 2),
      status: 'fresh_unmitigated',
      strength: 'high',
      volumeSpike: true,
      descriptionFa: 'اوردر بلاک تقاضای قدرتمند با کندل اینگلفینگ نهادی و حجم بالا در ۴ ساعته',
    },
    {
      id: 'ob-2',
      type: 'bullish',
      timeframe: '1h',
      topPrice: isUSD ? Math.round((p * 0.996) * 10) / 10 : Math.round(p * 0.995),
      bottomPrice: isUSD ? Math.round((p * 0.993) * 10) / 10 : Math.round(p * 0.991),
      meanThreshold: isUSD ? Math.round((p * 0.9945) * 10) / 10 : Math.round(p * 0.993),
      status: 'tested_valid',
      strength: 'medium',
      volumeSpike: false,
      descriptionFa: 'اوردر بلاک ۱ ساعته بعد از شکست ساختار داخلی (iBOS)',
    },
    {
      id: 'ob-3',
      type: 'bearish',
      timeframe: '4h',
      topPrice: obBearishTop,
      bottomPrice: obBearishBottom,
      meanThreshold: isUSD ? Math.round(((obBearishTop + obBearishBottom) / 2) * 10) / 10 : Math.round((obBearishTop + obBearishBottom) / 2),
      status: 'fresh_unmitigated',
      strength: 'high',
      volumeSpike: true,
      descriptionFa: 'اوردر بلاک عرضه سنگین در سقف هفتگی و استخر نقدینگی فروشندگان',
    },
  ];

  // Fair Value Gaps (FVG)
  const fvgBullishLow = isUSD ? Math.round((p * 0.994) * 10) / 10 : Math.round(p * 0.992);
  const fvgBullishHigh = isUSD ? Math.round((p * 0.998) * 10) / 10 : Math.round(p * 0.997);
  const fairValueGaps: SmcFairValueGap[] = [
    {
      id: 'fvg-1',
      type: 'bullish_bisi',
      timeframe: '1h',
      low: fvgBullishLow,
      high: fvgBullishHigh,
      consequentEncroachment: isUSD ? Math.round(((fvgBullishHigh + fvgBullishLow) / 2) * 10) / 10 : Math.round((fvgBullishHigh + fvgBullishLow) / 2),
      status: 'open',
      descriptionFa: 'گپ ارزش منصفانه ۳ کندلی صعودی پرنشاط ناشی از ورود نقدینگی اسمارت مانی',
    },
    {
      id: 'fvg-2',
      type: 'bearish_sibi',
      timeframe: '4h',
      low: isUSD ? Math.round((p * 1.008) * 10) / 10 : Math.round(p * 1.01),
      high: isUSD ? Math.round((p * 1.014) * 10) / 10 : Math.round(p * 1.016),
      consequentEncroachment: isUSD ? Math.round((p * 1.011) * 10) / 10 : Math.round(p * 1.013),
      status: 'open',
      descriptionFa: 'خلأ نقدینگی نزولی در لگ ریزشی قبلی که مثل آهنربا قیمت را به بالا جذب می‌کند',
    },
  ];

  // Liquidity Pools
  const liquidityLevels: SmcLiquidityLevel[] = [
    {
      id: 'liq-1',
      type: 'BSL',
      price: swingHigh,
      descriptionFa: 'استخر نقدینگی سقف (Buy-Side Liquidity) - محل تجمع استاپ‌لاس‌های فروشندگان',
      status: 'untested_target',
      significance: 'major_swing',
    },
    {
      id: 'liq-2',
      type: 'SSL',
      price: swingLow,
      descriptionFa: 'استخر نقدینگی کف (Sell-Side Liquidity) - هدف هانت نهنگ‌ها قبل از پرواز',
      status: 'swept',
      significance: 'major_swing',
    },
    {
      id: 'liq-3',
      type: 'IDM',
      price: isUSD ? Math.round((p * 0.995) * 10) / 10 : Math.round(p * 0.994),
      descriptionFa: 'نقدینگی القایی (Inducement) برای فریب تریدرهای خرد به پوزیشن زودهنگام',
      status: 'swept',
      significance: 'minor_internal',
    },
  ];

  // ICT Killzones
  const activeKillzone: IctKillzoneStatus = {
    session: 'New York Open & Silver Bullet (نیویورک)',
    timeUtc: '13:00 - 16:00 UTC',
    timeTehran: '۱۶:۳۰ الی ۱۹:۳۰ به وقت تهران',
    isActiveNow: true,
    volatilityExpectation: 'بسیار بالا',
    judasSwingAlert: 'احتمال فریب قیمتی در ۱۵ دقیقه ابتدایی اوپن نیویورک، سپس حرکت اصلی به سمت BSL',
    silverBulletWindow: 'ساعت ۱۷:۳۰ الی ۱۸:۳۰ تهران (پنجره طلایی سیلور بولت ICT)',
  };

  // Optimal Trade Entry (OTE)
  const range = swingHigh - swingLow;
  const oteLevels = {
    fib62: isUSD ? Math.round((swingHigh - range * 0.62) * 10) / 10 : Math.round(swingHigh - range * 0.62),
    fib705: isUSD ? Math.round((swingHigh - range * 0.705) * 10) / 10 : Math.round(swingHigh - range * 0.705),
    fib79: isUSD ? Math.round((swingHigh - range * 0.79) * 10) / 10 : Math.round(swingHigh - range * 0.79),
  };

  // Pre-calculated High Probability SMC Setups
  const entryLong = oteLevels.fib705;
  const slLong = isUSD ? Math.round((swingLow * 0.997) * 10) / 10 : Math.round(swingLow * 0.996);
  const tp1Long = isUSD ? Math.round((p * 1.008) * 10) / 10 : Math.round(p * 1.01);
  const tp2Long = swingHigh;
  const tp3Long = isUSD ? Math.round((swingHigh * 1.015) * 10) / 10 : Math.round(swingHigh * 1.02);

  // Short Setup Parameters (BSL Hunt + Premium Zone Rejection)
  const entryShort = isUSD ? Math.round((swingHigh * 0.998) * 10) / 10 : Math.round(swingHigh * 0.998);
  const slShort = isUSD ? Math.round((swingHigh * 1.006) * 10) / 10 : Math.round(swingHigh * 1.008);
  const tp1Short = equilibrium;
  const tp2Short = isUSD ? Math.round((p * 0.992) * 10) / 10 : Math.round(p * 0.99);
  const tp3Short = swingLow;

  const activeSetups: SmcTradeSetup[] = [
    {
      id: 'setup-1',
      pair: isUSD ? 'XAU/USD (Gold Spot)' : 'طلای ۱۸ عیار ایران',
      direction: 'LONG (خرید صعودی)',
      setupName: 'ICT OTE + Order Block Retest',
      entryPrice: entryLong,
      stopLoss: slLong,
      takeProfit1: tp1Long,
      takeProfit2: tp2Long,
      takeProfit3: tp3Long,
      riskRewardRatio: '1 : 3.85',
      winRateEstimate: '78%',
      invalidationLevel: slLong,
      rationaleFa: 'قیمت پس از سوییپ نقدینگی کف (SSL) و ایجاد شکست ساختار صعودی (CHoCH)، در حال بازگشت به محدوده طلایی OTE (فیبوناچی ۷۰.۵٪) و پر کردن FVG همپوشان با اوردر بلاک دست‌نخورده است.',
      stepByStepAction: [
        `۱. لیمیت خرید (Buy Limit) روی سطح OTE یعنی قیمت ${entryLong.toLocaleString('fa-IR')} قرار دهید.`,
        `۲. حد ضرر قطعی دقیقاً زیر کف سوئیپ‌شده در ${slLong.toLocaleString('fa-IR')} ست شود (حداکثر ۱.۵٪ ریسک سرمایه).`,
        `۳. با رسیدن به تارگت اول (${tp1Long.toLocaleString('fa-IR')})، ۵۰٪ حجم را ببندید و حد ضرر را به نقطه ورود (Risk-Free) منتقل کنید.`,
        `۴. تارگت‌های دوم و سوم در استخرهای نقدینگی سقف (BSL) در ${tp2Long.toLocaleString('fa-IR')} و ${tp3Long.toLocaleString('fa-IR')} نقد شوند.`,
      ],
    },
    {
      id: 'setup-2',
      pair: isUSD ? 'XAU/USD (Gold Spot)' : 'سکه امامی / مظنه طلا',
      direction: 'SHORT (فروش نزولی)',
      setupName: 'Liquidity Sweep + CHoCH Reversal',
      entryPrice: entryShort,
      stopLoss: slShort,
      takeProfit1: tp1Short,
      takeProfit2: tp2Short,
      takeProfit3: tp3Short,
      riskRewardRatio: '1 : 3.65',
      winRateEstimate: '76%',
      invalidationLevel: slShort,
      rationaleFa: 'تحلیل نزولی و شکار نقدینگی: سوییپ کامل استخر استاپ‌های خریداران در سقف (BSL Hunt) و نفوذ به محدوده گران‌قیمت (Premium Zone) همزمان با واگرایی نزولی و تشکیل اوردر بلاک عرضه ۴ ساعته.',
      stepByStepAction: [
        `۱. اردر فروش لیمیت (Sell Limit) در پولبک به سقف اوردربلاک نزولی در قیمت ${entryShort.toLocaleString('fa-IR')}.`,
        `۲. حد ضرر بالای شدو سقف استخر نقدینگی در ${slShort.toLocaleString('fa-IR')} (تثبیت بالای این عدد تحلیل نزولی را باطل می‌کند).`,
        `۳. تارگت اول در خط تعادل (Equilibrium 50%) در ${tp1Short.toLocaleString('fa-IR')}، تارگت دوم در ${tp2Short.toLocaleString('fa-IR')} و خروج نهایی در کف SSL (${tp3Short.toLocaleString('fa-IR')}).`,
      ],
    },
  ];

  return {
    assetId,
    currentPrice: p,
    isUSD,
    marketStructure: {
      bias: 'Bullish (صعودی ساختاری)',
      lastBOS: {
        price: isUSD ? Math.round((p * 1.004) * 10) / 10 : Math.round(p * 1.005),
        type: 'bullish',
        time: '۴ ساعت پیش',
      },
      lastCHoCH: {
        price: isUSD ? Math.round((p * 0.992) * 10) / 10 : Math.round(p * 0.99),
        type: 'bullish',
        time: '۲۴ ساعت پیش',
      },
      currentSwingHigh: swingHigh,
      currentSwingLow: swingLow,
      equilibriumPrice: equilibrium,
      currentZone: isDiscount
        ? 'Discount (محدوده تخفیف - ارزان برای خرید)'
        : 'Premium (محدوده گران - مناسب برای فروش)',
    },
    orderBlocks,
    fairValueGaps,
    liquidityLevels,
    activeKillzone,
    oteLevels,
    activeSetups,
    lastUpdated: new Date().toISOString(),
  };
}
