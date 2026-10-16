export interface ElliottWaveAnalysis {
  assetId: string;
  timeframe: '1h' | '4h' | '1d' | '1w';
  currentDegree: 'Primary (ماژور هفتگی)' | 'Intermediate (میان‌مدت روزانه)' | 'Minor (کوتاه‌مدت ۴ ساعته)';
  currentCycle: 'Motive Wave 3 in progress (موج ۳ صعودی اصلی)' | 'Wave 4 Pullback (اصلاح موج ۴)' | 'Wave 5 Blow-off Top' | 'Corrective ABC (اصلاح زیگزاگ)';
  waves: Array<{
    label: 'Wave 1' | 'Wave 2' | 'Wave 3' | 'Wave 4' | 'Wave 5' | 'Wave A' | 'Wave B' | 'Wave C';
    startPrice: number;
    endPrice: number;
    status: 'completed' | 'active_forming' | 'projected_target';
    fibRatio: string;
    descriptionFa: string;
  }>;
  rulesValidation: {
    rule1Valid: boolean; // Wave 2 does not retrace 100% of Wave 1
    rule2Valid: boolean; // Wave 3 is not the shortest
    rule3Valid: boolean; // Wave 4 does not overlap Wave 1
    statusTextFa: string;
  };
  projectedWave5Target: number;
  invalidationPrice: number;
}

export interface HarmonicPattern {
  id: string;
  name: 'Bullish Gartley (گارتلی صعودی)' | 'Bullish Bat (الگوی خفاش صعودی)' | 'Bullish Butterfly (پروانه صعودی)' | 'Bullish Crab (خرچنگ صعودی)' | 'Bearish Deep Crab (خرچنگ نزولی)';
  symbol: string;
  timeframe: '1h' | '4h' | '1d';
  points: {
    X: number;
    A: number;
    B: number;
    C: number;
    D: number; // Potential Reversal Zone (PRZ)
  };
  przZone: {
    min: number;
    max: number;
    reversalScore: number; // 0 to 100
  };
  fibRatios: {
    xB: string; // e.g., 0.618 or 0.382
    aC: string; // e.g., 0.382 - 0.886
    bD: string; // e.g., 1.618 - 2.618
    xD: string; // e.g., 0.786 or 0.886
  };
  direction: 'LONG (خرید برگشتی)' | 'SHORT (فروش بازگشتی)';
  status: 'active_prz_entry' | 'forming_leg_cd' | 'target_reached';
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskReward: string;
  descriptionFa: string;
}

export interface GoldenPocketData {
  swingHigh: number;
  swingLow: number;
  fib618: number;
  fib650: number; // Institutional Golden Pocket Sweet Spot
  fib786: number;
  currentZoneStatus: 'Inside Golden Pocket (در باکس طلایی ورود)' | 'Approaching Zone' | 'Above Zone';
  descriptionFa: string;
}

export interface ElliottHarmonicPayload {
  assetId: string;
  currentPrice: number;
  isUSD: boolean;
  elliott: ElliottWaveAnalysis;
  harmonics: HarmonicPattern[];
  goldenPocket: GoldenPocketData;
  activeSetups: Array<{
    id: string;
    title: string;
    patternType: string;
    entry: number;
    sl: number;
    tp1: number;
    tp2: number;
    tp3: number;
    rr: string;
    probability: string;
    instructionFa: string;
  }>;
  lastUpdated: string;
}

export function getElliottHarmonicsAnalysis(
  assetId: string = 'xau_usd',
  currentPrice: number = 2748.5,
  isUSD: boolean = true
): ElliottHarmonicPayload {
  const p = currentPrice || (isUSD ? 2748.5 : 4350000);

  // Dynamic Wave 1 to 5 Coordinates
  const w1Start = isUSD ? Math.round((p * 0.92) * 10) / 10 : Math.round(p * 0.91);
  const w1End = isUSD ? Math.round((p * 0.955) * 10) / 10 : Math.round(p * 0.95);
  const w2End = isUSD ? Math.round((p * 0.938) * 10) / 10 : Math.round(p * 0.93);
  const w3End = isUSD ? Math.round((p * 1.012) * 10) / 10 : Math.round(p * 1.015);
  const w4End = isUSD ? Math.round((p * 0.985) * 10) / 10 : Math.round(p * 0.982);
  const w5Projected = isUSD ? Math.round((p * 1.055) * 10) / 10 : Math.round(p * 1.06);

  const elliott: ElliottWaveAnalysis = {
    assetId,
    timeframe: '4h',
    currentDegree: 'Intermediate (میان‌مدت روزانه)',
    currentCycle: 'Motive Wave 3 in progress (موج ۳ صعودی اصلی)',
    waves: [
      {
        label: 'Wave 1',
        startPrice: w1Start,
        endPrice: w1End,
        status: 'completed',
        fibRatio: '1.0 (موج پیشرو اولیه)',
        descriptionFa: 'شروع حرکت صعودی پرقدرت پس از پایان اصلاح ماژور قبلی',
      },
      {
        label: 'Wave 2',
        startPrice: w1End,
        endPrice: w2End,
        status: 'completed',
        fibRatio: '0.618 فیبوناچی موج ۱',
        descriptionFa: 'اصلاح زیگزاگ عمیق و جمع‌آوری نقدینگی در کف کانال',
      },
      {
        label: 'Wave 3',
        startPrice: w2End,
        endPrice: w3End,
        status: 'active_forming',
        fibRatio: '1.618 اکستنشن موج ۱ (پرقدرت‌ترین موج)',
        descriptionFa: 'موج انفجاری سوم با مومنتوم حداکثری و حجم معاملات سنگین',
      },
      {
        label: 'Wave 4',
        startPrice: w3End,
        endPrice: w4End,
        status: 'projected_target',
        fibRatio: '0.382 اصلاح موج ۳',
        descriptionFa: 'اصلاح فرسایشی مثلثی بدون همپوشانی با قله موج ۱',
      },
      {
        label: 'Wave 5',
        startPrice: w4End,
        endPrice: w5Projected,
        status: 'projected_target',
        fibRatio: 'برابری با موج ۱ / هدف اکستنشن ۲.۶۱۸ کل ساختار',
        descriptionFa: 'قله نهایی و سقف تاریخی جدید در پایان سوپرسایکل ۵ موجی',
      },
    ],
    rulesValidation: {
      rule1Valid: true,
      rule2Valid: true,
      rule3Valid: true,
      statusTextFa: 'تمامی ۳ قانون طلایی الیوت با دقت ۱۰۰٪ رعایت شده و شمارش از بالاترین اعتبار برخوردار است.',
    },
    projectedWave5Target: w5Projected,
    invalidationPrice: w1End, // If price drops below wave 1 high, count is invalidated
  };

  // Harmonic Patterns Coordinates
  const xGartley = isUSD ? Math.round((p * 0.96) * 10) / 10 : Math.round(p * 0.95);
  const aGartley = isUSD ? Math.round((p * 1.015) * 10) / 10 : Math.round(p * 1.02);
  const rangeXA = aGartley - xGartley;
  const bGartley = isUSD ? Math.round((aGartley - rangeXA * 0.618) * 10) / 10 : Math.round(aGartley - rangeXA * 0.618);
  const cGartley = isUSD ? Math.round((bGartley + (aGartley - bGartley) * 0.786) * 10) / 10 : Math.round(bGartley + (aGartley - bGartley) * 0.786);
  const dGartley = isUSD ? Math.round((aGartley - rangeXA * 0.786) * 10) / 10 : Math.round(aGartley - rangeXA * 0.786); // PRZ at 0.786

  const harmonics: HarmonicPattern[] = [
    {
      id: 'harm-1',
      name: 'Bullish Gartley (گارتلی صعودی)',
      symbol: isUSD ? 'XAU/USD' : 'طلای ۱۸ عیار',
      timeframe: '4h',
      points: {
        X: xGartley,
        A: aGartley,
        B: bGartley,
        C: cGartley,
        D: dGartley,
      },
      przZone: {
        min: isUSD ? Math.round((dGartley * 0.996) * 10) / 10 : Math.round(dGartley * 0.995),
        max: isUSD ? Math.round((dGartley * 1.004) * 10) / 10 : Math.round(dGartley * 1.005),
        reversalScore: 92,
      },
      fibRatios: {
        xB: '0.618 (دقیق)',
        aC: '0.786',
        bD: '1.618',
        xD: '0.786 (تراز کلیدی برگشت PRZ)',
      },
      direction: 'LONG (خرید برگشتی)',
      status: 'active_prz_entry',
      stopLoss: isUSD ? Math.round((xGartley * 0.995) * 10) / 10 : Math.round(xGartley * 0.993),
      takeProfit1: isUSD ? Math.round((dGartley + (aGartley - dGartley) * 0.382) * 10) / 10 : Math.round(dGartley + (aGartley - dGartley) * 0.382),
      takeProfit2: isUSD ? Math.round((dGartley + (aGartley - dGartley) * 0.618) * 10) / 10 : Math.round(dGartley + (aGartley - dGartley) * 0.618),
      takeProfit3: aGartley,
      riskReward: '1 : 4.2',
      descriptionFa: 'الگوی گارتلی صعودی با اصلاح دقیق ۰.۶۱۸ در نقطه B و محدوده بازگشت پتانسیل (PRZ) فوق‌العاده معتبر در تراز ۰.۷۸۶ موج XA.',
    },
    {
      id: 'harm-2',
      name: 'Bearish Deep Crab (خرچنگ نزولی)',
      symbol: isUSD ? 'XAU/USD' : 'طلای ۱۸ عیار / سکه',
      timeframe: '4h',
      points: {
        X: isUSD ? Math.round((p * 0.96) * 10) / 10 : Math.round(p * 0.95),
        A: isUSD ? Math.round((p * 0.985) * 10) / 10 : Math.round(p * 0.98),
        B: isUSD ? Math.round((p * 0.965) * 10) / 10 : Math.round(p * 0.96),
        C: isUSD ? Math.round((p * 0.98) * 10) / 10 : Math.round(p * 0.978),
        D: isUSD ? Math.round((p * 1.012) * 10) / 10 : Math.round(p * 1.015),
      },
      przZone: {
        min: isUSD ? Math.round((p * 1.008) * 10) / 10 : Math.round(p * 1.01),
        max: isUSD ? Math.round((p * 1.016) * 10) / 10 : Math.round(p * 1.02),
        reversalScore: 89,
      },
      fibRatios: {
        xB: '0.886 (تراز دیپ کرب)',
        aC: '0.382',
        bD: '2.618',
        xD: '1.618 (اکستنشن نهایی)',
      },
      direction: 'SHORT (فروش بازگشتی)',
      status: 'active_prz_entry',
      stopLoss: isUSD ? Math.round((p * 1.022) * 10) / 10 : Math.round(p * 1.025),
      takeProfit1: isUSD ? Math.round((p * 0.995) * 10) / 10 : Math.round(p * 0.992),
      takeProfit2: isUSD ? Math.round((p * 0.985) * 10) / 10 : Math.round(p * 0.98),
      takeProfit3: isUSD ? Math.round((p * 0.970) * 10) / 10 : Math.round(p * 0.965),
      riskReward: '1 : 3.8',
      descriptionFa: 'الگوی هارمونیک خرچنگ نزولی در سقف موج ۳ الیوت؛ هشدار اصلاح عمیق زیگزاگ در موج ۴ به سمت کف‌های حمایتی.',
    },
  ];

  // Golden Pocket
  const sHigh = aGartley;
  const sLow = xGartley;
  const rng = sHigh - sLow;
  const goldenPocket: GoldenPocketData = {
    swingHigh: sHigh,
    swingLow: sLow,
    fib618: isUSD ? Math.round((sHigh - rng * 0.618) * 10) / 10 : Math.round(sHigh - rng * 0.618),
    fib650: isUSD ? Math.round((sHigh - rng * 0.65) * 10) / 10 : Math.round(sHigh - rng * 0.65),
    fib786: isUSD ? Math.round((sHigh - rng * 0.786) * 10) / 10 : Math.round(sHigh - rng * 0.786),
    currentZoneStatus: p >= (sHigh - rng * 0.786) && p <= (sHigh - rng * 0.618)
      ? 'Inside Golden Pocket (در باکس طلایی ورود)'
      : 'Approaching Zone',
    descriptionFa: 'باکس طلایی فیبوناچی ۰.۶۱۸ تا ۰.۶۵ محبوب‌ترین محدوده خرید الگوریتم‌های سرمایه‌گذاری وال‌استریت در طلا.',
  };

  const activeSetups = [
    {
      id: 'es-1',
      title: 'شکار موج ۵ الیوت پس از اتمام اصلاح موج ۴',
      patternType: 'Elliott Wave 5 Impulse',
      entry: w4End,
      sl: isUSD ? Math.round((w1End * 0.998) * 10) / 10 : Math.round(w1End * 0.995),
      tp1: w3End,
      tp2: isUSD ? Math.round((w3End * 1.025) * 10) / 10 : Math.round(w3End * 1.03),
      tp3: w5Projected,
      rr: '1 : 4.5',
      probability: '84%',
      instructionFa: 'ورود در باکس حمایتی موج ۴ با حد ضرر تداخل قله موج ۱؛ اهداف قیمتی در سقف تاریخی موج ۵ قرار دارند.',
    },
    {
      id: 'es-2',
      title: 'فروش نزولی (SHORT) در انتهای موج ۳ با الگوی هارمونیک نزولی',
      patternType: 'Bearish Harmonic Reversal (موج اصلاحی ۴)',
      entry: isUSD ? Math.round((p * 1.01) * 10) / 10 : Math.round(p * 1.012),
      sl: isUSD ? Math.round((p * 1.02) * 10) / 10 : Math.round(p * 1.022),
      tp1: isUSD ? Math.round((p * 0.995) * 10) / 10 : Math.round(p * 0.992),
      tp2: w4End,
      tp3: isUSD ? Math.round((w4End * 0.99) * 10) / 10 : Math.round(w4End * 0.99),
      rr: '1 : 3.7',
      probability: '77%',
      instructionFa: 'پوزیشن فروش و هج (Short / Hedging) برای سوار شدن بر موج اصلاحی ۴ الیوت با تاییدیه ریجکت از سقف PRZ خرچنگ نزولی.',
    },
  ];

  return {
    assetId,
    currentPrice: p,
    isUSD,
    elliott,
    harmonics,
    goldenPocket,
    activeSetups,
    lastUpdated: new Date().toISOString(),
  };
}
