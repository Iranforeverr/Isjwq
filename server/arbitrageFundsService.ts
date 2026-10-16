export interface CoinIntrinsicBubbleData {
  id: string;
  name: string;
  weightGrams: number;
  karat: number; // e.g. 21.6 for coins (900/1000) or 18 (750/1000)
  marketPrice: number;
  intrinsicValue: number;
  bubbleToman: number;
  bubblePercent: number;
  riskStatus: 'حباب خطرناک (هشدار اصلاح)' | 'حباب متوسط' | 'حباب کم و منطقی' | 'زیر ارزش ذاتی (فرصت خرید طلایی)';
  mintingFeeEstimate: number;
}

export interface GoldFundTSETMC {
  symbol: string;
  name: string;
  manager: string;
  currentPrice: number;
  nav: number;
  pNavRatio: number;
  bubblePercent: number;
  volumeDailyBillion: number;
  weeklyReturn: number;
  monthlyReturn: number;
  portfolioAssetMix: {
    goldBars: number; // e.g., 75%
    coinCertificates: number; // e.g., 20%
    cashAndFix: number; // e.g., 5%
  };
  arbitrageSignal: 'فرصت خرید زیر NAV (تخفیف)' | 'معامله در ارزش منصفانه' | 'دارای حباب مثبت (صبر کنید)';
}

export interface TriangularArbitrageRadar {
  ounceUSD: number;
  usdtToman: number;
  dirhamRate: number;
  meltedGoldMithqal: number;
  implicitGoldDollar: number;
  freeMarketDollar: number;
  dollarGapPercent: number;
  arbitrageDirection: 'خرید طلا و فروش دلار (طلا جامانده است)' | 'فروش طلا و خرید دلار (طلا گران‌تر از دلار)' | 'تعادل کامل بین‌بازاری';
  recommendationFa: string;
}

export interface ArbitrageFundsPayload {
  assetId: string;
  currentPrice: number;
  isUSD: boolean;
  coinsMatrix: CoinIntrinsicBubbleData[];
  goldFunds: GoldFundTSETMC[];
  triangularArbitrage: TriangularArbitrageRadar;
  lastUpdated: string;
}

export function getArbitrageFundsAnalysis(
  assetId: string = 'xau_usd',
  currentPrice: number = 2748.5,
  isUSD: boolean = true,
  liveOunce: number = 2748.5,
  liveDollar: number = 68500
): ArbitrageFundsPayload {
  const ounce = liveOunce || 2748.5;
  const dollar = liveDollar || 68500;
  const gram18kIntrinsic = Math.round(((ounce * dollar) / 31.1035) * (750 / 999.9));
  const gram24kIntrinsic = Math.round((ounce * dollar) / 31.1035);

  // Coins Matrix (Intrinsic value calculation: (Ounce * Dollar / 31.1035) * (900/1000) * Weight + MintingFee)
  // Emami: 8.133g, Bahar: 8.133g, Half: 4.066g, Quarter: 2.033g, Gram Coin: 1.01g
  const calculateCoin = (
    id: string,
    name: string,
    weight: number,
    marketPrice: number,
    mintFee: number = 100000
  ): CoinIntrinsicBubbleData => {
    const rawGoldValue = Math.round(((ounce * dollar) / 31.1035) * (900 / 1000) * weight);
    const intrinsic = rawGoldValue + mintFee;
    const bubbleToman = Math.max(0, marketPrice - intrinsic);
    const bubblePercent = Number(((bubbleToman / marketPrice) * 100).toFixed(1));

    let riskStatus: CoinIntrinsicBubbleData['riskStatus'] = 'حباب کم و منطقی';
    if (bubblePercent > 35) riskStatus = 'حباب خطرناک (هشدار اصلاح)';
    else if (bubblePercent > 18) riskStatus = 'حباب متوسط';
    else if (bubblePercent <= 5) riskStatus = 'زیر ارزش ذاتی (فرصت خرید طلایی)';

    return {
      id,
      name,
      weightGrams: weight,
      karat: 21.6,
      marketPrice,
      intrinsicValue: intrinsic,
      bubbleToman,
      bubblePercent,
      riskStatus,
      mintingFeeEstimate: mintFee,
    };
  };

  const coinsMatrix: CoinIntrinsicBubbleData[] = [
    calculateCoin('emami_coin', 'سکه تمام طرح جدید (امامی)', 8.133, 51800000, 150000),
    calculateCoin('bahar_coin', 'سکه تمام بهار آزادی (طرح قدیم)', 8.133, 46500000, 100000),
    calculateCoin('half_coin', 'نیم سکه بهار آزادی', 4.066, 27600000, 80000),
    calculateCoin('quarter_coin', 'ربع سکه بهار آزادی', 2.033, 17850000, 50000),
    calculateCoin('gram_coin', 'سکه یک گرمی بانک مرکزی', 1.01, 8400000, 40000),
  ];

  // TSETMC Gold ETFs
  const goldFunds: GoldFundTSETMC[] = [
    {
      symbol: 'طلا (TALA)',
      name: 'صندوق پشتوانه طلای لوتوس',
      manager: 'تأمین سرمایه لوتوس پارسیان',
      currentPrice: 38200,
      nav: 38450,
      pNavRatio: 0.993,
      bubblePercent: -0.7, // Trading at 0.7% discount!
      volumeDailyBillion: 185,
      weeklyReturn: 4.8,
      monthlyReturn: 12.4,
      portfolioAssetMix: { goldBars: 80, coinCertificates: 15, cashAndFix: 5 },
      arbitrageSignal: 'فرصت خرید زیر NAV (تخفیف)',
    },
    {
      symbol: 'عیار (AYAR)',
      name: 'صندوق طلای عیار مفید',
      manager: 'کارگزاری مفید',
      currentPrice: 22100,
      nav: 22050,
      pNavRatio: 1.002,
      bubblePercent: 0.2,
      volumeDailyBillion: 240,
      weeklyReturn: 5.1,
      monthlyReturn: 13.0,
      portfolioAssetMix: { goldBars: 85, coinCertificates: 10, cashAndFix: 5 },
      arbitrageSignal: 'معامله در ارزش منصفانه',
    },
    {
      symbol: 'کهربا (KAHROBA)',
      name: 'صندوق طلای کهربا کاریزما',
      manager: 'گروه مالی کاریزما',
      currentPrice: 41500,
      nav: 41200,
      pNavRatio: 1.007,
      bubblePercent: 0.7,
      volumeDailyBillion: 120,
      weeklyReturn: 4.6,
      monthlyReturn: 11.9,
      portfolioAssetMix: { goldBars: 90, coinCertificates: 5, cashAndFix: 5 },
      arbitrageSignal: 'معامله در ارزش منصفانه',
    },
    {
      symbol: 'زرفام (ZARFAM)',
      name: 'صندوق طلای زرفام آشنا',
      manager: 'سهم آشنا',
      currentPrice: 19800,
      nav: 20100,
      pNavRatio: 0.985,
      bubblePercent: -1.5,
      volumeDailyBillion: 65,
      weeklyReturn: 4.2,
      monthlyReturn: 11.2,
      portfolioAssetMix: { goldBars: 70, coinCertificates: 25, cashAndFix: 5 },
      arbitrageSignal: 'فرصت خرید زیر NAV (تخفیف)',
    },
    {
      symbol: 'گوهر (GOHAR)',
      name: 'صندوق طلای گوهر کیان',
      manager: 'گروه مالی کیان',
      currentPrice: 34100,
      nav: 33900,
      pNavRatio: 1.005,
      bubblePercent: 0.5,
      volumeDailyBillion: 90,
      weeklyReturn: 4.9,
      monthlyReturn: 12.1,
      portfolioAssetMix: { goldBars: 75, coinCertificates: 20, cashAndFix: 5 },
      arbitrageSignal: 'معامله در ارزش منصفانه',
    },
  ];

  // Triangular Arbitrage & Implicit Dollar
  const meltedMithqal = 18850000; // 1 mithqal 17k
  const gram18kMarket = 4350000;
  // Implicit dollar = (Gram 18k Market / ((Ounce / 31.1035) * 0.75))
  const implicitGoldDollar = Math.round(gram18kMarket / ((ounce / 31.1035) * (750 / 999.9)));
  const dollarGap = implicitGoldDollar - dollar;
  const dollarGapPercent = Number(((dollarGap / dollar) * 100).toFixed(2));

  let arbitrageDir: TriangularArbitrageRadar['arbitrageDirection'] = 'تعادل کامل بین‌بازاری';
  let recFa = 'قیمت طلای بازار تهران با نرخ دلار آزاد در هماهنگی کامل است.';

  if (dollarGapPercent < -1.5) {
    arbitrageDir = 'خرید طلا و فروش دلار (طلا جامانده است)';
    recFa = `دلار ضمنی طلا (${implicitGoldDollar.toLocaleString()} تومان) ارزان‌تر از دلار بازار آزاد (${dollar.toLocaleString()} تومان) است. خرید طلا بازدهی بیشتری نسبت به دلار ایجاد خواهد کرد.`;
  } else if (dollarGapPercent > 1.5) {
    arbitrageDir = 'فروش طلا و خرید دلار (طلا گران‌تر از دلار)';
    recFa = `طلا با احتساب انس جهانی دارای حباب مثبت نسبت به دلار آزاد است. اولویت خرید با دلار یا صندوق‌های دارای تخفیف است.`;
  }

  const triangularArbitrage: TriangularArbitrageRadar = {
    ounceUSD: ounce,
    usdtToman: dollar,
    dirhamRate: Math.round(dollar / 3.67),
    meltedGoldMithqal: meltedMithqal,
    implicitGoldDollar,
    freeMarketDollar: dollar,
    dollarGapPercent,
    arbitrageDirection: arbitrageDir,
    recommendationFa: recFa,
  };

  return {
    assetId,
    currentPrice,
    isUSD,
    coinsMatrix,
    goldFunds,
    triangularArbitrage,
    lastUpdated: new Date().toISOString(),
  };
}
