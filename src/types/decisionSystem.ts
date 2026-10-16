/**
 * Gold Decision Intelligence System (GDIS)
 * Core Domain Types & Data Contracts
 * Compliant with Phase 1 Architecture (Clauses 1, 2, 3, 4, 58, 59)
 */

export type MarketType = 'global_gold' | 'iran_gold';

export type GlobalGoldAssetKey = 'xau_usd' | 'xau_eur' | 'gold_futures';

export type IranGoldAssetKey =
  | 'gold_18k'
  | 'gold_melted'
  | 'gold_mithqal'
  | 'emami_coin'
  | 'bahar_coin'
  | 'half_coin'
  | 'quarter_coin'
  | 'gerami_coin';

export type AssetDomainKey = GlobalGoldAssetKey | IranGoldAssetKey;

export type CurrencyUnit = 'USD' | 'TOMAN' | 'RIAL';

export type TimeframePeriod = '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export type DataQualityGrade = 'excellent' | 'good' | 'limited' | 'poor';

export interface DataQualityReport {
  grade: DataQualityGrade;
  score: number; // 0 to 100
  isStale: boolean;
  ageInMinutes: number;
  hasMissingCandles: boolean;
  hasAbnormalSpikes: boolean;
  currencyUnitVerified: boolean;
  sourceReliabilityScore: number;
  anomalyNotes: string[];
  disallowStrongConclusions: boolean; // if grade is poor/limited, strict rule says no strong verdicts
}

export interface TraceablePricePoint {
  assetId: AssetDomainKey;
  marketType: MarketType;
  price: number;
  currency: CurrencyUnit;
  timestamp: string;
  source: string;
  sourceReliability: 'primary_exchange' | 'central_bank' | 'aggregated_feed' | 'otc_desk';
  high24h?: number;
  low24h?: number;
  change24h?: number;
  change24hPercent?: number;
  validationReport: DataQualityReport;
}

export interface OHLCVItem {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IntermarketDataFeed {
  dxy: { price: number; change24hPercent: number; quality: DataQualityGrade; timestamp: string };
  us10y: { yieldRate: number; change24hPercent: number; quality: DataQualityGrade; timestamp: string };
  us2y: { yieldRate: number; quality: DataQualityGrade; timestamp: string };
  realYieldUS: { yieldRate: number; quality: DataQualityGrade; timestamp: string };
  silverUSD: { price: number; change24hPercent: number; quality: DataQualityGrade; timestamp: string };
  wtiOil: { price: number; quality: DataQualityGrade; timestamp: string };
  vix: { score: number; quality: DataQualityGrade; timestamp: string };
  sp500: { price: number; quality: DataQualityGrade; timestamp: string };
  usdIrrFree: { priceToman: number; change24hPercent: number; quality: DataQualityGrade; timestamp: string };
  usdtIrr: { priceToman: number; quality: DataQualityGrade; timestamp: string };
}

export interface MacroIndicatorState {
  id: string;
  titleFa: string;
  titleEn: string;
  category: 'fed_rates' | 'inflation' | 'employment' | 'central_banks' | 'geopolitical';
  currentValue: string;
  previousValue: string;
  forecastValue: string;
  releaseDate: string;
  goldImpactDirection: 'bullish' | 'bearish' | 'neutral' | 'unclear';
  impactMagnitude: 'high' | 'medium' | 'low';
  sourceName: string;
  dataQuality: DataQualityGrade;
}
