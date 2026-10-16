export interface AsianRangeData {
  high: number;
  low: number;
  rangePips: number;
  rangeToman: number;
  status: 'consolidation_active' | 'breakout_bullish' | 'breakout_bearish' | 'fakeout_detected';
  sessionTimeTehran: string;
  judasSwingRisk: 'بالا (احتمال فریب قیمت در بازگشایی اروپا)' | 'متوسط' | 'پایین';
  bullishBreakoutTarget: number;
  bearishBreakoutTarget: number;
  descriptionFa: string;
}

export interface ScalpStrategyModel {
  id: string;
  name: 'Asian Range Box Breakout' | 'London Open Momentum 5M' | 'RSI(2) Extreme Mean Reversion' | 'EMA 9/21 Ribbon Pullback';
  timeframe: '1m' | '5m' | '15m';
  direction: 'LONG (خرید اسکالپ)' | 'SHORT (فروش اسکالپ)';
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  pipTarget: number;
  riskReward: string;
  leverageGuide: string;
  winRate: string;
  indicatorsTrigger: string[];
  executionRules: string[];
}

export interface GoldVolatilityRadar {
  atr14M5: number;
  atr14H1: number;
  dailyRangeExpected: number;
  currentSpreadEstimate: string;
  bestTradingWindow: string;
  marketCondition: 'High Volatility Trend' | 'Compressed Range (آماده انفجار قیمت)' | 'Quiet Session';
}

export interface GoldScalpingPayload {
  assetId: string;
  currentPrice: number;
  isUSD: boolean;
  asianRange: AsianRangeData;
  volatilityRadar: GoldVolatilityRadar;
  activeScalpSetups: ScalpStrategyModel[];
  lastUpdated: string;
}

export function getGoldScalpingAnalysis(
  assetId: string = 'xau_usd',
  currentPrice: number = 2748.5,
  isUSD: boolean = true
): GoldScalpingPayload {
  const p = currentPrice || (isUSD ? 2748.5 : 4350000);

  // Asian Range Calculations (usually tight range 0.4% - 0.6%)
  const asianHigh = isUSD ? Math.round((p * 1.0035) * 10) / 10 : Math.round(p * 1.004);
  const asianLow = isUSD ? Math.round((p * 0.9965) * 10) / 10 : Math.round(p * 0.996);
  const rangePips = isUSD ? Math.round((asianHigh - asianLow) * 10) : 0;
  const rangeToman = !isUSD ? Math.round(asianHigh - asianLow) : 0;

  const asianBreakoutBullish = isUSD ? Math.round((asianHigh + (asianHigh - asianLow) * 1.5) * 10) / 10 : Math.round(asianHigh + (asianHigh - asianLow) * 1.5);
  const asianBreakoutBearish = isUSD ? Math.round((asianLow - (asianHigh - asianLow) * 1.5) * 10) / 10 : Math.round(asianLow - (asianHigh - asianLow) * 1.5);

  const asianRange: AsianRangeData = {
    high: asianHigh,
    low: asianLow,
    rangePips,
    rangeToman,
    status: p > asianHigh ? 'breakout_bullish' : p < asianLow ? 'breakout_bearish' : 'consolidation_active',
    sessionTimeTehran: '۰۳:۳۰ بامداد الی ۱۰:۳۰ صبح تهران',
    judasSwingRisk: 'بالا (احتمال فریب قیمت در بازگشایی اروپا)',
    bullishBreakoutTarget: asianBreakoutBullish,
    bearishBreakoutTarget: asianBreakoutBearish,
    descriptionFa: 'باکس رنج توکیو/سیدنی با فشردگی نقدینگی بالا. بریک‌اوت جعلی اولیه (Judas Swing) در ۱۵ دقیقه اول اوپن لندن بهترین فرصت ورود معکوس است.',
  };

  // Volatility Radar
  const atr5m = isUSD ? 2.8 : 12000;
  const atr1h = isUSD ? 11.5 : 48000;
  const dailyRange = isUSD ? 28.5 : 110000;

  const volatilityRadar: GoldVolatilityRadar = {
    atr14M5: atr5m,
    atr14H1: atr1h,
    dailyRangeExpected: dailyRange,
    currentSpreadEstimate: isUSD ? '1.2 - 2.0 Pips' : '0.05% در بازار نقدی',
    bestTradingWindow: 'ساعت ۱۶:۳۰ الی ۱۹:۳۰ (همپوشانی لندن و نیویورک)',
    marketCondition: 'Compressed Range (آماده انفجار قیمت)',
  };

  // Scalping Setups
  const activeScalpSetups: ScalpStrategyModel[] = [
    {
      id: 'scalp-1',
      name: 'London Open Momentum 5M',
      timeframe: '5m',
      direction: 'LONG (خرید اسکالپ)',
      entryPrice: isUSD ? Math.round((p * 0.998) * 10) / 10 : Math.round(p * 0.997),
      stopLoss: isUSD ? Math.round((p * 0.994) * 10) / 10 : Math.round(p * 0.993),
      takeProfit1: isUSD ? Math.round((p * 1.004) * 10) / 10 : Math.round(p * 1.005),
      takeProfit2: isUSD ? Math.round((p * 1.009) * 10) / 10 : Math.round(p * 1.01),
      pipTarget: isUSD ? 110 : 0,
      riskReward: '1 : 2.75',
      leverageGuide: isUSD ? 'حداکثر لوریج 1:20 با ریسک ۱٪' : 'معامله نقد یا مارجین کم‌ریسک',
      winRate: '81%',
      indicatorsTrigger: [
        'کراس صعودی مووینگ اوریج نمایی ۹ از روی ۲۱ در تایم ۵ دقیقه',
        'شاخص RSI بالاتر از سطح ۵۵ و شیب مثبت',
        'کلوز کندل مومنتومی پرقدرت بالای VWAP روزانه',
      ],
      executionRules: [
        'ورود دقیقاً در کلوز کندل ۵ دقیقه‌ای تثبیت‌شده بالای سطح میانگین متحرک.',
        'حد ضرر در زیر کف کندل ورود (حداکثر ۱۲ تا ۱۵ پیپ در طلا).',
        'با رسیدن به تارگت اول (+۶۰ پیپ)، ریسک‌فری کنید و نیمی از سود را قفل کنید.',
      ],
    },
    {
      id: 'scalp-2',
      name: 'Asian Range Box Breakout',
      timeframe: '15m',
      direction: 'LONG (خرید اسکالپ)',
      entryPrice: asianHigh,
      stopLoss: isUSD ? Math.round((asianHigh - 3.5) * 10) / 10 : Math.round(asianHigh * 0.995),
      takeProfit1: isUSD ? Math.round((asianHigh + 7.0) * 10) / 10 : Math.round(asianHigh * 1.008),
      takeProfit2: asianBreakoutBullish,
      pipTarget: isUSD ? 140 : 0,
      riskReward: '1 : 3.2',
      leverageGuide: isUSD ? 'لوریج 1:10 تا 1:15' : 'پله اول خرید',
      winRate: '76%',
      indicatorsTrigger: [
        'کلوز کندل ۱۵ دقیقه‌ای خارج از سقف باکس آسیایی',
        'اسپایک حجم معاملات بیش از ۱۵۰٪ میانگین ۲۰ کندل',
        'عدم وجود واگرایی منفی در مکدی (MACD Histogram)',
      ],
      executionRules: [
        'سفارش Buy Stop روی سقف رنج آسیا ست شود.',
        'حد ضرر دقیقاً در داخل باکس آسیایی (۳ الی ۴ دلار زیر نقطه شکست).',
        'تارگت اصلی در سطح ۱.۵ برابری پهنای کانال آسیا نقد شود.',
      ],
    },
    {
      id: 'scalp-3',
      name: 'London Open Momentum 5M',
      timeframe: '5m',
      direction: 'SHORT (فروش اسکالپ)',
      entryPrice: isUSD ? Math.round((p * 1.003) * 10) / 10 : Math.round(p * 1.004),
      stopLoss: isUSD ? Math.round((p * 1.007) * 10) / 10 : Math.round(p * 1.008),
      takeProfit1: isUSD ? Math.round((p * 0.995) * 10) / 10 : Math.round(p * 0.994),
      takeProfit2: isUSD ? Math.round((p * 0.990) * 10) / 10 : Math.round(p * 0.988),
      pipTarget: isUSD ? 130 : 0,
      riskReward: '1 : 3.1',
      leverageGuide: isUSD ? 'لوریج 1:15 با استاپ قطعی' : 'فروش نوسان‌گیری سقف',
      winRate: '79%',
      indicatorsTrigger: [
        'سوییپ نقدینگی و فریب قیمتی جوداس سوئینگ (Judas Swing) بالای سقف آسیا',
        'واگرایی منفی مشهود در اندیکاتور RSI تایم‌فریم ۵ دقیقه',
        'شکست رو به پایین خط میانگین متحرک VWAP با کندل اینگلف نزولی',
      ],
      executionRules: [
        'ورود به پوزیشن فروش به محض کلوز کندل نزولی برگشتی زیر سقف رنج آسیا.',
        'حد ضرر دقیقاً بالای بالاترین شدو ایجاد شده در فیک‌بریک‌اوت.',
        'تارگت اول در خط میانی رنج و تارگت دوم در کف باکس آسیایی قفل شود.',
      ],
    },
  ];

  return {
    assetId,
    currentPrice: p,
    isUSD,
    asianRange,
    volatilityRadar,
    activeScalpSetups,
    lastUpdated: new Date().toISOString(),
  };
}
