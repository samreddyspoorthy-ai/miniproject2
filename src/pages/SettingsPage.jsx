import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { roleAccess } from '../data/mockData';

const exportLogs = [
  { file: 'financial-impact-feb.pdf', user: 'Owner', time: '2026-02-26 10:14' },
  { file: 'waste-report-week4.csv', user: 'Manager', time: '2026-02-25 18:40' },
];

const auditLogs = [
  { action: 'Changed branch threshold', actor: 'Asha Nair', time: '2026-02-26 09:12' },
  { action: 'Enabled push anomaly alerts', actor: 'Rohan Mehta', time: '2026-02-24 16:02' },
  { action: 'Updated subscription plan', actor: 'Owner', time: '2026-02-21 11:33' },
];

function SettingsPage() {
  const [name, setName] = useState('Asha Nair');
  const [email, setEmail] = useState('admin@wastewise.ai');
  const [org, setOrg] = useState('Urban Dine Group');
  const [saved, setSaved] = useState(false);
  const [role, setRole] = useState('Owner');
  const [darkMode, setDarkMode] = useState(false);

  const onSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings & Enterprise Admin" subtitle="Manage account, role-based permissions, audit visibility, API access, and compliance controls." />

      {saved ? <p className="text-sm font-medium text-emerald-700">Settings saved successfully.</p> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Role-Based Access Control</h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {roleAccess.map((entry) => (
              <button
                key={entry.role}
                onClick={() => setRole(entry.role)}
                className={`rounded-lg px-3 py-2 text-left text-sm ${role === entry.role ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {entry.role}
              </button>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
            {roleAccess.find((entry) => entry.role === role)?.access}
          </p>
        </article>

        <article className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Notification Preferences</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            {['Daily prediction summary', 'High waste anomaly alerts', 'Weekly financial report', 'Push cost leakage alerts'].map((label) => (
              <label key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                {label}
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-600" />
              </label>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Organization Profile</h3>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={org} onChange={(e) => setOrg(e.target.value)} />
            <button onClick={onSave} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Save Changes</button>
          </div>
        </article>

        <article className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">API Access & Compliance</h3>
          <p className="mt-2 text-sm text-slate-600">API Key usage this month: 68%</p>
          <div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-full w-[68%] rounded-full bg-emerald-500" /></div>
          <p className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">ISO Data Secure Compliance Badge</p>
          <button onClick={toggleDarkMode} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            {darkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
          </button>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Data Export Logs</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {exportLogs.map((log) => (
              <div key={log.file} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <p className="font-medium">{log.file}</p>
                <p className="text-xs text-slate-500">{log.user} • {log.time}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Audit Logs</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {auditLogs.map((log) => (
              <div key={`${log.action}-${log.time}`} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <p className="font-medium">{log.action}</p>
                <p className="text-xs text-slate-500">{log.actor} • {log.time}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default SettingsPage;
