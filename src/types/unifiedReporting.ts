/**
 * Phase 9: Unified Decision Architecture, Dual UI (Simple vs Advanced),
 * Transparent Journaling, Backtesting & Reporting Types
 * Compliant with Clauses 2, 3, 4, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 58, 59, 61, 62, 63
 */

export interface SimpleExecutiveSummary {
  headlineFa: string;
  trafficLightColor: 'green' | 'amber' | 'red';
  trafficLightActionFa: string; // "خرید پله‌ای با رعایت خط ابطال"
  summaryBulletPoints: string[];
  invalidationAlertFa: string;
  whoShouldActFa: string; // چه کسانی باید اقدام کنند
  whoShouldWaitFa: string; // چه کسانی باید صبر کنند
}

export interface TradeJournalEntry {
  id: string;
  timestamp: string;
  asset: string;
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  riskReward: number;
  outcomeStatus: 'open' | 'target_hit' | 'invalidated';
  pnlPercent: number;
  postMortemLessonFa: string;
}

export interface BacktestValidationMetrics {
  historicalWinRatePercent: number; // e.g. 68.4%
  profitFactor: number; // e.g. 2.14
  maxDrawdownPercent: number; // e.g. 7.2%
  totalTradesTested: number; // e.g. 240 trades over 24 months
  sharpeRatio: number;
  regimePerformance: {
    uptrendWinRate: number;
    rangeWinRate: number;
    downtrendWinRate: number;
  };
}

export interface Phase9MasterPayload {
  simpleSummary: SimpleExecutiveSummary;
  recentJournal: TradeJournalEntry[];
  backtestMetrics: BacktestValidationMetrics;
  auditTrailVerified: boolean;
}
