/**
 * Phase 7: Decision Engine, Tri-Scenario, Invalidation & Allocation Engine Types
 * Compliant with Clauses 33, 34, 35, 36, 37, 38, 54, 57, 64:
 * - Decision Types: Aggressive Buy, Conservative Staggered Buy (DCA), Wait / No-Edge (صبر و نظاره), De-risk / Take-Profit
 * - Triple Scenarios: Base Case (سناریوی پایه), Bullish Extended (سناریوی خوش‌بینانه), Bearish Correction (سناریوی اصلاحی بدبینانه)
 * - Strict Invalidation Level (سطح ابطال قطعی که در صورت شکست، تز صعودی باطل می‌شود)
 * - Capital Allocation: Lump-sum vs Staggered DCA steps (خرید یکجا در برابر پله‌ای)
 * - Time Horizon Specific Guidance: Short-term Swing vs Medium-term Investment
 */

export type ActionRecommendationType =
  | 'lump_sum_buy'
  | 'staggered_dca_buy'
  | 'hold_and_trail_stop'
  | 'wait_no_edge'
  | 'derisk_trim';

export interface MarketScenarioDetail {
  id: 'base' | 'bull_extended' | 'bear_correction';
  titleFa: string;
  probabilityPercent: number; // Sum must equal 100%
  triggerConditionFa: string;
  targetPrice: number;
  expectedTimeframeFa: string;
  narrativeFa: string;
}

export interface StaggeredDcaStep {
  stepNumber: number;
  priceTarget: number;
  allocationPercent: number; // e.g. 40% Step 1, 35% Step 2, 25% Step 3
  rationaleFa: string;
}

export interface Phase7DecisionEnginePayload {
  assetId: string;
  currentPrice: number;
  isUSD: boolean;
  recommendationType: ActionRecommendationType;
  recommendationTitleFa: string;
  confidencePercent: number; // 0 to 100
  executiveSummaryFa: string;
  lumpSumVsDcaGuide: {
    recommendedStrategy: 'خرید پله‌ای (DCA)' | 'خرید یکجا (Lump-Sum)' | 'صبر و نظاره (Cash / Wait)';
    capitalAllocationSteps: StaggeredDcaStep[];
    lumpSumWarningFa: string;
  };
  invalidationFramework: {
    hardInvalidationPrice: number;
    trailingStopPrice: number;
    invalidationTriggerConditionFa: string;
    consequenceIfBrokenFa: string;
  };
  tripleScenarios: {
    baseCase: MarketScenarioDetail;
    bullExtended: MarketScenarioDetail;
    bearCorrection: MarketScenarioDetail;
  };
  horizonSpecificAdvice: {
    shortTermSwing: string;
    mediumTermInvestor: string;
  };
}
