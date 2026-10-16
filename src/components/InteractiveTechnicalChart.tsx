import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Target,
  Shield,
  Activity,
  Zap,
  BarChart3,
  Eye,
  Sliders,
} from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface InteractiveTechnicalChartProps {
  asset: AssetInfo;
  timeframe: string;
}

export const InteractiveTechnicalChart: React.FC<InteractiveTechnicalChartProps> = ({
  asset,
  timeframe,
}) => {
  // Overlay Toggles on Chart
  const [showSMCZones, setShowSMCZones] = useState<boolean>(true); // FVG & Order Blocks
  const [showElliottWaves, setShowElliottWaves] = useState<boolean>(true); // 1-2-3-4-5 Waves
  const [showVolumePOC, setShowVolumePOC] = useState<boolean>(true); // POC & Value Area
  const [showForecastBand, setShowForecastBand] = useState<boolean>(true); // AI Future Path

  const p = asset.currentPrice;
  const isUSD = asset.isUSD;

  // Key Levels for Overlays
  const pocLevel = isUSD ? Math.round(p * 0.998 * 10) / 10 : Math.round(p * 0.997);
  const obZoneLow = isUSD ? Math.round(p * 0.985 * 10) / 10 : Math.round(p * 0.984);
  const obZoneHigh = isUSD ? Math.round(p * 0.992 * 10) / 10 : Math.round(p * 0.991);

  const fvgLow = isUSD ? Math.round(p * 0.994 * 10) / 10 : Math.round(p * 0.993);
  const fvgHigh = isUSD ? Math.round(p * 0.997 * 10) / 10 : Math.round(p * 0.996);

  const resistanceLevel = isUSD ? Math.round(p * 1.018 * 10) / 10 : Math.round(p * 1.02);

  // Generate Candlestick / Line with Elliott & Forecast Wave Path
  const generateChartData = () => {
    const data = [];
    const base = p * 0.97;
    const count = 28;

    // Past 20 Candles
    for (let i = 1; i <= 20; i++) {
      let waveLabel = '';
      if (i === 4) waveLabel = '(موج ۱)';
      if (i === 8) waveLabel = '(موج ۲)';
      if (i === 15) waveLabel = '(موج ۳ - اکستند)';
      if (i === 19) waveLabel = '(موج ۴)';
      if (i === 20) waveLabel = 'اکنون (موج ۵)';

      const noise = Math.sin(i / 2.5) * (p * 0.012) + (i / 20) * (p * 0.03);
      const price = Math.round(base + noise);

      data.push({
        name: `شمع ${i}`,
        price,
        forecast: undefined,
        upperBand: undefined,
        lowerBand: undefined,
        waveLabel,
        isFuture: false,
      });
    }

    // Future 8 Forecast Bars (AI Scenario)
    const lastPrice = data[data.length - 1].price;
    for (let j = 1; j <= 8; j++) {
      const forecastVal = Math.round(lastPrice + j * (p * 0.0035) + Math.sin(j) * (p * 0.002));
      data.push({
        name: `تارگت ${j}`,
        price: j === 1 ? lastPrice : undefined,
        forecast: forecastVal,
        upperBand: Math.round(forecastVal * 1.008),
        lowerBand: Math.round(forecastVal * 0.992),
        waveLabel: j === 5 ? '🎯 تارگت نهایی موج ۵' : '',
        isFuture: true,
      });
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm shadow-amber-500/5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              <span>چارت هوشمند تعاملی با تلفیق تمام متدهای تحلیلی (SMC + Elliott + Volume)</span>
            </h3>
            <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              Live Interactive Overlays
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            امکان روشن/خاموش کردن اردر بلاک‌ها، موج‌شماری الیوت، زون FVG و هسته حجمی POC مستقیماً روی نمودار
          </p>
        </div>

        {/* Overlay Switches */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSMCZones(!showSMCZones)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
              showSMCZones
                ? 'bg-amber-300 text-amber-950 border-amber-400 shadow-xs'
                : 'bg-amber-50/70 text-slate-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>بلاک‌های نقدینگی SMC</span>
          </button>

          <button
            onClick={() => setShowElliottWaves(!showElliottWaves)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
              showElliottWaves
                ? 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-xs'
                : 'bg-amber-50/70 text-slate-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>امواج الیوت ۱-۵</span>
          </button>

          <button
            onClick={() => setShowVolumePOC(!showVolumePOC)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
              showVolumePOC
                ? 'bg-cyan-100 text-cyan-900 border-cyan-300 shadow-xs'
                : 'bg-amber-50/70 text-slate-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
            <span>هسته حجمی POC</span>
          </button>

          <button
            onClick={() => setShowForecastBand(!showForecastBand)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border cursor-pointer ${
              showForecastBand
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                : 'bg-amber-50/70 text-slate-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>مسیر پیش‌بینی AI</span>
          </button>
        </div>
      </div>

      {/* Chart Visual Container */}
      <div className="h-[360px] sm:h-[400px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="aiForecastArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              domain={['auto', 'auto']}
              orientation="left"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => (isUSD ? `$${v}` : `${(v / 1000).toFixed(0)}k`)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border-2 border-amber-300 p-3 rounded-xl shadow-xl text-xs space-y-1.5 font-mono text-slate-900">
                      <div className="text-amber-950 font-bold border-b border-amber-200 pb-1 flex justify-between">
                        <span>{d.name}</span>
                        {d.waveLabel && <span className="text-indigo-700">{d.waveLabel}</span>}
                      </div>
                      {d.price && (
                        <div className="flex justify-between gap-4 text-slate-700">
                          <span>قیمت شمع:</span>
                          <strong className="text-slate-950 font-bold">{formatPrice(d.price, isUSD)}</strong>
                        </div>
                      )}
                      {d.forecast && (
                        <div className="flex justify-between gap-4 text-emerald-700 font-bold">
                          <span>پیش‌بینی هوش مصنوعی:</span>
                          <span>{formatPrice(d.forecast, isUSD)}</span>
                        </div>
                      )}
                      {d.upperBand && (
                        <div className="flex justify-between gap-4 text-[10px] text-amber-800">
                          <span>باند خوش‌بینانه:</span>
                          <span>{formatPrice(d.upperBand, isUSD)}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* SMC Order Block Key Level */}
            {showSMCZones && (
              <ReferenceLine
                y={obZoneHigh}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: `بلاک خرید بانکی (${formatPrice(obZoneHigh, isUSD)})`,
                  position: 'insideBottomRight',
                  fill: '#fcd34d',
                  fontSize: 10,
                }}
              />
            )}

            {/* FVG Gap Key Level */}
            {showSMCZones && (
              <ReferenceLine
                y={fvgLow}
                stroke="#3b82f6"
                strokeDasharray="2 2"
                label={{
                  value: `گپ نقدینگی FVG (${formatPrice(fvgLow, isUSD)})`,
                  position: 'insideTopLeft',
                  fill: '#93c5fd',
                  fontSize: 10,
                }}
              />
            )}

            {/* Volume Profile POC Reference Line */}
            {showVolumePOC && (
              <ReferenceLine
                y={pocLevel}
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: `هسته حجمی POC (${formatPrice(pocLevel, isUSD)})`,
                  position: 'right',
                  fill: '#22d3ee',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              />
            )}

            {/* Key Resistance Line */}
            <ReferenceLine
              y={resistanceLevel}
              stroke="#f43f5e"
              strokeDasharray="5 5"
              label={{
                value: `مقاومت ماژور (${formatPrice(resistanceLevel, isUSD)})`,
                position: 'left',
                fill: '#fb7185',
                fontSize: 11,
              }}
            />

            {/* AI Forecast Confidence Cloud Area */}
            {showForecastBand && (
              <Area
                type="monotone"
                dataKey="upperBand"
                stroke="none"
                fill="url(#aiForecastArea)"
              />
            )}

            {/* Historical Candlestick Price Line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={{ r: 3, fill: '#fbbf24' }}
              activeDot={{ r: 6, fill: '#f59e0b' }}
              name="قیمت طلا"
            />

            {/* AI Projected Path Line */}
            {showForecastBand && (
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#10b981' }}
                name="مسیر پیش‌بینی AI"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-200 text-xs">
        <div className="flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-amber-300 font-bold">
          <span className="w-3 h-3 rounded bg-amber-400 border border-amber-500"></span>
          <span className="text-slate-800">اوردر بلاک SMC: {formatPrice(obZoneLow, isUSD)}</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-blue-300 font-bold">
          <span className="w-3 h-3 rounded bg-blue-400 border border-blue-500"></span>
          <span className="text-slate-800">گپ نقدینگی FVG: {formatPrice(fvgLow, isUSD)}</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-cyan-300 font-bold">
          <span className="w-3 h-3 rounded bg-cyan-500"></span>
          <span className="text-slate-800">هسته حجمی POC: {formatPrice(pocLevel, isUSD)}</span>
        </div>
        <div className="flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-xl border border-emerald-300 font-bold">
          <span className="w-3 h-3 rounded bg-emerald-500 border-dashed"></span>
          <span className="text-emerald-800 font-black">تارگت موج ۵ الیوت</span>
        </div>
      </div>
    </div>
  );
};
