import { useState } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, Download, CreditCard, Smartphone, Building2, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatCurrency, simulateRevenueDistribution } from '../services/aiEngine';
import StatsCard from '../components/StatsCard';
import RevenueChart from '../components/RevenueChart';
import TransactionTable from '../components/TransactionTable';

export default function WalletPage() {
  const { currentUser } = useAuth();
  const { getUserTransactions, projects, contributions, investments, users, processWithdrawal } = useData();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  const [selectedProjectForDist, setSelectedProjectForDist] = useState(null);

  const txns = getUserTransactions(currentUser?.id);
  const completedPayouts = txns.filter(t => t.type === 'payout' && t.status === 'completed');
  const pendingPayouts = txns.filter(t => t.status === 'pending');
  const totalReceived = completedPayouts.reduce((s, t) => s + t.amount, 0);
  const totalPending = pendingPayouts.reduce((s, t) => s + t.amount, 0);

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > (currentUser?.walletBalance || 0)) return;

    processWithdrawal(currentUser.id, amt);
    setWithdrawSuccess(true);
    setTimeout(() => { setShowWithdrawModal(false); setWithdrawSuccess(false); setWithdrawAmount(''); }, 2000);
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Oasis Transaction Statement', 14, 22);
    doc.setFontSize(11);
    doc.text(`Account: ${currentUser?.name}`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 38);

    autoTable(doc, {
      startY: 48,
      head: [['Date', 'Type', 'Description', 'Status', 'Amount']],
      body: txns.map(t => [
        t.date,
        t.type,
        t.description,
        t.status,
        `₹${t.amount.toLocaleString('en-IN')}`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.save(`oasis-statement-${currentUser?.name?.replace(/\s/g, '-')}.pdf`);
  };

  const handleSimulateDistribution = (projectId) => {
    setSelectedProjectForDist(projectId);
    setShowDistribution(true);
  };

  const distribution = selectedProjectForDist
    ? simulateRevenueDistribution(selectedProjectForDist, 100000, contributions, investments, users)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Wallet</h1>
          <p className="text-slate-500 mt-1">Manage your earnings, payouts, and transactions</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDownloadPDF} className="btn-secondary text-sm" id="download-statement-btn">
            <Download size={14} /> Statement
          </button>
          <button onClick={() => setShowWithdrawModal(true)} className="btn-primary text-sm" id="withdraw-btn">
            <Wallet size={14} /> Withdraw
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <div className="glass rounded-2xl p-6 glow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-success-400/10 flex items-center justify-center">
              <Wallet size={16} className="text-success-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white animate-count-up">{formatCurrency(currentUser?.walletBalance || 0)}</p>
          <p className="text-xs text-success-400 mt-1">Ready to withdraw</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Pending Payouts</span>
            <div className="w-8 h-8 rounded-lg bg-warning-400/10 flex items-center justify-center">
              <Clock size={16} className="text-warning-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(currentUser?.pendingPayout || totalPending)}</p>
          <p className="text-xs text-warning-400 mt-1">{pendingPayouts.length} pending</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Total Earned</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <ArrowDownRight size={16} className="text-brand-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(currentUser?.totalEarned || totalReceived)}</p>
          <p className="text-xs text-brand-400 mt-1">Lifetime earnings</p>
        </div>
      </div>

      {/* Revenue Chart + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue History</h3>
          <RevenueChart transactions={txns} />
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Revenue Simulator</h3>
          <p className="text-sm text-slate-500 mb-4">Simulate how ₹1,00,000 would be distributed across stakeholders.</p>
          <div className="space-y-2">
            {projects.slice(0, 4).map(p => (
              <button
                key={p.id}
                onClick={() => handleSimulateDistribution(p.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-sm font-bold text-brand-400">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-300 truncate">{p.name}</p>
                  <p className="text-xs text-slate-600">{p.domain}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
        <TransactionTable transactions={txns} />
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowWithdrawModal(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass rounded-2xl p-8 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X size={18} />
            </button>

            {withdrawSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-success-400/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-success-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Withdrawal Initiated!</h3>
                <p className="text-sm text-slate-400">Amount will be credited within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Withdraw Funds</h3>
                <p className="text-sm text-slate-500 mb-6">Available: {formatCurrency(currentUser?.walletBalance || 0)}</p>

                {/* Method selection (UPI Only) */}
                <div className="mb-4 p-3 rounded-xl bg-[var(--color-surface-950)] border border-[var(--color-surface-700)]">
                    <p className="text-xs text-[var(--color-fg-muted)] mb-1">UPI ID</p>
                    <p className="text-sm font-medium text-white">{currentUser?.upiId || 'Not set'}</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="10,000"
                    className="input-dark"
                    id="withdraw-amount-input"
                    max={currentUser?.walletBalance}
                  />
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > (currentUser?.walletBalance || 0)}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-30"
                >
                  Withdraw {withdrawAmount ? formatCurrency(parseFloat(withdrawAmount)) : ''}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Distribution Modal */}
      {showDistribution && distribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDistribution(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass rounded-2xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowDistribution(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold text-white mb-1">Revenue Distribution Simulation</h3>
            <p className="text-sm text-slate-500 mb-6">How {formatCurrency(distribution.totalRevenue)} would be split:</p>

            <div className="flex gap-4 mb-6">
              <div className="flex-1 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center">
                <p className="text-lg font-bold text-brand-300">{distribution.contributorPool.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">Contributors</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-warning-400/10 border border-warning-400/20 text-center">
                <p className="text-lg font-bold text-warning-400">{distribution.investorPool.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">Investors</p>
              </div>
            </div>

            <div className="space-y-2">
              {distribution.all.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{d.name}</p>
                    <p className="text-xs text-slate-600">{d.role} • {d.upiId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success-400">{formatCurrency(d.amount)}</p>
                    <p className="text-xs text-slate-500">{d.stakePercent.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
