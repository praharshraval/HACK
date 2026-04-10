import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, getStageInfo } from '../services/aiEngine';
import FundingProgressBar from '../components/FundingProgressBar';

export default function FundedPage() {
  const navigate = useNavigate();
  const { projects, investments, contributions, users, getUser } = useData();
  
  const fundedProjects = projects.filter(p => p.fundingRaised > 0).sort((a, b) => b.fundingRaised - a.fundingRaised);

  // Build a funding history timeline from investments
  const fundingHistory = investments
    .filter(inv => inv.amount > 0)
    .sort((a, b) => new Date(b.date || '2025-01-01') - new Date(a.date || '2025-01-01'))
    .slice(0, 20);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Funded Startups</h1>
          <p className="text-slate-400">Platforms actively backed by the Oasis network, with full funding history.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Total Capital Deployed</span>
            <DollarSign size={16} className="text-[var(--color-accent-fg)]" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(fundedProjects.reduce((s, p) => s + p.fundingRaised, 0))}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Funded Projects</span>
            <TrendingUp size={16} className="text-[var(--color-success-fg)]" />
          </div>
          <p className="text-2xl font-bold text-white">{fundedProjects.length}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Unique Investors</span>
            <Users size={16} className="text-[var(--color-warning-fg)]" />
          </div>
          <p className="text-2xl font-bold text-white">{new Set(investments.map(i => i.userId)).size}</p>
        </div>
      </div>

      {/* Funded Projects List */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Funded Companies</h2>
        <div className="space-y-3 stagger-children">
          {fundedProjects.length === 0 ? (
            <div className="glass rounded-2xl py-16 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">No Funded Ventures Yet</h3>
              <p className="text-sm text-slate-500">Wait for the community to deploy capital into projects.</p>
            </div>
          ) : (
            fundedProjects.map(project => {
              const stage = getStageInfo(project.stage);
              const fundingPercent = Math.round((project.fundingRaised / project.fundingTarget) * 100);
              const projectContribs = contributions.filter(c => c.projectId === project.id && c.status === 'active');
              
              return (
                <div key={project.id} className="glass rounded-2xl p-5 hover:border-[rgba(var(--accent-fg-rgb),0.2)] transition-all cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-800)] border border-[var(--color-surface-700)] flex items-center justify-center text-xl font-bold text-[var(--color-accent-fg)] flex-shrink-0">
                        {project.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-lg font-semibold text-white truncate">{project.name}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stage.className}`}>{stage.label}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{project.domain} • {projectContribs.length} active developers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--color-success-fg)]">{formatCurrency(project.fundingRaised)}</p>
                        <p className="text-[10px] text-slate-500">of {formatCurrency(project.fundingTarget)}</p>
                      </div>
                      <div className="w-24">
                        <FundingProgressBar percent={fundingPercent} />
                      </div>
                      <ExternalLink size={16} className="text-[var(--color-fg-muted)]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Funding History Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Funding History</h2>
        <div className="glass rounded-2xl p-6">
          {fundingHistory.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No funding activity yet.</p>
          ) : (
            <div className="space-y-0">
              {fundingHistory.map((inv, i) => {
                const investor = getUser(inv.userId);
                const project = projects.find(p => p.id === inv.projectId);
                return (
                  <div key={inv.id || i} className="flex items-center gap-4 py-3 border-b border-white/[0.03] last:border-0 animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="flex-shrink-0 w-10 text-center">
                      <Calendar size={14} className="mx-auto text-[var(--color-fg-muted)]" />
                      <p className="text-[10px] text-slate-600 mt-0.5">{inv.date || 'N/A'}</p>
                    </div>
                    <div className="w-px h-8 bg-white/5"></div>
                    <img src={investor?.avatar} alt="" className="w-7 h-7 rounded-full bg-[var(--color-surface-700)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        <span className="font-medium">{investor?.name || 'Unknown'}</span>
                        <span className="text-slate-500"> invested in </span>
                        <span className="font-medium text-[var(--color-accent-fg)]">{project?.name || 'Unknown'}</span>
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-success-fg)] flex-shrink-0">{formatCurrency(inv.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
