/**
 * Phase 4: Price, Structure, SMC & Technical Engines Types
 * Compliant with Clauses 7, 8, 9, 11, 12, 13, 22, 23:
 * - Market Structure (HH, HL, LH, LL, BOS, CHoCH)
 * - Support & Resistance with Level Strength Scoring
 * - SMC / ICT with strict contextual validity (FVG, OrderBlock, Liquidity Sweeps)
 * - Momentum (RSI, MACD Divergence) - Never single-indicator buy/sell
 * - Elliott Wave (Primary count, Alternative count, Invalidation) & Fibonacci
 */

export interface MarketStructurePoint {
  type: 'HH' | 'HL' | 'LH' | 'LL';
  price: number;
  timestamp: string;
  timeframe: string;
}

export interface StructureBreakEvent {
  type: 'BOS' | 'CHOCH';
  direction: 'bullish' | 'bearish';
  priceLevel: number;
  timeframe: string;
  confidenceScore: number; // 0 to 100
  descriptionFa: string;
}

export interface SupportResistanceLevel {
  id: string;
  price: number;
  type: 'major_support' | 'minor_support' | 'major_resistance' | 'minor_resistance' | 'psychological';
  labelFa: string;
  strengthScore: number; // 0 to 100 based on touch reactions, timeframe & volume
  numberOfReactions: number;
  distancePercent: number; // relative to current price
  breakStatus: 'holding' | 'testing' | 'broken';
}

export interface SmcContextualElement {
  id: string;
  type: 'order_block' | 'fvg' | 'liquidity_pool' | 'breaker_block';
  direction: 'bullish' | 'bearish';
  rangeStart: number;
  rangeEnd: number;
  timeframe: string;
  isContextuallyValid: boolean; // Must align with higher-timeframe structure (Clause 12)
  mitigated: boolean;
  explanationFa: string;
}

export interface MomentumTechnicalState {
  rsiValue: number;
  rsiStateFa: string; // e.g. "مومنتوم مثبت و سالم، بدون اشباع خرید افراطی"
  macdDivergence: 'none' | 'bullish_divergence' | 'bearish_divergence';
  emaAlignment: 'bullish_stack' | 'neutral_mixed' | 'bearish_stack';
  distanceFrom200EmaPercent: number;
  exhaustionRisk: 'کم' | 'متوسط' | 'بالا';
}

export interface ElliottWaveScenario {
  primaryCount: string; // e.g. "موج ۳ ایمپالس صعودی در حال بسط"
  alternativeCount: string; // e.g. "موج B اصلاحی و احتمال موج C پولبک"
  invalidationLevel: number;
  fibonacciGoldenPocket: {
    fib50: number;
    fib618: number;
  };
}

export interface Phase4TechnicalAnalysisPayload {
  assetId: string;
  currentPrice: number;
  structureScore: number; // -100 to +100
  structureSummaryFa: string;
  recentBreaks: StructureBreakEvent[];
  keyLevels: SupportResistanceLevel[];
  smcElements: SmcContextualElement[];
  momentum: MomentumTechnicalState;
  elliottAndFib: ElliottWaveScenario;
  synthesizedTechnicalVerdictFa: string;
}
