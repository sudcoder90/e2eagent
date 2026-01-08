import { useState } from 'react';
import { TestCase, TestStep } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Pencil
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

function TestCaseItem({ testCase }: { testCase: TestCase }) {
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

  const passedSteps = testCase.steps.filter(s => s.status === 'passed').length;
  const totalSteps = testCase.steps.length;

  return (
    <Card className={`bg-card/50 backdrop-blur-sm transition-all duration-200 ${
      testCase.status === 'failed' ? 'border-destructive/30' : ''
    }`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-1">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-foreground">{testCase.name}</h4>
                    {getStatusBadge()}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {testCase.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{totalSteps} steps</span>
                    <span>{passedSteps}/{totalSteps} passed</span>
                    {testCase.duration && <span>{testCase.duration.toFixed(1)}s</span>}
                    {testCase.lastRun && (
                      <span>Last run {formatDistanceToNow(testCase.lastRun, { addSuffix: true })}</span>
                    )}
                  </div>
                  {testCase.failedStepSummary && (
                    <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20">
                      <p className="text-xs text-destructive">{testCase.failedStepSummary}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
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
                    <FileDown className="w-3 h-3" />
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
                    <Video className="w-3 h-3" />
                    <span className="text-xs">Video</span>
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="gap-1 h-8 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Edit test case logic here
                  }}
                >
                  <Pencil className="w-3 h-3" />
                  <span className="text-xs">Edit</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Run test logic here
                  }}
                >
                  <Play className="w-3 h-3" />
                  Run
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="ml-7 space-y-2 border-l-2 border-border/50 pl-4">
              {testCase.steps.map((step) => (
                <StepItem key={step.id} step={step} />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export function TestCaseList({ testCases }: TestCaseListProps) {
  return (
    <div className="space-y-3">
      {testCases.map((testCase) => (
        <TestCaseItem key={testCase.id} testCase={testCase} />
      ))}
    </div>
  );
}