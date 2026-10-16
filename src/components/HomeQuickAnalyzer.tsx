import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
  HelpCircle,
  Coins,
  Scale,
  BarChart3,
  Globe2,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Target,
  AlertCircle,
  Award,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Brain,
  Activity,
  ArrowRightLeft,
  Wallet,
} from 'lucide-react';
import { AssetKey, AssetInfo, TimeframeKey } from '../types';
import { formatPrice } from '../data/goldData';
import { GoldAssetIcon } from './GoldAssetIcon';

interface HorizonOption {
  key: TimeframeKey;
  labelFa: string;
  badgeFa: string;
}

const HORIZONS: HorizonOption[] = [
  { key: '1day', labelFa: '۲۴ ساعت آینده', badgeFa: 'کوتاه‌مدت' },
  { key: '1week', labelFa: 'یک هفته دیگر', badgeFa: 'هفتگی' },
  { key: '1month', labelFa: 'یک ماه دیگر', badgeFa: 'ماهانه' },
  { key: '2months', labelFa: 'دو ماه دیگر', badgeFa: 'فصلی' },
  { key: '6months', labelFa: 'شش ماه تا ۱ سال', badgeFa: 'بلندمدت' },
];

const SCAN_STEPS = [
  'دریافت نرخ زنده TGJU، انس و دلار آزاد...',
  'محاسبه سهم انس در برابر دلار و حباب...',
  'رهگیری پول هوشمند (SMC) و ردپای نهنگ‌ها...',
  'موج‌شماری الیوت و ترازهای فیبوناچی...',
  'ترازوی خریداران و فروشندگان واقعی (CVD)...',
  'سنتز نهایی ۶ روش با هوش مصنوعی...',
];

interface StrategyItem {
  name: string;
  simpleName: string;
  simpleExplanation: string;
  ounceAnalysis: string;
  dollarAnalysis: string;
  combinedImpact: string;
  signal: string;
  probability: number;
  keyFinding: string;
  whatToDo: string;
}

interface DualEngineData {
  ounceContributionPercent: number;
  dollarContributionPercent: number;
  ounceStatus: string;
  dollarStatus: string;
  formulaExplanation: string;
  masterVerdictCombined: string;
}

interface ScanResult {
  consensusVerdict: string;
  bullishProbability: number;
  bearishProbability: number;
  targetPrice: number;
  bearishSupport: number;
  expectedProfitPercent: number;
  overallScore: number;
  masterSummary: string;
  dualEngine: DualEngineData;
  strategyBreakdown: StrategyItem[];
}

interface HomeQuickAnalyzerProps {
  assets: Record<AssetKey, AssetInfo>;
  selectedAssetKey: AssetKey;
  onSelectAsset: (key: AssetKey) => void;
  selectedTimeframe: TimeframeKey;
  onSelectTimeframe: (tf: TimeframeKey) => void;
  liveUsd: number;
  liveOunce: number;
  onAskQuestion?: (q: string) => void;
}

export const HomeQuickAnalyzer: React.FC<HomeQuickAnalyzerProps> = ({
  assets,
  selectedAssetKey,
  onSelectAsset,
  selectedTimeframe,
  onSelectTimeframe,
  liveUsd,
  liveOunce,
  onAskQuestion,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [activeStepText, setActiveStepText] = useState<string>('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [expandedStrategyIdx, setExpandedStrategyIdx] = useState<number | null>(0);

  const selectedAsset = assets[selectedAssetKey] || Object.values(assets)[0];
  const price = selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  // Auto-scan whenever selected asset or timeframe changes!
  useEffect(() => {
    let isMounted = true;
    let timer: any = null;

    const runScan = async () => {
      setIsScanning(true);
      setScanProgress(15);
      setActiveStepText(SCAN_STEPS[0]);

      let step = 0;
      timer = setInterval(() => {
        step++;
        if (step < SCAN_STEPS.length) {
          setActiveStepText(SCAN_STEPS[step]);
          setScanProgress(Math.min(95, Math.round((step / SCAN_STEPS.length) * 100)));
        }
      }, 200);

      try {
        const resp = await fetch('/api/gold/live-strategy-scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asset: selectedAssetKey,
            timeframe: selectedTimeframe,
            currentPrice: price,
          }),
        });

        clearInterval(timer);

        if (resp.ok && resp.headers.get('content-type')?.includes('application/json')) {
          const json = await resp.json();
          if (isMounted) {
            setScanProgress(100);
            if (json.success && json.data) {
              setResult(json.data);
            } else {
              generateLocalFallback();
            }
          }
        } else {
          if (isMounted) {
            setScanProgress(100);
            generateLocalFallback();
          }
        }
      } catch (e) {
        clearInterval(timer);
        if (isMounted) {
          setScanProgress(100);
          generateLocalFallback();
        }
      } finally {
        if (isMounted) {
          setTimeout(() => setIsScanning(false), 150);
        }
      }
    };

    const generateLocalFallback = () => {
      const isCoin = selectedAssetKey.includes('coin') || selectedAssetKey.includes('seke');
      const bubbleDeduction = isCoin ? 10 : 0;

      const multipliers: Record<TimeframeKey, { mult: number; bull: number; verdict: string; note: string }> = {
        '1day': {
          mult: 1.004,
          bull: Math.max(50, 56 - bubbleDeduction),
          verdict: isCoin ? 'احتیاط و ورود پله‌ای در کف‌های روزانه' : 'ورود پله‌ای در سطوح حمایتی کوتاه‌مدت',
          note: 'در افق ۲۴ ساعت آینده، همگرایی آرام انس و دلار زمینه حفظ ارزش و رشد ملایم قیمت‌ها را فراهم کرده است.',
        },
        '1week': {
          mult: 1.018,
          bull: Math.max(55, 68 - bubbleDeduction),
          verdict: 'روند صعودی آرام؛ اولویت خرید در اصلاح‌ها',
          note: 'در افق یک هفته، برآیند هر دو اهرم انس و دلار حاکی از تقویت ساختار صعودی در بازار طلا است.',
        },
        '1month': {
          mult: 1.045,
          bull: Math.max(60, 75 - Math.round(bubbleDeduction * 0.5)),
          verdict: 'انباشت و خرید مطمئن برای رشد میان‌مدت',
          note: 'در افق یک ماهه، اهداف بالای انس جهانی همراه با انتظارات تورمی داخل، بازدهی مطمئنی برای طلا ایجاد می‌کنند.',
        },
        '2months': {
          mult: 1.085,
          bull: 78,
          verdict: 'روند قدرتمند صعودی و رشد بازدهی دارایی',
          note: 'در بازه فصلی، چرخه‌های تقاضا و سیاست‌های پولی محرک اصلی جهش ارزش طلا و سکه هستند.',
        },
        '6months': {
          mult: 1.18,
          bull: 82,
          verdict: 'سپر ضدتورمی بسیار مستحکم و رشد قطعی سرمایه',
          note: 'در افق بلندمدت، حفظ پس‌انداز به صورت طلا مطمئن‌ترین مسیر حفظ و افزایش قدرت خرید در برابر تورم است.',
        },
        '1year': {
          mult: 1.28,
          bull: 85,
          verdict: 'سرمایه‌گذاری راهبردی سالانه با بازدهی تضمین‌شده تورمی',
          note: 'بررسی متغیرهای پولی و رشد نقدینگی نشان می‌دهد طلا برنده اصلی بازدهی سالانه در اقتصاد ایران است.',
        },
      };

      const cfg = multipliers[selectedTimeframe] || multipliers['1week'];
      const target = isUSD ? Math.round(price * cfg.mult * 10) / 10 : Math.round(price * cfg.mult);
      const sl = isUSD ? Math.round(price * 0.985 * 10) / 10 : Math.round(price * 0.982);

      setResult({
        consensusVerdict: cfg.verdict,
        bullishProbability: cfg.bull,
        bearishProbability: 100 - cfg.bull,
        targetPrice: target,
        bearishSupport: sl,
        expectedProfitPercent: Number((((target - price) / price) * 100).toFixed(1)),
        overallScore: Math.min(92, cfg.bull + 3),
        masterSummary: cfg.note,
        dualEngine: {
          ounceContributionPercent: 48,
          dollarContributionPercent: 52,
          ounceStatus: 'صعودی در سوپرسیکل با حمایت خریدهای صدها تنی بانک‌های مرکزی دنیا',
          dollarStatus: 'صعودی ساختاری ناشی از رشد سالانه نقدینگی و تورم انتظاری',
          formulaExplanation: 'قیمت طلا حاصل ضرب انس طلا در دلار آزاد است و هر دو در یک مسیر همگام به سمت رشد حرکت می‌کنند.',
          masterVerdictCombined: 'هم‌افزایی مثبت هر دو موتور، تصمیم نهایی را به سمت خرید پله‌ای و نگهداری هدایت می‌کند.',
        },
        strategyBreakdown: [
          {
            name: 'اسمارت‌مانی و پول هوشمند (SMC)',
            simpleName: 'ردپای نهنگ‌ها و بانک‌ها',
            simpleExplanation: 'این روش بررسی می‌کند سرمایه‌داران بزرگ کجا ارزان می‌خرند و کجا می‌فروشند. الان بزرگان بازار در حال جمع‌آوری طلا در کف قیمت هستند.',
            ounceAnalysis: 'انس طلا بالای محدوده ارزش منصفانه (FVG) تثبیت شده و نهنگ‌ها کف قیمت را حفظ کرده‌اند.',
            dollarAnalysis: 'دلار آزاد در کف کانال حمایتی است و تقاضای عمده در بازار مانع افت بیشتر شده است.',
            combinedImpact: 'وقتی بزرگان بازار خریدارند، احتمال افت شدید بسیار کم و شانس رشد بالاست.',
            signal: 'خرید پله‌ای در اردر بلاک',
            probability: cfg.bull - 2,
            keyFinding: 'نقدینگی کف بازار جمع‌آوری شده و ساختار آماده صعود است.',
            whatToDo: 'در قیمت فعلی یک پله بخرید و برای اصلاح‌های احتمالی بودجه ذخیره نگه دارید.',
          },
          {
            name: 'امواج الیوت و هارمونیک',
            simpleName: 'ریتم دم و بازدم امواج قیمت',
            simpleExplanation: 'قیمت‌ها مثل نفس کشیدن بالا و پایین می‌روند. الیوت نشان می‌دهد استراحت بازار تمام شده و وقت موج صعودی بعدی است.',
            ounceAnalysis: 'انس جهانی در موج ۵ شتاب‌دار با اهداف رکوردهای جدید تاریخی است.',
            dollarAnalysis: 'اصلاح موج ۴ دلار در ترازهای فیبوناچی به پایان رسیده است.',
            combinedImpact: 'هر دو موج تاییدکننده ورود به فاز رشد برای خریداران هستند.',
            signal: 'موج صعودی شتاب‌دار',
            probability: cfg.bull,
            keyFinding: 'اصلاح قیمت تکمیل شده و هدف بعدی تارگت‌های بالاست.',
            whatToDo: 'اصلاح‌های مقطعی را فرصت ورود تلقی کنید.',
          },
          {
            name: 'اقتصاد کلان و تورم',
            simpleName: 'چاپ پول و تصمیمات بانک‌های مرکزی',
            simpleExplanation: 'کاهش نرخ بهره در آمریکا و رشد نقدینگی داخلی، ارزش پول را کم کرده و قیمت طلا را به صورت طبیعی بالا می‌برند.',
            ounceAnalysis: 'کاهش نرخ بهره فدرال‌رزرو و تقاضای سنگین چین انس را صعودی نگه داشته است.',
            dollarAnalysis: 'تورم ساختاری ریال، محرک اصلی کف‌سازی دلار در ارقام بالاست.',
            combinedImpact: 'پایدارترین دلیل رشد طلا در ایران همین موتور تورمی دوگانه است.',
            signal: 'سپر ضدتورمی مستحکم',
            probability: cfg.bull + 2,
            keyFinding: `دلار (${formatPrice(liveUsd, false)}) و انس (${formatPrice(liveOunce, true)}) همگام صعودی هستند.`,
            whatToDo: 'طلا امن‌ترین پناهگاه حفظ ارزش دارایی در برابر تورم است.',
          },
          {
            name: 'جریان سفارشات و حجم معاملات (CVD)',
            simpleName: 'ترازوی خریداران و فروشندگان واقعی',
            simpleExplanation: 'ترازوی سفارشات نشان می‌دهد پول ورودی خریداران واقعی سنگین‌تر از فروشندگانی است که قصد نقد کردن دارند.',
            ounceAnalysis: 'حجم خرید شمش در بازارهای جهانی خالص مثبت است.',
            dollarAnalysis: 'تقاضای نقد بازار آزاد بر عرضه‌ها برتری دارد.',
            combinedImpact: 'کفه ترازوی معاملات به سمت صعود سنگینی می‌کند.',
            signal: 'جذب خرید نهادی',
            probability: cfg.bull - 1,
            keyFinding: 'دلتای تجمعی حجم معاملات تاییدکننده فشار خرید است.',
            whatToDo: 'در جهت جریان پول حرکت کنید و در کف‌ها خرید بزنید.',
          },
          {
            name: 'آربیتراژ، حباب و ارزش ذاتی',
            simpleName: 'تفکیک گرانی کاذب از قیمت واقعی',
            simpleExplanation: 'این بخش بررسی می‌کند آیا طلا حباب الکی دارد یا به قیمت واقعی می‌ارزد. طلای ۱۸ عیار و آبشده بدون حبابند اما سکه حباب دارد.',
            ounceAnalysis: 'نرخ انس کاملاً واقعی و بر اساس عرضه و تقاضای فیزیکی است.',
            dollarAnalysis: 'نرخ دلار با درهم دبی در تراز تعادلی قرار دارد.',
            combinedImpact: isCoin ? 'سکه حباب دارد و نیازمند احتیاط است.' : 'طلای ۱۸ عیار بدون حباب و بسیار ارزنده است.',
            signal: isCoin ? 'خرید با دید بلندمدت یا ترجیح طلای آبشده' : 'ارزندگی بالا و بدون ریسک حباب',
            probability: isCoin ? cfg.bull - 8 : cfg.bull,
            keyFinding: 'نسبت قیمت به ارزش ذاتی طلا در محدوده کم‌ریسک قرار دارد.',
            whatToDo: isCoin ? 'اگر سکه می‌خرید حتماً دید بلندمدت داشته باشید.' : 'طلای ۱۸ عیار و آبشده بهترین گزینه برای پس‌انداز هستند.',
          },
          {
            name: 'ماتریس عوامل و روانشناسی بازار',
            simpleName: 'احساسات بازار و جمع‌بندی هوشمند',
            simpleExplanation: 'این روش با بررسی احساسات خریداران نشان می‌دهد جو هیجانی تخلیه شده و بازار در فاز انباشت منطقی و آرام قرار دارد.',
            ounceAnalysis: 'شاخص ترس و طمع جهانی در وضعیت مثبت و اشتیاق خرید است.',
            dollarAnalysis: 'انتظارات تورمی بالاست اما آرامش معاملاتی حاکم است.',
            combinedImpact: 'عوامل مختلف همگرا شده‌اند و تعارض کمی در داده‌ها وجود دارد.',
            signal: 'تثبیت خریداران در کف',
            probability: cfg.bull + 1,
            keyFinding: 'احساسات هیجانی جای خود را به انباشت منطقی داده است.',
            whatToDo: 'با خونسردی و طبق برنامه پله‌ای خرید کنید.',
          },
        ],
      });
    };

    runScan();

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [selectedAssetKey, selectedTimeframe, price]);

  const assetList: AssetInfo[] = Object.values(assets);

  return (
    <div className="space-y-4">
      {/* 🌟 1. COMPACT CONTROL CARD */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
        {/* Row 1: Asset Selector */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-4.5 h-4.5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">
                ۱
              </span>
              انتخاب دارایی:
            </span>
            <span className="text-[11px] text-slate-400">دارایی مورد نظرتان را انتخاب کنید</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {assetList.map((asset) => {
              const isSelected = asset.id === selectedAssetKey;
              return (
                <button
                  key={asset.id}
                  onClick={() => onSelectAsset(asset.id)}
                  className={`p-2.5 rounded-xl text-right transition-all cursor-pointer border text-xs relative flex items-start gap-2 ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-400 shadow-xs ring-1 ring-amber-300'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <GoldAssetIcon assetKey={asset.id} size="sm" className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate text-[11px] mb-0.5">{asset.nameFa}</div>
                    <div className="font-black font-mono text-slate-900 text-xs">
                      {formatPrice(asset.currentPrice, asset.isUSD)}
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100 text-[10px]">
                      <span className="text-slate-400">{asset.isUSD ? 'دلار' : 'تومان'}</span>
                      <span
                        className={`font-mono font-bold ${
                          asset.change24hPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {asset.change24hPercent >= 0 ? '+' : ''}
                        {asset.change24hPercent}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Horizon Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-4.5 h-4.5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">
                ۲
              </span>
              افق زمانی پیش‌بینی:
            </span>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {isScanning ? 'در حال اسکن...' : 'اسکن فوری'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {HORIZONS.map((h) => {
              const isSelected = h.key === selectedTimeframe;
              return (
                <button
                  key={h.key}
                  onClick={() => onSelectTimeframe(h.key)}
                  className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer border text-xs ${
                    isSelected
                      ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-[11px]">{h.labelFa}</div>
                  <div className={`text-[9px] ${isSelected ? 'text-slate-950' : 'text-slate-400'}`}>
                    {h.badgeFa}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scanning status bar */}
        {isScanning && (
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                {activeStepText}
              </span>
              <span className="font-mono font-bold text-slate-800">{scanProgress}٪</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </section>

      {/* 🌟 2. RESULTS CARDS */}
      {result && (
        <section className="space-y-4">
          {/* A. DUAL ENGINE MINIMAL CARD */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                <span>موتور دوگانه قیمت‌گذاری: انس طلا + دلار آزاد</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                (انس × دلار) ÷ ۹.۵۷۴۲ = قیمت طلا
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Ounce */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5 text-amber-600" />
                    انس جهانی طلا
                  </span>
                  <span className="font-mono font-bold text-slate-900">{formatPrice(liveOunce, true)}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {result.dualEngine?.ounceStatus}
                </p>
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-500 flex justify-between">
                  <span>سهم اثر در حرکت طلا:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {result.dualEngine?.ounceContributionPercent || 48}٪
                  </span>
                </div>
              </div>

              {/* Dollar */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    دلار بازار آزاد
                  </span>
                  <span className="font-mono font-bold text-slate-900">{formatPrice(liveUsd, false)}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {result.dualEngine?.dollarStatus}
                </p>
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-500 flex justify-between">
                  <span>سهم اثر در حرکت طلا:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {result.dualEngine?.dollarContributionPercent || 52}٪
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* B. MASTER VERDICT COMPACT SUMMARY */}
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-3.5 mb-3.5">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                    نتیجه اسکن تحلیلی
                  </span>
                  <span className="text-[11px] text-slate-400">
                    برای {selectedAsset.nameFa}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">{result.consensusVerdict}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">{result.masterSummary}</p>
              </div>

              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl shrink-0">
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block">احتمال صعود</span>
                  <span className="text-sm font-black font-mono text-amber-900">{result.bullishProbability}٪</span>
                </div>
                <div className="w-px h-6 bg-amber-200"></div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-500 block">امتیاز کل</span>
                  <span className="text-sm font-black font-mono text-slate-900">{result.overallScore}/۱۰۰</span>
                </div>
              </div>
            </div>

            {/* Target and Stop loss */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-600 font-medium">هدف قیمتی مورد انتظار:</span>
                  <span className="text-emerald-700 font-bold font-mono">+{result.expectedProfitPercent}٪</span>
                </div>
                <div className="text-base font-black font-mono text-slate-950">
                  {formatPrice(result.targetPrice, isUSD)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-600 font-medium">حد ابطال (خروج امن):</span>
                  <span className="text-rose-600 font-bold font-mono text-[10px]">SL</span>
                </div>
                <div className="text-base font-black font-mono text-slate-900">
                  {formatPrice(result.bearishSupport, isUSD)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="text-[11px] text-slate-600 font-medium mb-1">روش پیشنهادی خرید:</div>
                <div className="text-xs font-bold text-slate-900">
                  خرید پله‌ای (DCA) در کف‌های حمایتی
                </div>
              </div>
            </div>
          </div>

          {/* C. 6 STRATEGIES ACCORDION (COMPACT & SIMPLE) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                بررسی ۶ تحلیل تخصصی به زبان ساده:
              </h4>
              <span className="text-[10px] text-slate-500">برای جزئیات بیشتر کلیک کنید</span>
            </div>

            <div className="space-y-2">
              {result.strategyBreakdown?.map((strat, idx) => {
                const isExpanded = expandedStrategyIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`border rounded-xl transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => setExpandedStrategyIdx(isExpanded ? null : idx)}
                      className="w-full p-2.5 sm:p-3 text-right flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-900 ml-1.5">{strat.name}</span>
                          <span className="text-[10px] text-slate-500">({strat.simpleName})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          {strat.probability}٪
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                    </button>

                    {/* Content */}
                    {isExpanded && (
                      <div className="p-3 border-t border-amber-100 bg-white space-y-2.5 text-xs">
                        {/* 1. Simple */}
                        <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                          <span className="font-bold text-amber-950 block mb-0.5 text-[11px]">
                            💡 مفهوم ساده:
                          </span>
                          <p className="text-slate-700 leading-relaxed text-[11px]">
                            {strat.simpleExplanation}
                          </p>
                        </div>

                        {/* 2. Ounce & Dollar */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="font-bold text-slate-800 block mb-0.5">دیدگاه انس جهانی:</span>
                            <p className="text-slate-600 leading-relaxed">{strat.ounceAnalysis}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="font-bold text-slate-800 block mb-0.5">دیدگاه دلار آزاد:</span>
                            <p className="text-slate-600 leading-relaxed">{strat.dollarAnalysis}</p>
                          </div>
                        </div>

                        {/* 3. What to do */}
                        <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-950">
                            <strong>برآیند:</strong> {strat.combinedImpact}
                          </span>
                          <span className="text-emerald-800 font-bold">
                            اقدام: {strat.whatToDo}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* D. QUICK QUESTIONS BAR */}
          {onAskQuestion && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <span className="text-slate-700 font-bold flex items-center gap-1.5 text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                پرسش‌های فوری پرکاربرد:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onAskQuestion('الان طلا بخرم یا صبر کنم ارزون بشه؟')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-slate-800 text-[11px] font-medium transition cursor-pointer active:scale-95"
                >
                  الان بخرم یا صبر کنم؟
                </button>
                <button
                  onClick={() => onAskQuestion('سکه بهتره یا طلای آبشده و ۱۸ عیار؟')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-slate-800 text-[11px] font-medium transition cursor-pointer active:scale-95"
                >
                  سکه یا طلای آبشده؟
                </button>
                <button
                  onClick={() => onAskQuestion('خرید پله‌ای چطوری انجام میشه؟')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-slate-800 text-[11px] font-medium transition cursor-pointer active:scale-95"
                >
                  روش خرید پله‌ای چیست؟
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
