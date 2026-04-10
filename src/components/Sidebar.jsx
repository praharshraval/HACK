import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Trophy, Wallet, User, Building2,
  ChevronLeft, ChevronRight, LogOut, Hexagon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/marketplace', label: 'Marketplace', icon: LayoutDashboard },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/funded', label: 'Funded Startups', icon: Building2 },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] glass-sidebar ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Toggle Button in Sidebar Header */}
      <div className="h-[72px] border-b border-[rgba(var(--surface-700-rgb),0.5)] flex items-center justify-center backdrop-blur-md relative z-10">
        <button
          onClick={onToggle}
          className="w-10 h-10 rounded-xl bg-[var(--color-surface-800)] border border-[var(--color-surface-700)] flex items-center justify-center relative hover:bg-[var(--color-surface-700)] transition-colors cursor-pointer group"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Hexagon size={20} className="text-[var(--color-accent-fg)] group-hover:scale-110 transition-transform absolute" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-brand-600)] absolute" />
        </button>
      </div>

      {/* Navigation with Domino Stagger & Glass Tiles */}
      <nav key={collapsed ? 'col' : 'exp'} className="flex-1 py-6 px-3 overflow-y-auto relative z-10">
        <div className="space-y-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path === '/marketplace' && location.pathname === '/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-300 group animate-slide-up opacity-0 glass hover:scale-[1.02] ${
                  isActive ? 'border-[var(--color-accent-fg)] shadow-[0_0_15px_rgba(var(--accent-fg-rgb),0.2)] bg-[rgba(var(--accent-fg-rgb),0.05)]' : 'border-[rgba(var(--surface-700-rgb),0.3)] hover:border-[rgba(var(--surface-700-rgb),0.8)] bg-white/[0.01]'
                }`}
                style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'forwards' }}
                title={collapsed ? item.label : ''}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-colors ${
                    isActive ? 'text-[var(--color-accent-fg)]' : 'text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg-default)]'
                  }`}
                />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent-fg)] shadow-glow animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-[rgba(var(--surface-700-rgb),0.5)] p-4 animate-fade-in opacity-0 backdrop-blur-md relative z-10" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
        {currentUser && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-[rgba(var(--surface-700-rgb),0.3)] glass">
            <img src={currentUser.avatar} alt={currentUser.name}
              className="w-8 h-8 rounded-lg bg-[var(--color-surface-700)] flex-shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-fg-default)] truncate">{currentUser.name}</p>
                <p className="text-xs text-[var(--color-fg-muted)] capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center mt-3 gap-1 px-2">
          <button onClick={logout} className="btn-ghost flex items-center gap-2 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-danger-fg)]" title="Sign out">
            <LogOut size={16} />
            {!collapsed && <span>Sign out from Oasis</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
