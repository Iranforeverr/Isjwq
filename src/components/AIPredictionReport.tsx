import React, { useState } from 'react';
import { AIGeneratedAnalysis, AssetInfo, TimeframeKey } from '../types';
import { formatPrice } from '../data/goldData';
import {
  Sparkles,
  Bot,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Globe2,
  HelpCircle,
  RefreshCw,
  Award,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface AIPredictionReportProps {
  analysis: AIGeneratedAnalysis | null;
  isLoading: boolean;
  asset: AssetInfo;
  timeframe: TimeframeKey;
  onRefresh: (customPrompt?: string) => void;
}

export const AIPredictionReport: React.FC<AIPredictionReportProps> = ({
  analysis,
  isLoading,
  asset,
  timeframe,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'scenarios' | 'macro' | 'strategy'>('summary');
  const [customQuestion, setCustomQuestion] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim()) {
      onRefresh(customQuestion);
    }
  };

  if (!analysis && isLoading) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-8 text-center space-y-4 shadow-xl">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 animate-pulse">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-slate-100">
          در حال تدوین گزارش تحلیل جامع هوش مصنوعی با Gemini 3.8 Flash...
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          محاسبه تقارن‌های تکنیکال، نرخ‌های بهره، همبستگی DXY، داده‌های خرید بانک‌های مرکزی و قیمت هدف...
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Decorative corner glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header with Model Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/90 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                دیدگاه تخصصی موتور هوش مصنوعی (AI Analyst Report)
              </h3>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              تحلیل عمیق چندمتغیره {asset.nameFa} برای افق {timeframe}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefresh()}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>بازتحلیل</span>
          </button>
        </div>
      </div>

      {/* Quick Score Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] text-slate-400">سیگنال روند کلی</span>
          <div className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4" />
            {analysis.trend === 'Bullish' ? 'صعودی (Bullish)' : analysis.trend === 'Bearish' ? 'نزولی' : 'خنثی'}
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] text-slate-400">ضریب اطمینان الگو</span>
          <div className="text-sm font-black text-amber-300 font-mono mt-1">
            {analysis.confidenceScore}%
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] text-slate-400">سطح ریسک</span>
          <div className="text-sm font-bold text-blue-400 mt-1">
            {analysis.riskLevel}
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[11px] text-slate-400">تارگت مورد انتظار</span>
          <div className="text-xs sm:text-sm font-bold text-slate-100 font-mono mt-1">
            {formatPrice(analysis.forecastTargets?.expectedPrice || 0, asset.isUSD)}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          خلاصه تحلیلی و چکیده
        </button>
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'scenarios'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          اهداف قیمتی و احتمالات
        </button>
        <button
          onClick={() => setActiveTab('macro')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'macro'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          محرک‌های کلان و ژئوپلیتیک
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'strategy'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          استراتژی معاملاتی و پله‌های ورود
        </button>
      </div>

      {/* Content based on Active Tab */}
      <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 font-medium leading-relaxed">
              {analysis.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2 text-xs">
                  <Zap className="w-4 h-4" />
                  برجسته‌ترین نکات تکنیکال:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.technicalHighlights?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2 text-xs">
                  <Globe2 className="w-4 h-4" />
                  محرک‌های بنیادین و فاندامنتال:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {analysis.fundamentalDrivers?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-xl text-center">
                <div className="text-xs text-emerald-400 font-bold mb-1">تارگت صعودی (Bullish)</div>
                <div className="text-lg font-black text-slate-100 font-mono">
                  {formatPrice(analysis.forecastTargets?.bullishTarget || 0, asset.isUSD)}
                </div>
                <div className="text-xs text-emerald-400 mt-1 font-mono">
                  احتمال: {analysis.scenarioProbabilities?.bullish || 55}%
                </div>
              </div>

              <div className="bg-blue-950/30 border border-blue-500/40 p-4 rounded-xl text-center">
                <div className="text-xs text-blue-400 font-bold mb-1">تارگت پایه (Base Case)</div>
                <div className="text-lg font-black text-slate-100 font-mono">
                  {formatPrice(analysis.forecastTargets?.expectedPrice || 0, asset.isUSD)}
                </div>
                <div className="text-xs text-blue-400 mt-1 font-mono">
                  احتمال: {analysis.scenarioProbabilities?.base || 30}%
                </div>
              </div>

              <div className="bg-rose-950/30 border border-rose-500/40 p-4 rounded-xl text-center">
                <div className="text-xs text-rose-400 font-bold mb-1">کف حمایتی (Bearish)</div>
                <div className="text-lg font-black text-slate-100 font-mono">
                  {formatPrice(analysis.forecastTargets?.bearishTarget || 0, asset.isUSD)}
                </div>
                <div className="text-xs text-rose-400 mt-1 font-mono">
                  احتمال: {analysis.scenarioProbabilities?.bearish || 15}%
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'macro' && (
          <div className="space-y-3">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h5 className="font-bold text-amber-300 text-xs mb-1.5">اثر ریسک‌های ژئوپلیتیک و منطقه‌ای:</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.geopoliticalImpact || 'تنش‌های منطقه‌ای تقاضای امن برای طلا را در بالاترین سطوح ۵ ساله نگه داشته و مانع از ریزش‌های سنگین می‌شود.'}
              </p>
            </div>

            {analysis.bubbleStatus && (
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <h5 className="font-bold text-amber-300 text-xs mb-1.5">وضعیت حباب و ارزندگی دارایی:</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.bubbleStatus}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <span className="font-bold text-xs flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                راهبرد ورود و مدیریت سرمایه پیشنهادی:
              </span>
              <p className="text-xs leading-relaxed text-slate-200">
                {analysis.actionableAdvice}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Custom Question Prompt */}
      <form onSubmit={handleCustomSubmit} className="pt-3 border-t border-slate-800/80 flex gap-2">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="سوال خاصی از هوش مصنوعی دارید؟ (مثلا: اگر دلار ۵ هزار تومان بالا رود طلا چه می‌شود؟)"
          className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
        <button
          type="submit"
          disabled={isLoading || !customQuestion.trim()}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50"
        >
          پرسش از AI
        </button>
      </form>
    </div>
  );
};
