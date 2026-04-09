import { GitCommit, DollarSign, UserPlus, CheckCircle, Star, Zap } from 'lucide-react';

const iconMap = {
  commit: GitCommit,
  payout: DollarSign,
  joined: UserPlus,
  milestone: CheckCircle,
  review: Star,
  default: Zap,
};

const colorMap = {
  commit: 'text-brand-400 bg-brand-500/10',
  payout: 'text-success-400 bg-success-400/10',
  joined: 'text-cyan-400 bg-cyan-500/10',
  milestone: 'text-warning-400 bg-warning-400/10',
  review: 'text-purple-400 bg-purple-500/10',
  default: 'text-slate-400 bg-white/5',
};

export default function ActivityTimeline({ activities = [] }) {
  // Generate sample activities if none provided
  const items = activities.length > 0 ? activities : [
    { type: 'milestone', text: 'Completed "Model Training v1" milestone', date: '2 hours ago', project: 'NeuroLens' },
    { type: 'payout', text: 'Received ₹12,500 revenue distribution', date: '1 day ago', project: 'EduForge' },
    { type: 'commit', text: 'Pushed 12 commits to main branch', date: '2 days ago', project: 'PaySplit' },
    { type: 'review', text: 'Received 4.9★ peer review from Priya', date: '3 days ago', project: 'EduForge' },
    { type: 'joined', text: 'Joined as Backend Architect', date: '1 week ago', project: 'NeuroLens' },
    { type: 'payout', text: 'Received ₹9,600 licensing fee', date: '2 weeks ago', project: 'PaySplit' },
  ];

  return (
    <div className="relative" id="activity-timeline">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/30 via-white/5 to-transparent" />

      <div className="space-y-4">
        {items.map((item, i) => {
          const Icon = iconMap[item.type] || iconMap.default;
          const colors = colorMap[item.type] || colorMap.default;
          return (
            <div
              key={i}
              className="flex gap-4 relative animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-10 h-10 rounded-xl ${colors} flex items-center justify-center flex-shrink-0 z-10`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm text-slate-300">{item.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-600">{item.date}</span>
                  {item.project && (
                    <>
                      <span className="text-xs text-slate-700">•</span>
                      <span className="text-xs text-brand-400">{item.project}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
