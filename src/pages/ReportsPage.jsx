import { useState } from 'react';
import { Download, FileBarChart2, Leaf, Target } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { sustainabilityMetrics } from '../data/mockData';
import { formatINR, formatNumber } from '../utils/formatters';

const reportCards = [
  { title: 'Financial Impact Report', value: formatINR(284000), note: 'Total monthly waste-linked loss' },
  { title: 'Waste Reduction Metrics', value: '14.6%', note: 'Average reduction in last 90 days' },
  { title: 'Recovered Margin', value: formatINR(128500), note: 'Estimated margin protected' },
];

function ReportsPage() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (filename, title) => {
    const content = [
      title,
      'Platform: WasteWise Intelligence Platform',
      'Organization: Urban Dine Group',
      `CO2 Saved: ${formatNumber(sustainabilityMetrics.co2SavedKg)} kg`,
      `Meals Saved: ${formatNumber(sustainabilityMetrics.mealsSaved)}`,
      `Money Saved: ${formatINR(sustainabilityMetrics.moneySaved)}`,
      `Sustainability Score: ${sustainabilityMetrics.sustainabilityScore}/100`,
    ].join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & ESG Dashboard"
        subtitle="Financial impact, sustainability scorecards, and downloadable CSR reports."
        action={
          <button onClick={() => handleDownload('monthly-impact-report.pdf', 'Monthly Impact Report')} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            <Download className="h-4 w-4" />
            Download Monthly PDF
          </button>
        }
      />

      {downloaded ? <p className="text-sm font-medium text-emerald-700">Report download started.</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        {reportCards.map((card) => (
          <article key={card.title} className="card-surface p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <FileBarChart2 className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">CO2 Emissions Saved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{formatNumber(sustainabilityMetrics.co2SavedKg)} kg</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Meals Saved</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatNumber(sustainabilityMetrics.mealsSaved)}</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Money Saved</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatINR(sustainabilityMetrics.moneySaved)}</p>
        </article>
        <article className="card-surface p-5">
          <p className="text-sm text-slate-500">Sustainability Score</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{sustainabilityMetrics.sustainabilityScore}/100</p>
        </article>
      </section>

      <section className="card-surface p-6">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-orange-600" />
          <h3 className="font-semibold text-slate-900">Waste Reduction Metrics</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Prediction Model Accuracy</span>
            <span className="font-semibold">88%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-full w-[88%] rounded-full bg-emerald-500" /></div>
          <div className="flex items-center justify-between">
            <span>Waste Forecast Adoption</span>
            <span className="font-semibold">76%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-full w-[76%] rounded-full bg-orange-500" /></div>
          <div className="flex items-center justify-between">
            <span>Branch Compliance</span>
            <span className="font-semibold">92%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-full w-[92%] rounded-full bg-lime-500" /></div>
        </div>
      </section>

      <section className="card-surface p-5">
        <div className="mb-2 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-emerald-700" />
          <h3 className="font-semibold text-slate-900">Sustainability Impact Report</h3>
        </div>
        <p className="text-sm text-slate-600">Download CSR-ready sustainability report for investors and compliance teams.</p>
        <button onClick={() => handleDownload('sustainability-impact-report.pdf', 'Sustainability Impact Report')} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Download Sustainability Impact Report (PDF)
        </button>
      </section>
    </div>
  );
}

export default ReportsPage;
