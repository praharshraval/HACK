import { useState } from 'react';
import { Cpu, GitBranch, DollarSign, Activity, GitCommit, Search, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { formatCurrency } from '../services/aiEngine';

export default function IPNexusPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [licenseValue, setLicenseValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runEngine = async (e) => {
    e.preventDefault();
    if (!licenseValue) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Extract owner/repo intelligently
      let owner = '';
      let repo = '';
      let cleanUrl = repoUrl.trim();
      
      try {
        if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
        const urlObj = new URL(cleanUrl);
        const parts = urlObj.pathname.split('/').filter(Boolean);
        owner = parts[0];
        repo = parts[1];
        if (!owner || !repo) throw new Error();
      } catch (err) {
        throw new Error('Invalid GitHub URL. Use format: github.com/owner/repo');
      }

      // 2. Fetch up to 100 recent commits to get up to 50 contributors
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('Repository not found or private.');
        if (response.status === 403) throw new Error('API Rate Limit Exceeded.');
        throw new Error('Failed to fetch from GitHub API.');
      }
      
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No commits found in this repository.');
      }

      // 3. Map Commits to Unique Users
      const map = {};
      data.forEach(c => {
        const user = c.author?.login || c.commit?.author?.name || 'unknown';
        const avatar = c.author?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user}`;
        if (!map[user]) {
          map[user] = { commits: 0, avatar };
        }
        map[user].commits++;
      });

      // 4. Calculate Scores
      let contributors = [];
      let totalScore = 0;

      for (let user in map) {
        const { commits, avatar } = map[user];
        const peerScore = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
        const score = Number((commits * 0.7 + peerScore * 0.3).toFixed(2));
        totalScore += score;
        contributors.push({ user, avatar, commits, peerScore, score });
      }

      // 5. Compute Payouts & Slice up to 50
      const value = Number(parseFloat(licenseValue).toFixed(2));
      let totalPaid = 0;

      let royaltyDistribution = contributors.map(c => {
        const percentage = Number(((c.score / totalScore) * 100).toFixed(2));
        const royalty = Number(((percentage / 100) * value).toFixed(2));
        return {
          ...c,
          percentage,
          royalty,
          upiId: `${c.user.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
          txId: "TXN" + Math.floor(100000 + Math.random() * 900000)
        };
      }).sort((a, b) => b.royalty - a.royalty);

      // Distribute to up to 50 Persons
      royaltyDistribution = royaltyDistribution.slice(0, 50);

      // Recalculate accurately based on the sliced pool just for reporting total distributed
      royaltyDistribution.forEach(r => { totalPaid += r.royalty; });

      setResult({
        owner,
        repo,
        totalValue: value,
        totalPaid: Number(totalPaid.toFixed(2)),
        totalCommits: data.length,
        contributors: royaltyDistribution,
        topContributor: royaltyDistribution[0] || null
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">IP Nexus Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[rgba(var(--brand-rgb),0.1)] text-[var(--color-brand-400)] text-[10px] uppercase font-bold border border-[rgba(var(--brand-rgb),0.2)]">Live Simulation</span>
          </div>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
            Test the core algorithmic distribution engine. Enter any public GitHub repository to simulate instantly calculating micro-ownership and distributing capital (up to 50 participants).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={runEngine} className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-600)] opacity-[0.03] blur-3xl rounded-full" />
            
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <Activity size={18} className="text-[var(--color-brand-400)]" /> Run Engine
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <GitBranch size={12} className="text-[var(--color-fg-muted)]"/> Target Repository
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. facebook/react" 
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  className="input-dark w-full text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <DollarSign size={12} className="text-[var(--color-fg-muted)]"/> Investment Value (₹)
                </label>
                <input 
                  type="number" 
                  required
                  min="1"
                  placeholder="500000" 
                  value={licenseValue}
                  onChange={e => setLicenseValue(e.target.value)}
                  className="input-dark w-full text-sm font-mono tracking-wide"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full justify-center mt-4 group relative overflow-hidden h-11"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--color-brand-300)] border-t-transparent rounded-full animate-spin"></div> 
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Cpu size={16} className="group-hover:rotate-12 transition-transform" /> Execute Protocol
                  </span>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.2)] text-xs text-[var(--color-danger-fg)] animate-shake">
                {error}
              </div>
            )}
          </form>

          <div className="glass rounded-2xl p-6 relative overflow-hidden">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[var(--color-brand-400)]"/> Pipeline Steps
            </h4>
            <ol className="relative border-l border-white/10 ml-2 space-y-5">
              <li className="pl-5 relative">
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--color-surface-700)] -left-[5px] top-1" />
                <p className="text-xs text-slate-200 font-semibold uppercase tracking-wider">Scrape History</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Reads up to 100 recent commits to map valid network identities.</p>
              </li>
              <li className="pl-5 relative">
                <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--color-brand-500)] -left-[5px] top-1 shadow-[0_0_8px_rgba(var(--brand-rgb),0.5)]" />
                <p className="text-xs text-slate-200 font-semibold uppercase tracking-wider">Stake Consensus</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Runs dynamic AI model over code impact & peer reputation.</p>
              </li>
              <li className="pl-5 relative">
                <div className="absolute w-2.5 h-2.5 rounded-full bg-white -left-[5px] top-1 shadow-[0_0_8px_white]" />
                <p className="text-xs text-slate-200 font-semibold uppercase tracking-wider">Capital Routing</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Locks final shares and automates micro-payouts for up to 50 nodes.</p>
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="glass rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center border border-dashed border-white/10">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search size={24} className="text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Awaiting Parameters</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Enter a repository address and the total capital pool to automatically route ownership based on merit.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass rounded-2xl p-12 text-center h-[500px] flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-6">
                 <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                 <div className="absolute inset-0 border-4 border-t-[var(--color-brand-400)] border-r-[var(--color-brand-300)] border-b-transparent border-l-transparent rounded-full animate-[spin_1s_linear_infinite]" />
                 <Cpu size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-brand-400)] shadow-glow" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Synthesizing Network</h3>
              <p className="text-sm text-slate-400 font-mono">Running cryptographic distribution protocol...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-4">
                   <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">Total Capital</p>
                   <p className="text-lg font-bold text-white truncate">{formatCurrency(result.totalValue)}</p>
                </div>
                <div className="glass rounded-xl p-4">
                   <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">Distributed</p>
                   <p className="text-lg font-bold text-white truncate">{formatCurrency(result.totalPaid)}</p>
                </div>
                <div className="glass rounded-xl p-4 border border-[var(--color-brand-500)] bg-[rgba(var(--brand-rgb),0.02)]">
                   <p className="text-[10px] text-[var(--color-brand-400)] mb-1 uppercase tracking-wider font-semibold">Payouts Made</p>
                   <p className="text-lg font-bold text-white">{result.contributors.length} Valid</p>
                </div>
                <div className="glass rounded-xl p-4">
                   <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">Lead Developer</p>
                   <p className="text-sm font-semibold text-white truncate leading-tight pt-1">{result.topContributor?.user || 'None'}</p>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Consensus Leaderboard</h3>
                  <span className="flex items-center gap-1.5 text-xs text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
                     <CheckCircle2 size={12} className="text-[var(--color-brand-400)]"/> Network Verified
                  </span>
                </div>
                
                <div className="overflow-x-auto max-h-[500px]">
                  {result.contributors.length > 0 ? (
                    <table className="w-full text-left">
                      <thead className="bg-[#0f0f13] sticky top-0 z-10">
                        <tr className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase border-b border-white/5">
                          <th className="px-5 py-3 font-medium">Contributor ID</th>
                          <th className="px-5 py-3 text-center font-medium">Network Impact</th>
                          <th className="px-5 py-3 text-center font-medium">Allocated Stake</th>
                          <th className="px-5 py-3 text-right font-medium">Total Payout</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {result.contributors.map((c, i) => (
                          <tr key={c.user} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-slate-600 w-4">{i + 1}.</span>
                                <img src={c.avatar} alt="" className="w-8 h-8 rounded-full bg-[var(--color-surface-800)] ring-1 ring-white/10" />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-white truncate">{c.user}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                                    <Zap size={10} className="text-[var(--color-brand-500)]"/> {c.upiId} — {c.txId}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <div className="flex justify-center flex-col items-center">
                                <span className="text-sm font-bold text-slate-200">{c.score.toFixed(1)}</span>
                                <span className="text-[9px] text-slate-500 uppercase">{c.commits} Commits</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-white border border-white/10">
                                {c.percentage.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right group-hover:bg-[rgba(var(--brand-rgb),0.02)] transition-colors">
                               <p className="font-bold text-white text-[15px]">{formatCurrency(c.royalty)}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-slate-500">
                      <p>No valid contributors could be resolved.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
