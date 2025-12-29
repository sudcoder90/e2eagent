import { Project } from '@/types';
import { getProjectStats } from '@/data/mockProjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Folder, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const stats = getProjectStats(project);
  
  const getStatusBadge = () => {
    switch (project.status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'paused':
        return <Badge variant="warning">Paused</Badge>;
      default:
        return null;
    }
  };

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
              <p className="text-sm text-muted-foreground">{project.quarter}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        
        {/* Test Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-bold text-foreground">{stats.totalTests}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="p-2 rounded-lg bg-success/10">
            <div className="text-lg font-bold text-success flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {stats.passedTests}
            </div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </div>
          <div className="p-2 rounded-lg bg-destructive/10">
            <div className="text-lg font-bold text-destructive flex items-center justify-center gap-1">
              <XCircle className="w-4 h-4" />
              {stats.failedTests}
            </div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
          <div className="p-2 rounded-lg bg-warning/10">
            <div className="text-lg font-bold text-warning flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              {stats.pendingTests + stats.runningTests}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>
        
        {/* Success Rate Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Success Rate</span>
            <span className="font-medium text-foreground">{stats.successRate.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.successRate} 
            className="h-2"
          />
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <div className="flex -space-x-2">
              {project.members.slice(0, 4).map((member, i) => (
                <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                  +{project.members.length - 4}
                </div>
              )}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(project.lastUpdated, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
