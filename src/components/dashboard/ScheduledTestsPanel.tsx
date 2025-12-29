import { mockProjects } from '@/data/mockProjects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';

export function ScheduledTestsPanel() {
  const navigate = useNavigate();

  const scheduledProjects = mockProjects
    .filter(p => p.scheduledRun?.enabled && p.scheduledRun?.nextRun)
    .sort((a, b) => (a.scheduledRun?.nextRun?.getTime() || 0) - (b.scheduledRun?.nextRun?.getTime() || 0));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Scheduled Tests</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/scheduling')}
        >
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {scheduledProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No scheduled tests</p>
        ) : (
          scheduledProjects.slice(0, 5).map((project) => (
            <div 
              key={project.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {project.testCases.length} tests • {project.scheduledRun?.frequency}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {project.scheduledRun?.nextRun && formatDistanceToNow(project.scheduledRun.nextRun, { addSuffix: true })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.scheduledRun?.nextRun && format(project.scheduledRun.nextRun, 'MMM d, h:mm a')}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="p-1 h-auto">
                  <Play className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
