import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

export default function TopBar() {
  const { currentUser, logout } = useAuth();
  const { projects } = useData();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const results = projects.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        p.domain.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  };

  return (
    <header className="h-[72px] flex items-center justify-between px-6 border-b border-[var(--color-surface-700)] z-30 relative" style={{ background: 'var(--color-surface-950)' }}>

      {/* Search */}
      <div ref={searchRef} className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]" />
        <input
          type="text"
          placeholder="Search projects, domains, technologies..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="input-dark pl-10 pr-4 py-2.5 text-sm w-full"
          id="global-search"
        />
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-50 animate-fade-in">
            {searchResults.map(p => (
              <button
                key={p.id}
                onClick={() => { navigate(`/project/${p.id}`); setShowSearch(false); setSearchQuery(''); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-800)] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(var(--accent-fg-rgb),0.1)] flex items-center justify-center text-sm text-[var(--color-accent-fg)]">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-fg-default)] truncate">{p.name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{p.domain} • {p.stage}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-4">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-[var(--color-surface-800)] text-[var(--color-fg-muted)] transition-colors cursor-pointer">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div ref={notificationsRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer" 
            id="notifications-btn"
          >
            <Bell size={18} className="text-[var(--color-fg-muted)]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-brand-600)] rounded-full animate-pulse" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 glass-card rounded-xl overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-[var(--color-surface-700)] flex justify-between items-center">
                <h3 className="text-sm font-semibold text-[var(--color-fg-default)]">Notifications</h3>
                <span className="text-[10px] text-[var(--color-fg-muted)] px-2 py-0.5 rounded-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)]">2 New</span>
              </div>
              <div className="p-2 space-y-1">
                <div className="p-2 rounded-md hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer">
                  <p className="text-[13px] font-medium text-[var(--color-fg-default)] mb-1">Welcome to Oasis</p>
                  <p className="text-[11px] text-[var(--color-fg-muted)]">Your dashboard is ready. Explore the marketplace.</p>
                </div>
                <div className="p-2 rounded-md hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer">
                  <p className="text-[13px] font-medium text-[var(--color-fg-default)] mb-1">Wallet Connected</p>
                  <p className="text-[11px] text-[var(--color-fg-muted)]">Your wallet successfully initialized for UPI payouts.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer"
            id="user-menu-btn"
          >
            <img src={currentUser?.avatar} alt={currentUser?.name}
              className="w-8 h-8 rounded-lg bg-[var(--color-surface-700)]" />
            <span className="text-sm font-medium text-[var(--color-fg-muted)] hidden sm:block">{currentUser?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className={`text-[var(--color-fg-muted)] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl overflow-hidden z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-[var(--color-surface-700)]">
                <p className="text-sm font-medium text-[var(--color-fg-default)]">{currentUser?.name}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">{currentUser?.email}</p>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer">
                  <User size={16} /> Profile
                </button>
                <button onClick={() => { navigate('/wallet'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer">
                  <Settings size={16} /> Settings
                </button>
                <button onClick={() => { logout(); navigate('/'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-danger-fg)] hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
