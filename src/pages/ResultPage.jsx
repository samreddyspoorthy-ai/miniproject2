import { useEffect } from 'react';
import { BarChart3, Boxes, ChevronLeft, ChevronRight, Radar, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSession } from '../context/AppSessionContext';

const CATEGORY_STYLES = {
  Recyclable: 'bg-emerald-500/15 text-emerald-200 ring-emerald-300/30',
  'Non-recyclable': 'bg-slate-400/15 text-slate-100 ring-slate-300/30',
  Organic: 'bg-lime-500/15 text-lime-100 ring-lime-300/30',
  Hazardous: 'bg-rose-500/15 text-rose-100 ring-rose-300/30',
};

function titleize(value) {
  return value
    ?.split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function ResultPage() {
  const navigate = useNavigate();
  const { analysis, previewUrl } = useAppSession();

  useEffect(() => {
    if (!analysis) navigate('/input', { replace: true });
  }, [analysis, navigate]);

  if (!analysis) return null;

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/input')}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate('/suggestions')}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 grid flex-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="app-card overflow-hidden p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Step 3</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Classification result</h1>
          <div className="relative mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-slate-900">
            <img src={previewUrl} alt="Analyzed waste" className="aspect-[4/3] w-full object-cover" />
            {analysis.detections.map((detection, index) => (
              <div
                key={`${detection.label}-${index}`}
                className="absolute rounded-xl border-2"
                style={{
                  left: `${(detection.bounding_box.x / analysis.debug.original_size[0]) * 100}%`,
                  top: `${(detection.bounding_box.y / analysis.debug.original_size[1]) * 100}%`,
                  width: `${(detection.bounding_box.width / analysis.debug.original_size[0]) * 100}%`,
                  height: `${(detection.bounding_box.height / analysis.debug.original_size[1]) * 100}%`,
                  borderColor: detection.color,
                  boxShadow: `0 0 0 1px ${detection.color}55 inset`,
                }}
              >
                <span
                  className="absolute left-1 top-1 rounded-full px-2 py-1 text-[10px] font-semibold text-slate-950"
                  style={{ backgroundColor: detection.color }}
                >
                  {titleize(detection.label)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Boxes className="h-4 w-4 text-emerald-300" />
              Multi-object detection
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {analysis.item_counts.map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-950/60 p-3">
                  <p className="text-sm text-slate-400">{titleize(item.category)}</p>
                  <p className="mt-1 text-lg font-semibold capitalize text-white">
                    {item.count} {item.label}
                    {item.count > 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="app-card p-6">
          <div className="icon-pill">
            <Radar className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-3xl font-semibold capitalize text-white">{analysis.predicted_class}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Waste type detected with stable deterministic classification and fixed mapping.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                CATEGORY_STYLES[analysis.waste_category] || 'bg-white/10 text-white ring-white/15'
              }`}
            >
              {analysis.waste_category}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              Confidence {Math.round(analysis.confidence_score * 100)}%
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Waste stream
              </div>
              <p className="mt-3 text-xl font-semibold text-white">{analysis.waste_category}</p>
              <p className="mt-1 text-sm text-slate-400">{analysis.confidence_label}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Zap className="h-4 w-4 text-emerald-300" />
                Material detail
              </div>
              <p className="mt-3 text-xl font-semibold capitalize text-white">{analysis.predicted_class}</p>
              <p className="mt-1 text-sm text-slate-400">{analysis.model_name}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Approx weight</p>
              <p className="mt-2 text-2xl font-semibold text-white">{analysis.weight_estimate.total_weight_g} g</p>
              <p className="mt-1 text-sm text-slate-400">AI approximation</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Volume</p>
              <p className="mt-2 text-2xl font-semibold text-white">{analysis.weight_estimate.total_volume_ml} ml</p>
              <p className="mt-1 text-sm text-slate-400">Bounding-box based</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Decomposition</p>
              <p className="mt-2 text-2xl font-semibold text-white">{analysis.environmental_metrics.decomposition_time}</p>
              <p className="mt-1 text-sm text-slate-400">Environmental persistence</p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BarChart3 className="h-4 w-4 text-emerald-300" />
              Carbon and damage estimator
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-950/60 p-3">
                <p className="text-sm text-slate-400">Carbon impact</p>
                <p className="mt-1 text-lg font-semibold text-white">{analysis.environmental_metrics.carbon_impact_kg_co2e} kg CO2e</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-3">
                <p className="text-sm text-slate-400">Carbon saved if recycled</p>
                <p className="mt-1 text-lg font-semibold text-white">{analysis.environmental_metrics.carbon_saved_if_recycled_kg} kg</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-3">
                <p className="text-sm text-slate-400">Damage score</p>
                <p className="mt-1 text-lg font-semibold text-white">{analysis.environmental_metrics.damage_score}/100</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-400">{analysis.weight_estimate.method}</p>
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold text-white">Top 3 predictions</h3>
            <div className="mt-4 space-y-3">
              {analysis.top_3_predictions.map((item) => (
                <div key={`${item.label}-${item.class_index}`} className="rounded-2xl bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold capitalize text-white">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-200">{Math.round(item.score * 100)}%</p>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${item.score * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default ResultPage;
