import { useState } from 'react';
import { TestCase, TestStep } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  ChevronDown,
  ChevronRight,
  Play,
  AlertTriangle,
  Sparkles,
  FileDown,
  Video,
  Pencil,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

type RunPlatform = 'All Platforms' | 'Web' | 'Android' | 'iOS';

const platformOptions: { value: RunPlatform; label: string; icon: React.ReactNode }[] = [
  { value: 'All Platforms', label: 'All Platforms', icon: <Monitor className="w-3.5 h-3.5" /> },
  { value: 'Web', label: 'Web', icon: <Monitor className="w-3.5 h-3.5" /> },
  { value: 'Android', label: 'Android', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { value: 'iOS', label: 'iOS', icon: <Tablet className="w-3.5 h-3.5" /> },
];

interface TestCaseListProps {
  testCases: TestCase[];
}

function StepItem({ step }: { step: TestStep }) {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'passed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    }
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${
      step.status === 'failed' ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/30'
    }`}>
      <div className="flex-shrink-0 mt-0.5">
        {getStatusIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">Step {step.stepNumber}</span>
          {step.duration && (
            <span className="text-xs text-muted-foreground">{step.duration.toFixed(1)}s</span>
          )}
        </div>
        <p className="text-sm text-foreground mt-1">{step.description}</p>
        {step.failureReason && (
          <div className="mt-2 p-2 rounded bg-destructive/20 border border-destructive/30">
            <div className="flex items-center gap-2 text-destructive text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              Failure Reason
            </div>
            <p className="text-xs text-destructive/80 mt-1">{step.failureReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TestCaseItemProps {
  testCase: TestCase;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

function TestCaseItem({ testCase, isSelected, onSelectChange }: TestCaseItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = () => {
    switch (testCase.status) {
      case 'passed':
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="w-3 h-3" />Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Failed</Badge>;
      case 'running':
        return <Badge variant="default" className="gap-1"><Loader2 className="w-3 h-3 animate-spin" />Running</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'self-healed':
        return <Badge variant="warning" className="gap-1"><Sparkles className="w-3 h-3" />Self-Healed</Badge>;
    }
  };

  const handleRunOnPlatform = (platform: RunPlatform) => {
    toast.success(`Running "${testCase.name}" on ${platform}`);
  };

  const passedSteps = testCase.steps.filter(s => s.status === 'passed').length;
  const totalSteps = testCase.steps.length;

  return (
    <div className={`rounded-lg border border-border bg-card/50 transition-all duration-200 ${
      testCase.status === 'failed' ? 'border-destructive/30' : ''
    } ${isSelected ? 'ring-1 ring-primary/50' : ''}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelectChange(!!checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary flex-shrink-0"
                />
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                <h4 className="font-medium text-foreground truncate">{testCase.name}</h4>
                {getStatusBadge()}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {totalSteps} steps · {passedSteps}/{totalSteps} passed
                  {testCase.duration ? ` · ${Math.floor(testCase.duration / 60)}m ${Math.round(testCase.duration % 60)}s` : ''}
                  {testCase.lastRun && ` · Last run ${formatDistanceToNow(testCase.lastRun, { addSuffix: false })} ago`}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {testCase.output?.pdfUrl && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="gap-1 h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(testCase.output?.pdfUrl, '_blank');
                    }}
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span className="text-xs">PDF</span>
                  </Button>
                )}
                {testCase.output?.videoUrl && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="gap-1 h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(testCase.output?.videoUrl, '_blank');
                    }}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span className="text-xs">Video</span>
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="gap-1 h-8 px-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="text-xs">Edit</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="gap-1 h-8 px-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span className="text-xs">Run</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    {platformOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        onClick={() => handleRunOnPlatform(opt.value)}
                        className="gap-2"
                      >
                        {opt.icon}
                        {opt.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="ml-11 space-y-2 border-l-2 border-border/50 pl-4">
              {testCase.steps.map((step) => (
                <StepItem key={step.id} step={step} />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function TestCaseList({ testCases }: TestCaseListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = testCases.length > 0 && selectedIds.size === testCases.length;
  const someSelected = selectedIds.size > 0;

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(testCases.map(tc => tc.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleBulkRun = (platform: RunPlatform) => {
    const count = selectedIds.size;
    toast.success(`Running ${count} test${count !== 1 ? 's' : ''} on ${platform}`);
  };

  return (
    <div className="space-y-3">
      {/* Bulk actions bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => toggleSelectAll(!!checked)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm text-muted-foreground">
            {someSelected ? `${selectedIds.size} of ${testCases.length} selected` : 'Select all'}
          </span>
        </div>
        {someSelected && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Play className="w-3.5 h-3.5" />
                  Run Selected
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {platformOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => handleBulkRun(opt.value)}
                    className="gap-2"
                  >
                    {opt.icon}
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {testCases.map((testCase) => (
        <TestCaseItem 
          key={testCase.id} 
          testCase={testCase}
          isSelected={selectedIds.has(testCase.id)}
          onSelectChange={(checked) => toggleSelect(testCase.id, checked)}
        />
      ))}
    </div>
  );
}