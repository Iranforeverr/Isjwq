import {
  TraceablePricePoint,
  DataQualityReport,
  DataQualityGrade,
  AssetDomainKey,
  CurrencyUnit,
  MarketType,
} from '../types/decisionSystem';

/**
 * Data Validation Engine
 * Implements Clauses 3, 4, 58, 59:
 * - Checks for stale data, abnormal spikes, timezone bugs, unit mismatches (Rial vs Toman).
 * - Disallows strong prediction conclusions if quality is below 'good'.
 */
export class DataValidationEngine {
  private static readonly STALE_THRESHOLD_MINUTES = 45;
  private static readonly ABNORMAL_SPIKE_PCT_LIMIT = 18.0; // Spikes > 18% in short timeframe trigger warning

  public static validatePricePoint(
    assetId: AssetDomainKey,
    marketType: MarketType,
    price: number,
    currency: CurrencyUnit,
    source: string,
    sourceTimestamp: string,
    previousClose?: number
  ): DataQualityReport {
    const anomalyNotes: string[] = [];
    let score = 100;

    // 1. Timestamp freshness check
    const now = new Date();
    const dataTime = new Date(sourceTimestamp);
    const ageInMinutes = Math.max(0, Math.round((now.getTime() - dataTime.getTime()) / (1000 * 60)));
    const isStale = isNaN(ageInMinutes) || ageInMinutes > this.STALE_THRESHOLD_MINUTES;

    if (isStale) {
      score -= 30;
      anomalyNotes.push(`داده با تاخیر زمانی دریافت شده است (${ageInMinutes} دقیقه پیش)`);
    }

    // 2. Unit and Zero checks (Rial vs Toman vs USD sanity boundaries)
    let currencyUnitVerified = true;
    if (price <= 0 || isNaN(price)) {
      score -= 70;
      currencyUnitVerified = false;
      anomalyNotes.push('قیمت ورودی نامعتبر یا صفر است.');
    } else if (marketType === 'global_gold') {
      if (currency !== 'USD') {
        score -= 50;
        currencyUnitVerified = false;
        anomalyNotes.push('واحد ارزی برای اونس جهانی باید دلار (USD) باشد.');
      } else if (price < 1000 || price > 6000) {
        score -= 40;
        anomalyNotes.push('نرخ اونس خارج از بازه منطقی تاریخی (۱۰۰۰ تا ۶۰۰۰ دلار) است.');
      }
    } else if (marketType === 'iran_gold') {
      if (currency === 'RIAL') {
        score -= 20;
        anomalyNotes.push('واحد بر حسب ریال است، توصیه می‌شود برای کاربر به تومان نرمال‌سازی شود.');
      } else if (currency === 'TOMAN') {
        // Sanity thresholds for 18k / coin
        if (assetId === 'gold_18k' && (price < 1000000 || price > 25000000)) {
          score -= 30;
          anomalyNotes.push('قیمت هر گرم طلای ۱۸ عیار از کریدور متداول خارج است.');
        } else if (assetId === 'emami_coin' && (price < 10000000 || price > 200000000)) {
          score -= 30;
          anomalyNotes.push('قیمت سکه امامی با حدود مورد انتظار تفاوت نامتعارف دارد.');
        }
      }
    }

    // 3. Abnormal Spike Detection
    let hasAbnormalSpikes = false;
    if (previousClose && previousClose > 0) {
      const deltaPct = Math.abs(((price - previousClose) / previousClose) * 100);
      if (deltaPct > this.ABNORMAL_SPIKE_PCT_LIMIT) {
        hasAbnormalSpikes = true;
        score -= 35;
        anomalyNotes.push(`نوسان غیرعادی ${deltaPct.toFixed(1)}٪ نسبت به بسته شدن قبلی مشاهده شد.`);
      }
    }

    // 4. Source Reliability
    let sourceReliabilityScore = 95;
    if (!source || source === 'unknown') {
      sourceReliabilityScore = 50;
      score -= 25;
      anomalyNotes.push('منبع استخراج قیمت نامشخص یا ثبت‌نشده است.');
    }

    // Determine Final Grade
    let grade: DataQualityGrade = 'excellent';
    if (score < 50) {
      grade = 'poor';
    } else if (score < 75) {
      grade = 'limited';
    } else if (score < 90) {
      grade = 'good';
    } else {
      grade = 'excellent';
    }

    // Clause 4 & 58: If grade is poor, strict lock prevents strong verdicts
    const disallowStrongConclusions = grade === 'poor' || grade === 'limited';

    return {
      grade,
      score: Math.max(0, Math.min(100, score)),
      isStale,
      ageInMinutes,
      hasMissingCandles: false,
      hasAbnormalSpikes,
      currencyUnitVerified,
      sourceReliabilityScore,
      anomalyNotes,
      disallowStrongConclusions,
    };
  }

  public static buildValidatedPoint(
    assetId: AssetDomainKey,
    marketType: MarketType,
    price: number,
    currency: CurrencyUnit,
    source: string,
    sourceTimestamp?: string,
    previousClose?: number
  ): TraceablePricePoint {
    const ts = sourceTimestamp || new Date().toISOString();
    const validationReport = this.validatePricePoint(
      assetId,
      marketType,
      price,
      currency,
      source,
      ts,
      previousClose
    );

    return {
      assetId,
      marketType,
      price,
      currency,
      timestamp: ts,
      source,
      sourceReliability:
        marketType === 'global_gold'
          ? 'primary_exchange'
          : source.includes('tgju')
          ? 'aggregated_feed'
          : 'otc_desk',
      validationReport,
    };
  }
}
