import { ArrowDownRight, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../services/aiEngine';

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-8">No transactions yet</p>;
  }

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="overflow-x-auto" id="transaction-table">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Type</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Description</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Date</th>
            <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Status</th>
            <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-4">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {sorted.map((tx, i) => (
            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
              <td className="py-3.5 px-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tx.type === 'payout' || tx.type === 'return' ? 'bg-success-400/10' :
                  tx.type === 'withdrawal' ? 'bg-danger-400/10' : 'bg-brand-500/10'
                }`}>
                  {tx.type === 'payout' || tx.type === 'return' ? (
                    <ArrowDownRight size={16} className="text-success-400" />
                  ) : (
                    <ArrowUpRight size={16} className="text-danger-400" />
                  )}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <p className="text-sm text-slate-300">{tx.description}</p>
                <p className="text-xs text-slate-600 capitalize">{tx.type}</p>
              </td>
              <td className="py-3.5 px-4">
                <span className="text-sm text-slate-400">{tx.date}</span>
              </td>
              <td className="py-3.5 px-4 text-center">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tx.status === 'completed'
                    ? 'bg-success-400/10 text-success-400'
                    : 'bg-warning-400/10 text-warning-400'
                }`}>
                  {tx.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {tx.status}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <span className={`text-sm font-bold ${
                  tx.type === 'payout' || tx.type === 'return' ? 'text-success-400' : 'text-danger-400'
                }`}>
                  {tx.type === 'payout' || tx.type === 'return' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
