import { AlertTriangle, Clock3 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { inventoryAging } from '../data/mockData';

function InventoryAgingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Inventory Aging Tracker"
        subtitle="Track expiring items, shelf life risks, and raw material aging to prevent spoilage."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Expiring Soon Items</p>
          <p className="mt-1 text-3xl font-bold text-red-600">7</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Aging Risk Batches</p>
          <p className="mt-1 text-3xl font-bold text-orange-600">4</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Potential Avoidable Loss</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">₹38,400</p>
        </article>
      </section>

      <section className="card-surface overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Inventory Shelf-Life Monitor</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Raw Material</th>
                <th className="px-4 py-3">Shelf Life</th>
                <th className="px-4 py-3">Aging Risk</th>
                <th className="px-4 py-3">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {inventoryAging.map((item) => (
                <tr key={item.item} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.item}</td>
                  <td className="px-4 py-3 text-slate-600">{item.shelfLife}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.risk === 'High' ? 'bg-red-100 text-red-700' : item.risk === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.utilizationPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-surface p-5 text-sm text-slate-700">
        <p className="mb-2 font-semibold text-slate-900">Smart Alerts</p>
        <p className="rounded-xl bg-red-50 p-3 text-red-700 ring-1 ring-red-100"><AlertTriangle className="mr-1 inline h-4 w-4" /> Spinach batch expires in less than 24 hours.</p>
        <p className="mt-2 rounded-xl bg-orange-50 p-3 text-orange-700 ring-1 ring-orange-100"><Clock3 className="mr-1 inline h-4 w-4" /> Tomatoes utilization dropped below 65% this week.</p>
      </section>
    </div>
  );
}

export default InventoryAgingPage;
