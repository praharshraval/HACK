import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Plus, ExternalLink, Settings, Users, Star, Clock, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getStageInfo, formatCurrency } from '../services/aiEngine';
import ImportRepoModal from '../components/ImportRepoModal';
import FundingProgressBar from '../components/FundingProgressBar';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUserProjects, getProjectContributions, updateProject } = useData();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showCustomize, setShowCustomize] = useState(null);
  const [customizeForm, setCustomizeForm] = useState({ description: '', vision: '', contributionMode: 'approval' });

  const { created, contributed } = getUserProjects(currentUser?.id);
  const [activeFilter, setActiveFilter] = useState('owned');

  const displayProjects = activeFilter === 'owned' ? created : contributed;

  const handleCustomizeOpen = (project) => {
    setCustomizeForm({
      description: project.description || '',
      vision: project.vision || '',
      contributionMode: project.contributionMode || 'approval',
    });
    setShowCustomize(project.id);
  };

  return (
    <div className="space-y-6">
      <ImportRepoModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={(newId) => { setIsImportModalOpen(false); }}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Projects</h1>
          <p className="text-slate-400 mt-1">Manage your creations and contributions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsImportModalOpen(true)} className="btn-primary">
            <GitBranch size={16} /> Import from GitHub
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveFilter('owned')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeFilter === 'owned' 
              ? 'glass border-[var(--color-accent-fg)] text-[var(--color-accent-fg)] shadow-[0_0_12px_rgba(var(--accent-fg-rgb),0.15)]' 
              : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] bg-white/[0.02] border border-white/5'
          }`}
        >
          <span className="flex items-center gap-2"><Layers size={14} /> Owned ({created.length})</span>
        </button>
        <button
          onClick={() => setActiveFilter('contributed')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeFilter === 'contributed'
              ? 'glass border-[var(--color-accent-fg)] text-[var(--color-accent-fg)] shadow-[0_0_12px_rgba(var(--accent-fg-rgb),0.15)]' 
              : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] bg-white/[0.02] border border-white/5'
          }`}
        >
          <span className="flex items-center gap-2"><Users size={14} /> Contributing ({contributed.length})</span>
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-4 stagger-children">
        {displayProjects.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Layers size={40} className="mx-auto text-[var(--color-fg-muted)] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeFilter === 'owned' ? 'No projects yet' : 'Not contributing to any projects'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {activeFilter === 'owned' ? 'Import a repository from GitHub to get started.' : 'Explore the marketplace to find projects.'}
            </p>
            {activeFilter === 'owned' ? (
              <button onClick={() => setIsImportModalOpen(true)} className="btn-primary">
                <GitBranch size={16} /> Import from GitHub
              </button>
            ) : (
              <button onClick={() => navigate('/marketplace')} className="btn-primary">
                Explore Marketplace
              </button>
            )}
          </div>
        ) : (
          displayProjects.map((project) => {
            const stage = getStageInfo(project.stage);
            const contribs = getProjectContributions(project.id);
            const fundingPercent = project.fundingTarget > 0 ? Math.round((project.fundingRaised / project.fundingTarget) * 100) : 0;
            const isOwner = project.createdBy === currentUser?.id;

            return (
              <div key={project.id} className="glass rounded-2xl p-6 hover:border-[rgba(var(--accent-fg-rgb),0.2)] transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Project Info */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-800)] border border-[var(--color-surface-700)] flex items-center justify-center text-lg font-bold text-[var(--color-accent-fg)] flex-shrink-0">
                        {project.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white truncate hover:text-[var(--color-accent-fg)] transition-colors">{project.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${stage.className}`}>{stage.icon} {stage.label}</span>
                          {isOwner && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(var(--brand-rgb),0.1)] text-[var(--color-success-fg)] border border-[rgba(var(--brand-rgb),0.2)]">Owner</span>}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{project.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{contribs.length}</p>
                      <p className="text-[10px] text-slate-500">Contributors</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Star size={12} className="text-[var(--color-warning-fg)] fill-[var(--color-warning-fg)]" />
                        <p className="text-lg font-bold text-white">{project.rating}</p>
                      </div>
                      <p className="text-[10px] text-slate-500">Rating</p>
                    </div>
                    <div className="w-32">
                      <p className="text-xs text-slate-500 mb-1">{formatCurrency(project.fundingRaised)}</p>
                      <FundingProgressBar percent={fundingPercent} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => navigate(`/project/${project.id}`)} className="btn-secondary text-xs">
                      <ExternalLink size={14} /> View
                    </button>
                    {isOwner && (
                      <button onClick={() => handleCustomizeOpen(project)} className="btn-secondary text-xs">
                        <Settings size={14} /> Customize
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Customize Panel */}
                {showCustomize === project.id && isOwner && (
                  <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
                    <h4 className="text-sm font-semibold text-white mb-3">Quick Customize</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Description</label>
                        <textarea
                          value={customizeForm.description}
                          onChange={(e) => setCustomizeForm({...customizeForm, description: e.target.value})}
                          className="input-dark text-xs h-20 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Vision Statement</label>
                        <textarea
                          value={customizeForm.vision}
                          onChange={(e) => setCustomizeForm({...customizeForm, vision: e.target.value})}
                          className="input-dark text-xs h-20 w-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Contribution Mode:</span>
                        <select
                          value={customizeForm.contributionMode}
                          onChange={(e) => setCustomizeForm({...customizeForm, contributionMode: e.target.value})}
                          className="input-dark text-xs py-1 w-auto"
                        >
                          <option value="open">Open Source</option>
                          <option value="approval">Approval Required</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setShowCustomize(null)} className="btn-ghost text-xs">Cancel</button>
                        <button 
                          onClick={() => {
                            updateProject(project.id, {
                              description: customizeForm.description,
                              vision: customizeForm.vision,
                              contributionMode: customizeForm.contributionMode,
                            });
                            setShowCustomize(null);
                          }}
                          className="btn-primary text-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
