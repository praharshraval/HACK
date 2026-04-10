import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExternalLink, Globe, Star, Users, GitBranch, DollarSign,
  TrendingUp, CheckCircle2, Clock, AlertCircle, ArrowLeft, Coins
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { getStageInfo, formatCurrency, calculateContributionScore } from '../services/aiEngine';
import StakePieChart from '../components/StakePieChart';
import FundingProgressBar from '../components/FundingProgressBar';
import ContributorTable from '../components/ContributorTable';
import InvestorList from '../components/InvestorList';
import RoleRequestCard from '../components/RoleRequestCard';

const tabs = ['Overview', 'Contributors', 'Funding', 'Contribute'];

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getProject, getUser, getProjectContributions, getProjectInvestments, addInvestment, applyToContribute, updateProject, updateContributionStatus } = useData();
  const [activeTab, setActiveTab] = useState('Overview');
  const [investAmount, setInvestAmount] = useState('');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);
  const [inviteQuery, setInviteQuery] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const { users } = useData();

  const project = getProject(id);
  if (!project) return (
    <div className="text-center py-20">
      <p className="text-slate-500 text-lg">Project not found</p>
      <button onClick={() => navigate('/marketplace')} className="btn-secondary mt-4"><ArrowLeft size={16} /> Back</button>
    </div>
  );

  const creator = getUser(project.createdBy);
  const contribs = getProjectContributions(project.id);
  const invests = getProjectInvestments(project.id);
  const stage = getStageInfo(project.stage);
  const fundingPercent = Math.round((project.fundingRaised / project.fundingTarget) * 100);
  const totalCommits = contribs.reduce((s, c) => s + c.commits, 0);

  const handleInvest = () => {
    const amt = parseFloat(investAmount);
    if (amt > 0 && currentUser) {
      addInvestment(currentUser.id, project.id, amt);
      setInvestSuccess(true);
      setTimeout(() => { setShowInvestModal(false); setInvestSuccess(false); setInvestAmount(''); }, 2000);
    }
  };

  const handleApply = (role) => {
    if (currentUser) {
      applyToContribute(currentUser.id, project.id, role);
      alert(`Application submitted for ${role}!`);
    }
  };

  const milestoneIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 size={16} className="text-success-400" />;
    if (status === 'in-progress') return <Clock size={16} className="text-warning-400" />;
    return <AlertCircle size={16} className="text-slate-600" />;
  };

  const availableTabs = currentUser?.id === project.createdBy ? [...tabs, 'Manage'] : tabs;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => navigate('/marketplace')} className="btn-ghost text-xs text-slate-500">
        <ArrowLeft size={14} /> Back to Marketplace
      </button>

      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${stage.className}`}>
                {stage.icon} {stage.label}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4 max-w-2xl">{project.description}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="px-3 py-1 rounded-lg bg-white/5 text-sm text-slate-300 border border-white/5">{project.domain}</span>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors">
                <Globe size={14} /> Repository <ExternalLink size={12} />
              </a>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-warning-400 fill-warning-400" />
                <span className="text-sm font-semibold text-warning-400">{project.rating}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            {[
              { icon: Users, value: contribs.length, label: 'Contributors' },
              { icon: GitBranch, value: totalCommits, label: 'Commits' },
              { icon: TrendingUp, value: project.tractionScore, label: 'Traction' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-1">
                  <stat.icon size={18} className="text-slate-400" />
                </div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-600 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/5">
          <img src={creator?.avatar} alt="" className="w-8 h-8 rounded-lg bg-surface-700" />
          <div>
            <p className="text-sm text-slate-300">Created by <span className="font-medium text-white">{creator?.name}</span></p>
            <p className="text-xs text-slate-600">{project.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-1 overflow-x-auto">
        {availableTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab
                ? 'text-brand-300 border-brand-500'
                : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vision */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Vision</h3>
                <p className="text-slate-400 leading-relaxed">{project.vision}</p>
              </div>

              {/* Milestones */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Milestone Tracker</h3>
                <div className="space-y-3">
                  {project.milestones?.map((m, i) => (
                    <div key={m.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] animate-fade-in"
                      style={{ animationDelay: `${i * 0.08}s` }}>
                      {milestoneIcon(m.status)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">{m.title}</p>
                        <p className="text-xs text-slate-600">{m.date}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                        m.status === 'completed' ? 'bg-success-400/10 text-success-400' :
                        m.status === 'in-progress' ? 'bg-warning-400/10 text-warning-400' :
                        'bg-white/5 text-slate-500'
                      }`}>{m.status.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Funding progress */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Funding Progress</h3>
                  <span className="text-2xl font-bold gradient-text">{fundingPercent}%</span>
                </div>
                <FundingProgressBar percent={fundingPercent} height={10} />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-slate-500">Raised: {formatCurrency(project.fundingRaised)}</span>
                  <span className="text-sm text-slate-500">Target: {formatCurrency(project.fundingTarget)}</span>
                </div>
              </div>
            </div>

            {/* Stake Chart */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Stake Distribution</h3>
                <StakePieChart contributions={contribs} investments={invests} size={240} />
              </div>

              {/* Tags */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-300 border border-white/5">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Peer Review Widget */}
              {currentUser && currentUser.id !== project.createdBy && (
                <div className="glass-glow rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-white mb-2">Submit Peer Review</h3>
                  <p className="text-xs text-slate-400 mb-4">Evaluate this project to improve its network standing.</p>
                  <div className="flex gap-2 mb-5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onMouseEnter={() => setReviewHover(star)}
                        onMouseLeave={() => setReviewHover(0)}
                        onClick={() => setReviewRating(star)}
                        className="transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star 
                          size={24} 
                          className={(reviewHover || reviewRating) >= star ? "text-warning-400 fill-warning-400" : "text-[var(--color-surface-600)]"} 
                        />
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={!reviewRating}
                    onClick={() => {
                       updateProject(project.id, { 
                         rating: project.rating ? parseFloat(((project.rating + reviewRating) / 2).toFixed(1)) : reviewRating,
                         collaborationScore: Math.min(100, project.collaborationScore + 5)
                       });
                       setReviewRating(0);
                       alert("Peer review submitted! Project traction and rating dynamically updated.");
                    }}
                    className="btn-primary w-full justify-center"
                  >
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Contributors' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contributors ({contribs.length})</h3>
            <ContributorTable contributions={contribs} />
          </div>
        )}

        {activeTab === 'Funding' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Funding Overview</h3>
                  <button onClick={() => setShowInvestModal(true)} className="btn-primary text-sm" id="invest-btn">
                    <DollarSign size={14} /> Invest Now
                  </button>
                </div>
                <FundingProgressBar percent={fundingPercent} height={10} showLabel />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-2xl font-bold text-white">{formatCurrency(project.fundingRaised)}</p>
                    <p className="text-xs text-slate-500 mt-1">Total Raised</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-2xl font-bold text-white">{formatCurrency(project.fundingTarget)}</p>
                    <p className="text-xs text-slate-500 mt-1">Target</p>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
                {project.milestones?.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.03] last:border-0">
                    {milestoneIcon(m.status)}
                    <span className="text-sm text-slate-300 flex-1">{m.title}</span>
                    <span className="text-xs text-slate-600">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Investors ({invests.length})</h3>
              <InvestorList investments={invests} />
            </div>
          </div>
        )}

        {activeTab === 'Contribute' && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Open Positions</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${project.contributionMode === 'open' ? 'bg-[rgba(var(--success-fg),0.1)] text-[var(--color-success-fg)]' : 'bg-[rgba(var(--warning-fg),0.1)] text-[var(--color-warning-fg)]'}`}>
                  {project.contributionMode === 'open' ? 'Open Source (Auto-Accept)' : 'Approval Required'}
                </span>
              </div>
              <p className="text-sm text-slate-500">Apply to contribute and earn ownership stake in this project.</p>
            </div>
            {project.requiredRoles?.map(role => (
              <RoleRequestCard
                key={role}
                role={role}
                skills={['Relevant experience', '10+ hrs/week', 'Open source mindset']}
                stakeOffered={Math.round(Math.random() * 5 + 3)}
                onApply={() => handleApply(role)}
              />
            ))}
          </div>
        )}

        {activeTab === 'Manage' && currentUser?.id === project.createdBy && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Project Settings</h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Contribution Mode</h4>
                  <p className="text-xs text-slate-500">Decide if applications are instantly accepted or require manual review.</p>
                </div>
                <div className="flex bg-surface-900 rounded-lg p-1 border border-surface-700">
                  <button onClick={() => updateProject(project.id, { contributionMode: 'open' })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${project.contributionMode === 'open' ? 'bg-success-400/20 text-success-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    Open Source
                  </button>
                  <button onClick={() => updateProject(project.id, { contributionMode: 'approval' })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${project.contributionMode !== 'open' ? 'bg-warning-400/20 text-warning-400' : 'text-slate-500 hover:text-slate-300'}`}>
                    Approval Required
                  </button>
                </div>
              </div>
            </div>

            {/* Invite Collaborators */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Invite to Project</h3>
              <div className="relative">
                <input
                  type="text"
                  value={inviteQuery}
                  onChange={(e) => setInviteQuery(e.target.value)}
                  placeholder="Search by Oasis username or GitHub handle..."
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-lg px-4 py-2 text-sm text-[var(--color-fg-default)] focus:border-[var(--color-brand-500)] outline-none"
                />
                {inviteQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface-900)] border border-[var(--color-surface-700)] rounded-xl shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                    {users.filter(u => 
                      (u.name && u.name.toLowerCase().includes(inviteQuery.toLowerCase())) || 
                      (u.github && u.github.toLowerCase().includes(inviteQuery.toLowerCase()))
                    ).map(targetUser => (
                      <div key={targetUser.id} className="flex items-center justify-between p-3 border-b border-[var(--color-surface-800)] hover:bg-[var(--color-surface-800)] transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={targetUser.avatar} alt="" className="w-6 h-6 rounded-full bg-[var(--color-surface-700)]" />
                          <span className="text-sm text-white font-medium">{targetUser.name} <span className="text-xs text-slate-500">({targetUser.github || 'No GitHub'})</span></span>
                        </div>
                        <button
                          className="btn-primary text-xs py-1"
                          onClick={() => {
                            const contrib = applyToContribute(targetUser.id, project.id, 'Invited Collaborator');
                            updateContributionStatus(contrib.id, 'active');
                            setInviteQuery('');
                            alert('Successfully invited ' + targetUser.name + ' as a collaborator!');
                          }}
                        >
                          Invite
                        </button>
                      </div>
                    ))}
                    {users.filter(u => 
                      (u.name && u.name.toLowerCase().includes(inviteQuery.toLowerCase())) || 
                      (u.github && u.github.toLowerCase().includes(inviteQuery.toLowerCase()))
                    ).length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-500">No users found matching "{inviteQuery}"</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pending Applications</h3>
              {contribs.filter(c => c.status === 'pending').length === 0 ? (
                <div className="text-center py-8 bg-white/[0.02] border border-white/5 rounded-xl">
                  <Users size={24} className="mx-auto text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">No pending applications.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contribs.filter(c => c.status === 'pending').map(c => {
                    const applicant = getUser(c.userId);
                    return (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={applicant?.avatar} alt="" className="w-8 h-8 rounded-full bg-surface-700" />
                          <div>
                            <p className="text-sm font-medium text-white">{applicant?.name}</p>
                            <p className="text-xs text-brand-400">Applied for {c.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => updateContributionStatus(c.id, 'rejected')}
                            className="px-3 py-1.5 rounded-md text-xs font-medium text-danger-400 bg-danger-400/10 hover:bg-danger-400/20 transition-colors">
                            Reject
                          </button>
                          <button onClick={() => updateContributionStatus(c.id, 'active')}
                            className="px-3 py-1.5 rounded-md text-xs font-medium text-success-400 bg-success-400/10 hover:bg-success-400/20 transition-colors">
                            Accept
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Invest Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInvestModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass rounded-2xl p-8 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
            {investSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-success-400/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-success-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Investment Successful!</h3>
                <p className="text-sm text-slate-400">Your investment has been recorded.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Invest in {project.name}</h3>
                <p className="text-sm text-slate-500 mb-6">Simulate a transaction to fund this project.</p>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Investment Amount (₹)</label>
                  <div className="relative">
                    <Coins size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="50,000"
                      className="input-dark pl-10"
                      id="invest-amount-input"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowInvestModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={handleInvest} disabled={!investAmount || investAmount <= 0} className="btn-primary flex-1 justify-center disabled:opacity-30">Confirm Investment</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
