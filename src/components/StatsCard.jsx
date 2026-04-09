export default function StatsCard({ icon: Icon, label, value, trend, trendUp = true, className = '' }) {
  return (
    <div className={`glass rounded-2xl p-5 card-interactive ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <Icon size={20} className="text-brand-400" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendUp
              ? 'bg-success-400/10 text-success-400'
              : 'bg-danger-400/10 text-danger-400'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white animate-count-up">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
