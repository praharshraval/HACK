import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, GitBranch, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  const { loginWithEmail, loginWithGitHub } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    loginWithEmail(email);
    setIsLoading(false);
    navigate('/marketplace');
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#388bfd] selection:text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#0d1117]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center border border-[#30363d]">
            <Zap size={16} className="text-[#c9d1d9]" />
          </div>
          <span className="font-semibold text-[16px] text-white tracking-tight">IP-NEXUS</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-[14px] font-medium text-[#c9d1d9]">
          <a href="#" className="hover:text-[#58a6ff] transition-colors">Product</a>
          <a href="#" className="hover:text-[#58a6ff] transition-colors">Solutions</a>
          <a href="#" className="hover:text-[#58a6ff] transition-colors">Open Source</a>
          <a href="#" className="hover:text-[#58a6ff] transition-colors">Pricing</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column - Hero */}
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white tracking-tight">
            The Open-Source <br className="hidden lg:block"/>
            <span className="text-[#58a6ff]">Patent Commons</span>
          </h1>
          <p className="text-[20px] text-[#8b949e] max-w-[600px] leading-relaxed">
            Build, collaborate, fund, and monetize with transparent micro-ownership. 
            Your contributions are tracked, valued, and rewarded automatically based on verifiable Git commits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => { loginWithGitHub(); navigate('/marketplace'); }}
              className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-semibold flex items-center justify-center gap-2 border border-[rgba(240,246,252,0.1)] transition-colors"
            >
              <GitBranch size={18} /> Continue with GitHub
            </button>
            <a href="#login-form" className="px-6 py-3 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded-md font-semibold border border-[#30363d] text-center transition-colors">
              Sign in with Email
            </a>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-6 border-t border-[#30363d]">
            <div>
              <Shield className="text-[#8b949e] mb-2" size={24} />
              <h3 className="text-white font-semibold mb-1">Verifiable Provenance</h3>
              <p className="text-[14px] text-[#8b949e]">Every line of code and design asset proves your stake.</p>
            </div>
            <div>
              <Terminal className="text-[#8b949e] mb-2" size={24} />
              <h3 className="text-white font-semibold mb-1">Developer First</h3>
              <p className="text-[14px] text-[#8b949e]">Integrated directly with standard Git workflows.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Login & Dev Terminal */}
        <div className="lg:pl-12 flex flex-col gap-6" id="login-form">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-white mb-6">Authenticate to Dashboard</h2>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium mb-2 pr-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                  placeholder="you@example.com"
                />
              </div>
              <div className="pb-2">
                <label className="block text-[14px] font-medium mb-2 pr-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                  placeholder="••••••••"
                />
              </div>
              
              {error && <p className="text-[#f85149] text-sm">{error}</p>}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white rounded-md py-1.5 font-medium border border-[rgba(240,246,252,0.1)] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          {/* Code snippet decoration */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden font-mono text-[13px] shadow-sm">
            <div className="bg-[#0d1117] px-4 py-2 border-b border-[#30363d] flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f85149]"></div>
              <div className="w-3 h-3 rounded-full bg-[#d29922]"></div>
              <div className="w-3 h-3 rounded-full bg-[#3fb950]"></div>
            </div>
            <div className="p-4 text-[#8b949e]">
              <div className="flex"><span className="text-[#79c0ff] pr-4">1</span><span className="text-[#ff7b72]">import</span> {'{ IPNexus }'} <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'@ip-nexus/core'</span>;</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">2</span></div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">3</span><span className="text-[#ff7b72]">const</span> project = <span className="text-[#ff7b72]">new</span> <span className="text-[#d2a8ff]">IPNexus</span>();</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">4</span><span className="text-[#ff7b72]">await</span> project.<span className="text-[#d2a8ff]">distributeRoyalties</span>({'{'}</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">5</span>  strategy: <span className="text-[#a5d6ff]">'git-commit-weight'</span>,</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">6</span>  currency: <span className="text-[#a5d6ff]">'INR'</span></div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">7</span>{'}'});</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t border-[#30363d] text-[12px] text-[#8b949e] flex flex-col sm:flex-row items-center gap-6 justify-between max-w-[1280px] w-full mx-auto">
        <div>© 2026 IP-NEXUS, Inc.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#58a6ff]">Terms</a>
          <a href="#" className="hover:text-[#58a6ff]">Privacy</a>
          <a href="#" className="hover:text-[#58a6ff]">Status</a>
          <a href="#" className="hover:text-[#58a6ff]">Docs</a>
          <a href="#" className="hover:text-[#58a6ff]">Contact GitHub</a>
        </div>
      </footer>
    </main>
  );
}
