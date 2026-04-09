import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import usersData from '../data/users';
import projectsData from '../data/projects';
import contributionsData from '../data/contributions';
import investmentsData from '../data/investments';
import transactionsData from '../data/transactions';
import { getTrendingProjects } from '../services/aiEngine';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users] = useState(usersData);
  const [projects, setProjects] = useState(projectsData);
  const [contributions, setContributions] = useState(contributionsData);
  const [investments, setInvestments] = useState(investmentsData);
  const [transactions, setTransactions] = useState(transactionsData);

  const updateUser = useCallback((userId, updates) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
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
    setTransactions(prev => [...prev, {
      id: 't_' + Date.now(),
      userId: investorId,
      type: 'investment',
      amount,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      description: `Investment in ${projects.find(p => p.id === projectId)?.name}`,
      projectId,
    }]);
    return inv;
  }, [projects]);

  const applyToContribute = useCallback((userId, projectId, role) => {
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
      status: 'pending',
    };
    setContributions(prev => [...prev, contrib]);
    return contrib;
  }, []);

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
    addInvestment,
    applyToContribute,
    updateUser,
    processWithdrawal,
  }), [users, projects, contributions, investments, transactions, trendingProjects,
    getUser, getProject, getProjectContributions, getProjectInvestments,
    getUserContributions, getUserTransactions, getUserProjects, addInvestment, applyToContribute, updateUser, processWithdrawal]);

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
