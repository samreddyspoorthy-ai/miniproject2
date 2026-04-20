import { useMemo, useState } from 'react';
import { Award, MapPin, Plus, TriangleAlert } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from '../components/charts/ChartCard';
import PageHeader from '../components/common/PageHeader';
import { branchComparison, branchTable } from '../data/mockData';
import { formatCompactINR } from '../utils/formatters';

function BranchManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState(branchTable);
  const [form, setForm] = useState({ name: '', city: '', manager: '' });

  const ranked = useMemo(
    () => [...branchComparison].sort((a, b) => b.efficiencyScore - a.efficiencyScore),
    [],
  );

  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  const saveBranch = () => {
    if (!form.name || !form.city || !form.manager) return;

    setBranches((prev) => [
      ...prev,
      { name: form.name, manager: form.manager, city: form.city, active: true, monthlyWaste: 0 },
    ]);
    setForm({ name: '', city: '', manager: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Branch Intelligence"
        subtitle="Ranking, efficiency scores, and strategic branch-level waste intelligence."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="card-surface p-5">
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <Award className="h-5 w-5" />
            <p className="font-semibold">Best Performing Branch</p>
          </div>
          <p className="text-lg font-bold text-slate-900">{best.branch}</p>
          <p className="text-sm text-slate-600">Efficiency Score: {best.efficiencyScore}</p>
          <p className="mt-2 text-sm text-emerald-700">{best.branch} ranked #1 in waste reduction this month.</p>
        </article>
        <article className="card-surface p-5">
          <div className="mb-2 flex items-center gap-2 text-red-600">
            <TriangleAlert className="h-5 w-5" />
            <p className="font-semibold">Worst Performing Branch</p>
          </div>
          <p className="text-lg font-bold text-slate-900">{worst.branch}</p>
          <p className="text-sm text-slate-600">Efficiency Score: {worst.efficiencyScore}</p>
          <p className="mt-2 text-sm text-red-600">Requires immediate intervention for waste leakage control.</p>
        </article>
      </section>

      <section className="card-surface overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Monthly Waste Cost</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.name} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{branch.name}</td>
                <td className="px-4 py-3 text-slate-600">{branch.manager}</td>
                <td className="px-4 py-3 text-slate-600">{branch.city}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${branch.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    {branch.active ? 'Active' : 'Paused'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{formatCompactINR(branch.monthlyWaste)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Branch Ranking System" subtitle="Waste efficiency score per branch.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ranked}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="efficiencyScore" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="card-surface p-5">
          <h3 className="text-base font-semibold text-slate-900">Location Coverage</h3>
          <div className="mt-4 space-y-3 text-sm">
            {branches.map((branch) => (
              <div key={branch.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <span>{branch.city}</span>
                </div>
                <span className="text-slate-500">{branch.name.split(' - ')[1] || 'Main'}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">Add New Branch</h3>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Branch Name" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} />
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))} />
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Manager" value={form.manager} onChange={(e) => setForm((v) => ({ ...v, manager: e.target.value }))} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" onClick={saveBranch} disabled={!form.name || !form.city || !form.manager}>
                Save Branch
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BranchManagementPage;
