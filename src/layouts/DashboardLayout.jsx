import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface-950 relative overflow-hidden">
      {/* Full-Screen Wandering Orbs */}
      <div className="orb-bg" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div className="orb orb-primary"></div>
        <div className="orb orb-secondary"></div>
        <div className="orb orb-tertiary"></div>
      </div>

      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
        }`}
      >
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1400px] mx-auto page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
