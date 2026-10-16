import React, { useState, useEffect } from 'react';
import {
  Globe,
  Clock,
  CheckSquare,
  BarChart,
  ShieldCheck,
  AlertTriangle,
  PlayCircle,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  Volume2,
  VolumeX,
  RefreshCw,
  TrendingUp,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface CommandControlHubProps {
  selectedAsset: AssetInfo;
  onAskAi: (prompt: string) => void;
}

export const CommandControlHub: React.FC<CommandControlHubProps> = ({
  selectedAsset,
  onAskAi,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'backtest' | 'checklist' | 'executive_summary'>('sessions');

  // Sound Alerts Toggle
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(false);

  // Pre-Trade Checklist Checked IDs State
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const fetchCommandData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gold/command-control?asset=${selectedAsset.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch command control data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandData();
  }, [selectedAsset.id, selectedAsset.currentPrice]);

  const p = data?.currentPrice || selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalChecks = data?.preTradeChecklistItems?.length || 5;
  const completedChecks = Object.values(checkedIds).filter(Boolean).length;
  const isTradeApproved = completedChecks === totalChecks;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-violet-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-100">
                  فاز ۷: اتاق فرمان نهایی، ساعت زنده سشن‌های جهانی و بک‌تست‌گیر استراتژی‌های طلا (Command Control Center)
                </h2>
                <span className="text-[10px] font-black bg-violet-500/20 text-violet-300 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                  Master Execution Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                دیده‌بان همپوشانی سشن‌های لندن و نیویورک، شبیه‌ساز سودآوری ۱۰۰ ترید گذشته و چک‌لیست تایید ورود
              </p>
            </div>
          </div>

          {/* Quick Sound Alert Toggle & Time */}
          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <div>
              <div className="text-[10px] text-slate-400">ساعت محلی تهران:</div>
              <div className="text-xs font-black text-violet-300 font-mono mt-0.5">
                {data?.tehranLocalTime || 'در حال بارگذاری...'}
              </div>
            </div>
            <div className="h-7 w-px bg-slate-800"></div>
            <button
              onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
              className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                soundAlertsEnabled
                  ? 'bg-violet-600 text-white border-violet-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="هشدار صوتی زنگ شروع سشن"
            >
              {soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[10px]">{soundAlertsEnabled ? 'هشدار صوتی فعال' : 'هشدار صوتی خاموش'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          {[
            { id: 'sessions', label: '🌍 رادار سشن‌های جهانی طلا (London / NY)', icon: Globe },
            { id: 'backtest', label: '📊 نتایج بک‌تست ۱۰۰ ترید گذشته استراتژی‌ها', icon: BarChart },
            { id: 'checklist', label: '✅ چک‌لیست قبل از فشردن دکمه ترید (Pre-Trade)', icon: CheckSquare },
            { id: 'executive_summary', label: '📋 پلن جامع اجرایی روزانه و گزارش چاپی', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-max border ${
                  isActive
                    ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30 ring-1 ring-violet-300'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SESSIONS RADAR */}
      {activeTab === 'sessions' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-violet-400" />
                  <span>دیده‌بان وضعیت زنده سشن‌های معاملاتی و منطقه طلایی نوسان طلا (Killzones)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  بیشترین حجم و اسپایک‌های سودآور طلا در ساعات همپوشانی لندن و نیویورک (۱۶:۰۰ تا ۱۹:۰۰ تهران) رخ می‌دهد
                </p>
              </div>

              <div className="text-xs bg-violet-500/10 border border-violet-500/30 text-violet-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>همپوشانی لندن و نیویورک: فعال و طلایی</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(data?.activeSessions || []).map((session: any, idx: number) => {
                const isOpen = session.currentStatus.includes('باز');
                return (
                  <div
                    key={idx}
                    className={`bg-slate-950 p-5 rounded-3xl border transition space-y-3 shadow-lg ${
                      isOpen
                        ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
                        : 'border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{session.flag}</span>
                        <div>
                          <h4 className="text-sm font-black text-slate-100">{session.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {session.openTehran} - {session.closeTehran}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        isOpen
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {session.currentStatus}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>شدت نوسان و حجم:</span>
                        <strong className="text-amber-300 font-bold">{session.volatilityLevel}</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                      🎯 <strong className="text-slate-100">بهترین استراتژی طلا:</strong> {session.bestGoldStrategy}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BACKTEST RESULTS */}
      {activeTab === 'backtest' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>کارنامه و بک‌تست هوش مصنوعی روی ۱۰۰ ترید اخیر طلا (Quant Strategy Backtester)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(data?.backtestResults || []).map((res: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-5 rounded-3xl border border-violet-500/30 hover:border-violet-400 transition space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-slate-100">{res.strategyName}</h4>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 font-mono">
                      {res.winRatePercent}% Win
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px]">سود خالص کل:</span>
                      <strong className="text-emerald-400 font-mono text-sm block mt-0.5">+{res.netProfitPercent}%</strong>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px]">ضریب سود (Profit Factor):</span>
                      <strong className="text-amber-300 font-mono text-sm block mt-0.5">{res.profitFactor}</strong>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px]">حداکثر افت حساب (DD):</span>
                      <strong className="text-cyan-300 font-mono text-sm block mt-0.5">{res.maxDrawdownPercent}%</strong>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px]">میانگین R/R:</span>
                      <strong className="text-violet-300 font-mono text-sm block mt-0.5">{res.avgRiskReward}</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed space-y-1">
                    <div>✓ <strong className="text-emerald-300">نقطه قوت:</strong> {res.strengthsFa}</div>
                    <div>⚠️ <strong className="text-rose-300">نقطه ضعف:</strong> {res.weaknessesFa}</div>
                  </div>

                  <div className="text-[10px] text-slate-400 text-center">
                    تایم‌فریم بهینه: <strong className="text-slate-200">{res.bestTimeframe}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRE-TRADE CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                  <span>چک‌لیست ایمنی و انضباط روانی قبل از ورود به معامله طلا</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تک‌تک موارد را بررسی کنید؛ تنها در صورت دریافت تایید کامل مجاز به ارسال سفارش هستید
                </p>
              </div>

              {/* Status Badge */}
              <div className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 ${
                isTradeApproved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {isTradeApproved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>مجوز ورود صادر شد ({completedChecks}/{totalChecks})</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>تایید نشده ({completedChecks}/{totalChecks})</span>
                  </>
                )}
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {(data?.preTradeChecklistItems || []).map((item: any) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 mt-0.5 ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'bg-slate-900 border-slate-700 text-transparent'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>

                    <div className="space-y-1 text-xs flex-1">
                      <div className="flex items-center justify-between">
                        <strong className={`text-sm ${isChecked ? 'text-emerald-300 font-black' : 'text-slate-200'}`}>
                          {item.questionFa}
                        </strong>
                        <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        قانون استاندارد: {item.suggestedRuleFa}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXECUTIVE SUMMARY & PRINT REPORT */}
      {activeTab === 'executive_summary' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-400" />
                  <span>پلن استراتژیک روزانه طلا و گزارش چاپی جهت تصمیم‌گیری</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  خلاصه مدیریتی سیستم هوش مصنوعی از وضعیت کلان، سطوح کلیدی و سقف حجم مجاز
                </p>
              </div>

              <button
                onClick={handlePrintReport}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-violet-600/30"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ یا ذخیره PDF گزارش</span>
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-3xl border border-violet-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm font-black text-amber-300">
                  جهت‌گیری کلی بازار (Market Bias): {data?.aiDailyExecutiveSummary?.biasDirection}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  راهنمای حجم مجاز: <strong className="text-emerald-400">{data?.aiDailyExecutiveSummary?.dayMaxRiskLotGuide}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-slate-400 block text-[11px]">مهم‌ترین حمایت روز (Key Support):</span>
                  <strong className="text-emerald-400 font-mono text-base block mt-0.5">
                    {formatPrice(data?.aiDailyExecutiveSummary?.keySupport || p * 0.988, isUSD)}
                  </strong>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-rose-500/30">
                  <span className="text-slate-400 block text-[11px]">مهم‌ترین مقاومت روز (Key Resistance):</span>
                  <strong className="text-rose-400 font-mono text-base block mt-0.5">
                    {formatPrice(data?.aiDailyExecutiveSummary?.keyResistance || p * 1.012, isUSD)}
                  </strong>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs leading-relaxed text-slate-200 space-y-2">
                <strong className="text-violet-300 block text-sm">
                  📌 {data?.aiDailyExecutiveSummary?.summaryHeadlineFa}
                </strong>
                <p className="text-slate-300">{data?.aiDailyExecutiveSummary?.detailedPlanFa}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
