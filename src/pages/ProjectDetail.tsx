import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { TestCaseList } from '@/components/projects/TestCaseList';
import { AccessControlPanel } from '@/components/projects/AccessControlPanel';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { getProjectStats } from '@/data/mockProjects';
import { useProjects } from '@/context/ProjectsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TestTube2,
  TrendingUp,
  FileText,
  Figma,
  ExternalLink,
  FileVideo,
  FileDown
} from 'lucide-react';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();
  
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Project not found</h2>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const stats = getProjectStats(project);

  return (
    <div className="min-h-screen">
      <Header 
        title={project.name}
        subtitle={project.description}
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">{format(new Date(), 'MMM d, yyyy')}</Badge>
            <Button variant="glow" className="gap-2">
              <Play className="w-4 h-4" />
              Run All Tests
            </Button>
          </div>
        </div>

        {/* Project Summary & Links */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Project Summary</h3>
          <p className="text-muted-foreground mb-4">{project.summary}</p>
          <div className="flex items-center gap-3">
            {project.links?.prd && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.prd} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  PRD Document
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </Button>
            )}
            {project.links?.figma && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.figma} target="_blank" rel="noopener noreferrer">
                  <Figma className="w-4 h-4 mr-2" />
                  Figma Designs
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Tests" value={stats.totalTests} subtitle="Test cases" icon={<TestTube2 className="w-5 h-5" />} variant="primary" />
          <StatsCard title="Passed" value={stats.passedTests} subtitle={`${stats.successRate.toFixed(0)}% success`} icon={<CheckCircle2 className="w-5 h-5" />} variant="success" />
          <StatsCard title="Failed" value={stats.failedTests} subtitle="Need attention" icon={<XCircle className="w-5 h-5" />} variant="destructive" />
          <StatsCard title="Pending" value={stats.pendingTests + stats.runningTests} subtitle="Awaiting run" icon={<Clock className="w-5 h-5" />} />
          <StatsCard title="Success Rate" value={`${stats.successRate.toFixed(1)}%`} subtitle="Overall" icon={<TrendingUp className="w-5 h-5" />} variant={stats.successRate >= 80 ? 'success' : stats.successRate >= 50 ? 'warning' : 'destructive'} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Test Cases</h3>
                <p className="text-sm text-muted-foreground">{project.testCases.length} test cases with detailed step-by-step execution</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><FileDown className="w-4 h-4 mr-2" />Export PDF</Button>
                <Button variant="outline" size="sm"><FileVideo className="w-4 h-4 mr-2" />View Recordings</Button>
              </div>
            </div>
            <TestCaseList testCases={project.testCases} />
          </div>
          <div>
            <AccessControlPanel members={project.members} />
          </div>
        </div>
      </div>
    </div>
  );
}
