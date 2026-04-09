const projects = [
  {
    id: 'p1',
    name: 'NeuroLens',
    description: 'AI-powered diagnostic imaging platform that detects early-stage tumors.',
    vision: 'Make precision diagnostics accessible to every clinic in the world.',
    domain: 'HealthTech',
    stage: 'MVP',
    githubUrl: 'https://github.com/ipnexus/neurolens',
    fundingTarget: 500000,
    fundingRaised: 285000,
    tractionScore: 92,
    collaborationScore: 88,
    createdBy: 'u2',
    createdAt: '2025-08-15',
    requiredRoles: ['ML Engineer', 'Medical Advisor'],
    milestones: [
      { id: 'm1', title: 'Data Pipeline MVP', status: 'completed', date: '2025-09-01' },
      { id: 'm2', title: 'Model Training v1', status: 'completed', date: '2025-11-15' },
    ],
    tags: ['AI/ML', 'Healthcare'],
    rating: 4.8,
  },
  {
    id: 'p2',
    name: 'ChainVault',
    description: 'Decentralized IP registry using zero-knowledge proofs.',
    vision: 'Build the world\'s first trustless intellectual property ledger.',
    domain: 'Web3',
    stage: 'Idea',
    githubUrl: 'https://github.com/ipnexus/chainvault',
    fundingTarget: 300000,
    fundingRaised: 42000,
    tractionScore: 67,
    collaborationScore: 54,
    createdBy: 'u1',
    createdAt: '2025-10-20',
    requiredRoles: ['Solidity Developer'],
    milestones: [
      { id: 'm1', title: 'Whitepaper & Architecture', status: 'completed', date: '2025-11-01' },
    ],
    tags: ['Web3', 'ZK Proofs'],
    rating: 4.2,
  }
];

export default projects;
