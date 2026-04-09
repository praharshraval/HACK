import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hammer, Users, TrendingUp, ArrowRight, ArrowLeft, Check, Code, Palette, Brain, Cpu, Globe, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roles = [
  { id: 'builder', label: 'Builder / Founder', desc: 'Create and lead projects from idea to revenue', icon: Hammer, color: 'brand' },
  { id: 'collaborator', label: 'Collaborator', desc: 'Contribute code, design, or expertise to projects', icon: Users, color: 'cyan' },
  { id: 'investor', label: 'Investor', desc: 'Fund promising projects and earn returns', icon: TrendingUp, color: 'warning' },
];

const skillOptions = [
  { id: 'react', label: 'React / Frontend', icon: Code },
  { id: 'backend', label: 'Backend / APIs', icon: Cpu },
  { id: 'ml', label: 'AI / ML', icon: Brain },
  { id: 'design', label: 'UI/UX Design', icon: Palette },
  { id: 'web3', label: 'Web3 / Blockchain', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
];

const domains = ['AI/ML', 'Web3', 'FinTech', 'EdTech', 'HealthTech', 'SaaS', 'Open Source', 'Hardware'];

export default function OnboardingPage() {
  const { currentUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');

  const toggleSkill = (id) => setSelectedSkills(prev =>
    prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
  );
  const toggleDomain = (id) => setSelectedDomains(prev =>
    prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
  );

  const handleComplete = () => {
    completeOnboarding({
      role: selectedRole,
      skills: selectedSkills,
      bio,
      github,
    });
    navigate('/marketplace');
  };

  const canProceed = () => {
    if (step === 1) return selectedRole !== '';
    if (step === 2) return selectedSkills.length > 0;
    if (step === 3) return true;
    return true;
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl animate-slide-up">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                s < step ? 'bg-brand-500 text-white' :
                s === step ? 'bg-brand-500/20 text-brand-400 ring-2 ring-brand-500/50' :
                'bg-white/5 text-slate-600'
              }`}>
                {s < step ? <Check size={16} /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded-full transition-colors ${s < step ? 'bg-brand-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Role */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-2">Choose your role</h2>
            <p className="text-slate-500 mb-8">This helps us customize your experience. You can always change it later.</p>
            <div className="space-y-3">
              {roles.map(role => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-brand-500/50 bg-brand-500/10 glow-sm'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-brand-500/20' : 'bg-white/5'
                    }`}>
                      <Icon size={22} className={isSelected ? 'text-brand-400' : 'text-slate-400'} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{role.label}</p>
                      <p className="text-sm text-slate-500">{role.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Skills & Domains */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-2">Your expertise</h2>
            <p className="text-slate-500 mb-8">Select skills and domains you're interested in.</p>

            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Skills</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
              {skillOptions.map(skill => {
                const Icon = skill.icon;
                const isSelected = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all ${
                      isSelected
                        ? 'border-brand-500/40 bg-brand-500/10 text-brand-300'
                        : 'border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <Icon size={16} />
                    {skill.label}
                  </button>
                );
              })}
            </div>

            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Domains</h3>
            <div className="flex flex-wrap gap-2">
              {domains.map(domain => {
                const isSelected = selectedDomains.includes(domain);
                return (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      isSelected
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                        : 'border-white/5 text-slate-500 hover:bg-white/5'
                    }`}
                  >
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Profile */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-2">Complete your profile</h2>
            <p className="text-slate-500 mb-8">Add a short bio and your GitHub username.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">GitHub Username</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="your-github-handle"
                  className="input-dark"
                  id="onboarding-github"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your expertise, and what you're looking to build..."
                  rows={4}
                  className="input-dark resize-none"
                  id="onboarding-bio"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`btn-ghost flex items-center gap-2 ${step === 1 ? 'invisible' : ''}`}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={() => {
              if (step < 3) setStep(s => s + 1);
              else handleComplete();
            }}
            disabled={!canProceed()}
            className="btn-primary disabled:opacity-30 disabled:pointer-events-none"
          >
            {step === 3 ? 'Complete Setup' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
