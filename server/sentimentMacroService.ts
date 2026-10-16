export interface MacroEconomicNewsItem {
  id: string;
  title: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'IRR';
  impact: 'high_red' | 'medium_orange' | 'low_yellow';
  timeTehran: string;
  date: string;
  forecast: string;
  previous: string;
  actual?: string;
  impactOnGoldFa: string;
  actionGuideFa: string;
  status: 'upcoming' | 'released';
}

export interface TradeJournalEntry {
  id: string;
  date: string;
  asset: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  pnlTomanOrDollar: number;
  pnlPercent: number;
  strategyUsed: string;
  emotionsTag: 'منطقی و طبق پلن' | 'طمع و ورود زودهنگام' | 'ترس از جا ماندن (FOMO)' | 'انتقام از بازار';
  lessonsLearnedFa: string;
}

export interface PortfolioRiskAudit {
  riskScore: number; // 0 to 100 (Safe to Dangerous)
  riskCategory: 'بسیار ایمن و حرفه‌ای' | 'ریسک متعادل و کنترل‌شده' | 'ریسک خطرناک (Over-leverage)';
  maxDrawdownTolerance: string;
  diversificationRatio: {
    physicalGold: number; // e.g., 40%
    goldFundsTSETMC: number; // e.g., 30%
    scalpForexGold: number; // e.g., 20%
    cashLiquidity: number; // e.g., 10%
  };
  stressTestScenarios: Array<{
    scenarioName: string;
    impactDescriptionFa: string;
    estimatedPortfolioImpact: string;
    hedgingSolutionFa: string;
  }>;
  aiRiskRecommendations: string[];
}

export interface SentimentMacroPayload {
  assetId: string;
  currentPrice: number;
  isUSD: boolean;
  fearAndGreedIndex: {
    score: number; // 0 to 100
    status: 'Extreme Fear (ترس شدید - زمان خرید)' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed (طمع شدید - ریسک اصلاح)';
    goldSpecificSentiment: string;
  };
  upcomingRedNews: MacroEconomicNewsItem[];
  portfolioAudit: PortfolioRiskAudit;
  sampleJournalEntries: TradeJournalEntry[];
  lastUpdated: string;
}

export function getSentimentMacroAnalysis(
  assetId: string = 'xau_usd',
  currentPrice: number = 2748.5,
  isUSD: boolean = true
): SentimentMacroPayload {
  const p = currentPrice || (isUSD ? 2748.5 : 4350000);

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 5 is Friday
  const dateStr = now.toLocaleDateString('fa-IR');

  const upcomingRedNews: MacroEconomicNewsItem[] = [
    {
      id: 'news-1',
      title: 'US CPI m/m & y/y (شاخص تورم مصرف‌کننده آمریکا)',
      currency: 'USD',
      impact: 'high_red',
      timeTehran: '۱۶:۰۰ به وقت تهران',
      date: 'هفته جاری',
      forecast: '2.8%',
      previous: '2.9%',
      impactOnGoldFa: 'کاهش تورم = تضعیف شاخص دلار (DXY) و صعود تقاضای انس طلا به سمت مقاومت‌ها.',
      actionGuideFa: '۱۵ دقیقه قبل و بعد از انتشار این خبر، از ورود با اهرم بالا پرهیز و حد ضرر را کنترل کنید.',
      status: 'upcoming',
    },
    {
      id: 'news-2',
      title: 'FOMC Interest Rate Decision (تصمیم نرخ بهره فدرال‌رزرو)',
      currency: 'USD',
      impact: 'high_red',
      timeTehran: '۲۱:۳۰ به وقت تهران',
      date: 'چهارشنبه کاری',
      forecast: '4.75%',
      previous: '5.00%',
      impactOnGoldFa: 'سیاست کاهش نرخ بهره و بیانیه انبساطی، محرک میان‌مدت انس جهانی طلاست.',
      actionGuideFa: 'در زمان کنفرانس خبری مراقب نوسانات سریع دوطرفه باشید.',
      status: 'upcoming',
    },
    {
      id: 'news-3',
      title: 'حراج شمش و سکه در مرکز مبادله ارز و طلای ایران',
      currency: 'IRR',
      impact: 'medium_orange',
      timeTehran: '۱۲:۰۰ الی ۱۶:۰۰ تهران',
      date: 'روزهای کاری یکشنبه و سه‌شنبه',
      forecast: 'عرضه مداوم شمش',
      previous: 'فروش با نرخ تعادلی',
      impactOnGoldFa: 'افزایش حجم عرضه فیزیکی در حراجی‌ها موجب تعدیل حباب سکه و کنترل هیجانات کاذب می‌شود.',
      actionGuideFa: 'در روزهای حراج، خریدهای پله‌ای را با مقایسه حباب سکه با طلای خام انجام دهید.',
      status: 'upcoming',
    },
    {
      id: 'news-4',
      title: 'US Non-Farm Payrolls (گزارش اشتغال بخش غیرکشاورزی NFP)',
      currency: 'USD',
      impact: 'high_red',
      timeTehran: '۱۶:۰۰ جمعه کاری',
      date: 'جمعه اول ماه میلادی',
      forecast: '142K',
      previous: '114K',
      impactOnGoldFa: 'کاهش اشتغال نشان‌دهنده خنک شدن اقتصاد و تقویت احتمال کاهش سریع‌تر نرخ بهره است.',
      actionGuideFa: 'پوزیشن‌های نوسانی کوتاه‌مدت پیش از خبر بسته یا ریسک‌فری شوند.',
      status: 'upcoming',
    },
  ];

  const portfolioAudit: PortfolioRiskAudit = {
    riskScore: 32, // Safe
    riskCategory: 'ریسک متعادل و کنترل‌شده',
    maxDrawdownTolerance: '۴.۵٪ در کل پرتفوی',
    diversificationRatio: {
      physicalGold: 45,
      goldFundsTSETMC: 25,
      scalpForexGold: 15,
      cashLiquidity: 15,
    },
    stressTestScenarios: [
      {
        scenarioName: 'ریزش ناگهانی ۵۰ دلاری انس به دلیل توافق صلح خاورمیانه',
        impactDescriptionFa: 'تخلیه حباب سکه و اصلاح کوتاه‌مدت طلای داخلی، اما اثر تورم ریالی کف قیمت را حفظ می‌کند.',
        estimatedPortfolioImpact: '-۲.۸٪ کاهش ارزش موقت',
        hedgingSolutionFa: 'خرید پله‌ای در محدوده تقاضای فیبوناچی ۶۱.۸٪ و نگهداری نقدینگی ۱۵٪ برای میانگین کم کردن.',
      },
      {
        scenarioName: 'جهش نرخ ارز آزاد و شوک تورمی داخلی',
        impactDescriptionFa: 'رشد سریع قیمت سکه امامی و صندوق‌های طلا با سرعت ۲ برابری نسبت به طلای خام.',
        estimatedPortfolioImpact: '+۱۴.۲٪ رشد بازدهی سبد',
        hedgingSolutionFa: 'انتقال بخشی از نقدینگی ریالی به صندوق‌های طلا (طلا، عیار، کهربا) در ساعات اولیه بازار.',
      },
    ],
    aiRiskRecommendations: [
      'حجم معاملات اهرم‌دار (Forex Scalping) هرگز نباید بیش از ۱۵٪ کل سرمایه شما باشد.',
      'همیشه حداقل ۱۵٪ نقدینگی ریالی یا تتر نقد برای شکار فرصت‌های طلایی در اصلاح‌های شارپ نگه دارید.',
      'صندوق‌های طلای بورس ایران به دلیل معافیت مالیاتی و نقدشوندگی ثانیه‌ای، بهترین جایگزین طلای فیزیکی پرریسک هستند.',
    ],
  };

  const sampleJournalEntries: TradeJournalEntry[] = [
    {
      id: 'j-1',
      date: 'امروز - سشن نیویورک',
      asset: isUSD ? 'XAU/USD (Gold Spot)' : 'صندوق طلای کهربا',
      type: 'LONG',
      entryPrice: isUSD ? Math.round((p * 0.994) * 10) / 10 : Math.round(p * 0.993),
      exitPrice: isUSD ? Math.round((p * 1.006) * 10) / 10 : Math.round(p * 1.008),
      pnlTomanOrDollar: isUSD ? 360 : 4200000,
      pnlPercent: isUSD ? 3.6 : 3.8,
      strategyUsed: 'ICT Order Block + FVG Rebalance',
      emotionsTag: 'منطقی و طبق پلن',
      lessonsLearnedFa: 'صبر برای تاچ شدن سطح دقیق ۰.۷۰۵ فیبوناچی باعث ورود بدون استرس و کسب حداکثر ریوارد شد.',
    },
    {
      id: 'j-2',
      date: 'دیروز - سشن لندن',
      asset: isUSD ? 'XAU/USD' : 'سکه تمام طرح جدید',
      type: 'LONG',
      entryPrice: isUSD ? Math.round((p * 0.985) * 10) / 10 : Math.round(p * 0.98),
      exitPrice: isUSD ? Math.round((p * 0.998) * 10) / 10 : Math.round(p * 0.995),
      pnlTomanOrDollar: isUSD ? 290 : 3100000,
      pnlPercent: isUSD ? 2.9 : 3.1,
      strategyUsed: 'Asian Range Breakout & Judas Sweep',
      emotionsTag: 'منطقی و طبق پلن',
      lessonsLearnedFa: 'اجتناب از ورود در اولین شکست دروغین و ورود در پولبک تاییدیه، سود عالی به همراه داشت.',
    },
  ];

  return {
    assetId,
    currentPrice: p,
    isUSD,
    fearAndGreedIndex: {
      score: 68,
      status: 'Greed',
      goldSpecificSentiment: 'تمایل خریداران نهادی و بانک‌های مرکزی جهانی در بالاترین سطح ۶ ماه گذشته قرار دارد.',
    },
    upcomingRedNews,
    portfolioAudit,
    sampleJournalEntries,
    lastUpdated: new Date().toISOString(),
  };
}
