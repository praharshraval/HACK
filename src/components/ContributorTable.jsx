import { Star, GitCommit, CheckCircle2, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import { calculateActivityScore } from '../services/aiEngine';

export default function ContributorTable({ contributions }) {
  const { getUser } = useData();

  return (
    <div className="overflow-x-auto">
      <table className="w-full" id="contributors-table">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Contributor</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Role</th>
            <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Commits</th>
            <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Tasks</th>
            <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Rating</th>
            <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Activity</th>
            <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Stake</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {contributions.map((c, i) => {
            const user = getUser(c.userId);
            const activity = calculateActivityScore(c);
            return (
              <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img src={user?.avatar} alt="" className="w-8 h-8 rounded-lg bg-surface-700" />
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{user?.name}</p>
                      <p className="text-xs text-slate-600">@{user?.github}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-sm text-slate-400">{c.role}</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <GitCommit size={13} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-300">{c.commits}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} className="text-slate-600" />
                    <span className="text-sm font-medium text-slate-300">{c.tasksCompleted}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Star size={13} className="text-warning-400 fill-warning-400" />
                    <span className="text-sm font-semibold text-warning-400">{c.peerRating}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${activity}%`,
                          background: activity > 70 ? 'linear-gradient(90deg, #22c55e, #4ade80)' :
                                     activity > 40 ? 'linear-gradient(90deg, #6366f1, #818cf8)' :
                                     'linear-gradient(90deg, #ef4444, #f87171)',
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{activity}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-sm font-bold gradient-text">{c.stakePercent}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
