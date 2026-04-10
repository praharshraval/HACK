export default function StatsCard({ icon: Icon, label, value, trend, trendUp = true, className = '' }) {
  return (
    <div className={`glass-glow rounded-2xl p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[rgba(var(--accent-fg-rgb),0.1)] flex items-center justify-center">
          <Icon size={20} className="text-[var(--color-accent-fg)]" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendUp
              ? 'bg-[rgba(63,185,80,0.1)] text-[var(--color-success-fg)]'
              : 'bg-[rgba(248,81,73,0.1)] text-[var(--color-danger-fg)]'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--color-fg-default)]">{value}</p>
      <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">{label}</p>
    </div>
  );
}
