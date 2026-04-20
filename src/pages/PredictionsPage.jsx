import { useMemo, useState } from 'react';
import { AlertTriangle, Lightbulb, MessageSquare, PackageCheck, ShieldCheck } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from '../components/charts/ChartCard';
import PageHeader from '../components/common/PageHeader';
import {
  demandDrivers,
  explainableInsights,
  purchaseOrder,
  sevenDayForecast,
  suggestions,
} from '../data/mockData';
import { formatINR } from '../utils/formatters';
import { useLiveData } from '../context/LiveDataContext';

const gaugeData = [{ name: 'Confidence', value: 89, fill: '#16a34a' }];
const chatAnswers = {
  'Why did waste increase this week?': 'Waste increased due to weekend spike and higher buffet prep in Koramangala branch.',
  'How can I reduce chicken waste?': 'Reduce chicken prep by 8% after 8 PM and enable half-batch replenishment.',
  'Show me top 5 waste items': 'Top waste items: Chicken gravy, onions, paneer cubes, spinach, and biryani rice.',
};
const rootCauseSignals = [
  'Overproduction of Biryani (+18%)',
  'Weekend footfall drop (-9%)',
  'Rain impact in region lowered dine-in conversion',
];
const inventoryRiskRadar = [
  { risk: 'Over-order', score: 72 },
  { risk: 'Expiry', score: 81 },
  { risk: 'Demand Volatility', score: 67 },
  { risk: 'Margin', score: 58 },
];
const efficiencyBreakdown = [
  { metric: 'Forecast Accuracy', value: 88 },
  { metric: 'Waste Ratio', value: 84 },
  { metric: 'Order Precision', value: 80 },
  { metric: 'Profit Impact', value: 86 },
];

function PredictionsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState('Why did waste increase this week?');
  const [prepReduction, setPrepReduction] = useState(8);
  const { liveEnabled, dashboard } = useLiveData();
  const latestPrediction = dashboard?.predictions?.[0];
  const recommendationRows =
    liveEnabled && dashboard?.recommendations?.length
      ? dashboard.recommendations.slice(0, 6).map((row) => ({
          material: row.item,
          requiredKg: Number(row.requiredQuantity?.toFixed?.(2) || row.requiredQuantity || 0),
          currentKg: Number(row.currentInventory?.toFixed?.(2) || row.currentInventory || 0),
          variancePct: Number(row.variancePct?.toFixed?.(1) || row.variancePct || 0),
        }))
      : purchaseOrder;
  const rootCauseFromModel =
    liveEnabled && latestPrediction?.explainableReason
      ? [latestPrediction.explainableReason, ...rootCauseSignals.slice(1)]
      : rootCauseSignals;

  const simulatedSavings = useMemo(() => Math.round(prepReduction * 6200), [prepReduction]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Forecast Intelligence Engine"
        subtitle="Demand forecasting by weekday, weather, festivals, and local events with explainable AI insights."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Predicted Waste</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {liveEnabled ? `${Math.round(latestPrediction?.predictedWaste || 67)} kg` : '67 kg'}
          </p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Predicted Waste Cost</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatINR(liveEnabled ? latestPrediction?.predictedCost || 14250 : 14250)}
          </p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Monthly Savings Potential</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">{formatINR(345000)}</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">AI Waste Score</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">89/100</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Prediction Confidence" subtitle="7-day confidence and forecast reliability.">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={22} data={gaugeData} startAngle={180} endAngle={0}>
              <RadialBar dataKey="value" cornerRadius={10} />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="-mt-10 text-center text-3xl font-bold text-slate-900">89%</p>
        </ChartCard>

        <ChartCard title="Demand Drivers" subtitle="Impact contribution on forecast model.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demandDrivers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="factor" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={70} />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="impact" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Explainable AI</h3>
          <div className="mt-4 space-y-3 text-sm">
            {explainableInsights.map((insight) => (
              <div key={insight} className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-slate-700 ring-1 ring-emerald-100">
                <Lightbulb className="mt-0.5 h-4 w-4 text-emerald-700" />
                <p>{insight}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-orange-50 p-3 text-sm text-orange-800 ring-1 ring-orange-100">
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Risk Note
            </div>
            High rainfall probability may reduce walk-ins by 7-12% tomorrow.
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="7-Day Forward Demand Forecast" subtitle="Projected demand with confidence %.">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sevenDayForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" unit="%" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="demand" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Line yAxisId="right" dataKey="confidence" stroke="#f97316" strokeWidth={2.5} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Smart Auto-Ordering" subtitle="Suggested purchase order vs current plan.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recommendationRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="material" />
              <YAxis unit="kg" />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentKg" fill="#f97316" radius={[6, 6, 0, 0]} />
              <Bar dataKey="requiredKg" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <section className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Auto-Ordering Alerts</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            {recommendationRows.map((row) => (
              <div key={row.material} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <p>{row.material}</p>
                <p className={`font-semibold ${row.variancePct < -15 ? 'text-red-600' : 'text-orange-600'}`}>
                  {row.variancePct < 0 ? `Over-ordering by ${Math.abs(row.variancePct)}%` : 'Optimized'}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
            <AlertTriangle className="mr-1 inline h-4 w-4" /> You are over-ordering onions by 18%.
          </div>
        </section>

        <section className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">What-if Simulation</h3>
          <p className="mt-2 text-sm text-slate-600">What if you reduce chicken prep by {prepReduction}%?</p>
          <input
            type="range"
            min="2"
            max="20"
            value={prepReduction}
            onChange={(e) => setPrepReduction(Number(e.target.value))}
            className="mt-4 w-full accent-emerald-600"
          />
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-100">
            Projected monthly savings: <span className="font-semibold">{formatINR(simulatedSavings)}</span>
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {suggestions.map((suggestion) => (
              <p key={suggestion} className="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">{suggestion}</p>
            ))}
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <section className="card-surface p-5 xl:col-span-1">
          <h3 className="text-base font-semibold text-slate-900">AI Root Cause Analysis Engine</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {rootCauseFromModel.map((signal) => (
              <p key={signal} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">{signal}</p>
            ))}
          </div>
        </section>

        <ChartCard title="Inventory Risk Radar" subtitle="Over-order, expiry, volatility and margin risk map.">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={inventoryRiskRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="risk" tick={{ fontSize: 11 }} />
              <Radar dataKey="score" stroke="#16a34a" fill="#16a34a" fillOpacity={0.35} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <p className="-mt-8 text-center text-sm text-slate-700">Inventory Health: <span className="font-semibold">74 / 100</span></p>
        </ChartCard>

        <section className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Branch Efficiency Score</h3>
          <p className="mt-1 text-3xl font-bold text-emerald-700">82 / 100</p>
          <div className="mt-4 space-y-2 text-sm">
            {efficiencyBreakdown.map((item) => (
              <div key={item.metric}>
                <div className="mb-1 flex justify-between text-slate-600">
                  <span>{item.metric}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="card-surface p-5">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-700" />
          <h3 className="text-base font-semibold text-slate-900">Ask WasteWise AI</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(chatAnswers).map((question) => (
            <button
              key={question}
              onClick={() => setSelectedQuestion(question)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${selectedQuestion === question ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {question}
            </button>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">{chatAnswers[selectedQuestion]}</p>
      </section>

      <div className="card-surface flex items-center gap-3 p-4 text-sm text-slate-700">
        <PackageCheck className="h-5 w-5 text-emerald-700" />
        Implementing AI recommendations is projected to reduce next-day waste by <span className="font-semibold">11.2%</span> and improve contribution margin.
      </div>
    </div>
  );
}

export default PredictionsPage;
