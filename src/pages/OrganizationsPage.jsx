import { useEffect, useState } from 'react';
import { ChevronLeft, ExternalLink, MapPin, Phone, Recycle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchOrganizations } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

function OrganizationsPage() {
  const navigate = useNavigate();
  const { analysis } = useAppSession();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!analysis) {
      navigate('/input', { replace: true });
      return;
    }

    let cancelled = false;

    async function loadOrganizations() {
      setLoading(true);
      setError('');
      try {
        const response = await fetchOrganizations({
          category: analysis.waste_category,
          material: analysis.predicted_class,
        });
        if (!cancelled) setOrganizations(response.organizations);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Unable to load organizations.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrganizations();

    return () => {
      cancelled = true;
    };
  }, [analysis, navigate]);

  if (!analysis) return null;

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/suggestions')}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Start Over
        </button>
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Step 5</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Nearby NGOs and organizations</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
          Suggested locations for <span className="font-semibold capitalize text-white">{analysis.predicted_class}</span> waste under the{' '}
          <span className="font-semibold text-white">{analysis.waste_category}</span> stream.
        </p>
      </div>

      {loading ? <p className="mt-8 text-sm text-slate-400">Loading organizations...</p> : null}
      {error ? <p className="mt-8 text-sm text-rose-300">{error}</p> : null}
      {!loading && !error && organizations.length === 0 ? (
        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-300">
          No exact NGO or government organization match was found for <span className="font-semibold capitalize text-white">{analysis.predicted_class}</span>.
          Try another image or use the suggestion page for the correct disposal flow.
        </div>
      ) : null}

      <div className="mt-8 grid flex-1 gap-5 lg:grid-cols-2">
        {organizations.map((organization) => (
          <article key={organization.name} className="app-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{organization.name}</h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">{organization.kind}</p>
              </div>
              <div className="icon-pill">
                <Recycle className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                <span>
                  {organization.address}, {organization.city}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                <span>{organization.contact}</span>
              </p>
            </div>

            <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
              Best match for: <span className="font-semibold capitalize text-white">{analysis.predicted_class}</span> under {analysis.waste_category}
            </div>
            <div className="mt-3 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
              Accepts categories: {organization.accepted_categories.join(', ')}
            </div>
            <div className="mt-3 rounded-2xl bg-white/5 p-4 text-sm leading-7 text-slate-300">
              Materials: {organization.accepted_materials.join(', ')}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {analysis.nearby_centers.map((center) => (
          <article key={center.name} className="app-card p-5">
            <p className="text-sm font-semibold text-white">{center.name}</p>
            <p className="mt-2 text-sm text-emerald-100">{center.kind}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{center.address}</p>
            <p className="mt-2 text-sm text-slate-400">{center.distance_km} km away</p>
            <a
              href={center.map_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Open map
              <ExternalLink className="h-4 w-4" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

export default OrganizationsPage;
