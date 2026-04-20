import { Link2 } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { integrations } from '../data/mockData';

function IntegrationsPage() {
  const [connected, setConnected] = useState([]);

  const toggleConnect = (name) => {
    setConnected((prev) =>
      prev.includes(name) ? prev.filter((entry) => entry !== name) : [...prev, name],
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="POS & Platform Integrations"
        subtitle="Connect ordering, delivery, finance, and accounting systems for full-stack restaurant intelligence."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <article key={integration.name} className="card-surface p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Link2 className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold text-slate-900">{integration.name}</p>
            <p className="mt-1 text-sm text-slate-500">Status: {integration.status}</p>
            <button
              onClick={() => toggleConnect(integration.name)}
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {integration.status === 'Available'
                ? connected.includes(integration.name)
                  ? 'Connected'
                  : 'Connect'
                : connected.includes(integration.name)
                  ? 'Notification Enabled'
                  : 'Notify Me'}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

export default IntegrationsPage;
