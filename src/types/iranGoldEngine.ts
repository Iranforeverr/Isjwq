/**
 * Phase 2: Iran Gold Engine Types & Contracts
 * Implements Clauses 24, 25, 26, 27, 28:
 * - Theoretical Pricing: (XAU / 31.1034768) * USD * 0.75
 * - Domestic Premium / Discount Calculation
 * - Price Decomposition: Gold Move Attribution (XAU effect vs USD effect vs Premium effect)
 * - Fair Value Range and Deviation / Extension detection
 */

export interface TheoreticalGoldCalculation {
  assetId: string;
  assetNameFa: string;
  marketPriceToman: number;
  theoreticalValueToman: number;
  bubbleOrPremiumToman: number;
  bubbleOrPremiumPercent: number;
  valuationStatus: 'under_fair_value' | 'fair_value' | 'slightly_extended' | 'highly_extended_bubble';
  valuationStatusFa: string;
  fairValueRange: {
    minToman: number;
    maxToman: number;
  };
  mintingFeeEstimateToman?: number;
}

export interface PriceDecompositionAttribution {
  assetName: string;
  totalChangePercent: number;
  driversContribution: {
    globalOunceEffectPercent: number; // e.g. 25% of the move
    usdExchangeRateEffectPercent: number; // e.g. 65% of the move
    domesticPremiumEffectPercent: number; // e.g. 10% of the move
  };
  primaryDriverFa: string;
  analysisConclusionFa: string;
}

export interface UsdIrrEngineState {
  currentUsdRateToman: number;
  currentUsdtRateToman: number;
  usdtPremiumToman: number;
  trendDirection: 'strong_uptrend' | 'uptrend' | 'range' | 'downtrend';
  supportLevelsToman: number[];
  resistanceLevelsToman: number[];
  volatilityStatus: 'high' | 'normal' | 'low';
  attributionTextFa: string;
}

export interface IranGoldEngineFullPayload {
  ouncePriceUsd: number;
  usdRateToman: number;
  calculatedAt: string;
  gold18k: TheoreticalGoldCalculation;
  goldMithqal: TheoreticalGoldCalculation;
  emamiCoin: TheoreticalGoldCalculation;
  halfCoin: TheoreticalGoldCalculation;
  quarterCoin: TheoreticalGoldCalculation;
  attributionAnalysis: PriceDecompositionAttribution;
  usdEngine: UsdIrrEngineState;
}
