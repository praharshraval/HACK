import { createContext, useContext, useState, useCallback } from 'react';
import usersData from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const login = useCallback((userId) => {
    const user = usersData.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsOnboarded(true);
    }
  }, []);

  const loginWithEmail = useCallback((email) => {
    const user = usersData.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsOnboarded(true);
      return true;
    }
    // Simulate new user signup
    setCurrentUser({
      id: 'u_new_' + Date.now(),
      name: email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${email}&backgroundColor=6366f1`,
      role: null,
      skills: [],
      github: '',
      bio: '',
      joinDate: new Date().toISOString().split('T')[0],
      walletBalance: 0,
      pendingPayout: 0,
      totalEarned: 0,
      upiId: '',
      collaborationScore: 0,
    });
    setIsAuthenticated(true);
    setIsOnboarded(false);
    return true;
  }, []);

  const loginWithGitHub = useCallback(() => {
    // Simulate GitHub OAuth — log in as Arjun (u1)
    const user = usersData[0];
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsOnboarded(true);
  }, []);

  const completeOnboarding = useCallback((profileData) => {
    setCurrentUser(prev => ({ ...prev, ...profileData }));
    setIsOnboarded(true);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
  }, []);

  const updateProfile = useCallback((data) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isOnboarded,
      login,
      loginWithEmail,
      loginWithGitHub,
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
