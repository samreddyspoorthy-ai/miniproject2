import { useEffect, useState } from 'react';
import { Building2, ShieldCheck, Users } from 'lucide-react';
import { fetchPlatformOverview } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

function AdminDashboardPage() {
  const { history, user, totalEcoScore, totalCarbonSaved } = useAppSession();
  const [overview, setOverview] = useState(null);

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
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Admin Dashboard</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">Security, oversight, NGO management, and user impact</h2>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-4">
        <article className="app-card p-5">
          <div className="icon-pill">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-400">Active users</p>
          <p className="mt-2 text-3xl font-semibold text-white">{overview?.admin_dashboard?.active_users || 0}</p>
        </article>
        <article className="app-card p-5">
          <div className="icon-pill">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-400">Today pickups</p>
          <p className="mt-2 text-3xl font-semibold text-white">{overview?.admin_dashboard?.today_pickups || 0}</p>
        </article>
        <article className="app-card p-5">
          <div className="icon-pill">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-400">NGO partners</p>
          <p className="mt-2 text-3xl font-semibold text-white">{overview?.admin_dashboard?.ngo_partners || 0}</p>
        </article>
        <article className="app-card p-5">
          <div className="icon-pill">
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-slate-400">Open reports</p>
          <p className="mt-2 text-3xl font-semibold text-white">{overview?.admin_dashboard?.open_dump_reports || 0}</p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">User authentication and eco profile</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
              User: <span className="font-semibold text-white">{user?.name || 'Guest user'}</span>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
              Personal eco impact score: <span className="font-semibold text-white">{totalEcoScore}</span>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
              Carbon saved through usage history: <span className="font-semibold text-white">{totalCarbonSaved.toFixed(2)} kg</span>
            </div>
          </div>
        </article>

        <article className="app-card p-6">
          <h3 className="text-lg font-semibold text-white">Recent user history</h3>
          <div className="mt-4 space-y-3">
            {history.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
                <p className="font-semibold capitalize text-white">
                  {item.predictedClass} · {item.wasteCategory}
                </p>
                <p>Confidence: {Math.round(item.confidence * 100)}%</p>
                <p>Eco points earned: {item.ecoPoints}</p>
              </div>
            ))}
            {history.length === 0 ? <p className="text-sm text-slate-400">No user history yet.</p> : null}
          </div>
        </article>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
