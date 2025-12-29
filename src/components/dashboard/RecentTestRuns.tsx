import { TestRun } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RecentTestRunsProps {
  runs: TestRun[];
}

const statusConfig = {
  passed: { icon: CheckCircle2, badge: 'success', label: 'Passed' },
  failed: { icon: XCircle, badge: 'destructive', label: 'Failed' },
  running: { icon: Loader2, badge: 'warning', label: 'Running' },
  pending: { icon: Clock, badge: 'muted', label: 'Pending' },
  'self-healed': { icon: Sparkles, badge: 'success', label: 'Self-Healed' },
};

export function RecentTestRuns({ runs }: RecentTestRunsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Test Runs</h3>
      
      <div className="space-y-3">
        {runs.map((run) => {
          const config = statusConfig[run.status];
          const Icon = config.icon;
          
          return (
            <div 
              key={run.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                run.status === 'passed' || run.status === 'self-healed' ? 'bg-success/10' : 
                run.status === 'failed' ? 'bg-destructive/10' : 'bg-warning/10'
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  run.status === 'passed' || run.status === 'self-healed' ? 'text-success' : 
                  run.status === 'failed' ? 'text-destructive' : 'text-warning',
                  run.status === 'running' && 'animate-spin'
                )} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {run.testName}
                  </span>
                  {run.selfHealed && (
                    <Badge variant="success" className="text-[10px] px-1.5">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      Self-Healed
                    </Badge>
                  )}
                  {run.uiDriftDetected && !run.selfHealed && (
                    <Badge variant="warning" className="text-[10px] px-1.5">
                      UI Drift
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(run.startTime, 'MMM d, h:mm a')} • {run.duration ? `${run.duration}s` : 'In progress'}
                </p>
              </div>

              <Badge variant={config.badge as any}>{config.label}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
