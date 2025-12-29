import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { mockProjects, getProjectStats } from '@/data/mockProjects';
import { mockAgents } from '@/data/mockData';
import { AgentStatusPanel } from '@/components/dashboard/AgentStatusPanel';
import { 
  Folder,
  TestTube2, 
  CheckCircle2, 
  XCircle, 
  Bot,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // Aggregate stats from all projects
  const aggregateStats = mockProjects.reduce((acc, project) => {
    const stats = getProjectStats(project);
    return {
      totalTests: acc.totalTests + stats.totalTests,
      passedTests: acc.passedTests + stats.passedTests,
      failedTests: acc.failedTests + stats.failedTests,
      pendingTests: acc.pendingTests + stats.pendingTests + stats.runningTests,
    };
  }, { totalTests: 0, passedTests: 0, failedTests: 0, pendingTests: 0 });

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Monitor your QA testing projects and test execution"
      />
      
      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Projects"
            value={mockProjects.length}
            subtitle="Active projects"
            icon={<Folder className="w-6 h-6" />}
            variant="primary"
          />
          <StatsCard
            title="Total Tests"
            value={aggregateStats.totalTests}
            subtitle="Across all projects"
            icon={<TestTube2 className="w-6 h-6" />}
          />
          <StatsCard
            title="Passed Tests"
            value={aggregateStats.passedTests}
            subtitle={`${((aggregateStats.passedTests / aggregateStats.totalTests) * 100).toFixed(1)}% success rate`}
            icon={<CheckCircle2 className="w-6 h-6" />}
            variant="success"
          />
          <StatsCard
            title="Failed Tests"
            value={aggregateStats.failedTests}
            subtitle="Requires attention"
            icon={<XCircle className="w-6 h-6" />}
            variant="destructive"
          />
          <StatsCard
            title="Active Agents"
            value={mockAgents.filter(a => a.status === 'running').length}
            subtitle={`${mockAgents.length} total deployed`}
            icon={<Bot className="w-6 h-6" />}
          />
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Projects</h2>
              <p className="text-sm text-muted-foreground">
                Click on a project to view test cases and details
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/project/${project.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <AgentStatusPanel agents={mockAgents} />
      </div>
    </div>
  );
}
