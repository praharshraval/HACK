import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Trophy, Wallet, User,
  ChevronLeft, ChevronRight, LogOut, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/marketplace', label: 'Marketplace', icon: LayoutDashboard },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out glass-sidebar ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-[rgba(var(--surface-700-rgb),0.5)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-800)] border border-[var(--color-surface-700)] flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-[var(--color-accent-fg)]" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <span className="text-lg font-bold gradient-text tracking-tight">Oasis</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path === '/marketplace' && location.pathname === '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[rgba(var(--accent-fg-rgb),0.1)] text-[var(--color-accent-fg)]'
                  : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-surface-800)]'
              }`}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-[var(--color-accent-fg)]' : 'text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg-default)]'
                }`}
              />
              {!collapsed && (
                <span className="animate-fade-in whitespace-nowrap">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-accent-fg)]" style={{ boxShadow: '0 0 8px rgba(var(--accent-fg-rgb), 0.5)' }} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[rgba(var(--surface-700-rgb),0.5)] p-3">
        {currentUser && (
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
            <img src={currentUser.avatar} alt={currentUser.name}
              className="w-8 h-8 rounded-lg bg-[var(--color-surface-700)] flex-shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-medium text-[var(--color-fg-default)] truncate">{currentUser.name}</p>
                <p className="text-xs text-[var(--color-fg-muted)] capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
        )}

        <div className={`flex ${collapsed ? 'flex-col items-center' : 'items-center justify-between'} mt-2 gap-1`}>
          <button onClick={logout} className="btn-ghost flex items-center gap-2 text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-danger-fg)]" title="Sign out">
            <LogOut size={16} />
            {!collapsed && <span>Sign out</span>}
          </button>
          <button onClick={onToggle} className="btn-ghost p-2 text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
