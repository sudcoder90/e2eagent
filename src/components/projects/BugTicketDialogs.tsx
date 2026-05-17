import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertTriangle,
  Bug,
  Check,
  FileImage,
  Info,
  Sparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const TEAM_MEMBERS = [
  'Alex Morgan',
  'Priya Patel',
  'Jordan Lee',
  'Sam Rivera',
  'Taylor Chen',
];

const MOCK_FILES = [
  'login-failure.png',
  'checkout-error.png',
  'cart-overflow.png',
  'pdp-broken-image.png',
  'search-empty-state.png',
  'walmart-plus-banner.png',
];

interface CreateBugTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testCaseName: string;
}

export function CreateBugTicketDialog({
  open,
  onOpenChange,
  testCaseName,
}: CreateBugTicketDialogProps) {
  const [summary, setSummary] = useState(`[Bug] ${testCaseName}`);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState<string>('');
  const [screenshots, setScreenshots] = useState<string[]>([]);

  const toggleScreenshot = (file: string) => {
    setScreenshots((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file],
    );
  };

  const handleCreate = () => {
    if (!summary.trim() || !description.trim()) {
      toast.error('Please add a summary and description');
      return;
    }
    const finalAssignee = assignee || 'Opex Lead (default)';
    toast.success(`Jira ticket created and assigned to ${finalAssignee}`);
    onOpenChange(false);
    // reset
    setDescription('');
    setScreenshots([]);
    setAssignee('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-destructive" />
            Create Jira Bug Ticket
          </DialogTitle>
          <DialogDescription>
            File a new bug ticket in Jira based on this test case.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short summary of the bug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Steps to reproduce, expected vs actual behaviour, environment details..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_MEMBERS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Screenshots from Files</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileImage className="w-4 h-4" />
                  {screenshots.length
                    ? `${screenshots.length} file${screenshots.length > 1 ? 's' : ''} selected`
                    : 'Select from Files folder'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="start">
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {MOCK_FILES.map((f) => {
                    const selected = screenshots.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleScreenshot(f)}
                        className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-muted text-sm text-left"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FileImage className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </span>
                        {selected && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            {screenshots.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {screenshots.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleScreenshot(s)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {!assignee && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                No assignee selected — this ticket will be routed to the{' '}
                <span className="font-medium text-foreground">Opex Lead</span> by default.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="gap-1.5">
            <Bug className="w-4 h-4" />
            Create Jira Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PotentialBug {
  id: string;
  title: string;
  summary: string;
  severity: 'High' | 'Medium' | 'Low';
  confidence: number;
  suggestedAssignee: string;
  detectedStep: string;
  evidence: string[];
}

const buildPotentialBugs = (testCaseName: string): PotentialBug[] => [
  {
    id: 'pb-1',
    title: 'CTA button unresponsive on first tap',
    summary: `During "${testCaseName}", the primary CTA required two taps to register. Likely a hydration/event-binding race condition.`,
    severity: 'High',
    confidence: 0.91,
    suggestedAssignee: 'Priya Patel',
    detectedStep: 'Step 3 — Tap "Continue to Checkout"',
    evidence: ['cta-delay-frame1.png', 'cta-delay-frame2.png'],
  },
  {
    id: 'pb-2',
    title: 'Layout shift on PDP image carousel',
    summary: 'Self-healing kicked in after the carousel container resized mid-render. May indicate a missing aspect-ratio reservation.',
    severity: 'Medium',
    confidence: 0.78,
    suggestedAssignee: 'Jordan Lee',
    detectedStep: 'Step 5 — Scroll product gallery',
    evidence: ['pdp-shift.png'],
  },
  {
    id: 'pb-3',
    title: 'Promo code field clears after error',
    summary: 'When an invalid promo is entered, the input value is wiped, forcing re-entry. Inconsistent with web behaviour.',
    severity: 'Low',
    confidence: 0.64,
    suggestedAssignee: 'Sam Rivera',
    detectedStep: 'Step 7 — Apply promo code',
    evidence: ['promo-cleared.png'],
  },
];

interface PotentialBugsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testCaseName: string;
}

export function PotentialBugsDialog({
  open,
  onOpenChange,
  testCaseName,
}: PotentialBugsDialogProps) {
  const [bugs, setBugs] = useState<PotentialBug[]>(() => buildPotentialBugs(testCaseName));
  const [reviewing, setReviewing] = useState<PotentialBug | null>(null);

  const handleConfirm = (bug: PotentialBug) => {
    setBugs((prev) => prev.filter((b) => b.id !== bug.id));
    setReviewing(null);
    toast.success(`Jira ticket created and assigned to ${bug.suggestedAssignee}`);
  };

  const handleDiscard = (bug: PotentialBug) => {
    setBugs((prev) => prev.filter((b) => b.id !== bug.id));
    setReviewing(null);
    toast.message('Potential bug discarded');
  };

  const severityVariant = (s: PotentialBug['severity']) =>
    s === 'High' ? 'destructive' : s === 'Medium' ? 'warning' : 'secondary';

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setReviewing(null);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-warning" />
            Potential Bug Tickets
          </DialogTitle>
          <DialogDescription>
            AI-detected issues from this test case. Review each one and confirm to file in Jira, or discard.
          </DialogDescription>
        </DialogHeader>

        {reviewing ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-foreground">{reviewing.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={severityVariant(reviewing.severity) as any}>
                    {reviewing.severity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(reviewing.confidence * 100)}% confidence
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Summary</Label>
              <p className="text-sm text-muted-foreground">{reviewing.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Detected at</Label>
                <p className="text-sm text-foreground">{reviewing.detectedStep}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Suggested Assignee</Label>
                <p className="text-sm text-foreground">{reviewing.suggestedAssignee}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Evidence</Label>
              <div className="flex flex-wrap gap-1.5">
                {reviewing.evidence.map((e) => (
                  <Badge key={e} variant="secondary" className="gap-1">
                    <FileImage className="w-3 h-3" />
                    {e}
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setReviewing(null)}>
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDiscard(reviewing)}
                className="gap-1.5"
              >
                <X className="w-4 h-4" />
                Discard
              </Button>
              <Button onClick={() => handleConfirm(reviewing)} className="gap-1.5">
                <Check className="w-4 h-4" />
                Confirm & File
              </Button>
            </DialogFooter>
          </div>
        ) : bugs.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            All potential bugs have been reviewed.
          </div>
        ) : (
          <div className="space-y-2">
            {bugs.map((b) => (
              <div
                key={b.id}
                className="rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-medium text-foreground text-sm">{b.title}</h5>
                      <Badge variant={severityVariant(b.severity) as any} className="text-[10px] h-5">
                        {b.severity}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {Math.round(b.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{b.summary}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      {b.detectedStep}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setReviewing(b)}>
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
