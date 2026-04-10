/**
 * Oasis AI Engine (Simulated)
 * Calculates contribution scores, stake allocations, trending ranks, and revenue distribution.
 */

/**
 * Calculate a contributor's score based on their activity.
 * Formula: (commits × 2) + (tasksCompleted × 3) + (peerRating × 15)
 */
export function calculateContributionScore(commits, tasksCompleted, peerRating) {
  return (commits * 2) + (tasksCompleted * 3) + (peerRating * 15);
}

/**
 * Calculate stake allocation for a set of contributions.
 * Returns an array of { userId, stakePercent, score } sorted by stake descending.
 * contributorPool — the percentage of total ownership allocated to contributors (e.g. 60%).
 */
export function calculateStakeAllocation(contributions, contributorPool = 60) {
  if (!contributions || contributions.length === 0) return [];

  const scored = contributions.map(c => ({
    userId: c.userId,
    role: c.role,
    score: calculateContributionScore(c.commits || 0, c.tasksCompleted || 0, c.peerRating || 0),
  }));

  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);

  return scored
    .map(s => ({
      ...s,
      stakePercent: totalScore > 0 ? parseFloat(((s.score / totalScore) * contributorPool).toFixed(2)) : parseFloat((contributorPool / contributions.length).toFixed(2)),
    }))
    .sort((a, b) => b.stakePercent - a.stakePercent);
}

/**
 * Generate trending rank for projects.
 * Formula: (tractionScore × 0.4) + (fundingRatio × 100 × 0.3) + (collaborationScore × 0.3)
 */
export function calculateTrendingRank(project) {
  const fundingRatio = project.fundingTarget > 0
    ? project.fundingRaised / project.fundingTarget
    : 0;

  return parseFloat((
    (project.tractionScore * 0.4) +
    (fundingRatio * 100 * 0.3) +
    ((project.collaborationScore || 0) * 0.3)
  ).toFixed(2));
}

/**
 * Sort projects by trending rank descending.
 */
export function getTrendingProjects(projects) {
  return [...projects]
    .map(p => ({ ...p, trendingRank: calculateTrendingRank(p) }))
    .sort((a, b) => b.trendingRank - a.trendingRank);
}

/**
 * Distribute revenue to contributors based on their stake percentages.
 * Returns an array of { userId, amount, upiId }.
 */
export function distributeRevenue(totalRevenue, stakes, users) {
  return stakes.map(s => {
    const user = users.find(u => u.id === s.userId);
    return {
      userId: s.userId,
      name: user?.name || 'Unknown',
      upiId: user?.upiId || 'N/A',
      stakePercent: s.stakePercent,
      amount: parseFloat(((s.stakePercent / 100) * totalRevenue).toFixed(2)),
    };
  }).sort((a, b) => b.amount - a.amount);
}

/**
 * Calculate a user's overall collaboration score across all their contributions.
 */
export function calculateCollaborationScore(userId, contributions) {
  const userContribs = contributions.filter(c => c.userId === userId);
  if (userContribs.length === 0) return 0;

  const totalScore = userContribs.reduce((sum, c) => {
    return sum + calculateContributionScore(c.commits, c.tasksCompleted, c.peerRating);
  }, 0);

  const avgPeer = userContribs.reduce((sum, c) => sum + c.peerRating, 0) / userContribs.length;

  // Normalize to 0-100 scale
  const rawScore = (totalScore / userContribs.length) * (avgPeer / 5);
  return Math.min(100, Math.round(rawScore / 4));
}

/**
 * Generate activity score for a contributor (0-100).
 */
export function calculateActivityScore(contribution) {
  const commitScore = Math.min(contribution.commits / 5, 100);
  const taskScore = Math.min(contribution.tasksCompleted * 2, 100);
  const peerScore = (contribution.peerRating / 5) * 100;
  return Math.round((commitScore * 0.4 + taskScore * 0.3 + peerScore * 0.3));
}

/**
 * Format currency in Indian Rupees.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with K/M suffixes.
 */
export function formatCompact(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Get stage display info.
 */
export function getStageInfo(stage) {
  const map = {
    'Idea': { label: 'Idea', className: 'badge-idea' },
    'MVP': { label: 'MVP', className: 'badge-mvp' },
    'Scaling': { label: 'Scaling', className: 'badge-scaling' },
    'Revenue': { label: 'Revenue', className: 'badge-revenue' },
  };
  return map[stage] || map['Idea'];
}

/**
 * Simulate revenue distribution for a project.
 */
export function simulateRevenueDistribution(projectId, totalRevenue, contributions, investments, users) {
  const projectContribs = contributions.filter(c => c.projectId === projectId);
  const projectInvestments = investments.filter(i => i.projectId === projectId);

  const totalInvestorStake = projectInvestments.reduce((sum, i) => sum + (i.stakePercent || 0), 0);
  const contributorPool = 100 - totalInvestorStake;

  const contributorAllocations = calculateStakeAllocation(projectContribs, contributorPool);

  const investorAllocations = projectInvestments.map(inv => {
    const user = users.find(u => u.id === inv.investorId);
    return {
      userId: inv.investorId,
      name: user?.name || 'Unknown',
      upiId: user?.upiId || 'N/A',
      role: 'Investor',
      stakePercent: inv.stakePercent || 0,
      amount: parseFloat(((inv.stakePercent / 100) * totalRevenue).toFixed(2)),
    };
  });

  const contribDistribution = contributorAllocations.map(ca => {
    const user = users.find(u => u.id === ca.userId);
    return {
      ...ca,
      name: user?.name || 'Unknown',
      upiId: user?.upiId || 'N/A',
      amount: parseFloat(((ca.stakePercent / 100) * totalRevenue).toFixed(2)),
    };
  });

  return {
    totalRevenue,
    contributorPool,
    investorPool: totalInvestorStake,
    contributors: contribDistribution,
    investors: investorAllocations,
    all: [...contribDistribution, ...investorAllocations].sort((a, b) => b.amount - a.amount),
  };
}
