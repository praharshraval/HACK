import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GitBranch, ExternalLink, Calendar, Award, Briefcase, TrendingUp, DollarSign, Star, Users, Edit2, Check, X, Link2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency, calculateCollaborationScore } from '../services/aiEngine';
import StatsCard from '../components/StatsCard';
import ActivityTimeline from '../components/ActivityTimeline';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, linkGitHub } = useAuth();
  const { getUser, getUserContributions, getUserTransactions, getUserProjects, updateUser } = useData();

  const isOwnProfile = !id || (currentUser && id === currentUser.id);
  const profileUser = id ? getUser(id) : currentUser;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingUpi, setEditingUpi] = useState(false);
  const [upiInput, setUpiInput] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { from: 'Prajapati', rating: 4.9, text: 'Exceptional architect. Clean code, clear communication, always delivers ahead of schedule.', date: '2 weeks ago' },
    { from: 'Twara', rating: 4.7, text: 'Great collaborator with deep system design knowledge. Would work with again.', date: '1 month ago' },
    { from: 'Avani', rating: 4.8, text: 'Brilliant problem solver. Made complex backend issues look easy.', date: '2 months ago' },
  ]);
  const [editForm, setEditForm] = useState({
    name: '', bio: '', github: '', upiId: '', skills: ''
  });

  if (!profileUser) return <div className="text-center py-20"><p className="text-[var(--color-fg-muted)]">User not found</p></div>;

  const startEditing = () => {
    setEditForm({
      name: profileUser.name || '',
      bio: profileUser.bio || '',
      github: profileUser.github || '',
      upiId: profileUser.upiId || '',
      skills: profileUser.skills?.join(', ') || ''
    });
    setIsEditing(true);
  };

  const saveProfile = () => {
    updateUser(profileUser.id, {
      name: editForm.name,
      bio: editForm.bio,
      github: editForm.github,
      upiId: editForm.upiId,
      skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setIsEditing(false);
  };

  const saveUpi = () => {
    updateUser(profileUser.id, { upiId: upiInput });
    setEditingUpi(false);
  };

  const submitReview = () => {
    if (!reviewText.trim()) return;
    setReviews(prev => [{
      from: currentUser?.name || 'Anonymous',
      rating: reviewRating,
      text: reviewText,
      date: 'Just now'
    }, ...prev]);
    setShowReviewForm(false);
    setReviewText('');
    setReviewRating(5);
  };

  const contributions = getUserContributions(profileUser.id);
  const transactions = getUserTransactions(profileUser.id);
  const { created, contributed } = getUserProjects(profileUser.id);
  const allProjects = [...created, ...contributed];
  const collabScore = profileUser.collaborationScore || calculateCollaborationScore(profileUser.id, contributions);
  const totalEarnings = transactions.filter(t => t.type === 'payout' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalStake = contributions.reduce((s, c) => s + c.stakePercent, 0);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-glow rounded-2xl p-8 relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          <img src={profileUser.avatar} alt={profileUser.name}
            className="w-24 h-24 rounded-2xl bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] flex-shrink-0" />

          <div className="flex-1 min-w-0 w-full">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold text-[var(--color-fg-default)]">Edit Profile</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="p-1.5 rounded-md hover:bg-[var(--color-surface-700)] text-[var(--color-fg-muted)] cursor-pointer"><X size={18} /></button>
                    <button onClick={saveProfile} className="p-1.5 rounded-md bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] text-white cursor-pointer"><Check size={18} /></button>
                  </div>
                </div>
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-1.5 text-sm text-[var(--color-fg-default)]" placeholder="Full Name" />
                <textarea value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-1.5 text-sm text-[var(--color-fg-default)] h-20" placeholder="Bio" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={editForm.github} onChange={e => setEditForm({...editForm, github: e.target.value})}
                    className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-1.5 text-sm text-[var(--color-fg-default)]" placeholder="GitHub Username" />
                  <input type="text" value={editForm.upiId} onChange={e => setEditForm({...editForm, upiId: e.target.value})}
                    className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-1.5 text-sm text-[var(--color-fg-default)]" placeholder="UPI ID (e.g. name@upi)" />
                </div>
                <input type="text" value={editForm.skills} onChange={e => setEditForm({...editForm, skills: e.target.value})}
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-1.5 text-sm text-[var(--color-fg-default)]" placeholder="Skills (comma separated)" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-[var(--color-fg-default)]">{profileUser.name}</h1>
                    <span className="px-3 py-0.5 rounded-full text-xs font-semibold capitalize bg-[rgba(var(--accent-fg-rgb),0.1)] text-[var(--color-accent-fg)] border border-[rgba(var(--accent-fg-rgb),0.2)]">
                      {profileUser.role}
                    </span>
                    {/* GitHub link status */}
                    {profileUser.githubLinked ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(63,185,80,0.1)] text-[var(--color-success-fg)] border border-[rgba(63,185,80,0.2)] flex items-center gap-1">
                        <Link2 size={10} /> GitHub Connected
                      </span>
                    ) : isOwnProfile ? (
                      <button onClick={linkGitHub} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-surface-800)] text-[var(--color-fg-muted)] border border-[var(--color-surface-700)] flex items-center gap-1 hover:text-[var(--color-fg-default)] cursor-pointer">
                        <Link2 size={10} /> Link GitHub
                      </button>
                    ) : null}
                  </div>
                  {isOwnProfile && (
                    <button onClick={startEditing} className="p-2 rounded-md hover:bg-[var(--color-surface-700)] text-[var(--color-fg-muted)] cursor-pointer">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>

                <p className="text-[var(--color-fg-muted)] leading-relaxed mb-4 max-w-2xl">{profileUser.bio || 'No bio provided'}</p>

                <div className="flex items-center gap-5 flex-wrap text-sm">
                  {profileUser.github && (
                    <a href={`https://github.com/${profileUser.github}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[var(--color-accent-fg)] hover:underline transition-colors">
                      <GitBranch size={14} /> @{profileUser.github} <ExternalLink size={11} />
                    </a>
                  )}
                  {/* UPI ID with quick edit */}
                  {editingUpi ? (
                    <div className="flex items-center gap-2">
                      <input type="text" value={upiInput} onChange={e => setUpiInput(e.target.value)}
                        className="bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded px-2 py-0.5 text-xs text-[var(--color-fg-default)] w-40"
                        placeholder="name@upi" autoFocus />
                      <button onClick={saveUpi} className="text-[var(--color-success-fg)] cursor-pointer"><Check size={14} /></button>
                      <button onClick={() => setEditingUpi(false)} className="text-[var(--color-fg-muted)] cursor-pointer"><X size={14} /></button>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[var(--color-fg-muted)] group">
                      <DollarSign size={14} />
                      {profileUser.upiId || 'No UPI set'}
                      {isOwnProfile && (
                        <button onClick={() => { setUpiInput(profileUser.upiId || ''); setEditingUpi(true); }}
                          className="opacity-0 group-hover:opacity-100 text-[var(--color-accent-fg)] transition-opacity cursor-pointer ml-1">
                          <Edit2 size={12} />
                        </button>
                      )}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-[var(--color-fg-muted)]">
                    <Calendar size={14} /> Joined {profileUser.joinDate}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {profileUser.skills?.map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-md bg-[var(--color-surface-800)] text-xs text-[var(--color-fg-default)] border border-[var(--color-surface-700)]">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Complete profile banner for GitHub users without bio */}
                {isOwnProfile && (!profileUser.bio || !profileUser.skills?.length) && (
                  <div className="mt-4 p-3 rounded-lg bg-[rgba(var(--accent-fg-rgb),0.06)] border border-[rgba(var(--accent-fg-rgb),0.15)] flex items-center justify-between">
                    <p className="text-xs text-[var(--color-accent-fg)]">Complete your profile to get better project matches</p>
                    <button onClick={startEditing} className="text-xs font-medium text-[var(--color-accent-fg)] hover:underline cursor-pointer">Edit Profile</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Collaboration Score */}
          {!isEditing && (
            <div className="flex-shrink-0 text-center glass-card rounded-xl p-4 min-w-[120px]">
              <span className="block text-3xl font-bold text-[var(--color-success-fg)]">{collabScore}</span>
              <span className="text-[10px] text-[var(--color-fg-muted)] uppercase mt-1">Collab Score</span>
            </div>
          )}
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
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[var(--color-fg-default)] mb-4">Projects ({allProjects.length})</h3>
            <div className="space-y-3">
              {allProjects.map((p, i) => {
                const isCreator = p.createdBy === profileUser.id;
                const contrib = contributions.find(c => c.projectId === p.id);
                return (
                  <div key={p.id} onClick={() => navigate(`/project/${p.id}`)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] hover:bg-[var(--color-surface-800)] hover:border-[rgba(var(--accent-fg-rgb),0.2)] cursor-pointer transition-all animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-800)] border border-[var(--color-surface-700)] flex items-center justify-center text-lg font-bold text-[var(--color-accent-fg)] flex-shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--color-fg-default)] truncate">{p.name}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isCreator ? 'bg-[rgba(var(--accent-fg-rgb),0.1)] text-[var(--color-accent-fg)] border border-[rgba(var(--accent-fg-rgb),0.2)]' : 'bg-[rgba(var(--brand-rgb),0.1)] text-[var(--color-success-fg)] border border-[rgba(var(--brand-rgb),0.2)]'
                        }`}>{isCreator ? 'Creator' : 'Contributor'}</span>
                      </div>
                      <p className="text-xs text-[var(--color-fg-muted)]">{p.domain} • {contrib?.role || 'Founder'}</p>
                    </div>
                    <div className="text-right">
                      {contrib && <p className="text-sm font-bold text-[var(--color-warning-fg)]">{contrib.stakePercent}%</p>}
                      <p className="text-xs text-[var(--color-fg-muted)]">stake</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Peer Reviews */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--color-fg-default)]">Peer Reviews ({reviews.length})</h3>
              {!isOwnProfile && (
                <button onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-secondary text-xs cursor-pointer">
                  <Plus size={14} /> Write Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="p-4 rounded-xl bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] mb-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-[var(--color-fg-muted)]">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setReviewRating(n)} className="cursor-pointer">
                        <Star size={16} className={n <= reviewRating ? 'text-[var(--color-warning-fg)] fill-[var(--color-warning-fg)]' : 'text-[var(--color-surface-600)]'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                  className="w-full bg-[var(--color-surface-900)] border border-[var(--color-surface-700)] rounded-md px-3 py-2 text-sm text-[var(--color-fg-default)] h-20 mb-3 resize-none focus:outline-none focus:border-[var(--color-accent-fg)]"
                  placeholder="Share your experience working with this person..." />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowReviewForm(false)} className="btn-ghost text-xs cursor-pointer">Cancel</button>
                  <button onClick={submitReview} disabled={!reviewText.trim()} className="btn-primary text-xs cursor-pointer">Submit Review</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-[var(--color-fg-default)]">{review.from}</p>
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-[var(--color-warning-fg)] fill-[var(--color-warning-fg)]" />
                      <span className="text-sm font-bold text-[var(--color-warning-fg)]">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-fg-muted)]">{review.text}</p>
                  <p className="text-xs text-[var(--color-fg-muted)] opacity-70 mt-2">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[var(--color-fg-default)] mb-4">Activity</h3>
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
