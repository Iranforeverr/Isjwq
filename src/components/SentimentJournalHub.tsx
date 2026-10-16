import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  PieChart,
  BarChart2,
  Clock,
  ExternalLink,
  Flame,
  Award,
  Filter,
  Trash2,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface SentimentJournalHubProps {
  selectedAsset: AssetInfo;
  onAskAi: (prompt: string) => void;
}

export const SentimentJournalHub: React.FC<SentimentJournalHubProps> = ({
  selectedAsset,
  onAskAi,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'news' | 'journal' | 'risk_audit' | 'sentiment'>('news');

  // Trade Journal User Entry Form State
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newEntry, setNewEntry] = useState({
    asset: selectedAsset.name,
    type: 'LONG' as 'LONG' | 'SHORT',
    entryPrice: selectedAsset.currentPrice,
    exitPrice: selectedAsset.currentPrice * 1.01,
    pnl: selectedAsset.isUSD ? 250 : 2500000,
    strategyUsed: 'ICT Order Block + Asian Breakout',
    emotionsTag: 'منطقی و طبق پلن',
    lessonsLearned: 'ورود به موقع بدون هیجان و خروج با تارگت تعیین‌شده.',
  });

  const fetchSentimentData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gold/sentiment-macro?asset=${selectedAsset.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          if (journalEntries.length === 0 && json.data.sampleJournalEntries) {
            setJournalEntries(json.data.sampleJournalEntries);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch sentiment & macro data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentimentData();
  }, [selectedAsset.id, selectedAsset.currentPrice]);

  const p = data?.currentPrice || selectedAsset.currentPrice;
  const isUSD = selectedAsset.isUSD;

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: `custom-${Date.now()}`,
      date: 'امروز - ثبت توسط کاربر',
      asset: newEntry.asset,
      type: newEntry.type,
      entryPrice: Number(newEntry.entryPrice),
      exitPrice: Number(newEntry.exitPrice),
      pnlTomanOrDollar: Number(newEntry.pnl),
      pnlPercent: Number(((newEntry.pnl / (newEntry.entryPrice || 1)) * 100).toFixed(1)),
      strategyUsed: newEntry.strategyUsed,
      emotionsTag: newEntry.emotionsTag,
      lessonsLearnedFa: newEntry.lessonsLearned,
    };

    setJournalEntries([entry, ...journalEntries]);
    setShowAddForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    setJournalEntries(journalEntries.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-100">
                  فاز ۴: ژورنال معاملاتی هوشمند، مدیریت ریسک پورتفو و تقویم اقتصاد کلان (ForexFactory & Risk Audit)
                </h2>
                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  Portfolio Defense
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                ثبت و بازبینی روانشناسی تریدها، سناریوهای استرس تست طلا، سنتیمنت ترس و طمع و فیلتر اخبار قرمز اقتصادی
              </p>
            </div>
          </div>

          {/* Fear & Greed Badge */}
          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <div>
              <div className="text-[10px] text-slate-400">شاخص سنتیمنت و طمع:</div>
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{data?.fearAndGreedIndex?.score || 68} / 100 ({data?.fearAndGreedIndex?.status || 'طمع'})</span>
              </div>
            </div>
            <div className="h-7 w-px bg-slate-800"></div>
            <div>
              <div className="text-[10px] text-slate-400">سطح ایمنی سبد:</div>
              <div className="text-xs font-bold text-indigo-300">
                {data?.portfolioAudit?.riskCategory || 'متعادل'}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          {[
            { id: 'news', label: '🔴 تقویم اخبار قرمز و رویدادهای فدرال رزرو (FOMC/CPI)', icon: Calendar },
            { id: 'journal', label: '📖 دفترچه ژورنال معاملاتی و روانشناسی ترید', icon: BookOpen },
            { id: 'risk_audit', label: '🛡️ استرس تست سبد و مدیریت ریسک پورتفوی طلا', icon: ShieldCheck },
            { id: 'sentiment', label: '🧠 رادار سنتیمنت و موقعیت بانک‌های مرکزی', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-max border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-300'
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

      {/* TAB 1: RED FOLDER ECONOMIC NEWS (FOREXFACTORY STYLE) */}
      {activeTab === 'news' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-400" />
                  <span>مانیتور رویدادهای قرمز با نوسان فوق‌العاده بالا (High Impact Economic Events)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ردیابی مستقیم داده‌های اشتغال، تورم و نرخ بهره جهانی با تحلیل اختصاصی تاثیر آن بر طلا
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(data?.upcomingRedNews || []).map((item: any) => (
                <div
                  key={item.id}
                  className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-rose-500/30 hover:border-rose-400 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="text-xs font-black text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                        {item.currency} (High Impact)
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-amber-300 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.timeTehran}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-amber-300 font-bold">تاثیر بر روند طلا:</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{item.impactOnGoldFa}</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                      <span className="text-emerald-400 font-bold">دستورالعمل اجرایی معامله‌گر:</span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{item.actionGuideFa}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                      <span>پیش‌بینی کارشناسان: <strong className="font-mono text-slate-200">{item.forecast}</strong></span>
                      <span>دوره قبلی: <strong className="font-mono text-slate-200">{item.previous}</strong></span>
                    </div>

                    <button
                      onClick={() => onAskAi(`اخبار اقتصادی ${item.title} را با سناریوهای صعودی و نزولی طلا تحلیل کن.`)}
                      className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/30 transition"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>تحلیل سناریو با AI</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART TRADE JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>دفترچه ثبت معاملات و تحلیل روانشناسی تریدر (Trading Journal)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  ثبت دلایل ورود، استراتژی مورد استفاده، وضعیت روحی و درس‌های آموخته‌شده از هر معامله
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <PlusCircle className="w-4 h-4" />
                <span>ثبت معامله جدید</span>
              </button>
            </div>

            {/* Add New Trade Journal Modal/Form */}
            {showAddForm && (
              <form onSubmit={handleAddJournal} className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/40 space-y-4">
                <div className="text-sm font-bold text-indigo-300">ثبت معامله جدید در ژورنال شخصی:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">دارایی:</label>
                    <input
                      type="text"
                      value={newEntry.asset}
                      onChange={(e) => setNewEntry({ ...newEntry, asset: e.target.value })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">نوع پوزیشن:</label>
                    <select
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as any })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="LONG">خرید (LONG)</option>
                      <option value="SHORT">فروش (SHORT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400">قیمت ورود:</label>
                    <input
                      type="number"
                      value={newEntry.entryPrice}
                      onChange={(e) => setNewEntry({ ...newEntry, entryPrice: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">قیمت خروج:</label>
                    <input
                      type="number"
                      value={newEntry.exitPrice}
                      onChange={(e) => setNewEntry({ ...newEntry, exitPrice: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">سود یا زیان خالص ({isUSD ? 'دلار' : 'تومان'}):</label>
                    <input
                      type="number"
                      value={newEntry.pnl}
                      onChange={(e) => setNewEntry({ ...newEntry, pnl: Number(e.target.value) })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">استراتژی اعمال شده:</label>
                    <input
                      type="text"
                      value={newEntry.strategyUsed}
                      onChange={(e) => setNewEntry({ ...newEntry, strategyUsed: e.target.value })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">حالت روانی در زمان معامله:</label>
                    <select
                      value={newEntry.emotionsTag}
                      onChange={(e) => setNewEntry({ ...newEntry, emotionsTag: e.target.value as any })}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="منطقی و طبق پلن">منطقی و طبق پلن</option>
                      <option value="طمع و ورود زودهنگام">طمع و ورود زودهنگام</option>
                      <option value="ترس از جا ماندن (FOMO)">ترس از جا ماندن (FOMO)</option>
                      <option value="انتقام از بازار">انتقام از بازار</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-400">درس آموخته‌شده یا علت موفقیت/شکست:</label>
                  <input
                    type="text"
                    value={newEntry.lessonsLearned}
                    onChange={(e) => setNewEntry({ ...newEntry, lessonsLearned: e.target.value })}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    ذخیره در ژورنال
                  </button>
                </div>
              </form>
            )}

            {/* List of Journal Entries */}
            <div className="space-y-3">
              {journalEntries.map((entry: any) => (
                <div
                  key={entry.id}
                  className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        entry.type === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {entry.type}
                      </span>
                      <strong className="text-xs font-bold text-slate-200">{entry.asset}</strong>
                      <span className="text-[10px] text-slate-400">({entry.date})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-emerald-400">
                          +{formatPrice(entry.pnlTomanOrDollar, isUSD)}
                        </span>
                        <span className="text-[10px] text-emerald-300 ml-1">({entry.pnlPercent}%)</span>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                        title="حذف رکورد"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl">
                    <div className="text-slate-400">استراتژی: <strong className="text-indigo-300">{entry.strategyUsed}</strong></div>
                    <div className="text-slate-400">وضعیت روانشناسی: <strong className="text-amber-300">{entry.emotionsTag}</strong></div>
                    <div className="text-slate-400">ورود/خروج: <span className="font-mono text-slate-200">{formatPrice(entry.entryPrice, isUSD)} → {formatPrice(entry.exitPrice, isUSD)}</span></div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    💡 <strong className="text-slate-200">یادداشت و نتیجه‌گیری:</strong> {entry.lessonsLearnedFa}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PORTFOLIO STRESS TESTING & RISK AUDIT */}
      {activeTab === 'risk_audit' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-lg">
            <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>سیستم مدیریت ریسک پورتفو و شبیه‌سازی بحران‌های بازار (Stress Testing)</span>
            </h3>

            {/* Allocation Ratio Bar */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">توزیع متوازن و استاندارد دارایی در سبد طلای ضدتورمی:</span>
                <span className="text-emerald-400 font-bold">۱۰۰٪ تخصیص داده شده</span>
              </div>

              {/* Visual Multi-color Progress */}
              <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden flex">
                <div style={{ width: '45%' }} className="bg-amber-500 h-full" title="طلای فیزیکی (۴۵٪)"></div>
                <div style={{ width: '25%' }} className="bg-indigo-500 h-full" title="صندوق‌های طلا (۲۵٪)"></div>
                <div style={{ width: '15%' }} className="bg-rose-500 h-full" title="اسکالپ فارکس (۱۵٪)"></div>
                <div style={{ width: '15%' }} className="bg-emerald-500 h-full" title="نقدینگی ریال/تتر (۱۵٪)"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>طلای فیزیکی و شمش (۴۵٪)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span>
                  <span>صندوق‌های بورس طلا (۲۵٪)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span>معاملات اهرم‌دار (۱۵٪)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>نقدینگی آماده خرید (۱۵٪)</span>
                </div>
              </div>
            </div>

            {/* Stress Test Scenarios */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300">سناریوهای شبیه‌سازی بحران و راهکارهای پوشش ریسک (Hedging):</div>
              {(data?.portfolioAudit?.stressTestScenarios || []).map((scen: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-300 text-sm">{scen.scenarioName}</strong>
                    <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {scen.estimatedPortfolioImpact}
                    </span>
                  </div>
                  <p className="text-slate-400">{scen.impactDescriptionFa}</p>
                  <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300 leading-relaxed">
                    🛡️ <strong className="text-emerald-200">استراتژی مهار ریسک:</strong> {scen.hedgingSolutionFa}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SENTIMENT RADAR & CENTRAL BANKS */}
      {activeTab === 'sentiment' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-lg">
            <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>تحلیل سنتیمنت جهانی، جریان سرمایه و ذخایر بانک‌های مرکزی (Central Banks & COT)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200">گزارش تعهد معامله‌گران (COT Report):</div>
                <div className="text-xs text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>موقعیت‌های خرید تجاری (Commercials):</span>
                    <strong className="text-emerald-400 font-mono">+64% خالص خرید</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>بانک خلق چین (PBOC) و هند (RBI):</span>
                    <strong className="text-amber-300 font-bold">افزایش ماهانه ذخایر شمش</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>ورودی صندوق‌های ETF طلا (GLD):</span>
                    <strong className="text-emerald-400 font-mono">+8.4 تن در هفته جاری</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-3xl border border-indigo-500/30 space-y-3">
                <div className="text-xs font-bold text-indigo-300">خلاصه هوش مصنوعی از فضای روانی بازار:</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {data?.fearAndGreedIndex?.goldSpecificSentiment || 'تمایل خریداران نهادی و بانک‌های مرکزی جهانی در بالاترین سطح ۶ ماه گذشته قرار دارد.'}
                </p>
                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                  ✓ توصیه کلی سیستم: حفظ استراتژی خرید در اصلاح‌ها (Buy the Dips) با تارگت‌های صعودی میان‌مدت.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
