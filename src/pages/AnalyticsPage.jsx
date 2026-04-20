import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from '../components/charts/ChartCard';
import PageHeader from '../components/common/PageHeader';
import {
  costLeakageFunnel,
  hourlyWastePattern,
  menuEngineering,
  monthlySalesTrend,
  peakWasteDays,
  topItems,
  wasteHeatmap,
} from '../data/mockData';
import { formatCompactINR } from '../utils/formatters';

const categoryLoss = [
  { category: 'Biryani', loss: 18500, profit: 42000 },
  { category: 'Curries', loss: 14400, profit: 35800 },
  { category: 'Breads', loss: 8300, profit: 24100 },
  { category: 'Beverages', loss: 6200, profit: 28700 },
  { category: 'Desserts', loss: 5400, profit: 16900 },
];
const weatherDemandCorrelation = [
  { weather: 'Sunny', demandDrop: -2, wasteChange: 1 },
  { weather: 'Cloudy', demandDrop: -4, wasteChange: 3 },
  { weather: 'Rainy', demandDrop: -12, wasteChange: 9 },
  { weather: 'Storm', demandDrop: -18, wasteChange: 13 },
];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Advanced Analytics Intelligence"
        subtitle="Waste heatmaps, hourly patterns, menu engineering matrix, and cost leakage funnel for deeper decisions."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Monthly Waste Trend" subtitle="Waste cost trajectory over time.">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySalesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCompactINR} />
              <Tooltip formatter={(value) => formatCompactINR(value)} />
              <Area type="monotone" dataKey="wasteCost" stroke="#f97316" fill="#fed7aa" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Hourly Waste Pattern" subtitle="Understand time-of-day operational losses.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyWastePattern}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" />
              <YAxis unit="kg" />
              <Tooltip />
              <Bar dataKey="waste" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Waste Heatmap (Mon-Sun)" subtitle="Waste intensity by meal slot.">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={wasteHeatmap}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="breakfast" stackId="a" fill="#86efac" />
              <Bar dataKey="lunch" stackId="a" fill="#fb923c" />
              <Bar dataKey="dinner" stackId="a" fill="#22c55e" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Menu Engineering Matrix" subtitle="Profitability vs popularity quadrant.">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="popularity" name="Popularity" unit="%" />
              <YAxis dataKey="profitability" name="Profitability" unit="%" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={menuEngineering} fill="#16a34a" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cost Leakage Funnel" subtitle="Trace financial leakage from procurement to retained value.">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={costLeakageFunnel} isAnimationActive />
            </FunnelChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Profitability Breakdown" subtitle="Loss vs profitability by food category.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryLoss}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={formatCompactINR} />
              <Tooltip formatter={(value) => formatCompactINR(value)} />
              <Legend />
              <Bar dataKey="profit" fill="#16a34a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="loss" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Peak Waste Days" subtitle="Operational pressure and waste spikes.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakWasteDays}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis unit="kg" />
              <Tooltip />
              <Bar dataKey="wasteKg" radius={[8, 8, 0, 0]}>
                {peakWasteDays.map((day) => (
                  <Cell
                    key={day.day}
                    fill={day.day === 'Saturday' || day.day === 'Friday' ? '#f97316' : '#22c55e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Profit vs Popular Items" subtitle="Top items performance balance.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItems.slice(0, 7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="item" tick={false} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#16a34a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="wasteKg" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Demand vs Weather Correlation" subtitle="Rainfall impact on dine-in demand and waste.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weatherDemandCorrelation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="weather" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demandDrop" fill="#f97316" radius={[8, 8, 0, 0]} />
              <Bar dataKey="wasteChange" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="-mt-6 text-center text-xs text-slate-500">Rainfall correlated with 12% drop in dine-in sales.</p>
        </ChartCard>
      </section>
    </div>
  );
}

export default AnalyticsPage;
