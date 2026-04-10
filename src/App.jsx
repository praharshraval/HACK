import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import MarketplacePage from './pages/MarketplacePage';
import ProjectPage from './pages/ProjectPage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import LeaderboardPage from './pages/LeaderboardPage';
import FundedPage from './pages/FundedPage';
import DashboardPage from './pages/DashboardPage';
import IPNexusPage from './pages/IPNexusPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';
import ErrorBoundary from './components/ErrorBoundary';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isOnboarded } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { isAuthenticated, isOnboarded } = useAuth();
  if (isAuthenticated && isOnboarded) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<AuthRoute><HomePage /></AuthRoute>} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ip-nexus" element={<IPNexusPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/funded" element={<FundedPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <DataProvider>
              <AppRoutes />
            </DataProvider>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
