function ChartCard({ title, subtitle, children }) {
  return (
    <section className="card-surface p-5 animate-fadeUp">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="h-72 w-full">{children}</div>
    </section>
  );
}

export default ChartCard;
