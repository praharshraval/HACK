import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getTrendingProjects } from '../services/aiEngine';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const fetchCloudData = async () => {
      try {
        const [u, p, c, i, t] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('contributions').select('*'),
          supabase.from('investments').select('*'),
          supabase.from('transactions').select('*')
        ]);
        if (u.error) console.error("users fetch error", u.error);
        if (p.error) console.error("projects fetch error", p.error);
        if (u.data) setUsers(u.data);
        if (p.data) setProjects(p.data);
        if (c.data) setContributions(c.data);
        if (i.data) setInvestments(i.data);
        if (t.data) setTransactions(t.data);
      } catch (err) {
        console.error("Supabase load error:", err);
      }
    };
    fetchCloudData();
  }, []);

  const updateUser = useCallback((userId, updates) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (isSupabaseConfigured()) supabase.from('users').update(updates).eq('id', userId).then();
  }, []);

  const processWithdrawal = useCallback((userId, amount) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        if (u.walletBalance < amount) throw new Error('Insufficient funds');
        return { ...u, walletBalance: u.walletBalance - amount };
      }
      return u;
    }));
    setTransactions(prev => [{
      id: 'tx_' + Date.now(),
      userId,
      type: 'withdrawal',
      amount,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      description: `UPI Withdrawal Request`,
      projectId: null
    }, ...prev]);
  }, []);

  const trendingProjects = useMemo(() => getTrendingProjects(projects), [projects]);

  const getUser = useCallback((id) => users.find(u => u.id === id), [users]);
  const getProject = useCallback((id) => projects.find(p => p.id === id), [projects]);

  const getProjectContributions = useCallback((projectId) =>
    contributions.filter(c => c.projectId === projectId), [contributions]);

  const getProjectInvestments = useCallback((projectId) =>
    investments.filter(i => i.projectId === projectId), [investments]);

  const getUserContributions = useCallback((userId) =>
    contributions.filter(c => c.userId === userId), [contributions]);

  const getUserTransactions = useCallback((userId) =>
    transactions.filter(t => t.userId === userId), [transactions]);

  const getUserProjects = useCallback((userId) => {
    const created = projects.filter(p => p.createdBy === userId);
    const contributedIds = contributions
      .filter(c => c.userId === userId)
      .map(c => c.projectId);
    const contributed = projects.filter(p => contributedIds.includes(p.id) && p.createdBy !== userId);
    return { created, contributed };
  }, [projects, contributions]);

  const addProject = useCallback((projectData) => {
    const newProject = {
      id: 'p_' + Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      fundingRaised: 0,
      tractionScore: Math.floor(Math.random() * 20) + 40,
      rating: 0,
      collaborationScore: 0,
      contributionMode: 'open',
      ...projectData
    };
    setProjects(prev => [newProject, ...prev]);
    if (isSupabaseConfigured()) {
      supabase.from('projects').insert(newProject).then(({ error }) => {
        if (error) alert("Database Error: Could not save project -> " + error.message);
      });
    }
    return newProject;
  }, []);

  const updateProject = useCallback((projectId, updates) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
    if (isSupabaseConfigured()) supabase.from('projects').update(updates).eq('id', projectId).then();
  }, []);

  const updateContributionStatus = useCallback((contributionId, status) => {
    setContributions(prev => prev.map(c => c.id === contributionId ? { ...c, status } : c));
    if (isSupabaseConfigured()) supabase.from('contributions').update({ status }).eq('id', contributionId).then();
  }, []);

  const addContributions = useCallback((newContributionsList) => {
    setContributions(prev => [...prev, ...newContributionsList]);
    if (isSupabaseConfigured()) {
      supabase.from('contributions').insert(newContributionsList).then(({ error }) => {
        if (error) console.error("Database Error: Could not save contributions -> " + error.message);
      });
    }
  }, []);

  const addInvestment = useCallback((investorId, projectId, amount) => {
    const inv = {
      id: 'inv_' + Date.now(),
      investorId,
      projectId,
      amount,
      date: new Date().toISOString().split('T')[0],
      stakePercent: parseFloat(((amount / 100000) * 5).toFixed(2)),
      note: 'New investment',
    };
    setInvestments(prev => [...prev, inv]);
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, fundingRaised: p.fundingRaised + amount }
        : p
    ));
    const tx = {
      id: 't_' + Date.now(),
      userId: investorId,
      type: 'investment',
      amount,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      description: `Investment in ${projects.find(p => p.id === projectId)?.name}`,
      projectId,
    };
    setTransactions(prev => [...prev, tx]);
    
    if (isSupabaseConfigured()) {
      supabase.from('investments').insert(inv).then();
      supabase.from('transactions').insert(tx).then();
      // Notice: project raised update should ideally be handled via DB triggers/functions,
      // but for MVP frontend speed we optimistically update UI.
    }
    return inv;
  }, [projects]);

  const applyToContribute = useCallback((userId, projectId, role) => {
    const targetProject = projects.find(p => p.id === projectId);
    const mode = targetProject?.contributionMode || 'approval';
    const contrib = {
      id: 'c_' + Date.now(),
      userId,
      projectId,
      role,
      commits: 0,
      tasksCompleted: 0,
      peerRating: 0,
      stakePercent: 0,
      joinedAt: new Date().toISOString().split('T')[0],
      status: mode === 'open' ? 'active' : 'pending',
    };
    setContributions(prev => [...prev, contrib]);
    if (isSupabaseConfigured()) {
      supabase.from('contributions').insert(contrib).then(({ error }) => {
        if (error) alert("Database Error: Could not save contribution -> " + error.message);
      });
    }
    return contrib;
  }, [projects]);

  const value = useMemo(() => ({
    users,
    projects,
    contributions,
    investments,
    transactions,
    trendingProjects,
    getUser,
    getProject,
    getProjectContributions,
    getProjectInvestments,
    getUserContributions,
    getUserTransactions,
    getUserProjects,
    addProject,
    updateProject,
    addContributions,
    addInvestment,
    applyToContribute,
    updateContributionStatus,
    updateUser,
    processWithdrawal,
  }), [users, projects, contributions, investments, transactions, trendingProjects,
    getUser, getProject, getProjectContributions, getProjectInvestments,
    getUserContributions, getUserTransactions, getUserProjects, addProject, updateProject, addInvestment, applyToContribute, updateContributionStatus, updateUser, processWithdrawal]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
