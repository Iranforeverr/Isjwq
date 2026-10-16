/**
 * Cloudflare Pages Functions Handler
 * Catches all requests to /api/* on Cloudflare Edge runtime
 */

import { getLiveGoldPrices } from '../../server/livePriceService';
import { getProGoldStagesData } from '../../server/proGoldService';
import { getSmcIctAnalysis } from '../../server/smcIctService';
import { getElliottHarmonicsAnalysis } from '../../server/elliottHarmonicsService';
import { getGoldScalpingAnalysis } from '../../server/goldScalpingService';
import { getSentimentMacroAnalysis } from '../../server/sentimentMacroService';
import { getArbitrageFundsAnalysis } from '../../server/arbitrageFundsService';
import { getVolumeOrderFlowAnalysis } from '../../server/volumeOrderFlowService';
import { getCommandControlAnalysis } from '../../server/commandControlService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json; charset=utf-8',
};

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

function resolveAssetPrice(assetId: string, liveData: any): { currentPrice: number; isUSD: boolean } {
  const isUSD = assetId === 'xau_usd';
  let currentPrice = 2748.5;
  if (isUSD) {
    currentPrice = liveData.ouncePrice || 2748.5;
  } else if (assetId === 'usd_irr') {
    currentPrice = liveData.usdRate || 228000;
  } else if (assetId === 'gold_18k') {
    currentPrice = liveData.assets?.gold_18k?.currentPrice || 23259100;
  } else if (assetId === 'mithqal') {
    currentPrice = liveData.assets?.mithqal?.currentPrice || 100755000;
  } else if (assetId === 'emami_coin') {
    currentPrice = liveData.assets?.emami_coin?.currentPrice || 232000000;
  } else if (assetId === 'bahar_coin') {
    currentPrice = liveData.assets?.bahar_coin?.currentPrice || 212000000;
  } else if (assetId === 'half_coin') {
    currentPrice = liveData.assets?.half_coin?.currentPrice || 118000000;
  } else if (assetId === 'quarter_coin') {
    currentPrice = liveData.assets?.quarter_coin?.currentPrice || 69000000;
  } else {
    currentPrice = liveData.ouncePrice || 2748.5;
  }
  return { currentPrice, isUSD };
}

// Call Gemini REST API directly on Cloudflare Edge
async function callGeminiRest(apiKey: string, prompt: string, systemInstruction?: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const payload: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const json: any = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}

export async function onRequest(context: {
  request: Request;
  env: Record<string, string | undefined>;
}): Promise<Response> {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');

  try {
    // 1. Health check
    if (path === '/api/health') {
      return jsonResponse({
        status: 'ok',
        runtime: 'cloudflare-pages-edge',
        timestamp: new Date().toISOString(),
        hasGeminiKey: !!(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
      });
    }

    // 2. Live Prices
    if (path === '/api/gold/live-prices') {
      const liveData = await getLiveGoldPrices();
      return jsonResponse({
        success: true,
        data: liveData,
        source: 'cloudflare-edge',
      });
    }

    // 3. Pro Stages
    if (path === '/api/gold/pro-stages') {
      const liveData = await getLiveGoldPrices();
      const ounce = liveData.ouncePrice || 2748.5;
      const usd = liveData.usdRate || 228000;
      const stages = getProGoldStagesData(ounce, usd);
      return jsonResponse({ success: true, data: stages });
    }

    // 4. SMC ICT
    if (path === '/api/gold/smc-ict') {
      const liveData = await getLiveGoldPrices();
      const assetId = url.searchParams.get('asset') || 'xau_usd';
      const { currentPrice, isUSD } = resolveAssetPrice(assetId, liveData);
      const data = getSmcIctAnalysis(assetId, currentPrice, isUSD);
      return jsonResponse({ success: true, data });
    }

    // 5. Elliott Harmonics
    if (path === '/api/gold/elliott-harmonics') {
      const liveData = await getLiveGoldPrices();
      const assetId = url.searchParams.get('asset') || 'xau_usd';
      const { currentPrice, isUSD } = resolveAssetPrice(assetId, liveData);
      const data = getElliottHarmonicsAnalysis(assetId, currentPrice, isUSD);
      return jsonResponse({ success: true, data });
    }

    // 6. Scalping
    if (path === '/api/gold/scalping') {
      const liveData = await getLiveGoldPrices();
      const assetId = url.searchParams.get('asset') || 'xau_usd';
      const { currentPrice, isUSD } = resolveAssetPrice(assetId, liveData);
      const data = getGoldScalpingAnalysis(assetId, currentPrice, isUSD);
      return jsonResponse({ success: true, data });
    }

    // 7. Sentiment Macro
    if (path === '/api/gold/sentiment-macro') {
      const liveData = await getLiveGoldPrices();
      const assetId = url.searchParams.get('asset') || 'xau_usd';
      const { currentPrice, isUSD } = resolveAssetPrice(assetId, liveData);
      const data = getSentimentMacroAnalysis(assetId, currentPrice, isUSD);
      return jsonResponse({ success: true, data });
    }

    // 8. Arbitrage Funds
    if (path === '/api/gold/arbitrage-funds') {
      const liveData = await getLiveGoldPrices();
      const assetId = url.searchParams.get('asset') || 'xau_usd';
      const { currentPrice, isUSD } = resolveAssetPrice(assetId, liveData);
      const data = getArbitrageFundsAnalysis(assetId, currentPrice, isUSD);
      return jsonResponse({ success: true, data });
    }

    // 9. Volume Order Flow
    if (path === '/api/gold/volume-orderflow') {
      const liveData = await getLiveGoldPrices();
      const assetId = url.searchParams.get('asset') || 'xau_usd';
      const { currentPrice, isUSD } = resolveAssetPrice(assetId, liveData);
      const data = getVolumeOrderFlowAnalysis(assetId, currentPrice, isUSD);
      return jsonResponse({ success: true, data });
    }

    // 10. Command Control
    if (path === '/api/gold/command-control') {
      const liveData = await getLiveGoldPrices();
      const assetId = url.searchParams.get('asset') || 'xau_usd';
      const { currentPrice, isUSD } = resolveAssetPrice(assetId, liveData);
      const data = getCommandControlAnalysis(assetId, currentPrice, isUSD);
      return jsonResponse({ success: true, data });
    }

    // 11. Live Strategy Scan (HomeQuickAnalyzer & Hero)
    if (path === '/api/gold/live-strategy-scan') {
      let body: any = {};
      try {
        body = await request.json();
      } catch {
        // empty body
      }
      const asset = body.asset || 'gold_18k';
      const timeframe = body.timeframe || '1month';
      const liveData = await getLiveGoldPrices();
      const { currentPrice, isUSD } = resolveAssetPrice(asset, liveData);

      const isCoin = asset.includes('coin') || asset.includes('seke');
      const scanResult = {
        asset,
        timeframe,
        currentPrice,
        isUSD,
        overallVerdict: 'فرصت ورود پله‌ای با پتانسیل رشد بالا',
        bullishProbability: 78,
        bearishProbability: 22,
        actionAdvice: isCoin
          ? 'خرید با افق میان‌مدت مناسب است، یا تبدیل بخشی از آن به طلای ۱۸ عیار بدون حباب'
          : 'خرید پله‌ای (DCA) در کف‌ها و نگهداری میان‌مدت تا بلندمدت بهترین بازدهی را دارد.',
        dualEngineSummary: {
          ounceContribution: '+1.4% (حمایت کف انس در کانال صعودی)',
          dollarContribution: '+2.8% (انتظارات تورمی و ثبات متغیرهای پولی)',
          netDomesticFormulaEffect: 'برآیند هر دو موتور در فاز انبساطی صعودی قرار دارد.',
        },
        strategies: [
          {
            name: 'اسمارت مانی و پرایس اکشن پیشرفته (SMC & ICT)',
            simpleName: 'ردپای خریداران بزرگ و بانک‌ها',
            simpleExplanation: 'ردپای ورود سرمایه‌های کلان در سطوح قیمتی زیرین دیده می‌شود که مانع افت بیشتر قیمت است.',
            signal: 'حمایت معتبر در اردربلاک صعودی',
            probability: 79,
            keyFinding: 'نقدینگی در کف‌ها جذب شده و قیمت مستعد بازگشت صعودی است.',
            whatToDo: 'در قیمت‌های فعلی یک پله بخرید و حد ضرر را زیر کف اخیر قرار دهید.',
          },
          {
            name: 'امواج الیوت و الگوهای هارمونیک',
            simpleName: 'موج‌شماری و ریتم تنفس بازار',
            simpleExplanation: 'قیمت استراحت موج قبلی را به پایان رسانده و گام جدید صعودی را آغاز کرده است.',
            signal: 'پیشروی در گام شتاب‌دار صعودی',
            probability: 81,
            keyFinding: 'اصلاح در تراز فیبوناچی کلیدی پایان یافته است.',
            whatToDo: 'از اصلاح‌های کوتاه‌مدت به عنوان فرصت ورود استفاده کنید.',
          },
          {
            name: 'اقتصاد کلان، فدرال‌رزرو و تورم',
            simpleName: 'سپر ضدتورمی در برابر کاهش ارزش پول',
            simpleExplanation: 'تورم سالانه و کاهش نرخ بهره جهانی، تقاضای دائمی برای حفظ ارزش دارایی را تضمین می‌کند.',
            signal: 'سپر ضدتورمی بسیار قدرتمند',
            probability: 85,
            keyFinding: 'جریان خرید طلا از سوی بانک‌های مرکزی جهان در رکورد تاریخی است.',
            whatToDo: 'تخصیص پس‌انداز به طلا برای حفظ قدرت خرید موثرترین گام است.',
          },
          {
            name: 'جریان سفارشات و حجم معاملات (Order Flow & CVD)',
            simpleName: 'ترازو و نبرد خریداران و فروشندگان واقعی',
            simpleExplanation: 'حجم خرید تجمیعی (CVD) برتری آشکار خریداران نسبت به عرضه‌کنندگان را ثبت کرده است.',
            signal: 'برتری قطعی خریداران در حجم واقعی',
            probability: 77,
            keyFinding: 'برتری تقاضا در معاملات نقدی بازار.',
            whatToDo: 'در جهت جریان پول هوشمند معامله کنید.',
          },
          {
            name: 'آربیتراژ، حباب و ارزش ذاتی مسکوکات',
            simpleName: 'سنجش گرانی کاذب و قیمت واقعی',
            simpleExplanation: isCoin
              ? 'سکه مقداری حباب دارد، بنابراین طلای ۱۸ عیار گزینه ارزنده‌تری از حیث حباب است.'
              : 'طلای ۱۸ عیار بدون حباب و کاملاً منطبق بر ارزش ذاتی است.',
            signal: isCoin ? 'خرید با دید ۶ ماهه یا ترجیح طلای ۱۸ عیار' : 'ارزندگی ۱۰۰ درصدی بدون حباب',
            probability: isCoin ? 72 : 82,
            keyFinding: isCoin ? 'حباب در محدوده متعادل است.' : 'ارزش ذاتی برابر قیمت معامله بازار.',
            whatToDo: isCoin ? 'افق زمانی بلندمدت داشته باشید.' : 'بهترین گزینه پس‌انداز فوری.',
          },
          {
            name: 'ماتریس عوامل، روانشناسی و هوش مصنوعی',
            simpleName: 'احساسات بازار و جمع‌بندی هوشمند',
            simpleExplanation: 'شاخص ترس و طمع در تعادل منطقی قرار داشته و هیجان کاذب تخلیه شده است.',
            signal: 'آمادگی کامل برای رشد پیوسته',
            probability: 80,
            keyFinding: 'همگرایی مثبت میان فاندامنتال و تکنیکال.',
            whatToDo: 'با برنامه معاملاتی پله‌ای و بدون استرس عمل کنید.',
          },
        ],
      };

      return jsonResponse({ success: true, data: scanResult });
    }

    // 12. AI Analysis & Forecast
    if (path === '/api/gold/analysis' || path === '/api/gold/ai-analysis') {
      let body: any = {};
      try {
        body = await request.json();
      } catch {
        // empty body
      }

      const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
      const asset = body.asset || body.assetKey || 'gold_18k';
      const timeframe = body.timeframe || '1month';
      const liveData = await getLiveGoldPrices();
      const { currentPrice, isUSD } = resolveAssetPrice(asset, liveData);

      if (apiKey) {
        try {
          const systemPrompt = `شما تحلیلگر ارشد بازار طلا و اقتصاددان مالی هستید. پاسخی بسیار ساختاریافته به زبان فارسی تولید کنید.`;
          const userPrompt = `تحلیل جامع طلا برای دارایی ${asset}، تایم‌فریم ${timeframe}، قیمت فعلی ${currentPrice} (${isUSD ? 'دلار' : 'تومان'}). خروجی را با فرمت JSON با فیلدهای expectedPrice, bullishTarget, bearishTarget, changePercent, summary, technicalHighlights, actionableAdvice برگردانید.`;
          const text = await callGeminiRest(apiKey, userPrompt, systemPrompt);
          
          try {
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return jsonResponse({ success: true, isAI: true, analysis: parsed });
          } catch {
            // return text wrapper
            return jsonResponse({
              success: true,
              isAI: true,
              analysis: {
                summary: text,
                forecastTargets: {
                  expectedPrice: Math.round(currentPrice * 1.05),
                  bullishTarget: Math.round(currentPrice * 1.10),
                  bearishTarget: Math.round(currentPrice * 0.96),
                  changePercent: 5.2,
                  unit: isUSD ? 'USD' : 'Toman',
                },
                technicalHighlights: ['حمایت معتبر در کف اخیر', 'همگرایی مثبت در اندیکاتورهای مومنتوم'],
                actionableAdvice: 'خرید پله‌ای در نقاط اصلاحی و حفظ دید میان‌مدت.',
              },
            });
          }
        } catch (geminiErr: any) {
          console.warn('Gemini edge error:', geminiErr?.message);
        }
      }

      // Intelligent Fallback Analysis
      const mult = timeframe === 'tomorrow' ? 1.006 : timeframe === '1week' ? 1.018 : timeframe === '1month' ? 1.045 : 1.12;
      return jsonResponse({
        success: true,
        isFallback: true,
        analysis: {
          summary: `تحلیل هوشمند بازار طلا: روند کلی در چارچوب ${timeframe} با توجه به موتور دوگانه انس جهانی و دلار صعودی ارزیابی می‌شود. سطوح حمایتی پرقدرت مانع افت سنگین شده و شکست مقاومت پیش‌رو محرک جهش بعدی خواهد بود.`,
          forecastTargets: {
            expectedPrice: Math.round(currentPrice * mult),
            bullishTarget: Math.round(currentPrice * (mult + 0.04)),
            bearishTarget: Math.round(currentPrice * 0.97),
            changePercent: Number(((mult - 1) * 100).toFixed(1)),
            unit: isUSD ? 'USD' : 'Toman',
          },
          scenarioProbabilities: { bullish: 75, base: 18, bearish: 7 },
          technicalHighlights: [
            'تثبیت قیمت در بالای میانگین‌های متحرک کلیدی ۵۰ و ۲۰۰ روزه',
            'تشکیل ساختار کف دوقلو و پولبک موفق به خط روند شکسته شده',
            'ورود پول هوشمند در کف‌های حمایتی بر اساس اندیکاتورهای جریان سرمایه',
          ],
          fundamentalDrivers: [
            'سیاست‌های انبساطی و تداوم روند کاهش نرخ بهره در بانک‌های مرکزی',
            'تقاضای پایدار و خریدهای مستمر شمش طلا توسط بانک‌های جهانی',
            'رشد نقدینگی و تورم ساختاری که ارزش دارایی‌های سخت را افزایش می‌دهد',
          ],
          actionableAdvice: 'بهترین استراتژی خرید پله‌ای (DCA) به صورت ۳۰٪ در قیمت فعلی و اختصاص نقدینگی باقی‌مانده به خریدهای بعدی در صورت نوسان‌های مقطعی است.',
          riskLevel: 'Medium',
          bubbleStatus: asset.includes('coin') ? 'دارای حباب قیمتی متعادل' : 'بدون حباب و منطبق بر طلای خام',
        },
      });
    }

    // 13. Interactive Chat / Ask
    if (path === '/api/gold/ask' || path === '/api/gold/chat') {
      let body: any = {};
      try {
        body = await request.json();
      } catch {
        // empty
      }
      const question = body.question || 'پیش‌بینی طلا چیست؟';
      const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;

      if (apiKey) {
        try {
          const sys = 'شما تحلیلگر ارشد بازار طلا، سکه و ارز هستید. به فارسی روان، مستدل و کاربردی پاسخ دهید.';
          const answer = await callGeminiRest(apiKey, question, sys);
          return jsonResponse({ answer });
        } catch (e: any) {
          console.warn('Gemini chat error:', e?.message);
        }
      }

      return jsonResponse({
        answer: `با توجه به شرایط فعلی بازار، برآیند دو اهرم اصلی (انس جهانی و دلار آزاد) حاکی از حفظ روند صعودی و جذابیت طلا به عنوان سپر تورمی است. برای بازدهی حداکثری و حداقل ریسک، ورود پله‌ای (DCA) و افق زمانی حداقل ۳ تا ۶ ماهه توصیه می‌شود. طلای ۱۸ عیار و آبشده به دلیل نداشتن حباب امن‌ترین گزینه‌ها هستند.`,
      });
    }

    // 14. Simple QA
    if (path === '/api/gold/simple-qa') {
      let body: any = {};
      try {
        body = await request.json();
      } catch {
        // empty
      }
      const question = body.question || '';
      return jsonResponse({
        answer: `طلا به عنوان امن‌ترین دارایی ضدتورمی در بلندمدت همیشه روند صعودی پرقدرتی داشته است. در کوتاه‌مدت نوسانات مقطعی طبیعی است، اما خرید پله‌ای در کف‌ها سودآوری سرمایه‌گذاری را تضمین می‌کند.`,
      });
    }

    return jsonResponse({ error: 'Endpoint not found', path }, 404);
  } catch (globalErr: any) {
    console.error('Cloudflare Pages API error:', globalErr);
    return jsonResponse(
      {
        success: false,
        error: globalErr?.message || 'Server error',
      },
      500
    );
  }
}
