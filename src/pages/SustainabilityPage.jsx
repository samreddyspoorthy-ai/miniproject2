import { useEffect, useState } from 'react';
import { AlertTriangle, CloudRain, Flame, Leaf, Wind } from 'lucide-react';
import { fetchPlatformOverview } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

function SustainabilityPage() {
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

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Sustainability</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">Air, weather, and circular economy intelligence</h2>
        <p className="mt-3 text-base leading-8 text-slate-300">
          This page groups AQI, weather interaction, environmental warnings, lifecycle flow, and circular economy impact
          into one clean sustainability module.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <article className="app-card p-5">
          <div className="icon-pill">
            <Wind className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Air Quality Integration</h3>
          <p className="mt-3 text-4xl font-semibold text-white">{overview?.aqi?.value || '--'}</p>
          <p className="mt-2 text-sm text-emerald-100">{overview?.aqi?.level || 'Loading AQI'}</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{overview?.aqi?.burning_waste_impact}</p>
        </article>

        <article className="app-card p-5">
          <div className="icon-pill">
            <CloudRain className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Weather + Waste Interaction</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{overview?.weather_interaction?.rain_warning}</p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{overview?.weather_interaction?.heat_warning}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
            {overview?.weather_interaction?.condition} · {overview?.weather_interaction?.temperature_c}°C
          </p>
        </article>

        <article className="app-card p-5">
          <div className="icon-pill">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Dynamic Warning</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {analysis
              ? `Current item: ${analysis.predicted_class} in ${analysis.waste_category}. Risk: ${analysis.risk_assessment.level}.`
              : 'Run a waste scan to personalize the warning layer.'}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Burning or dumping mixed waste can degrade AQI, block drains, and increase methane or toxic leakage.
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Leaf className="h-4 w-4 text-emerald-300" />
            Circular economy simulation mode
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Plastic recycled</p>
              <p className="mt-2 text-2xl font-semibold text-white">80%</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">CO₂ saved</p>
              <p className="mt-2 text-2xl font-semibold text-white">32 tons</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Landfill reduction</p>
              <p className="mt-2 text-2xl font-semibold text-white">18%</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This policy-oriented simulation shows how higher recovery rates can reduce landfill load and carbon emissions.
          </p>
        </article>

        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Flame className="h-4 w-4 text-emerald-300" />
            Environmental persistence snapshot
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              ['Plastic', '450 years'],
              ['Organic', '2-6 weeks'],
              ['Glass', '1 million years'],
              ['Metal', '50-200 years'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default SustainabilityPage;
