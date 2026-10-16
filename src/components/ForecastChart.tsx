import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { ChartDataPoint, AssetInfo } from '../types';
import { formatPriceCompact } from '../data/goldData';
import { LineChart, Sparkles, TrendingUp } from 'lucide-react';

interface ForecastChartProps {
  data: ChartDataPoint[];
  asset: AssetInfo;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, asset }) => {
  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as ChartDataPoint;
      return (
        <div className="bg-white border-2 border-amber-300 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[190px] text-slate-900 font-sans">
          <div className="font-black text-amber-950 border-b border-amber-200 pb-1 flex items-center justify-between">
            <span>{point.date}</span>
            {point.isForecast && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                پیش‌بینی مدل
              </span>
            )}
          </div>

          {point.historicalPrice !== undefined && !point.isForecast && (
            <div className="flex justify-between text-slate-700 font-medium">
              <span>قیمت تاریخی:</span>
              <span className="font-mono font-bold text-slate-950">
                {formatPriceCompact(point.historicalPrice, asset.isUSD)}
              </span>
            </div>
          )}

          {point.forecastPrice !== undefined && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>پیش‌بینی مبنا:</span>
              <span className="font-mono font-black">
                {formatPriceCompact(point.forecastPrice, asset.isUSD)}
              </span>
            </div>
          )}

          {point.upperConfidence !== undefined && point.isForecast && (
            <div className="flex justify-between text-amber-800 text-[11px] font-semibold">
              <span>حد بالای خوش‌بینانه:</span>
              <span className="font-mono font-bold">
                {formatPriceCompact(point.upperConfidence, asset.isUSD)}
              </span>
            </div>
          )}

          {point.lowerConfidence !== undefined && point.isForecast && (
            <div className="flex justify-between text-rose-700 text-[11px] font-semibold">
              <span>حد پایین بدبینانه:</span>
              <span className="font-mono font-bold">
                {formatPriceCompact(point.lowerConfidence, asset.isUSD)}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm shadow-amber-500/5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-amber-600" />
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              نمودار پیوسته روند گذشته و مخروط پیش‌بینی آینده ({asset.nameFa})
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            نمایش داده‌های تاریخی به همراه بازه اطمینان مدل برای روز بعد، هفته بعد، ماه بعد، ۲ ماه و بلندمدت
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-500 rounded-full"></span>
            <span className="text-slate-700 font-bold">قیمت واقعی</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-amber-500 rounded-full"></span>
            <span className="text-slate-700 font-bold">پیش‌بینی هوش مصنوعی</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-amber-200 border border-amber-400 rounded"></span>
            <span className="text-slate-700 font-bold">بازه اطمینان</span>
          </div>
        </div>
      </div>

      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="confidenceArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b' }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={45}
            />

            <YAxis
              stroke="#64748b"
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => formatPriceCompact(v, asset.isUSD)}
              orientation="right"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Confidence Interval Upper and Lower Bounds */}
            <Area
              type="monotone"
              dataKey="upperConfidence"
              stroke="#d97706"
              strokeDasharray="4 4"
              strokeWidth={1}
              fill="url(#confidenceArea)"
              name="حد بالای خوش‌بینانه"
            />

            <Line
              type="monotone"
              dataKey="lowerConfidence"
              stroke="#e11d48"
              strokeDasharray="4 4"
              strokeWidth={1}
              dot={false}
              name="حد پایین بدبینانه"
            />

            {/* Historical Real Price Line */}
            <Line
              type="monotone"
              dataKey="historicalPrice"
              stroke="#0284c7"
              strokeWidth={3}
              dot={{ r: 3, fill: '#0284c7' }}
              name="روند تاریخی"
            />

            {/* Future Projection Line */}
            <Line
              type="monotone"
              dataKey="forecastPrice"
              stroke="#d97706"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: '#d97706', stroke: '#fff', strokeWidth: 1.5 }}
              name="مسیر پیش‌بینی آینده"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
