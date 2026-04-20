import {
  IndianRupee,
  PiggyBank,
  Recycle,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react';
import { formatINR, formatNumber } from '../../utils/formatters';

const iconMap = {
  IndianRupee,
  PiggyBank,
  Recycle,
  UtensilsCrossed,
};

function MetricCard({ metric }) {
  const Icon = iconMap[metric.icon] || IndianRupee;
  const TrendIcon = metric.up ? TrendingUp : TrendingDown;

  const value =
    typeof metric.value === 'number' && metric.key !== 'items'
      ? formatINR(metric.value)
      : typeof metric.value === 'number'
        ? formatNumber(metric.value)
        : metric.value;

  return (
    <article className="card-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-orange-100 text-green-700">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            metric.up ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'
          }`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {metric.trend}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-500">{metric.title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}

export default MetricCard;
