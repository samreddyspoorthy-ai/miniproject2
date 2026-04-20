import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

const plans = [
  {
    name: 'Basic',
    price: '₹999/month',
    features: ['1 branch', 'Weekly waste forecast', 'CSV upload + dashboard'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹2999/month',
    features: ['Up to 10 branches', 'Daily AI prediction', 'Advanced analytics + reports', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Sales',
    features: ['Unlimited branches', 'Custom integrations', 'Dedicated success manager', 'SLA + onboarding'],
    highlighted: false,
  },
];

function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plan"
        subtitle="Choose the right WasteWise AI plan for your restaurant operations."
      />

      <p className="text-sm text-slate-600">Current selection: <span className="font-semibold text-slate-900">{selectedPlan}</span></p>

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-2xl p-6 shadow-soft ring-1 transition-all hover:-translate-y-1 ${
              plan.highlighted
                ? 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white ring-emerald-500'
                : 'bg-white text-slate-800 ring-slate-200'
            } ${selectedPlan === plan.name ? 'ring-2 ring-orange-400' : ''}`}
          >
            <p className="text-sm font-medium opacity-80">{plan.name}</p>
            <h3 className="mt-2 text-3xl font-bold">{plan.price}</h3>
            <ul className="mt-5 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedPlan(plan.name)}
              className={`mt-6 w-full rounded-xl px-4 py-2 text-sm font-semibold ${
                plan.highlighted
                  ? 'bg-white text-emerald-700 hover:bg-emerald-50'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {plan.name === 'Enterprise' ? 'Talk to Sales' : 'Choose Plan'}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

export default SubscriptionPage;
