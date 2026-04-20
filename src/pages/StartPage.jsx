import { ArrowRight, Leaf, Recycle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSession } from '../context/AppSessionContext';

function StartPage() {
  const navigate = useNavigate();
  const { clearSession } = useAppSession();

  function handleStart() {
    clearSession();
    navigate('/hub');
  }

  return (
    <div className="relative flex flex-1 items-center overflow-hidden rounded-[32px] p-5 sm:p-8">
      <div className="absolute inset-0 rounded-[32px] bg-[linear-gradient(135deg,rgba(15,23,42,0.7),rgba(2,6,23,0.82)),url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
      <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_30%)]" />

      <div className="relative z-10 grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-3xl self-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />
            EcoVision AI Nexus
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Smart waste classification for cleaner cities and faster segregation.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
            Detect recyclable, non-recyclable, organic, and hazardous waste with an app-style AI workflow built for
            modern sustainable waste management.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Start Classification
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 self-end sm:grid-cols-2 lg:grid-cols-1">
          <article className="app-card p-5">
            <div className="icon-pill">
              <Recycle className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Feature hub navigation</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Guided screens for classification, sustainability, analytics, admin, research, and nearby organizations.
            </p>
          </article>
          <article className="app-card p-5">
            <div className="icon-pill">
              <Leaf className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Stable AI decisions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Fixed RGB conversion, deterministic preprocessing, and consistent class mapping for repeatable results.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
