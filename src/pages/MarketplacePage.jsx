import { useState, useMemo } from 'react';
import { Layers, Users, TrendingUp, DollarSign, SlidersHorizontal } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getTrendingProjects, formatCurrency, formatCompact } from '../services/aiEngine';
import ProjectCard from '../components/ProjectCard';
import DomainFilter from '../components/DomainFilter';
import StatsCard from '../components/StatsCard';

const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'funded', label: 'Most Funded' },
  { value: 'collaborated', label: 'Most Collaborated' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'rated', label: 'Highest Rated' },
];

export default function MarketplacePage() {
  const { projects, contributions, investments, users } = useData();
  const [domainFilter, setDomainFilter] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [showSort, setShowSort] = useState(false);

  const totalFunding = projects.reduce((s, p) => s + p.fundingRaised, 0);
  const totalContributors = new Set(contributions.map(c => c.userId)).size;

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Domain filter
    if (domainFilter) {
      result = result.filter(p => p.domain === domainFilter);
    }

    // Sort
    switch (sortBy) {
      case 'funded':
        result.sort((a, b) => b.fundingRaised - a.fundingRaised);
        break;
      case 'collaborated':
        result.sort((a, b) => b.collaborationScore - a.collaborationScore);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'trending':
      default:
        result = getTrendingProjects(result);
        break;
    }

    return result;
  }, [projects, domainFilter, sortBy]);

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-fg-default)]">Marketplace</h1>
          <p className="text-[var(--color-fg-muted)] mt-1">Discover, fund, and contribute to breakthrough projects</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatsCard icon={Layers} label="Total Projects" value={projects.length} />
        <StatsCard icon={Users} label="Active Contributors" value={totalContributors} />
        <StatsCard icon={DollarSign} label="Total Funding" value={formatCurrency(totalFunding)} />
        <StatsCard icon={TrendingUp} label="Avg. Traction Score" value={projects.length > 0 ? Math.round(projects.reduce((s, p) => s + (p.tractionScore || 0), 0) / projects.length) : 0} />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <DomainFilter selected={domainFilter} onChange={setDomainFilter} />
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="btn-secondary text-xs"
            id="sort-dropdown-btn"
          >
            <SlidersHorizontal size={14} />
            {sortOptions.find(s => s.value === sortBy)?.label}
          </button>
          {showSort && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-surface-900)] border border-[var(--color-surface-700)] rounded-xl overflow-hidden z-50 animate-fade-in shadow-sm">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    sortBy === opt.value
                      ? 'text-brand-300 bg-brand-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No projects found in this domain</p>
          <button onClick={() => setDomainFilter('')} className="btn-secondary mt-4">Clear filters</button>
        </div>
      )}
    </div>
  );
}
