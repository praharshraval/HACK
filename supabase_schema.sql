-- Oasis Database Schema Full Migration

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT,
    role TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    github TEXT,
    bio TEXT,
    "joinDate" TEXT,
    "walletBalance" NUMERIC DEFAULT 0,
    "pendingPayout" NUMERIC DEFAULT 0,
    "totalEarned" NUMERIC DEFAULT 0,
    "upiId" TEXT,
    "collaborationScore" NUMERIC DEFAULT 0,
    "githubLinked" BOOLEAN DEFAULT false
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vision TEXT,
    domain TEXT,
    stage TEXT,
    "githubUrl" TEXT,
    "fundingTarget" NUMERIC DEFAULT 0,
    "fundingRaised" NUMERIC DEFAULT 0,
    "tractionScore" NUMERIC DEFAULT 0,
    "collaborationScore" NUMERIC DEFAULT 0,
    "createdBy" TEXT REFERENCES public.users(id),
    "createdAt" TEXT,
    "requiredRoles" JSONB DEFAULT '[]'::jsonb,
    milestones JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC DEFAULT 0,
    "contributionMode" TEXT DEFAULT 'open'
);

-- 3. Contributions Table
CREATE TABLE IF NOT EXISTS public.contributions (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES public.users(id),
    "projectId" TEXT REFERENCES public.projects(id),
    role TEXT,
    commits INTEGER DEFAULT 0,
    "tasksCompleted" INTEGER DEFAULT 0,
    "peerRating" NUMERIC DEFAULT 0,
    "stakePercent" NUMERIC DEFAULT 0,
    "joinedAt" TEXT,
    status TEXT DEFAULT 'pending'
);

-- 4. Investments Table
CREATE TABLE IF NOT EXISTS public.investments (
    id TEXT PRIMARY KEY,
    "investorId" TEXT REFERENCES public.users(id),
    "projectId" TEXT REFERENCES public.projects(id),
    amount NUMERIC DEFAULT 0,
    date TEXT,
    "stakePercent" NUMERIC DEFAULT 0,
    note TEXT
);

-- 5. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    "userId" TEXT REFERENCES public.users(id),
    type TEXT,
    amount NUMERIC DEFAULT 0,
    status TEXT,
    date TEXT,
    description TEXT,
    "projectId" TEXT REFERENCES public.projects(id)
);


-- Disable RLS across all tables temporarily during the MVP phase to bypass API permission blocks easily.
-- (Warning: Enable RLS later for actual production security)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- Optional: Initial Seed Data for Demo 
INSERT INTO public.users (id, name, email, avatar, role, skills, github, bio, "joinDate", "walletBalance", "pendingPayout", "totalEarned", "collaborationScore")
VALUES 
('u1', 'Praharsh Raval', 'arjun@oasis.io', 'https://api.dicebear.com/9.x/notionists/svg?seed=Arjun&backgroundColor=6366f1', 'builder', '["React", "Node.js", "Go"]', 'praharshraval', 'Full-stack open source maintainer.', '2025-06-15', 24500, 3200, 47800, 94),
('u2', 'Prajapati', 'priya@oasis.io', 'https://api.dicebear.com/9.x/notionists/svg?seed=Priya&backgroundColor=06b6d4', 'builder', '["Python", "Machine Learning"]', 'priyasharma', 'AI researcher.', '2025-07-22', 18200, 5100, 38500, 91)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, name, description, vision, domain, stage, "githubUrl", "fundingTarget", "fundingRaised", "tractionScore", "collaborationScore", "createdBy", "createdAt", "tags", "contributionMode")
VALUES 
('p1', 'Fang Neural Engine', 'Optimized neural network inference engine.', 'Make precision diagnostics accessible.', 'Artificial Intelligence', 'MVP', 'https://github.com/oasis/neurolens', 500000, 285000, 92, 88, 'u2', '2025-08-15', '["AI/ML", "Healthcare"]', 'approval'),
('p2', 'FangPay Core', 'Decentralized payment routing.', 'Build trustless ledger.', 'DeFi / FinTech', 'Idea', 'https://github.com/oasis/chainvault', 300000, 42000, 67, 54, 'u1', '2025-10-20', '["Web3"]', 'open')
ON CONFLICT (id) DO NOTHING;
