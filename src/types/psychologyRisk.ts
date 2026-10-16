/**
 * Phase 8: Psychology, Cognitive Bias Engine, Risk Management & Discipline Types
 * Compliant with Clauses 39, 40, 41, 42, 43, 55, 56:
 * - FOMO Syndrome Control & Peak Chasing Deterrence
 * - Panic Selling & Capitulation Deterrence during Natural Healthy Pullbacks
 * - Position Sizing Calculator (Fixed Risk % based on Account Capital & Stop Distance)
 * - Maximum Drawdown & Consecutive Losses Circuit Breakers
 * - Cognitive Bias Detection: Confirmation Bias, Recency Bias, Loss Aversion, Sunk Cost
 */

export interface CognitiveBiasCheck {
  id: string;
  biasNameFa: string;
  biasNameEn: string;
  riskStatus: 'critical' | 'moderate' | 'safe';
  triggerSymptomFa: string;
  mitigationProtocolFa: string;
}

export interface RiskManagementFramework {
  recommendedRiskPerTradePercent: number; // e.g. 1.0% to 2.0%
  stopLossDistancePercent: number;
  calculatedPositionSizePercent: number; // calculated mathematically: Risk % / Stop %
  maxPortfolioRiskExposurePercent: number;
  riskRewardRatio: number; // e.g. 1:2.8
  circuitBreakers: {
    maxDailyLossPercent: number; // e.g. 3.0%
    maxConsecutiveLossesAllowed: number; // e.g. 3 consecutive trades -> 24h cooldown
    cooldownPeriodHours: number;
    ruleFa: string;
  };
}

export interface BehavioralStateEvaluation {
  fearGreedIndexScore: number; // 0 (Extreme Fear) to 100 (Extreme Greed)
  sentimentClassificationFa: string;
  fomoIndexScore: number; // 0 to 100
  isFomoDangerActive: boolean;
  fomoWarningNarrativeFa: string;
  healthyPullbackComfortNarrativeFa: string;
  biases: CognitiveBiasCheck[];
  riskFramework: RiskManagementFramework;
  behavioralVerdictFa: string;
}
