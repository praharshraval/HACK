const projects = [
  {
    id: 'p1',
    name: 'Fang Neural Engine',
    description: 'An open-source, highly optimized neural network inference engine designed for edge devices. Fang Neural Engine reduces memory footprint by 40% while maintaining accuracy.',
    vision: 'Make precision diagnostics accessible to every clinic in the world.',
    domain: 'Artificial Intelligence',
    stage: 'MVP',
    githubUrl: 'https://github.com/oasis/neurolens',
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
    contributionMode: 'open', tags: ['AI/ML', 'Healthcare'],
    rating: 4.8,
  },
  {
    id: 'p2',
    name: 'FangPay Core',
    description: 'A decentralized payment routing protocol focused on minimal transaction fees and instant settlement bridging multiple layer-2 networks.',
    vision: 'Build the world\'s first trustless intellectual property ledger.',
    domain: 'DeFi / FinTech',
    stage: 'Idea',
    githubUrl: 'https://github.com/oasis/chainvault',
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
    contributionMode: 'open', tags: ['Web3', 'ZK Proofs'],
    rating: 4.2,
  }
];

export default projects;
