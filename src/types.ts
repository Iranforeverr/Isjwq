export type AssetKey =
  | 'xau_usd'      // انس جهانی طلا (دلار)
  | 'usd_irr'      // دلار آزاد تهران (تومان)
  | 'gold_18k'      // طلای ۱۸ عیار ایران (تومان هر گرم)
  | 'mithqal'       // مثقال طلا (تومان)
  | 'emami_coin'    // سکه تمام امامی (تومان)
  | 'bahar_coin'    // سکه تمام بهار آزادی (تومان)
  | 'half_coin'     // نیم سکه (تومان)
  | 'quarter_coin';  // ربع سکه (تومان)

export type TimeframeKey =
  | '1day'    // روز بعد (+24h)
  | '1week'   // هفته بعد (+7d)
  | '1month'  // ماه بعد (+30d)
  | '2months' // دو ماه بعد (+60d)
  | '6months' // شش ماه بعد (+180d)
  | '1year';   // یک سال بعد (+365d)

export interface AssetInfo {
  id: AssetKey;
  nameFa: string;
  nameEn: string;
  unitFa: string;
  unitEn: string;
  symbol: string;
  currentPrice: number;
  change24h: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
  bubbleTomans?: number;
  bubblePercent?: number;
  isUSD: boolean;
}

export interface ScenarioBreakdown {
  probability: number; // 0-100
  targetPrice: number;
  percentChange: number;
  labelFa: string;
  descriptionFa: string;
  catalysts: string[];
}

export interface ForecastPeriodData {
  timeframe: TimeframeKey;
  titleFa: string;
  titleEn: string;
  expectedPrice: number;
  expectedChangePercent: number;
  confidenceScore: number; // e.g. 85%
  upperBound: number;
  lowerBound: number;
  scenarios: {
    bullish: ScenarioBreakdown;
    base: ScenarioBreakdown;
    bearish: ScenarioBreakdown;
  };
  keyDriversFa: string[];
  technicalSummaryFa: string;
  riskRating: 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا';
}

export interface TechnicalIndicatorData {
  rsi: {
    value: number;
    status: 'اشباع خرید' | 'اشباع فروش' | 'خنثی' | 'متمایل به صعود' | 'متمایل به نزول';
    signal: 'خرید' | 'فروش' | 'نگهداری';
  };
  macd: {
    value: number;
    signalLine: number;
    histogram: number;
    status: 'تقاطع صعودی' | 'تقاطع نزولی' | 'خنثی';
    signal: 'خرید' | 'فروش' | 'نگهداری';
  };
  movingAverages: {
    ema20: number;
    ema50: number;
    ema200: number;
    trendShort: 'صعودی' | 'نزولی' | 'رِنج';
    trendLong: 'صعودی' | 'نزولی' | 'رِنج';
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    bandwidth: number;
    status: 'فشردگی نوسان' | 'انبساط باند' | 'عادی';
  };
  fibonacciLevels: {
    level0: number;
    level236: number;
    level382: number;
    level500: number;
    level618: number;
    level786: number;
    level100: number;
  };
  pivots: {
    r3: number;
    r2: number;
    r1: number;
    pivot: number;
    s1: number;
    s2: number;
    s3: number;
  };
}

export interface ChartDataPoint {
  date: string;
  label: string;
  historicalPrice?: number;
  forecastPrice?: number;
  upperConfidence?: number;
  lowerConfidence?: number;
  isForecast?: boolean;
}

export interface MacroIndicator {
  name: string;
  nameFa: string;
  currentValue: string;
  impactOnGold: 'محرک صعودی' | 'محرک نزولی' | 'خنثی / دوگانه';
  impactLevel: 'بالا' | 'متوسط' | 'کم';
  descriptionFa: string;
}

export interface AIGeneratedAnalysis {
  summary: string;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  confidenceScore: number;
  timeframe: string;
  forecastTargets: {
    expectedPrice: number;
    bullishTarget: number;
    bearishTarget: number;
    changePercent: number;
    unit: string;
  };
  scenarioProbabilities: {
    bullish: number;
    base: number;
    bearish: number;
  };
  technicalHighlights: string[];
  fundamentalDrivers: string[];
  supportResistanceLevels: {
    resistance3: number;
    resistance2: number;
    resistance1: number;
    pivot: number;
    support1: number;
    support2: number;
    support3: number;
  };
  riskLevel: string;
  actionableAdvice: string;
  bubbleStatus?: string;
  geopoliticalImpact?: string;
}
