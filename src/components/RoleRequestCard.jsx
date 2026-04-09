import { Briefcase, Code, Coins, ArrowRight } from 'lucide-react';

export default function RoleRequestCard({ role, skills, stakeOffered, onApply }) {
  return (
    <div className="glass rounded-xl p-5 card-interactive group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <Briefcase size={18} className="text-brand-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-1">{role}</h4>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skills?.map(skill => (
              <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-slate-400 border border-white/5">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {stakeOffered && (
              <div className="flex items-center gap-1.5 text-xs">
                <Coins size={13} className="text-warning-400" />
                <span className="text-warning-400 font-semibold">{stakeOffered}% stake</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onApply}
          className="btn-secondary text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Apply <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
