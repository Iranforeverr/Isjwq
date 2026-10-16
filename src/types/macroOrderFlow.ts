/**
 * Phase 5: Macroeconomics, Intermarket, Events & Order Flow Engine Types
 * Compliant with Clauses 14, 15, 16, 17, 18, 19, 20, 21:
 * - US Real Yields (TIPS 10Y) & Fed Funds Rate Impact
 * - DXY & Rolling Correlations with Gold
 * - Central Bank Physical Gold Accumulation Flows (PBoC, RBI, etc.)
 * - Event Risk (CPI, FOMC, NFP, PCE) & Volatility Blackout Guidelines
 * - Volume Profile (POC, VAH, VAL) & Order Flow CVD (Cumulative Volume Delta)
 */

export interface MacroFactorItem {
  id: string;
  nameFa: string;
  nameEn: string;
  currentValue: string;
  historicalPercentile: number; // 0 to 100
  goldCorrelation: number; // -1.0 to +1.0
  impactDirection: 'bullish' | 'bearish' | 'neutral';
  impactWeight: number; // 1 to 5
  explanationFa: string;
}

export interface CentralBankAccumulationState {
  totalTonsAnnual: number;
  isHistoricalRecord: boolean;
  topBuyers: Array<{ countryFa: string; tonsAdded: number }>;
  marketImpactFa: string;
}

export interface UpcomingEventRisk {
  id: string;
  titleFa: string;
  hoursUntilRelease: number;
  importanceLevel: 'critical' | 'high' | 'medium';
  forecastVsPreviousFa: string;
  blackoutWarningFa: string; // Guidance on reducing leverage / waiting before event
}

export interface OrderFlowVolumeProfile {
  pointOfControlPOC: number; // High-volume node
  valueAreaHighVAH: number;
  valueAreaLowVAL: number;
  cvdDeltaStatus: 'strong_buying_delta' | 'neutral_delta' | 'aggressive_selling_delta';
  cvdDivergenceFa: string;
  institutionalParticipation: 'بالا (حضور بانک‌ها و نهادی‌ها)' | 'متوسط' | 'پایین (بیشتر خرد)';
}

export interface Phase5MacroOrderFlowPayload {
  macroScore: number; // -100 to +100
  macroScoreFa: string;
  factors: MacroFactorItem[];
  centralBanks: CentralBankAccumulationState;
  eventRisks: UpcomingEventRisk[];
  volumeProfile: OrderFlowVolumeProfile;
  macroSynthesisFa: string;
  calculatedAt: string;
}
