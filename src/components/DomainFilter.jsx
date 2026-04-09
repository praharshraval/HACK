const allDomains = ['All', 'AI/ML', 'Web3', 'FinTech', 'EdTech', 'HealthTech', 'SaaS', 'Open Source', 'Hardware'];

export default function DomainFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" id="domain-filters">
      {allDomains.map(domain => (
        <button
          key={domain}
          onClick={() => onChange(domain === 'All' ? '' : domain)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
            (domain === 'All' && selected === '') || domain === selected
              ? 'bg-brand-500/15 text-brand-300 border-brand-500/30 glow-sm'
              : 'bg-white/[0.02] text-slate-500 border-white/5 hover:bg-white/5 hover:text-slate-300 hover:border-white/10'
          }`}
        >
          {domain}
        </button>
      ))}
    </div>
  );
}
