import { useData } from '../context/DataContext';
import ProjectCard from '../components/ProjectCard';

export default function FundedPage() {
  const { projects } = useData();
  
  // Filter for projects that have received some sort of funding, or a specific domain
  // In the Oasis schema, we map this to any project with fundingRaised > 0.
  const fundedProjects = projects.filter(p => p.fundingRaised > 0).sort((a, b) => b.fundingRaised - a.fundingRaised);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Funded Startups</h1>
          <p className="text-slate-400">Discover platforms actively backed and funded by the Oasis network.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
        {fundedProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center border border-white/5 bg-white/[0.02] rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-2">No Funded Ventures Yet</h3>
            <p className="text-sm text-slate-500">Wait for the community to deploy capital into projects.</p>
          </div>
        ) : (
          fundedProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
