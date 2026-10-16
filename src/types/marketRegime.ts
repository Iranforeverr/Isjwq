/**
 * Phase 3: Market Regime & Multi-Timeframe Engine Types
 * Compliant with Clauses 5, 6, 10:
 * - Market Regimes: Strong Uptrend, Uptrend, Weak Uptrend, Range, Weak Downtrend, Downtrend, Strong Downtrend
 * - Volatility: High, Normal, Low Volatility (ATR, Bollinger, Volatility Percentile)
 * - Sentiment Climate: Risk-On, Risk-Off, Event-Driven
 * - Multi-Timeframe Alignment: Weekly (Big Picture), Daily (Main Direction), 4H (Market Structure), 1H (Short-Term Timing)
 * - Timeframe Conflict Detection: Identifying e.g. Daily Bullish vs 4H Bearish Correction
 */

export type TrendRegime =
  | 'strong_uptrend'
  | 'uptrend'
  | 'weak_uptrend'
  | 'range'
  | 'weak_downtrend'
  | 'downtrend'
  | 'strong_downtrend';

export type VolatilityRegime = 'high_volatility' | 'normal_volatility' | 'low_volatility';

export type SentimentEnvironment = 'risk_on' | 'risk_off' | 'event_driven_market';

export interface TimeframeSignal {
  timeframe: '1w' | '1d' | '4h' | '1h';
  labelFa: string;
  roleDescriptionFa: string; // e.g. "تصویر کلان هفتگی", "جهت اصلی روزانه"
  direction: 'bullish' | 'bearish' | 'neutral_range';
  trendStrengthScore: number; // -100 to +100
  keyMovingAverageStatus: 'above_all_emas' | 'between_emas' | 'below_all_emas';
  structureStateFa: string;
}

export interface MarketRegimeState {
  assetId: string;
  assetNameFa: string;
  currentPrice: number;
  isUSD: boolean;
  trendRegime: TrendRegime;
  trendRegimeFa: string;
  trendStrengthScore: number; // 0 to 100
  volatilityRegime: VolatilityRegime;
  volatilityRegimeFa: string;
  atrPercentile: number; // 0 to 100
  environmentType: SentimentEnvironment;
  environmentTypeFa: string;
  regimeConfidencePercent: number; // e.g. 82%
  strategyWeightAdjustmentGuide: {
    trendFollowingWeight: number; // e.g. 40%
    supportResistanceRangeWeight: number; // e.g. 20%
    eventRiskWeight: number; // e.g. 15%
    liquiditySmcWeight: number; // e.g. 25%
  };
  timeframeMatrix: {
    weekly: TimeframeSignal;
    daily: TimeframeSignal;
    fourHour: TimeframeSignal;
    oneHour: TimeframeSignal;
  };
  conflictResolution: {
    hasConflict: boolean;
    headlineFa: string;
    actionableAdviceFa: string;
    correctionRiskLevel: 'کم' | 'متوسط' | 'زیاد';
  };
  timestamp: string;
}
