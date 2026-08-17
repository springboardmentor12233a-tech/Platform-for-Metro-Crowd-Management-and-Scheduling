import { CheckCircle2, Cloud, ClipboardCheck, Rocket } from 'lucide-react';
import StatCard from './StatCard.jsx';

function statusClass(status) {
  const normalized = status.toLowerCase();
  if (normalized.includes('ready') || normalized.includes('passed') || normalized.includes('healthy')) {
    return 'bg-emerald-100 text-emerald-800';
  }
  if (normalized.includes('prepared')) return 'bg-cyan-100 text-cyan-800';
  return 'bg-orange-100 text-orange-800';
}

export default function Milestone4Panel({ report }) {
  if (!report) return null;

  return (
    <section className="rounded-3xl bg-white p-6 card-shadow">
      <div className="flex items-center gap-3">
        <Rocket className="text-cyan-600" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Milestone 4</p>
          <h2 className="text-xl font-bold text-slate-950">Testing, deployment and final documentation</h2>
          <p className="text-sm text-slate-500">Final validation, Docker readiness, documentation, and end-to-end demonstration plan.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {report.system_metrics.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} helper={card.helper} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-cyan-600" size={20} />
            <h3 className="font-bold text-slate-950">Testing and workflow validation</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {report.testing.passed_checks} of {report.testing.total_checks} validation checks completed.
          </p>
          <div className="mt-4 space-y-3">
            {report.testing.validation_checks.map((item) => (
              <div key={item.name} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <Cloud className="text-cyan-600" size={20} />
            <h3 className="font-bold text-slate-950">Deployment readiness</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">{report.deployment.deployment_status}</p>
          <div className="mt-4 space-y-3">
            {report.deployment.deployment_items.map((item) => (
              <div key={item.item} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-slate-950">{item.item}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-950">Final demo flow</h3>
          <div className="mt-3 space-y-2">
            {report.demo_steps.map((step) => (
              <p key={step} className="flex gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                <span>{step}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 p-4">
          <h3 className="font-bold text-slate-950">Milestone 4 outcomes</h3>
          <div className="mt-3 space-y-2">
            {report.final_outcomes.map((item) => (
              <p key={item} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
