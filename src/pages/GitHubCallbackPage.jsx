import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function GitHubCallbackPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isOnboarded } = useAuth();
  const [status, setStatus] = useState('processing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Supabase handles the OAuth callback automatically via onAuthStateChange
    // This page just shows a loading state while the redirect completes
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        setStatus('error');
        setErrorMsg('Authentication timed out. Please try again.');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setStatus('success');
      const redirectTimer = setTimeout(() => {
        navigate(isOnboarded ? '/marketplace' : '/onboarding', { replace: true });
      }, 1200);
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, isOnboarded, navigate]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-950)] flex items-center justify-center transition-colors duration-300">
      <div className="text-center max-w-sm px-6">
        {status === 'processing' && (
          <div className="animate-fade-in">
            <Loader2 size={40} className="animate-spin mx-auto mb-4 text-[var(--color-fg-muted)]" />
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-2">Authenticating with GitHub</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">Verifying your identity and importing profile data...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-in">
            <CheckCircle size={40} className="mx-auto mb-4 text-[var(--color-success-fg)]" />
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-2">Authentication Successful</h2>
            <p className="text-sm text-[var(--color-fg-muted)]">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in">
            <AlertCircle size={40} className="mx-auto mb-4 text-[var(--color-danger-fg)]" />
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-2">Authentication Failed</h2>
            <p className="text-sm text-[var(--color-fg-muted)] mb-6">{errorMsg}</p>
            <button onClick={() => navigate('/')}
              className="px-4 py-2 bg-[var(--color-surface-800)] text-[var(--color-fg-default)] border border-[var(--color-surface-700)] rounded-md text-sm font-medium hover:bg-[var(--color-surface-700)] transition-colors cursor-pointer">
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
