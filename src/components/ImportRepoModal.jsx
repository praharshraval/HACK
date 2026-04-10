import { useState, useEffect } from 'react';
import { X, Search, GitBranch, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function ImportRepoModal({ isOpen, onClose, onImport }) {
  const { currentUser, githubToken } = useAuth();
  const { addProject } = useData();
  
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [importingId, setImportingId] = useState(null);

  // Pre-fill username if linked
  useEffect(() => {
    if (isOpen && currentUser?.githubLinked && currentUser?.github) {
      setUsername(currentUser.github);
      fetchRepos(currentUser.github);
    }
  }, [isOpen, currentUser]);

  const fetchRepos = async (targetUser) => {
    if (!targetUser) return;
    setIsLoading(true);
    setError('');
    try {
      const headers = {};
      if (githubToken) {
        headers['Authorization'] = `Bearer ${githubToken}`;
      }
      const res = await fetch(`https://api.github.com/users/${targetUser}/repos?sort=updated&per_page=15`, { headers });
      if (!res.ok) {
        if (res.status === 404) throw new Error('GitHub user not found');
        throw new Error('Failed to fetch repositories. Try again.');
      }
      const data = await res.json();
      setRepos(data.filter(r => !r.fork)); // Filter out forks generally
    } catch (err) {
      setError(err.message);
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRepos(username.trim());
  };

  const inferDomain = (language) => {
    const map = {
      'Python': 'AI/ML',
      'TypeScript': 'Web3',
      'Solidity': 'Web3',
      'Rust': 'Hardware',
      'Go': 'Cloud',
      'JavaScript': 'SaaS',
      'Jupyter Notebook': 'AI/ML'
    };
    return map[language] || 'Open Source';
  };

  const handleImport = async (repo) => {
    setImportingId(repo.id);
    
    // Slight artificial delay for UX (simulating processing)
    await new Promise(resolve => setTimeout(resolve, 800));

    const projectData = {
      name: repo.name.replace(/[-_]/g, ' '),
      description: repo.description || 'An imported GitHub repository ready for contribution.',
      domain: inferDomain(repo.language),
      tags: repo.language ? [repo.language] : ['Software'],
      fundingTarget: 100000,
      requiredRoles: ['Developer'],
      githubUrl: repo.html_url,
      stage: 'idea',
      createdBy: currentUser.id,
    };

    const newProject = addProject(projectData);
    setImportingId(null);
    onImport(newProject.id); // Triggers close parent state
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[var(--color-surface-900)] border border-[var(--color-surface-700)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-surface-700)] flex items-center justify-between bg-[var(--color-surface-950)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(var(--accent-fg-rgb),0.1)] flex items-center justify-center text-[var(--color-accent-fg)]">
              <GitBranch size={16} />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)]">Import GitHub Repository</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-800)] transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-[rgba(var(--accent-fg-rgb),0.05)] border border-[rgba(var(--accent-fg-rgb),0.15)] rounded-xl p-4">
            <h3 className="text-sm font-medium text-[var(--color-accent-fg)] mb-1">Enter GitHub Username</h3>
            <p className="text-xs text-[var(--color-fg-muted)] mb-3">Fetch any public repositories and instantly convert them to a project.</p>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]" />
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  placeholder="github-username" 
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md pl-9 pr-3 py-2 text-sm text-[var(--color-fg-default)] focus:border-[var(--color-accent-fg)] outline-none"
                />
              </div>
              <button type="submit" disabled={isLoading || !username} className="btn-primary">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Fetch Repos'}
              </button>
            </form>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-danger-fg)] p-3 rounded-lg bg-[rgba(248,81,73,0.1)] border border-[rgba(248,81,73,0.2)]">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-[var(--color-fg-default)] mb-3">Repositories</h3>
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="animate-spin text-[var(--color-accent-fg)]" />
                <p className="text-sm text-[var(--color-fg-muted)]">Fetching repositories via GitHub API...</p>
              </div>
            ) : repos.length > 0 ? (
              <div className="space-y-3">
                {repos.map(repo => (
                  <div key={repo.id} className="glass-card p-4 rounded-xl flex items-center justify-between group">
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-sm font-semibold text-[var(--color-fg-default)] truncate">{repo.name}</h4>
                      <p className="text-xs text-[var(--color-fg-muted)] line-clamp-1 mt-1">{repo.description || 'No description provided.'}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--color-fg-muted)] font-medium">
                        {repo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[var(--color-brand-600)]"></span>{repo.language}</span>}
                        <span>★ {repo.stargazers_count}</span>
                        <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleImport(repo)} 
                      disabled={importingId === repo.id}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-surface-800)] hover:bg-[var(--color-brand-600)] hover:text-white hover:border-[var(--color-brand-600)] text-[12px] font-medium text-[var(--color-fg-default)] border border-[var(--color-surface-700)] rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {importingId === repo.id ? <Loader2 size={14} className="animate-spin" /> : <><Plus size={14} /> Import</>}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border border-dashed border-[var(--color-surface-700)] rounded-xl bg-[var(--color-surface-950)]">
                <GitBranch size={24} className="mx-auto text-[var(--color-surface-600)] mb-2" />
                <p className="text-sm text-[var(--color-fg-muted)]">No repositories fetched.</p>
                <p className="text-xs text-[var(--color-surface-600)] mt-1">Enter a username above to pull data.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
