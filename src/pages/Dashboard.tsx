import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ScheduledTestsPanel } from '@/components/dashboard/ScheduledTestsPanel';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { useProjects } from '@/context/ProjectsContext';
import { getProjectStats } from '@/data/mockProjects';
import { Input } from '@/components/ui/input';
import { 
  Folder,
  TestTube2, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Plus,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter projects by team name or project name
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.team.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  // Aggregate stats from all projects
  const aggregateStats = projects.reduce((acc, project) => {
    const stats = getProjectStats(project);
    return {
      totalTests: acc.totalTests + stats.totalTests,
      passedTests: acc.passedTests + stats.passedTests,
      failedTests: acc.failedTests + stats.failedTests,
      pendingTests: acc.pendingTests + stats.pendingTests + stats.runningTests,
    };
  }, { totalTests: 0, passedTests: 0, failedTests: 0, pendingTests: 0 });

  const scheduledCount = projects.filter(p => p.scheduledRun?.enabled).length;

  // Get unique teams for display
  const uniqueTeams = useMemo(() => {
    return [...new Set(projects.map((p) => p.team))];
  }, [projects]);

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
            value={projects.length}
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
            subtitle={`${aggregateStats.totalTests > 0 ? ((aggregateStats.passedTests / aggregateStats.totalTests) * 100).toFixed(1) : 0}% success rate`}
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
            title="Scheduled"
            value={scheduledCount}
            subtitle={`${projects.length - scheduledCount} manual`}
            icon={<Calendar className="w-6 h-6" />}
          />
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Projects</h2>
              <p className="text-sm text-muted-foreground">
                Click on a project to view test cases and details • Teams: {uniqueTeams.join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by project or team name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <CreateProjectModal 
                trigger={
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                }
              />
            </div>
          </div>
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No projects found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Tests */}
        <ScheduledTestsPanel />
      </div>
    </div>
  );
}
