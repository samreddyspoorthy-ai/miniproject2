import { useEffect, useState } from 'react';
import { CalendarClock, ExternalLink, Landmark, Leaf, MapPin, Phone, Recycle, ShieldCheck } from 'lucide-react';
import { fetchOrganizations, fetchPlatformOverview, schedulePickup } from '../api/client';
import { useAppSession } from '../context/AppSessionContext';

function SmartCitySupportPage() {
  const { analysis } = useAppSession();
  const [organizations, setOrganizations] = useState([]);
  const [overview, setOverview] = useState(null);
  const [scheduleMessage, setScheduleMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [orgResponse, platformResponse] = await Promise.all([
        fetchOrganizations(
          analysis
            ? {
                category: analysis.waste_category,
                material: analysis.predicted_class,
              }
            : {},
        ),
        fetchPlatformOverview(),
      ]);

      if (!cancelled) {
        setOrganizations(orgResponse.organizations);
        setOverview(platformResponse);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [analysis]);

  async function handleSchedule(title, eta) {
    const response = await schedulePickup({
      service_type: title,
      category: analysis?.waste_category || 'General',
      preferred_slot: eta,
      notes: analysis ? `Scheduled for ${analysis.predicted_class}` : 'Scheduled from smart city support page',
    });
    setScheduleMessage(response.message);
  }

  const nearbyCenters =
    analysis?.nearby_centers || [
      {
        name: 'Hyderabad Dry Waste Collection Center',
        address: 'Ward Resource Recovery Hub, Banjara Hills',
        distance_km: 5.2,
        kind: 'Recycling',
        map_url: 'https://www.google.com/maps/search/?api=1&query=17.4126,78.4342',
      },
      {
        name: 'Greater Hyderabad Hazardous Drop-Off Point',
        address: 'Municipal Hazardous Collection Desk, Secunderabad',
        distance_km: 6.2,
        kind: 'Hazardous',
        map_url: 'https://www.google.com/maps/search/?api=1&query=17.4399,78.4983',
      },
    ];

  const scheduleOptions =
    analysis?.collection_schedule_options || [
      {
        title: 'Book Regular Pickup',
        description: 'Bundle this item with the next municipal segregated collection round.',
        eta: 'Within 24 hours',
      },
      {
        title: 'Schedule Hazardous Drop-Off',
        description: 'Reserve a supervised slot for hazardous or e-waste items.',
        eta: 'Next weekend slot',
      },
      {
        title: 'Report Illegal Dumping',
        description: 'Raise a civic escalation for unmanaged dumping points.',
        eta: 'Logged instantly',
      },
    ];

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-8">
      <div className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Smart City Support</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">Nearby recycling centers, NGO and government support, scheduling, metrics, and awareness</h2>
        <p className="mt-3 text-base leading-8 text-slate-300">
          This page groups the city-support features into one dedicated module so they are easy to find without cluttering the classification screens.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Recycle className="h-4 w-4 text-emerald-300" />
            Nearby recycling centers
          </div>
          <div className="mt-4 space-y-3">
            {nearbyCenters.map((center) => (
              <div key={center.name} className="rounded-2xl bg-white/5 p-4">
                <p className="text-base font-semibold text-white">{center.name}</p>
                <p className="mt-1 text-sm text-emerald-100">{center.kind}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{center.address}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-400">{center.distance_km} km away</p>
                  <a
                    href={center.map_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950/60 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Open map
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Landmark className="h-4 w-4 text-emerald-300" />
            NGO and government support points
          </div>
          <div className="mt-4 space-y-3">
            {organizations.map((organization) => (
              <div key={organization.name} className="rounded-2xl bg-white/5 p-4">
                <p className="text-base font-semibold text-white">{organization.name}</p>
                <p className="mt-1 text-sm text-emerald-100">{organization.kind}</p>
                <p className="mt-2 flex items-start gap-2 text-sm text-slate-300">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                  <span>
                    {organization.address}, {organization.city}
                  </span>
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm text-slate-300">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-emerald-200" />
                  <span>{organization.contact}</span>
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <CalendarClock className="h-4 w-4 text-emerald-300" />
            Waste collection scheduling
          </div>
          <div className="mt-4 space-y-3">
            {scheduleOptions.map((option) => (
              <button
                key={option.title}
                type="button"
                onClick={() => handleSchedule(option.title, option.eta)}
                className="w-full rounded-2xl bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <p className="text-base font-semibold text-white">{option.title}</p>
                <p className="mt-1 text-sm leading-7 text-slate-300">{option.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-emerald-100">{option.eta}</p>
              </button>
            ))}
          </div>
          {scheduleMessage ? <p className="mt-4 text-sm text-emerald-200">{scheduleMessage}</p> : null}
        </article>

        <article className="app-card p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Environmental metrics and awareness
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Carbon impact</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {analysis?.environmental_metrics?.carbon_impact_kg_co2e ?? 0} kg CO2e
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Methane risk</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {analysis?.environmental_metrics?.methane_risk || 'Moderate'}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">AQI</p>
              <p className="mt-2 text-2xl font-semibold text-white">{overview?.aqi?.value || '--'}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Damage score</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {analysis?.environmental_metrics?.damage_score ?? 0}/100
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-emerald-400/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
              <Leaf className="h-4 w-4" />
              Awareness feature
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {analysis?.awareness_tip?.description ||
                overview?.aqi?.burning_waste_impact ||
                'Correct segregation improves recycling efficiency, reduces landfill load, and protects air and water quality.'}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

export default SmartCitySupportPage;
