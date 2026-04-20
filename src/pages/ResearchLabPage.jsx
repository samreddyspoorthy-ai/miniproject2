import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Blocks, BrainCircuit, Cpu, QrCode, ScanSearch } from 'lucide-react';
import { fetchPlatformOverview } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

function ResearchLabPage() {
  const [overview, setOverview] = useState(null);
  const { analysis, arMode, voiceMode } = useAppSession();

  useEffect(() => {
    let cancelled = false;
    fetchPlatformOverview().then((payload) => {
      if (!cancelled) setOverview(payload);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const explainabilityStyle = useMemo(() => {
    if (!analysis?.detections?.length) return { left: '10%', top: '15%', width: '35%', height: '35%' };
    const best = analysis.detections[0];
    return {
      left: `${(best.bounding_box.x / analysis.debug.original_size[0]) * 100}%`,
      top: `${(best.bounding_box.y / analysis.debug.original_size[1]) * 100}%`,
      width: `${(best.bounding_box.width / analysis.debug.original_size[0]) * 100}%`,
      height: `${(best.bounding_box.height / analysis.debug.original_size[1]) * 100}%`,
    };
  }, [analysis]);

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Research Lab</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">Advanced AI, explainability, and publication-oriented concepts</h2>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu className="h-4 w-4 text-emerald-300" />
            Model comparison module
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview?.model_comparison || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="model" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#34d399" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <BrainCircuit className="h-4 w-4 text-emerald-300" />
            AI explainability panel
          </div>
          <div className="relative mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-slate-900">
            {analysis?.cached_image_url ? (
              <>
                <img src={`http://127.0.0.1:8000${analysis.cached_image_url}`} alt="Explainability" className="aspect-[4/3] w-full object-cover opacity-85" />
                <div
                  className="absolute rounded-[26px] bg-[radial-gradient(circle,_rgba(251,191,36,0.55),_rgba(239,68,68,0.28),_transparent_72%)] blur-sm"
                  style={explainabilityStyle}
                />
              </>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-slate-500">Run a scan to see explainability.</div>
            )}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            The heat region highlights why the model focused on the predicted waste area, similar to a Grad-CAM style explanation.
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <article className="app-card p-5">
          <div className="icon-pill">
            <Blocks className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Federated learning concept</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Cities: {overview?.federated_learning?.cities?.join(', ')}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">{overview?.federated_learning?.privacy_note}</p>
        </article>

        <article className="app-card p-5">
          <div className="icon-pill">
            <QrCode className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">Blockchain + QR tracking</h3>
          <div className="mt-3 space-y-3">
            {overview?.blockchain_tracking?.map((item) => (
              <div key={item.stage} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                <p className="font-semibold text-white">{item.stage}</p>
                <p>{item.owner}</p>
                <p className="text-emerald-100">{item.status}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="app-card p-5">
          <div className="icon-pill">
            <ScanSearch className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">AR / Voice / E-waste module</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">AR mode: {arMode ? 'Ready' : 'Disabled'}</p>
          <p className="mt-2 text-sm leading-7 text-slate-300">Voice mode: {voiceMode ? 'Ready' : 'Disabled'}</p>
          <p className="mt-3 text-sm font-semibold text-white">Certified e-waste recyclers</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {overview?.e_waste_module?.certified_recyclers?.map((name) => (
              <span key={name} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                {name}
              </span>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default ResearchLabPage;
