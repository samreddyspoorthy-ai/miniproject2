import { Globe, Layers3, Mic, ShieldCheck, UserCircle2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppSession } from '../context/AppSessionContext';

const NAV_ITEMS = [
  { to: '/hub', label: 'Feature Hub' },
  { to: '/options', label: 'Classification' },
  { to: '/smart-city', label: 'Smart City' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/analytics-lab', label: 'Analytics' },
  { to: '/admin', label: 'Admin' },
  { to: '/research-lab', label: 'Research' },
  { to: '/auth', label: 'Account' },
];

function AppLayout() {
  const { user, language, voiceMode, arMode } = useAppSession();

  return (
    <div className="min-h-screen bg-app px-4 py-4 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col rounded-[32px] border border-white/10 bg-slate-950/70 shadow-[0_24px_80px_rgba(15,23,42,0.42)] backdrop-blur">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-100">EcoVision AI Nexus</p>
            <h1 className="mt-1 text-xl font-semibold text-white">Smart Waste Management Platform</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
              <Globe className="h-3.5 w-3.5 text-emerald-300" />
              {language}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
              <Mic className="h-3.5 w-3.5 text-emerald-300" />
              Voice {voiceMode ? 'On' : 'Off'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
              <Layers3 className="h-3.5 w-3.5 text-emerald-300" />
              AR {arMode ? 'Ready' : 'Off'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
              <UserCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              {user?.name || 'Guest'}
            </span>
          </div>
        </header>

        <nav className="scrollbar-none flex gap-2 overflow-x-auto border-b border-white/10 px-5 py-3 sm:px-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-emerald-400 text-slate-950' : 'bg-white/5 text-slate-200 hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="ml-auto hidden items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-slate-300 md:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            App modules separated by workflow
          </div>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
