import { TestCase } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  Sparkles,
  Play,
  ChevronRight,
  Image,
  Pencil
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TestCaseCardProps {
  test: TestCase;
  onClick?: () => void;
  onRun?: () => void;
  onEdit?: () => void;
}

const statusConfig = {
  passed: { icon: CheckCircle2, badge: 'success', label: 'Passed', color: 'text-success' },
  failed: { icon: XCircle, badge: 'destructive', label: 'Failed', color: 'text-destructive' },
  running: { icon: Loader2, badge: 'warning', label: 'Running', color: 'text-warning' },
  pending: { icon: Clock, badge: 'muted', label: 'Pending', color: 'text-muted-foreground' },
  'self-healed': { icon: Sparkles, badge: 'success', label: 'Self-Healed', color: 'text-success' },
};

export function TestCaseCard({ test, onClick, onRun, onEdit }: TestCaseCardProps) {
  const config = statusConfig[test.status];
  const Icon = config.icon;

  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-card cursor-pointer"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
              test.status === 'passed' || test.status === 'self-healed' ? 'bg-success/10' : 
              test.status === 'failed' ? 'bg-destructive/10' : 
              test.status === 'running' ? 'bg-warning/10' : 'bg-muted'
            )}>
              <Icon className={cn("w-5 h-5", config.color, test.status === 'running' && 'animate-spin')} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {test.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {test.description}
              </p>
            </div>
          </div>
          <Badge variant={config.badge as any}>{config.label}</Badge>
        </div>

        {/* Steps preview */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{test.steps.length} steps</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{test.assertions.length} assertions</span>
          {test.screenshotUrl && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Image className="w-3 h-3" /> Visual
              </span>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {test.lastRun ? (
              <>Last run {formatDistanceToNow(test.lastRun)} ago {test.duration && `• ${test.duration}s`}</>
            ) : (
              'Never run'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onRun?.();
              }}
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              Run
            </Button>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
