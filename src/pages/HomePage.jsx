import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, GitBranch, Shield, Zap, Mail, ArrowRight, Link2, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function HomePage() {
  const { loginWithEmail, loginWithGitHub, verifyEmailOtp } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loginMode, setLoginMode] = useState('select'); // 'select', 'email', 'otp'
  const [otpToken, setOtpToken] = useState('');

  // Liquid morphism background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId;
    let time = 0;

    const resize = () => {
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const blobs = [
      { x: 0.25, y: 0.35, r: 220, color: 'rgba(88,166,255,0.07)', speed: 0.7, phase: 0 },
      { x: 0.75, y: 0.25, r: 250, color: 'rgba(63,185,80,0.05)', speed: 0.5, phase: 2 },
      { x: 0.5, y: 0.75, r: 200, color: 'rgba(137,87,229,0.05)', speed: 0.9, phase: 4 },
      { x: 0.15, y: 0.85, r: 180, color: 'rgba(210,153,34,0.04)', speed: 0.6, phase: 1 },
    ];

    const draw = () => {
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      blobs.forEach(blob => {
        const cx = w * blob.x + Math.sin(time * 0.008 * blob.speed + blob.phase) * 80;
        const cy = h * blob.y + Math.cos(time * 0.006 * blob.speed + blob.phase) * 50;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.r);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });
      time++;
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result?.needsVerification) {
        setSuccess('Enter the 6-digit OTP sent to your email.');
        setLoginMode('otp');
        setIsLoading(false);
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
    setIsLoading(false);
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!otpToken || otpToken.length !== 6) {
      setError('OTP must be exactly 6 characters');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await verifyEmailOtp(email, otpToken);
      navigate('/marketplace');
    } catch (err) {
      setError(err.message || 'Verification failed. Try again.');
    }
    setIsLoading(false);
  };

  const handleGitHubLogin = async () => {
    try {
      await loginWithGitHub();
      // If demo mode, this returns immediately and we navigate
      // If Supabase, it redirects to GitHub — no navigation needed
      navigate('/marketplace');
    } catch (err) {
      setError(err.message || 'GitHub authentication failed');
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-surface-950)] text-[var(--color-fg-default)] font-sans flex flex-col transition-colors duration-300 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ filter: 'blur(80px)' }} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-700)] z-10 relative" style={{ backgroundColor: 'var(--color-surface-950)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-surface-800)] flex items-center justify-center border border-[var(--color-surface-700)]">
            <Zap size={16} className="text-[var(--color-accent-fg)]" />
          </div>
          <span className="font-bold text-[17px] text-[var(--color-fg-default)] tracking-tight">Oasis</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center z-10 relative">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-[var(--color-fg-default)] tracking-tight">
            The Open-Source <br className="hidden lg:block"/>
            <span className="text-[var(--color-accent-fg)]">Patent Commons</span>
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)] max-w-[560px] leading-relaxed">
            Build, collaborate, fund, and monetize with transparent micro-ownership. 
            Your contributions are tracked, valued, and rewarded automatically.
          </p>
          <div className="pt-8 grid grid-cols-2 gap-6 border-t border-[var(--color-surface-700)]">
            <div>
              <Shield className="text-[var(--color-fg-muted)] mb-2" size={24} />
              <h3 className="text-[var(--color-fg-default)] font-semibold mb-1">Verifiable Provenance</h3>
              <p className="text-[14px] text-[var(--color-fg-muted)]">Every commit proves your stake with cryptographic certainty.</p>
            </div>
            <div>
              <Terminal className="text-[var(--color-fg-muted)] mb-2" size={24} />
              <h3 className="text-[var(--color-fg-default)] font-semibold mb-1">Developer First</h3>
              <p className="text-[14px] text-[var(--color-fg-muted)]">Native Git integration. No new tools to learn.</p>
            </div>
          </div>
        </div>

        {/* Auth Panel */}
        <div className="lg:pl-12 flex flex-col gap-6" id="login-form">
          <div className="glass-card rounded-xl p-8">
            {loginMode === 'select' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-[var(--color-fg-default)] mb-2">Sign in to Oasis</h2>
                <p className="text-sm text-[var(--color-fg-muted)] mb-6">Choose how you want to authenticate.</p>
                
                <button onClick={handleGitHubLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[var(--color-fg-default)] text-[var(--color-surface-950)] rounded-md font-semibold text-[14px] hover:opacity-90 transition-opacity cursor-pointer">
                  <GitBranch size={20} /> Continue with GitHub
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-[var(--color-surface-700)]"></div>
                  <span className="text-xs text-[var(--color-fg-muted)] font-medium">OR</span>
                  <div className="flex-1 h-px bg-[var(--color-surface-700)]"></div>
                </div>

                <button onClick={() => setLoginMode('email')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[var(--color-surface-800)] text-[var(--color-fg-default)] rounded-md font-semibold text-[14px] border border-[var(--color-surface-700)] hover:bg-[var(--color-surface-700)] transition-colors cursor-pointer">
                  <Mail size={18} /> Continue with Email
                </button>

                {error && <p className="text-[var(--color-danger-fg)] text-sm mt-2">{error}</p>}

                <p className="text-[11px] text-[var(--color-fg-muted)] text-center mt-4 leading-relaxed">
                  By signing in, you agree to our{' '}
                  <Link to="/privacy" className="text-[var(--color-accent-fg)] hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            )}

            {loginMode === 'email' && (
              <div>
                <div className="flex items-center mb-6 gap-3">
                  <button onClick={() => { setLoginMode('select'); setError(''); setSuccess(''); }} className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] transition-colors cursor-pointer">
                    <ArrowRight size={16} className="rotate-180" />
                  </button>
                  <h2 className="text-xl font-semibold text-[var(--color-fg-default)]">Sign in with Email</h2>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-[14px] font-medium mb-2 text-[var(--color-fg-default)]">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-2 text-[14px] text-[var(--color-fg-default)] focus:outline-none focus:border-[var(--color-accent-fg)] focus:ring-1 focus:ring-[var(--color-accent-fg)] transition-all"
                      placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-medium mb-2 text-[var(--color-fg-default)]">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-2 text-[14px] text-[var(--color-fg-default)] focus:outline-none focus:border-[var(--color-accent-fg)] focus:ring-1 focus:ring-[var(--color-accent-fg)] transition-all"
                      placeholder="Min 6 characters" />
                  </div>
                  
                  {error && <p className="text-[var(--color-danger-fg)] text-sm">{error}</p>}
                  {success && <p className="text-[var(--color-success-fg)] text-sm">{success}</p>}
                  
                  <button type="submit" disabled={isLoading}
                    className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] text-white rounded-md py-2.5 font-medium border border-[rgba(240,246,252,0.1)] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2">
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : 'Sign in'}
                  </button>
                </form>
              </div>
            )}

            {loginMode === 'otp' && (
              <div className="animate-fade-in">
                <div className="flex items-center mb-6 gap-3">
                  <button onClick={() => { setLoginMode('email'); setError(''); setSuccess(''); }} className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] transition-colors cursor-pointer">
                    <ArrowRight size={16} className="rotate-180" />
                  </button>
                  <h2 className="text-xl font-semibold text-[var(--color-fg-default)]">Verify Your Email</h2>
                </div>

                <form onSubmit={handleOtpVerification} className="space-y-4">
                  <p className="text-sm text-[var(--color-fg-muted)]">We sent a 6-digit verification code to <strong className="text-white">{email}</strong>.</p>
                  <div>
                    <label className="block text-[14px] font-medium mb-2 text-[var(--color-fg-default)]">Enter OTP</label>
                    <input type="text" value={otpToken} onChange={(e) => setOtpToken(e.target.value)} maxLength={6}
                      className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-3 text-[18px] tracking-widest text-center text-[var(--color-fg-default)] focus:outline-none focus:border-[var(--color-accent-fg)] focus:ring-1 focus:ring-[var(--color-accent-fg)] transition-all font-mono"
                      placeholder="000000" />
                  </div>
                  
                  {error && <p className="text-[var(--color-danger-fg)] text-sm">{error}</p>}
                  {success && <p className="text-[var(--color-success-fg)] text-sm">{success}</p>}
                  
                  <button type="submit" disabled={isLoading}
                    className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] text-white rounded-md py-2.5 font-medium border border-[rgba(240,246,252,0.1)] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-4">
                    {isLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Verify & Enter'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Code snippet */}
          <div className="glass-card rounded-xl overflow-hidden font-mono text-[13px]">
            <div className="bg-[var(--color-surface-950)] px-4 py-2 border-b border-[var(--color-surface-700)] flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-danger-fg)]"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-warning-fg)]"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-success-fg)]"></div>
            </div>
            <div className="p-4 text-[var(--color-fg-muted)]">
              <div className="flex"><span className="text-[#79c0ff] pr-4">1</span><span className="text-[var(--color-danger-fg)]">import</span>{' '}{'{ Oasis }'}{' '}<span className="text-[var(--color-danger-fg)]">from</span>{' '}<span className="text-[#a5d6ff]">'@oasis/core'</span>;</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">2</span></div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">3</span><span className="text-[var(--color-danger-fg)]">const</span>{' '}project = <span className="text-[var(--color-danger-fg)]">new</span>{' '}<span className="text-[#d2a8ff]">Oasis</span>();</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">4</span><span className="text-[var(--color-danger-fg)]">await</span>{' '}project.<span className="text-[#d2a8ff]">distributeRoyalties</span>({'{'}</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">5</span>{'  '}strategy: <span className="text-[#a5d6ff]">'git-commit-weight'</span>,</div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">6</span>{'  '}currency: <span className="text-[#a5d6ff]">'INR'</span></div>
              <div className="flex"><span className="text-[#79c0ff] pr-4">7</span>{'}'});</div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto py-6 px-6 border-t border-[var(--color-surface-700)] text-[12px] text-[var(--color-fg-muted)] flex flex-col sm:flex-row items-center gap-6 justify-between max-w-[1280px] w-full mx-auto z-10 relative">
        <div>© 2026 Oasis, Inc.</div>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-[var(--color-accent-fg)] transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-[var(--color-accent-fg)] transition-colors">Contact Us</Link>
        </div>
      </footer>
    </main>
  );
}
