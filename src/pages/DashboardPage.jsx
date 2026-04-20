import { useEffect, useState } from 'react';
import { BellRing, IndianRupee, Leaf, TrendingUp, UtensilsCrossed } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import ChartCard from '../components/charts/ChartCard';
import PageHeader from '../components/common/PageHeader';
import SkeletonCard from '../components/common/SkeletonCard';
import {
  branchComparison,
  leakageAlerts,
  monthlySalesTrend,
  pricingInsights,
  sustainabilityMetrics,
  topItems,
  wasteVsRevenue,
} from '../data/mockData';
import { formatCompactINR, formatINR, formatNumber } from '../utils/formatters';
import { useLiveData } from '../context/LiveDataContext';

const palette = ['#16a34a', '#22c55e', '#f97316', '#fdba74', '#84cc16', '#65a30d'];

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const navigate = useNavigate();
  const { liveEnabled, dashboard, alerts } = useLiveData();

  const dashboardMetrics = [
    {
      title: 'Total Sales (₹)',
      value: formatINR(liveEnabled ? dashboard?.totalSales || 0 : 1284500),
      icon: IndianRupee,
    },
    {
      title: 'Predicted Waste (kg)',
      value: `${Math.round(liveEnabled ? dashboard?.wasteKg || 67 : 67)} kg`,
      icon: UtensilsCrossed,
    },
    {
      title: 'Waste Cost (₹)',
      value: formatINR(liveEnabled ? dashboard?.wasteCost || 0 : 96500),
      icon: TrendingUp,
    },
    {
      title: 'Waste Percentage',
      value: `${liveEnabled ? dashboard?.wastePercentage || 0 : 6.2}%`,
      icon: Leaf,
    },
  ];
  const alertItems = liveEnabled && alerts.length ? alerts.map((a) => a.message) : leakageAlerts;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Main Dashboard"
        subtitle="AI-powered restaurant operations intelligence across waste, inventory, pricing, and sustainability."
      />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-green-600 to-orange-500 p-6 text-white shadow-soft">
        <img
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=60"
          alt="Restaurant operations"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="relative z-10">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Leaf className="h-3.5 w-3.5" />
            AI Restaurant Intelligence Platform
          </p>
          <h1 className="max-w-2xl text-2xl font-bold sm:text-3xl">Reduce Restaurant Food Waste by 30% Using AI</h1>
          <p className="mt-3 max-w-3xl text-sm text-white/90 sm:text-base">
            Forecast demand, optimize inventory, detect cost leakage, and drive sustainability outcomes with explainable AI.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <button onClick={() => navigate('/predictions')} className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">AI Forecast Intelligence</button>
            <button onClick={() => navigate('/inventory')} className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">Smart Inventory Aging</button>
            <button onClick={() => navigate('/reports')} className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">Sustainability & ESG</button>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article key={metric.title} className="card-surface p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-500">{metric.title}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{metric.value}</p>
              </article>
            );
          })}
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-4">
        <article className="card-surface p-5">
          <p className="text-xs text-slate-500">CO2 Saved</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{formatNumber(sustainabilityMetrics.co2SavedKg)} kg</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-xs text-slate-500">Meals Saved</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatNumber(sustainabilityMetrics.mealsSaved)}</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-xs text-slate-500">Money Saved</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatINR(sustainabilityMetrics.moneySaved)}</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-xs text-slate-500">Sustainability Score</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{sustainabilityMetrics.sustainabilityScore}/100</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Daily Revenue Trend" subtitle="Revenue trajectory with projected waste cost.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySalesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCompactINR} />
              <Tooltip formatter={(value) => formatCompactINR(value)} />
              <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="wasteCost" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Waste vs Revenue" subtitle="Cost leakage impact by week.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={wasteVsRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCompactINR} />
              <Tooltip formatter={(value) => formatCompactINR(value)} />
              <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
              <Bar dataKey="waste" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Branch Performance" subtitle="Sales and waste percentage by branch.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiencyScore" fill="#15803d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Selling Items" subtitle="Top sellers and waste contribution.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topItems.slice(0, 8)} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" />
              <YAxis dataKey="item" type="category" width={140} />
              <Tooltip />
              <Bar dataKey="sold" radius={[0, 8, 8, 0]}>
                {topItems.map((entry, idx) => (
                  <Cell key={entry.item} fill={palette[idx % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <section className="card-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Live Cost Leakage Detection</h3>
            <button onClick={() => setAlertsEnabled((v) => !v)} className={`rounded-full px-3 py-1 text-xs font-semibold ${alertsEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {alertsEnabled ? 'Push Alerts On' : 'Push Alerts Off'}
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {alertItems.map((alert) => (
              <p key={alert} className="rounded-xl bg-red-50 p-3 text-red-700 ring-1 ring-red-100">
                <BellRing className="mr-2 inline h-4 w-4" />
                {alert}
              </p>
            ))}
          </div>
        </section>

        <section className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Predictive Pricing Insights</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {pricingInsights.map((insight) => (
              <p key={insight} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">{insight}</p>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default DashboardPage;
