import {
  Activity,
  ArrowRight,
  Atom,
  Bot,
  Building2,
  CloudSun,
  Factory,
  LockKeyhole,
  Radar,
  Recycle,
  ScanSearch,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'Core AI Waste Flow',
    description: 'Upload, webcam, result analysis, suggestions, and nearby recycling support.',
    to: '/options',
    icon: Recycle,
  },
  {
    title: 'Sustainability Intelligence',
    description: 'AQI, weather interaction, circular economy, and environmental warnings.',
    to: '/sustainability',
    icon: CloudSun,
  },
  {
    title: 'Analytics & IoT',
    description: 'Smart bin simulation, predictive waste analytics, dashboards, and composition charts.',
    to: '/analytics-lab',
    icon: Activity,
  },
  {
    title: 'Smart City & Support',
    description: 'Nearby recycling centers, NGO and government support points, scheduling, metrics, and awareness.',
    to: '/smart-city',
    icon: Building2,
  },
  {
    title: 'Admin & Security',
    description: 'User accounts, history, analytics oversight, and NGO management views.',
    to: '/admin',
    icon: Shield,
  },
  {
    title: 'Research & Advanced AI',
    description: 'Model comparison, explainability, federated learning, blockchain, AR, voice, and QR tracking.',
    to: '/research-lab',
    icon: Atom,
  },
  {
    title: 'AI Assistant',
    description: 'Interactive waste chatbot and guided smart actions.',
    to: '/suggestions',
    icon: Bot,
  },
  {
    title: 'User Access',
    description: 'Login, signup, eco score, voice mode, AR mode, and multilingual preferences.',
    to: '/auth',
    icon: LockKeyhole,
  },
];

function FeatureHubPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <section className="hero-panel rounded-[28px] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-emerald-100">Platform Hub</p>
        <h2 className="mt-3 max-w-4xl text-4xl font-semibold text-white sm:text-5xl">
          Choose the module you want to explore instead of stacking every feature on one page.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-200">
          EcoVision AI Nexus now organizes core waste detection, sustainability, analytics, smart city modules,
          security, and research tools into a clean app-style workflow.
        </p>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {SECTIONS.map(({ title, description, to, icon: Icon }) => (
          <button
            key={title}
            type="button"
            onClick={() => navigate(to)}
            className="app-card group p-5 text-left transition hover:-translate-y-1 hover:border-emerald-300/30"
          >
            <div className="icon-pill">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
              Open module
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <article className="app-card p-5">
          <div className="icon-pill">
            <Radar className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">Classification Suite</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            MobileNetV2-oriented classification, multi-object view, webcam capture, and waste stream guidance.
          </p>
        </article>
        <article className="app-card p-5">
          <div className="icon-pill">
            <Factory className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">Industrial Simulation</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Smart bin fill level, pickup prediction, future waste generation, and seasonal analytics.
          </p>
        </article>
        <article className="app-card p-5">
          <div className="icon-pill">
            <ScanSearch className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">Explainable AI</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Heatmap-style explainability, model comparison, federated learning concept, and blockchain tracking.
          </p>
        </article>
      </div>
    </div>
  );
}

export default FeatureHubPage;
