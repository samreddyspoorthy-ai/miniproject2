import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Cpu,
  Leaf,
  Recycle,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { wasteHeatmap } from '../data/mockData';
import { formatINR, formatNumber } from '../utils/formatters';

const finalMetrics = {
  revenue: 1284500,
  wasteSaved: 124000,
  mealsRecovered: 1550,
  wasteRate: 6.2,
};

const problems = [
  'Restaurants lose 10-20% revenue due to food waste',
  'No forecasting tools for demand volatility',
  'Over-ordering raw materials increases spoilage',
];

const industries = [
  {
    title: 'QSR Chain',
    image:
      'https://images.unsplash.com/photo-1561758033-48d52648ae8b?auto=format&fit=crop&w=900&q=60',
  },
  {
    title: 'Cloud Kitchen',
    image:
      'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=60',
  },
  {
    title: 'Fine Dining',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=60',
  },
  {
    title: 'Cafe',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=60',
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [count, setCount] = useState({ revenue: 0, wasteSaved: 0, mealsRecovered: 0, wasteRate: 0 });
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [insightToast, setInsightToast] = useState(false);
  const [sustainabilityToast, setSustainabilityToast] = useState(false);
  const [aiAlert, setAiAlert] = useState(false);
  const [riceReduction, setRiceReduction] = useState(5);
  const [roiRevenue, setRoiRevenue] = useState(2000000);

  useEffect(() => {
    const steps = 40;
    let tick = 0;
    const timer = setInterval(() => {
      tick += 1;
      const progress = Math.min(tick / steps, 1);
      setCount({
        revenue: Math.round(finalMetrics.revenue * progress),
        wasteSaved: Math.round(finalMetrics.wasteSaved * progress),
        mealsRecovered: Math.round(finalMetrics.mealsRecovered * progress),
        wasteRate: Number((finalMetrics.wasteRate * progress).toFixed(1)),
      });
      if (progress === 1) clearInterval(timer);
    }, 35);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setWelcomeOpen(true), 2000);
    const t2 = setTimeout(() => setInsightToast(true), 5000);
    const t3 = setTimeout(() => setInsightToast(false), 9000);
    const t4 = setTimeout(() => setSustainabilityToast(true), 7000);
    const t5 = setTimeout(() => setSustainabilityToast(false), 12000);
    const t6 = setTimeout(() => setAiAlert(true), 9500);
    const t7 = setTimeout(() => setAiAlert(false), 13500);

    return () => [t1, t2, t3, t4, t5, t6, t7].forEach((t) => clearTimeout(t));
  }, []);

  const simulationSavings = useMemo(() => Math.round(riceReduction * 4700), [riceReduction]);
  const annualSavings = useMemo(() => Math.round((roiRevenue * 0.01) * 12), [roiRevenue]);

  const heatValueClass = (value) => {
    if (value >= 10) return 'bg-red-500';
    if (value >= 8) return 'bg-orange-500';
    if (value >= 6) return 'bg-yellow-400';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen bg-brand-muted px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-200">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-white">
              <BarChart3 className="h-5 w-5" />
              <Leaf className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-white p-0.5 text-brand-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-brand-ink">WasteWise Intelligence</p>
              <p className="text-xs text-slate-500">AI Operations Platform</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">View Dashboard</button>
            <button onClick={() => setWelcomeOpen(true)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Request Demo</button>
          </div>
        </header>

        <section className="relative overflow-hidden px-6 py-12 sm:px-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(10,20,15,0.78), rgba(22,163,74,0.35)), url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=60')",
              filter: 'blur(1px)',
            }}
          />
          <div className="relative z-10 grid gap-8 lg:grid-cols-2">
            <div className="animate-fadeUp text-white">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> AI Restaurant Intelligence Platform
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">Reduce Restaurant Food Waste by 30% Using AI</h1>
              <p className="mt-4 max-w-xl text-sm text-slate-100 sm:text-base">AI-powered forecasting, order optimization and sustainability analytics.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => navigate('/dashboard')} className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white hover:bg-green-700">View Dashboard</button>
                <button onClick={() => setWelcomeOpen(true)} className="rounded-full border border-white/60 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">Request Demo</button>
              </div>
            </div>

            <div className="relative rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20">
              <img
                src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=60"
                alt="Dashboard preview"
                className="h-56 w-full rounded-xl object-cover opacity-85"
              />
              <div className="absolute -left-3 top-6 rounded-xl bg-emerald-500/90 px-3 py-2 text-xs font-semibold text-white">AI Waste Score: 78/100</div>
              <div className="absolute -right-3 bottom-6 rounded-xl bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white">Projected Savings: {formatINR(240000)}</div>
              <div className="absolute right-4 top-4 flex gap-2 text-white/90">
                <Leaf className="h-4 w-4" />
                <Recycle className="h-4 w-4" />
                <Cpu className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">
          <article className="rounded-2xl bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Revenue Analyzed</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatINR(count.revenue)}</p>
          </article>
          <article className="rounded-2xl bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Waste Saved</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatINR(count.wasteSaved)}</p>
          </article>
          <article className="rounded-2xl bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Meals Recovered</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatNumber(count.mealsRecovered)}</p>
          </article>
          <article className="rounded-2xl bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg ring-1 ring-slate-200">
            <p className="text-xs text-slate-500">Average Waste Rate</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{count.wasteRate}%</p>
          </article>
        </section>

        <section className="grid gap-4 px-6 pb-6 sm:px-8 lg:grid-cols-2">
          <article className="rounded-2xl bg-red-50 p-5 ring-1 ring-red-100 transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-bold text-slate-900">The Problem</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {problems.map((item) => (
                <li key={item} className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-red-400" />{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-bold text-slate-900">The AI Solution</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Upload Data</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">AI Forecast</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Smart Order</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
              <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Reduce Waste</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">End-to-end AI workflow for forecasting, optimization and cost control.</p>
          </article>
        </section>

        <section className="px-6 pb-6 sm:px-8">
          <h3 className="text-2xl font-bold text-slate-900">Real Dashboard Preview</h3>
          <div className="relative mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=60"
              alt="Restaurant analytics"
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent" />
            <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-800">Waste vs Revenue Live</div>
            <div className="absolute bottom-4 right-4 rounded-xl bg-emerald-500/90 px-3 py-2 text-xs font-semibold text-white">Confidence 89%</div>
          </div>
        </section>

        <section className="px-6 pb-6 sm:px-8">
          <h3 className="text-2xl font-bold text-slate-900">Industry We Serve</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => (
              <article key={industry.title} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
                <img src={industry.image} alt={industry.title} className="h-28 w-full object-cover grayscale" />
                <p className="p-3 text-sm font-semibold text-slate-800">{industry.title}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 px-6 pb-6 sm:px-8 lg:grid-cols-2">
          <article className="rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 p-5 text-white">
            <h3 className="text-2xl font-bold">Protect the Planet. Increase Profit.</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 text-sm">
              <p className="rounded-lg bg-white/15 p-3">CO2 Saved: 2,480 kg</p>
              <p className="rounded-lg bg-white/15 p-3">Meals Saved: 1,550</p>
              <p className="rounded-lg bg-white/15 p-3">Waste Reduced: 12%</p>
            </div>
          </article>

          <article className="rounded-2xl bg-slate-900 p-5 text-white">
            <h3 className="text-xl font-bold">AI Waste Score Meter</h3>
            <p className="mt-2 text-4xl font-extrabold">78 / 100</p>
            <p className="mt-1 text-sm text-slate-300">Your kitchen is operating efficiently.</p>
          </article>
        </section>

        <section className="grid gap-4 px-6 pb-6 sm:px-8 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-slate-900">What-if Simulation Tool</h3>
            <p className="mt-2 text-sm text-slate-600">What if you reduce rice prep by {riceReduction}%?</p>
            <input type="range" min="2" max="15" value={riceReduction} onChange={(e) => setRiceReduction(Number(e.target.value))} className="mt-3 w-full accent-emerald-600" />
            <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-100">Projected savings: <span className="font-semibold">{formatINR(simulationSavings)}</span> / month</p>
          </article>

          <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h3 className="text-xl font-bold text-slate-900">ROI Calculator</h3>
            <p className="mt-2 text-sm text-slate-600">Monthly revenue input (₹)</p>
            <input
              type="number"
              value={roiRevenue}
              onChange={(e) => setRoiRevenue(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
              Estimated annual savings: <span className="font-semibold">{formatINR(annualSavings)}</span>
            </p>
          </article>
        </section>

        <section className="px-6 pb-6 sm:px-8">
          <h3 className="text-xl font-bold text-slate-900">Waste Heatmap (Mon-Sun)</h3>
          <div className="mt-3 grid grid-cols-7 gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            {wasteHeatmap.map((day) => {
              const total = day.breakfast + day.lunch + day.dinner;
              return (
                <div key={day.day} className="text-center">
                  <p className="mb-1 text-xs font-semibold text-slate-600">{day.day}</p>
                  <div className={`mx-auto h-12 w-full rounded-lg ${heatValueClass(total)} opacity-90`} />
                  <p className="mt-1 text-[10px] text-slate-500">{total} pts</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900 mx-6 mb-6 p-6 text-white sm:mx-8">
          <h3 className="text-2xl font-bold">Start Building a Smarter Kitchen Today</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={() => navigate('/dashboard')} className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold hover:bg-emerald-600">Get Started</button>
            <button onClick={() => navigate('/subscription')} className="rounded-full border border-white/50 px-5 py-2 text-sm font-semibold hover:bg-white/10">See Plans & Pricing</button>
          </div>
        </section>

        <section className="flex flex-wrap gap-2 px-6 pb-6 text-xs sm:px-8">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200"><BadgeCheck className="h-3.5 w-3.5" /> Trusted by 20+ Restaurants</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-slate-700 ring-1 ring-slate-200"><ShieldCheck className="h-3.5 w-3.5" /> ISO Data Secure</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-orange-700 ring-1 ring-orange-200"><Leaf className="h-3.5 w-3.5" /> Made for Indian Restaurants</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-slate-700 ring-1 ring-slate-200"><CloudRain className="h-3.5 w-3.5" /> Weather-aware Forecasts</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-slate-700 ring-1 ring-slate-200"><Cpu className="h-3.5 w-3.5" /> Explainable AI</span>
        </section>

        <section className="grid gap-3 border-t border-slate-200 px-6 py-6 text-sm text-slate-700 sm:grid-cols-2 sm:px-8">
          <p><span className="font-semibold">Platform Support:</span> support@wastewise.ai</p>
          <p><span className="font-semibold">Enterprise Helpline:</span> +91 98765 43210</p>
          <p><span className="font-semibold">Organization:</span> Urban Dine Group</p>
          <p><span className="font-semibold">Active Branch:</span> Bengaluru - Koramangala</p>
        </section>

        <footer className="px-6 pb-6 text-center text-xs text-slate-500 sm:px-8">
          © 2026 WasteWise Intelligence - AI for Sustainable Restaurant Operations
        </footer>
      </div>

      {welcomeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md animate-fadeUp rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Welcome to WasteWise AI</h3>
              <button onClick={() => setWelcomeOpen(false)} className="rounded-full p-1 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-sm text-slate-600">Discover how restaurants reduce waste by 30%.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setWelcomeOpen(false); navigate('/dashboard'); }} className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white">Explore Dashboard</button>
              <button onClick={() => { setWelcomeOpen(false); navigate('/predictions'); }} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">View Demo</button>
            </div>
          </div>
        </div>
      ) : null}

      {insightToast ? (
        <div className="fixed right-4 top-4 z-50 animate-fadeUp rounded-xl bg-white p-3 text-sm shadow-soft ring-1 ring-slate-200">
          <p className="font-semibold text-emerald-700">Waste Reduced by 12% This Month</p>
        </div>
      ) : null}

      {sustainabilityToast ? (
        <div className="fixed bottom-4 left-4 z-50 animate-fadeUp rounded-xl bg-emerald-600 p-3 text-sm text-white shadow-soft">
          🌱 1,550 meals saved this month
        </div>
      ) : null}

      {aiAlert ? (
        <div className="fixed right-4 top-20 z-50 animate-fadeUp rounded-xl bg-orange-50 p-3 text-sm text-orange-800 shadow-soft ring-1 ring-orange-200">
          ⚠ High waste detected in weekend sales trend
        </div>
      ) : null}
    </div>
  );
}

export default HomePage;
