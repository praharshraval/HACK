import { useParams, useNavigate } from 'react-router-dom';
import { GitBranch, ExternalLink, MapPin, Calendar, Award, Briefcase, TrendingUp, DollarSign, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency, calculateCollaborationScore } from '../services/aiEngine';
import StatsCard from '../components/StatsCard';
import ActivityTimeline from '../components/ActivityTimeline';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getUser, getUserContributions, getUserTransactions, getUserProjects, users } = useData();

  const profileUser = id ? getUser(id) : currentUser;
  if (!profileUser) return <div className="text-center py-20"><p className="text-slate-500">User not found</p></div>;

  const contributions = getUserContributions(profileUser.id);
  const transactions = getUserTransactions(profileUser.id);
  const { created, contributed } = getUserProjects(profileUser.id);
  const allProjects = [...created, ...contributed];
  const collabScore = profileUser.collaborationScore || calculateCollaborationScore(profileUser.id, contributions);
  const totalEarnings = transactions.filter(t => t.type === 'payout' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalStake = contributions.reduce((s, c) => s + c.stakePercent, 0);

  const peerReviews = [
    { from: 'Priya Sharma', rating: 4.9, text: 'Exceptional architect. Clean code, clear communication, always delivers ahead of schedule.', date: '2 weeks ago' },
    { from: 'Karthik Rajan', rating: 4.7, text: 'Great collaborator with deep system design knowledge. Would work with again.', date: '1 month ago' },
    { from: 'Ananya Desai', rating: 4.8, text: 'Brilliant problem solver. Made complex backend issues look easy.', date: '2 months ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)' }} />

        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="w-24 h-24 rounded-2xl bg-surface-700 ring-4 ring-brand-500/20 flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-white">{profileUser.name}</h1>
              <span className={`px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${
                profileUser.role === 'builder' ? 'role-builder' :
                profileUser.role === 'investor' ? 'role-investor' : 'role-collaborator'
              }`}>
                {profileUser.role}
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed mb-4 max-w-2xl">{profileUser.bio}</p>

            <div className="flex items-center gap-5 flex-wrap text-sm">
              {profileUser.github && (
                <a href={`https://github.com/${profileUser.github}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors">
                  <GitBranch size={14} /> @{profileUser.github} <ExternalLink size={11} />
                </a>
              )}
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={14} /> Joined {profileUser.joinDate}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {profileUser.skills?.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 text-xs text-slate-300 border border-white/5">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Collaboration Score Gauge */}
          <div className="flex-shrink-0 text-center">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                  strokeDasharray={`${collabScore * 2.64} 264`} strokeLinecap="round" />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{collabScore}</span>
                <span className="text-[10px] text-slate-500 uppercase">Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatsCard icon={Briefcase} label="Projects Created" value={created.length} />
        <StatsCard icon={Users} label="Projects Contributed" value={contributed.length} />
        <StatsCard icon={DollarSign} label="Total Earnings" value={formatCurrency(totalEarnings || profileUser.totalEarned)} trend="18%" trendUp />
        <StatsCard icon={Award} label="Total Stake Owned" value={`${totalStake.toFixed(1)}%`} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Projects ({allProjects.length})</h3>
            <div className="space-y-3">
              {allProjects.map((p, i) => {
                const isCreator = p.createdBy === profileUser.id;
                const contrib = contributions.find(c => c.projectId === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/project/${p.id}`)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer transition-all animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-lg font-bold text-brand-400 flex-shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-200 truncate">{p.name}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isCreator ? 'bg-brand-500/15 text-brand-300' : 'bg-cyan-500/15 text-cyan-300'
                        }`}>
                          {isCreator ? 'Creator' : 'Contributor'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{p.domain} • {contrib?.role || 'Founder'}</p>
                    </div>
                    <div className="text-right">
                      {contrib && (
                        <p className="text-sm font-bold gradient-text">{contrib.stakePercent}%</p>
                      )}
                      <p className="text-xs text-slate-600">stake</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Peer Reviews */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Peer Reviews</h3>
            <div className="space-y-4">
              {peerReviews.map((review, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-300">{review.from}</p>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-warning-400 fill-warning-400" />
                      <span className="text-sm font-bold text-warning-400">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{review.text}</p>
                  <p className="text-xs text-slate-600 mt-2">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
