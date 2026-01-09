import { Project } from '@/types';
import { getProjectStats } from '@/data/mockProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Folder, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

// Generate mock platform stats based on project stats
const getPlatformStats = (stats: ReturnType<typeof getProjectStats>) => {
  const platforms = ['dWeb', 'mWeb', 'iOS', 'Android'] as const;
  const totalPerPlatform = Math.ceil(stats.totalTests / 4);
  
  return platforms.map((platform, index) => {
    // Distribute stats across platforms with some variation
    const passed = Math.floor(stats.passedTests / 4) + (index < stats.passedTests % 4 ? 1 : 0);
    const failed = Math.floor(stats.failedTests / 4) + (index < stats.failedTests % 4 ? 1 : 0);
    const pending = Math.floor((stats.pendingTests + stats.runningTests) / 4) + (index < (stats.pendingTests + stats.runningTests) % 4 ? 1 : 0);
    
    return { platform, passed, failed, pending };
  });
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const stats = getProjectStats(project);
  const platformStats = getPlatformStats(stats);
  
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 bg-card/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-medium">
                  {project.team} Team
                </Badge>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        
        {/* Platform Stats Table */}
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1 text-xs text-muted-foreground text-center font-medium">
            <div>Platform</div>
            <div className="text-success">Passed</div>
            <div className="text-destructive">Failed</div>
            <div className="text-warning">Pending</div>
          </div>
          {platformStats.map(({ platform, passed, failed, pending }) => (
            <div key={platform} className="grid grid-cols-4 gap-1 text-center py-1.5 rounded bg-muted/30">
              <div className="text-xs font-medium text-foreground">{platform}</div>
              <div className="text-xs font-bold text-success flex items-center justify-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                {passed}
              </div>
              <div className="text-xs font-bold text-destructive flex items-center justify-center gap-0.5">
                <XCircle className="w-3 h-3" />
                {failed}
              </div>
              <div className="text-xs font-bold text-warning flex items-center justify-center gap-0.5">
                <Clock className="w-3 h-3" />
                {pending}
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall Success Rate Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Success Rate</span>
            <span className="font-medium text-foreground">{stats.successRate.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.successRate} 
            className="h-2"
          />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(project.lastUpdated, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
