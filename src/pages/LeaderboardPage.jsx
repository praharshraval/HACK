import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, GitBranch, Award } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getTrendingProjects, formatCurrency, formatCompact } from '../services/aiEngine';
import FundingProgressBar from '../components/FundingProgressBar';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { projects, users, contributions } = useData();
  const [tab, setTab] = useState('projects');

  const rankedProjects = getTrendingProjects(projects);

  const rankedUsers = [...users]
    .map(u => {
      const userContribs = contributions.filter(c => c.userId === u.id);
      const totalCommits = userContribs.reduce((s, c) => s + c.commits, 0);
      const totalTasks = userContribs.reduce((s, c) => s + c.tasksCompleted, 0);
      const avgRating = userContribs.length > 0
        ? userContribs.reduce((s, c) => s + c.peerRating, 0) / userContribs.length
        : 0;
      return { ...u, totalCommits, totalTasks, avgRating, projectCount: userContribs.length };
    })
    .sort((a, b) => b.collaborationScore - a.collaborationScore);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown size={20} className="text-warning-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
    if (index === 1) return <Medal size={20} className="text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.4)]" />;
    if (index === 2) return <Medal size={20} className="text-amber-600 drop-shadow-[0_0_6px_rgba(180,83,9,0.4)]" />;
    return <span className="text-sm font-bold text-slate-600 w-5 text-center">{index + 1}</span>;
  };

  const getRankBg = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-warning-400/5 to-transparent border-warning-400/20';
    if (index === 1) return 'bg-gradient-to-r from-slate-300/5 to-transparent border-slate-400/20';
    if (index === 2) return 'bg-gradient-to-r from-amber-600/5 to-transparent border-amber-600/20';
    return 'border-white/5 hover:bg-white/[0.02]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy size={28} className="text-warning-400" /> Leaderboard
          </h1>
          <p className="text-slate-500 mt-1">Top projects and contributors ranked by performance</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('projects')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'projects'
              ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
              : 'text-slate-500 border border-white/5 hover:bg-white/5'
          }`}
        >
          <TrendingUp size={14} className="inline mr-2" /> Projects
        </button>
        <button
          onClick={() => setTab('contributors')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'contributors'
              ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
              : 'text-slate-500 border border-white/5 hover:bg-white/5'
          }`}
        >
          <Users size={14} className="inline mr-2" /> Contributors
        </button>
      </div>

      {/* Top 3 Podium (Projects) */}
      {tab === 'projects' && rankedProjects.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-2">
          {[1, 0, 2].map(idx => {
            const p = rankedProjects[idx];
            const isFirst = idx === 0;
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/project/${p.id}`)}
                className={`glass rounded-2xl p-5 cursor-pointer card-interactive text-center relative overflow-hidden ${
                  isFirst ? 'col-start-2 row-start-1' : ''
                }`}
                style={isFirst ? { transform: 'scale(1.02)' } : {}}
              >
                {isFirst && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(250,204,21,0.08) 0%, transparent 60%)' }} />
                )}
                <div className="relative z-10">
                  <div className="mb-3">{getRankIcon(idx)}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{p.domain}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star size={14} className="text-warning-400 fill-warning-400" />
                    <span className="text-sm font-bold text-warning-400">{p.trendingRank || p.tractionScore}</span>
                  </div>
                  <FundingProgressBar percent={Math.round((p.fundingRaised / p.fundingTarget) * 100)} />
                  <p className="text-xs text-slate-500 mt-2">{formatCurrency(p.fundingRaised)} raised</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Projects List */}
      {tab === 'projects' && (
        <div className="space-y-2 stagger-children">
          {rankedProjects.map((p, i) => {
            const contribs = contributions.filter(c => c.projectId === p.id);
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/project/${p.id}`)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all animate-fade-in ${getRankBg(i)}`}
              >
                <div className="w-8 flex items-center justify-center flex-shrink-0">
                  {getRankIcon(i)}
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-lg font-bold text-brand-400 flex-shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.domain} • {p.stage}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-200">{contribs.length}</p>
                    <p className="text-[10px] text-slate-600">Contributors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-200">{formatCompact(contribs.reduce((s, c) => s + c.commits, 0))}</p>
                    <p className="text-[10px] text-slate-600">Commits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-warning-400">{p.tractionScore}</p>
                    <p className="text-[10px] text-slate-600">Traction</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold gradient-text">{formatCurrency(p.fundingRaised)}</p>
                  <p className="text-xs text-slate-600">raised</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contributors List */}
      {tab === 'contributors' && (
        <div className="space-y-2 stagger-children">
          {rankedUsers.map((u, i) => (
            <div
              key={u.id}
              onClick={() => navigate(`/profile/${u.id}`)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all animate-fade-in ${getRankBg(i)}`}
            >
              <div className="w-8 flex items-center justify-center flex-shrink-0">
                {getRankIcon(i)}
              </div>
              <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl bg-surface-700 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                    u.role === 'builder' ? 'role-builder' :
                    u.role === 'investor' ? 'role-investor' : 'role-collaborator'
                  }`}>{u.role}</span>
                </div>
                <p className="text-xs text-slate-500">@{u.github}</p>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">{u.projectCount}</p>
                  <p className="text-[10px] text-slate-600">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">{formatCompact(u.totalCommits)}</p>
                  <p className="text-[10px] text-slate-600">Commits</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-warning-400 fill-warning-400" />
                    <span className="text-sm font-bold text-warning-400">{u.avgRating.toFixed(1)}</span>
                  </div>
                  <p className="text-[10px] text-slate-600">Avg Rating</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold gradient-text">{u.collaborationScore}</p>
                <p className="text-[10px] text-slate-600">Score</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
