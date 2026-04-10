import { useNavigate } from 'react-router-dom';
import { Users, GitBranch, Star, ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getStageInfo, formatCurrency, formatCompact } from '../services/aiEngine';
import FundingProgressBar from './FundingProgressBar';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { getProjectContributions } = useData();
  const contribs = getProjectContributions(project.id);
  const stage = getStageInfo(project.stage);
  const fundingPercent = Math.round((project.fundingRaised / project.fundingTarget) * 100);

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      className="glass-glow rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
      id={`project-card-${project.id}`}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-lg font-semibold text-[var(--color-accent-fg)] truncate group-hover:underline transition-colors">
                {project.name}
              </h3>
              <ArrowUpRight size={14} className="text-[var(--color-fg-muted)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${stage.className}`}>
              {stage.icon} {stage.label}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-3">
            <Star size={14} className="text-[var(--color-warning-fg)] fill-[var(--color-warning-fg)]" />
            <span className="text-sm font-semibold text-[var(--color-warning-fg)]">{project.rating}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Domain tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-800)] text-xs font-medium text-[var(--color-fg-muted)] border border-[var(--color-surface-700)]">
            {project.domain}
          </span>
          {project.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-800)] text-xs text-[var(--color-fg-muted)] border border-[var(--color-surface-700)]">
              {tag}
            </span>
          ))}
        </div>

        {/* Funding */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[var(--color-fg-muted)]">Funding</span>
            <span className="text-xs font-semibold text-[var(--color-fg-default)]">{formatCurrency(project.fundingRaised)} / {formatCurrency(project.fundingTarget)}</span>
          </div>
          <FundingProgressBar percent={fundingPercent} />
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-surface-700)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[var(--color-fg-muted)]">
              <Users size={14} />
              <span className="text-xs font-medium">{contribs.length}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--color-fg-muted)]">
              <GitBranch size={14} />
              <span className="text-xs font-medium">{formatCompact(contribs.reduce((s, c) => s + c.commits, 0))}</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            {contribs.slice(0, 3).map(c => {
              const user = useData().getUser(c.userId);
              return (
                <img key={c.id} src={user?.avatar} alt=""
                  className="w-6 h-6 rounded-full bg-[var(--color-surface-700)] ring-2 ring-[var(--color-surface-900)]" />
              );
            })}
            {contribs.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-[var(--color-surface-600)] ring-2 ring-[var(--color-surface-900)] flex items-center justify-center text-[10px] text-[var(--color-fg-muted)] font-medium">
                +{contribs.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Required roles */}
        {project.requiredRoles?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--color-surface-700)]">
            <p className="text-[10px] text-[var(--color-fg-muted)] uppercase tracking-wider mb-1.5">Looking for</p>
            <div className="flex flex-wrap gap-1.5">
              {project.requiredRoles.map(role => (
                <span key={role} className="px-2 py-0.5 rounded-md bg-[rgba(var(--brand-rgb),0.08)] text-[11px] text-[var(--color-success-fg)] border border-[rgba(var(--brand-rgb),0.15)]">
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
