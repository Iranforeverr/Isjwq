/**
 * Phase 6: Factor Matrix, Dynamic Weighting & Conflict Detection Engine Types
 * Compliant with Clauses 29, 30, 31, 32, 60:
 * - Anti-Double-Counting Architecture: 8 Orthogonal Independent Factors
 * - Each Factor has: Score (-100 to +100), Confidence (0-100), Dynamic Weight (0-100%), Data Quality Grade
 * - Dynamic Regime-Aware Weight Allocation
 * - Conflict Detection Engine: Flags divergence between methods (e.g. Technical vs Macro or Trend vs Bubble)
 * - Conflict Score (0 to 100) & Disallowance of premature certainty
 */

import { DataQualityGrade } from './decisionSystem';

export type FactorCategoryKey =
  | 'market_structure'
  | 'liquidity_smc'
  | 'macro_rates'
  | 'intermarket_correlations'
  | 'order_flow_volume'
  | 'valuation_intrinsic_bubble'
  | 'multi_timeframe_alignment'
  | 'event_risk_sentiment';

export interface OrthogonalFactorItem {
  id: FactorCategoryKey;
  titleFa: string;
  categoryDescriptionFa: string;
  score: number; // -100 (Strong Bearish) to +100 (Strong Bullish)
  confidence: number; // 0 to 100
  baseWeightPercent: number;
  dynamicWeightPercent: number; // dynamically adjusted by market regime
  dataQuality: DataQualityGrade;
  subComponentsCount: number;
  antiDoubleCountingNoteFa: string; // Explains what correlated indicators were merged
  keySignalFa: string;
}

export interface FactorConflictDetail {
  id: string;
  sideA: { factorName: string; direction: string; score: number };
  sideB: { factorName: string; direction: string; score: number };
  severity: 'low' | 'moderate' | 'severe';
  explanationFa: string;
  recommendedCautionFa: string;
}

export interface Phase6FactorMatrixPayload {
  factors: OrthogonalFactorItem[];
  totalNormalizedWeight: number; // Must equal 100%
  compositeWeightedScore: number; // -100 to +100
  compositeConfidence: number; // 0 to 100
  compositeDirectionFa: string;
  conflictScore: number; // 0 (complete harmony) to 100 (severe total conflict)
  conflictStatusFa: string;
  detectedConflicts: FactorConflictDetail[];
  regimeWeightingAdjustmentNoteFa: string;
}
