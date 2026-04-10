import { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { LayoutDashboard, Trophy, FolderKanban, Cpu, User } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkWidth = () => { if (window.innerWidth < 768) setSidebarCollapsed(true); };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const bottomNavItems = [
    { path: '/dashboard', icon: FolderKanban },
    { path: '/ip-nexus', icon: Cpu },
    { path: '/marketplace', icon: LayoutDashboard },
    { path: '/leaderboard', icon: Trophy },
    { path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-[100dvh] flex bg-[var(--color-surface-950)] relative overflow-hidden pb-16 md:pb-0">
      {/* Full-Screen Wandering Orbs */}
      <div className="orb-bg hidden md:block" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div className="orb orb-primary"></div>
        <div className="orb orb-secondary"></div>
        <div className="orb orb-tertiary"></div>
      </div>

      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full ${
          sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
        } ml-0`}
      >
        <TopBar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto page-enter relative z-10 w-full">
          <div className="p-4 md:p-6 max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-card border-t border-[var(--color-surface-700)] z-50 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.2)] bg-[var(--color-surface-950)]/90 backdrop-blur-xl">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-[var(--color-accent-fg)] bg-[rgba(var(--accent-fg-rgb),0.1)] -translate-y-1' : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'}`}
            >
              <Icon size={22} />
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
