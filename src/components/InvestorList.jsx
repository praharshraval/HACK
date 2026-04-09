import { useData } from '../context/DataContext';
import { formatCurrency } from '../services/aiEngine';

export default function InvestorList({ investments }) {
  const { getUser } = useData();

  if (!investments || investments.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-8">No investors yet</p>;
  }

  return (
    <div className="space-y-3" id="investor-list">
      {investments.map((inv, i) => {
        const user = getUser(inv.investorId);
        return (
          <div
            key={inv.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img src={user?.avatar} alt="" className="w-10 h-10 rounded-lg bg-surface-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-500">{inv.date} • {inv.note}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-warning-400">{formatCurrency(inv.amount)}</p>
              <p className="text-xs text-slate-500">{inv.stakePercent}% stake</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
