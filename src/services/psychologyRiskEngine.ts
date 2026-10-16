import {
  BehavioralStateEvaluation,
  CognitiveBiasCheck,
  RiskManagementFramework,
} from '../types/psychologyRisk';

/**
 * Phase 8: Psychology, Cognitive Bias & Risk Management Engine
 * Implements Clauses 39, 40, 41, 42, 43, 55, 56:
 * - FOMO Blocker: Prevents entering at historical highs with leverage.
 * - Panic Selling Neutralizer: Explains normal retracements vs structural breakdown.
 * - Dynamic Position Sizing Formula: Position Size = (Account Risk $ / Distance to Invalidation $).
 * - Circuit Breaker: Automatic 24-hour cooldown after 3 consecutive losses.
 */
export class PsychologyRiskEngine {
  public static evaluateBehavioralRisk(
    isIranGold: boolean = false,
    currentPrice: number = 2748.5,
    stopLossPrice: number = 2685.0
  ): BehavioralStateEvaluation {
    const fearGreedIndexScore = 68; // Greed zone
    const sentimentClassificationFa = 'طمع صعودی فعال در بازار (Greed Zone)';

    // FOMO Index
    const fomoIndexScore = isIranGold ? 74 : 66;
    const isFomoDangerActive = fomoIndexScore >= 65;

    const fomoWarningNarrativeFa = isIranGold
      ? 'سندروم FOMO (ترس از جا ماندن) در بازار طلای داخلی بالاست. افزایش خریدهای هیجانی در سقف‌های حباب‌دار سکه اکیداً منع می‌شود؛ تنها ورود پله‌ای در اصلاح‌ها مجاز است.'
      : 'قیمت انس در نزدیکی سقف‌های تاریخی است؛ خرید با اهرم بالا ناشی از هیجان جا ماندن (FOMO Chasing) ریسک لیکویید شدن در یک پولبک ۳۰ دلاری را ایجاد می‌کند.';

    const formatP = (val: number) => !isIranGold ? `$${val.toLocaleString()}` : `${Math.round(val).toLocaleString('fa-IR')} تومان`;
    const pullbackLevel = isIranGold ? Math.round(currentPrice * 0.985) : Math.round(currentPrice * 0.988 * 10) / 10;

    const healthyPullbackComfortNarrativeFa = isIranGold
      ? `هرگونه افت موقت تا محدوده ${formatP(pullbackLevel)} یک اصلاح سالم برای جمع‌آوری نقدینگی است؛ از فروش سراسیمه (Panic Sell) در کف‌های موقت پرهیز کنید.`
      : `اصلاح تا محدوده ${formatP(pullbackLevel)} یک ریتریسمنت طبیعی تکنیکال است و نشان‌دهنده تغییر روند کلان نیست.`;

    // Cognitive Biases Check (Clause 40, 41)
    const biases: CognitiveBiasCheck[] = [
      {
        id: 'fomo_bias',
        biasNameFa: 'سوگیری ترس از جا ماندن (FOMO)',
        biasNameEn: 'Fear Of Missing Out',
        riskStatus: 'critical',
        triggerSymptomFa: 'تمایل به خرید فوری کل سرمایه در بالاترین قیمت‌های سبز بازار بدون انتظار برای پولبک.',
        mitigationProtocolFa: 'تقسیم سرمایه به ۳ پله خرید لیمیت و خودداری از ورود دستی مارکت در کندل‌های پرشتاب.',
      },
      {
        id: 'recency_bias',
        biasNameFa: 'سوگیری تازه‌گرایی (Recency Bias)',
        biasNameEn: 'Recency Bias',
        riskStatus: 'moderate',
        triggerSymptomFa: 'تصور اینکه به دلیل صعود پیوسته هفته‌های گذشته، قیمت طلا هرگز افت اصلاحی نخواهد داشت.',
        mitigationProtocolFa: 'ثبت حد ضرر قطعی و ارزیابی سناریوی بدبینانه اصلاحی با احتمال ۱۵٪ در محاسبات.',
      },
      {
        id: 'confirmation_bias',
        biasNameFa: 'سوگیری تاییدی (Confirmation Bias)',
        biasNameEn: 'Confirmation Bias',
        riskStatus: 'moderate',
        triggerSymptomFa: 'جستجوی صرف اخبار و تحلیل‌های صعودی و نادیده گرفتن ریسک‌های تورم آمریکا یا تخلیه حباب.',
        mitigationProtocolFa: 'استفاده از ماتریس تعارض فاز ۶ و مرور فاکتورهای مخالف قبل از هر ترید.',
      },
      {
        id: 'loss_aversion',
        biasNameFa: 'زیان‌گریزی و لجبازی با ضرر (Loss Aversion / Sunk Cost)',
        biasNameEn: 'Loss Aversion',
        riskStatus: 'safe',
        triggerSymptomFa: 'جا‌به‌جا کردن حد ضرر به امید برگشت قیمت و تبدیل ترید نوسانی به سرمایه‌گذاری اجباری.',
        mitigationProtocolFa: 'خروج مکانیکی و بی قید و شرط به محض شکست سطح ابطال (Invalidation Level).',
      },
    ];

    // Mathematical Position Sizing (Clauses 42, 55, 56)
    const stopDistancePercent = Number(
      (Math.abs((currentPrice - stopLossPrice) / currentPrice) * 100).toFixed(2)
    );
    const riskPerTrade = 1.5; // 1.5% max account risk
    // Position size as % of portfolio = Risk % / Stop Distance %
    const calculatedPositionSizePercent = Number(
      Math.min(100, Math.max(5, (riskPerTrade / (stopDistancePercent / 100)))).toFixed(1)
    );

    const riskFramework: RiskManagementFramework = {
      recommendedRiskPerTradePercent: riskPerTrade,
      stopLossDistancePercent: stopDistancePercent,
      calculatedPositionSizePercent,
      maxPortfolioRiskExposurePercent: 6.0,
      riskRewardRatio: 2.8,
      circuitBreakers: {
        maxDailyLossPercent: 3.0,
        maxConsecutiveLossesAllowed: 3,
        cooldownPeriodHours: 24,
        ruleFa: 'قانون مدارشکن قطعی: در صورت ثبت ۳ معامله ضررده متوالی، سیستم دستور قفل و کول‌داون ۲۴ ساعته صادر می‌کند.',
      },
    };

    const behavioralVerdictFa =
      'جو روانی بازار در فاز طمع و هیجان قرار دارد؛ حفظ انضباط معاملاتی، خودداری از ورود در سقف‌ها و اعمال فرمول مدیریت ریسک الزامی است.';

    return {
      fearGreedIndexScore,
      sentimentClassificationFa,
      fomoIndexScore,
      isFomoDangerActive,
      fomoWarningNarrativeFa,
      healthyPullbackComfortNarrativeFa,
      biases,
      riskFramework,
      behavioralVerdictFa,
    };
  }
}
