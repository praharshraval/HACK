import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [githubToken, setGithubToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Supabase auth state changes (handles OAuth redirects)
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSupabaseSession(session);
      }
      setLoading(false);
    });

    // Listen for auth changes (OAuth callback, sign-in, sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSupabaseSession(session);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsOnboarded(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSupabaseSession = (session) => {
    const user = session.user;
    const meta = user.user_metadata || {};
    const provider = user.app_metadata?.provider;

    // Build user profile from Supabase session
    const profile = {
      id: user.id,
      name: meta.full_name || meta.name || meta.user_name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: meta.avatar_url || `https://api.dicebear.com/9.x/notionists/svg?seed=${user.id}`,
      role: null,
      skills: [],
      github: meta.user_name || meta.preferred_username || '',
      bio: meta.bio || '',
      joinDate: new Date(user.created_at).toISOString().split('T')[0],
      walletBalance: 0,
      pendingPayout: 0,
      totalEarned: 0,
      githubLinked: provider === 'github',
    };

    // Pre-process for db to ensure we don't send columns not in the schema
    const dbProfile = { ...profile };

    if (isSupabaseConfigured()) {
      supabase.from('users').upsert(dbProfile).then(({ error }) => {
        if (error) console.error("Supabase User Upsert Error:", error);
      });
    }

    setCurrentUser(profile);
    setGithubToken(session.provider_token || null);
    setIsAuthenticated(true);
    // If user has a role set, they've completed onboarding
    setIsOnboarded(!!profile.role || provider === 'github');
  };

  // Primary Authentication Hook

  const loginWithEmail = useCallback(async (email, password) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Database not configured. Please set up Supabase.');
    }

    // Try sign in first
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      // Rate limit check
      if (error.message.includes('rate') || error.status === 429) {
        throw new Error('Too many attempts. Please wait a few minutes and try again, or use GitHub login.');
      }
      
      // User doesn't exist — try sign up
      if (error.message.includes('Invalid login')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: email.split('@')[0] } }
        });
        
        if (signUpError) {
          if (signUpError.message.includes('rate') || signUpError.status === 429) {
            throw new Error('Too many attempts. Please wait a few minutes and try again, or use GitHub login.');
          }
          throw new Error(signUpError.message);
        }
        
        // If session exists, user is logged in (email confirm disabled)
        if (signUpData.session) {
          return { success: true };
        }
        // Otherwise needs email verification
        return { needsVerification: true };
      }
      
      throw new Error(error.message);
    }
    
    return { success: true };

  }, []);

  const verifyEmailOtp = useCallback(async (email, token) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
      if (error) throw error;
      return { success: true };
    }
  }, []);

  const loginWithGitHub = useCallback(async () => {
    if (isSupabaseConfigured()) {
      // Real GitHub OAuth via Supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/auth/github/callback',
          scopes: 'read:user user:email repo',
        },
      });
      if (error) throw error;
      return; // Redirect happens automatically
    }

    // Demo mode
    const user = usersData[0];
    setCurrentUser({ ...user, githubLinked: true });
    setIsAuthenticated(true);
    setIsOnboarded(true);
  }, []);

  const linkGitHub = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.linkIdentity({
        provider: 'github',
        options: { redirectTo: window.location.origin + '/profile' },
      });
      if (error) throw error;
      return;
    }
    // Demo mode: just flag as linked
    setCurrentUser(prev => ({ ...prev, githubLinked: true, github: prev.github || 'linked-user' }));
  }, []);

  const completeOnboarding = useCallback((profileData) => {
    setCurrentUser(prev => ({ ...prev, ...profileData }));
    setIsOnboarded(true);
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
    setGithubToken(null);
  }, []);

  const updateProfile = useCallback((data) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-950)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-surface-700)] border-t-[var(--color-accent-fg)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isOnboarded,
      githubToken,
      loginWithEmail,
      verifyEmailOtp,
      loginWithGitHub,
      linkGitHub,
      completeOnboarding,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
