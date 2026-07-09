export default function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-3xl bg-white p-6 card-shadow">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="mt-3 text-3xl font-bold text-slate-950">{value}</h3>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}
