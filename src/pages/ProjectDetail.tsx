import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { TestCaseList } from '@/components/projects/TestCaseList';
import { AccessControlPanelHorizontal } from '@/components/projects/AccessControlPanelHorizontal';
import { PlatformStatsGrid, Platform } from '@/components/projects/PlatformStatsGrid';
import { AddTestCasesModal } from '@/components/projects/AddTestCasesModal';
import { getProjectStats } from '@/data/mockProjects';
import { useProjects } from '@/context/ProjectsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  FileText,
  Figma,
  ExternalLink,
  FileVideo,
  FileDown,
  Filter,
  ChevronDown,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('dWeb');
  const [addTestCasesOpen, setAddTestCasesOpen] = useState(false);
  
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

  // Filter test cases by platform (simulated - in real app would have platform field on test cases)
  const getFilteredTestCases = () => {
    // For demo purposes, we'll show different subsets based on platform
    const platformIndex: Record<Platform, number> = {
      dWeb: 0,
      mWeb: 1,
      iOS: 2,
      Android: 3,
    };
    const index = platformIndex[selectedPlatform];
    // Show all test cases but with simulated platform filtering
    return project.testCases.filter((_, i) => {
      // Distribute test cases across platforms
      return i % 4 === index || project.testCases.length <= 4;
    });
  };

  const filteredTestCases = getFilteredTestCases();

  const platforms: Platform[] = ['dWeb', 'mWeb', 'iOS', 'Android'];

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

        {/* Project Summary */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Project Summary</h3>
          <p className="text-muted-foreground mb-4">{project.summary}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <a href="https://opif.example.com/OPIF-1345" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                OPIF 1345
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            </Button>
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

        {/* Access Control - Horizontal Layout */}
        <AccessControlPanelHorizontal members={project.members} />

        {/* Platform Stats Grid */}
        <PlatformStatsGrid stats={stats} />

        {/* Test Cases Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Test Cases</h3>
              <p className="text-sm text-muted-foreground">
                {filteredTestCases.length} test cases for {selectedPlatform} with detailed step-by-step execution
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setAddTestCasesOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Test Cases
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <FileVideo className="w-4 h-4 mr-2" />
                View Recordings
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Platform: {selectedPlatform}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {platforms.map((platform) => (
                    <DropdownMenuItem 
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={selectedPlatform === platform ? 'bg-accent' : ''}
                    >
                      {platform}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="glow" size="sm" className="gap-2">
                <Play className="w-4 h-4" />
                Run All
              </Button>
            </div>
          </div>
          <AddTestCasesModal 
            open={addTestCasesOpen} 
            onOpenChange={setAddTestCasesOpen}
          />
          <TestCaseList testCases={filteredTestCases} />
        </div>
      </div>
    </div>
  );
}