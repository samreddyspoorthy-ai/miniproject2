import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, Boxes, Cpu } from 'lucide-react';
import { fetchPlatformOverview } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

const COLORS = ['#34d399', '#38bdf8', '#f59e0b', '#fb7185', '#a78bfa'];

function AnalyticsLabPage() {
  const [overview, setOverview] = useState(null);
  const { analysis } = useAppSession();

  useEffect(() => {
    let cancelled = false;
    fetchPlatformOverview().then((payload) => {
      if (!cancelled) setOverview(payload);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const composition = analysis?.item_counts?.map((item) => ({ name: item.label, value: item.count })) || [
    { name: 'plastic', value: 4 },
    { name: 'glass', value: 2 },
    { name: 'food', value: 3 },
  ];

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Analytics Lab</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">IoT simulation, predictive analytics, and dashboards</h2>
        <p className="mt-3 text-base leading-8 text-slate-300">
          Smart bin fill levels, predictive pickup, waste composition analysis, and trend charts are grouped here to keep the main flow uncluttered.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <article className="app-card p-5">
          <div className="icon-pill">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Smart bin IoT simulation</h3>
          <p className="mt-3 text-4xl font-semibold text-white">{overview?.smart_bin?.fill_level_percent || '--'}%</p>
          <p className="mt-2 text-sm text-emerald-100">{overview?.smart_bin?.status}</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{overview?.smart_bin?.pickup_prediction}</p>
        </article>
        <article className="app-card p-5">
          <div className="icon-pill">
            <Boxes className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Waste composition analysis</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            AI-powered composition is derived from the detected waste mix and used for smart bin and pickup planning.
          </p>
        </article>
        <article className="app-card p-5">
          <div className="icon-pill">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Municipal officer dashboard</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Ward coverage: {overview?.municipal_dashboard?.ward_coverage || '--'} · Recycling rate: {overview?.municipal_dashboard?.recycling_rate_percent || '--'}%
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{overview?.municipal_dashboard?.officer_note}</p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">Future waste generation</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview?.predictive_analytics?.monthly_trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="waste_tons" stroke="#34d399" strokeWidth={3} />
                <Line type="monotone" dataKey="recycled_tons" stroke="#38bdf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">Seasonal waste patterns</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.predictive_analytics?.seasonal_patterns || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="season" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="organic" fill="#84cc16" />
                <Bar dataKey="plastic" fill="#38bdf8" />
                <Bar dataKey="hazardous" fill="#fb7185" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">Interactive data dashboard</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.predictive_analytics?.pickup_forecast || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="fill" fill="#34d399" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">Waste distribution</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={composition} dataKey="value" nameKey="name" outerRadius={105} innerRadius={48}>
                  {composition.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </div>
  );
}

export default AnalyticsLabPage;
