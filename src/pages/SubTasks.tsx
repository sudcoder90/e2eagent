import { useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  ChevronDown,
  ChevronRight,
  History,
  AlertTriangle,
  Trash2,
  ListChecks,
  User,
  Calendar as CalIcon,
  TrendingUp,
} from 'lucide-react';
import {
  DOMAINS,
  Domain,
  SubTask,
  SubTaskStep,
  mockSubTasks,
} from '@/data/mockSubTasks';

const platforms: Array<'Web' | 'Native' | 'Both'> = ['Both', 'Web', 'Native'];

function StepEditor({
  steps,
  onChange,
}: {
  steps: SubTaskStep[];
  onChange: (s: SubTaskStep[]) => void;
}) {
  const update = (i: number, patch: Partial<SubTaskStep>) =>
    onChange(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const remove = (i: number) => onChange(steps.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([
      ...steps,
      { id: `new-${Date.now()}`, description: '', platform: 'Both' },
    ]);

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex gap-2 items-start">
          <div className="mt-2 text-xs font-mono text-muted-foreground w-6">
            {i + 1}.
          </div>
          <Textarea
            value={step.description}
            onChange={(e) => update(i, { description: e.target.value })}
            placeholder="Describe this step (e.g., Visit www.walmart.com/plus)"
            className="min-h-[60px] flex-1"
          />
          <Select
            value={step.platform}
            onValueChange={(v) =>
              update(i, { platform: v as 'Web' | 'Native' | 'Both' })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(i)}
            disabled={steps.length === 1}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="w-4 h-4 mr-1" /> Add Step
      </Button>
    </div>
  );
}

export default function SubTasks() {
  const [subTasks, setSubTasks] = useState<SubTask[]>(mockSubTasks);
  const [selectedDomain, setSelectedDomain] = useState<Domain>('Walmart+');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [historyOpen, setHistoryOpen] = useState<Record<string, boolean>>({});

  // create/edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const [form, setForm] = useState<{
    name: string;
    domain: Domain;
    description: string;
    steps: SubTaskStep[];
    changeNote: string;
  }>({
    name: '',
    domain: 'Walmart+',
    description: '',
    steps: [{ id: 'new-1', description: '', platform: 'Both' }],
    changeNote: '',
  });

  const filtered = useMemo(
    () => subTasks.filter((s) => s.domain === selectedDomain),
    [subTasks, selectedDomain],
  );

  const openCreate = () => {
    setEditingId(null);
    setDuplicateWarning(null);
    setForm({
      name: '',
      domain: selectedDomain,
      description: '',
      steps: [{ id: 'new-1', description: '', platform: 'Both' }],
      changeNote: '',
    });
    setDialogOpen(true);
  };

  const requestEdit = (st: SubTask) => {
    setPendingEditId(st.id);
    setShowEditWarning(true);
  };

  const confirmEdit = () => {
    const st = subTasks.find((x) => x.id === pendingEditId);
    if (!st) return;
    setEditingId(st.id);
    setDuplicateWarning(null);
    setForm({
      name: st.name,
      domain: st.domain,
      description: st.description,
      steps: st.steps.map((s) => ({ ...s })),
      changeNote: '',
    });
    setShowEditWarning(false);
    setPendingEditId(null);
    setDialogOpen(true);
  };

  const checkDuplicate = (name: string, domain: Domain, ignoreId?: string) => {
    const norm = name.trim().toLowerCase();
    if (!norm) return null;
    const match = subTasks.find(
      (s) =>
        s.id !== ignoreId &&
        s.domain === domain &&
        s.name.trim().toLowerCase() === norm,
    );
    return match ? `A sub-task named "${match.name}" already exists in ${domain}.` : null;
  };

  const onNameChange = (name: string) => {
    setForm((f) => ({ ...f, name }));
    setDuplicateWarning(checkDuplicate(name, form.domain, editingId ?? undefined));
  };

  const onDomainChange = (domain: Domain) => {
    setForm((f) => ({ ...f, domain }));
    setDuplicateWarning(checkDuplicate(form.name, domain, editingId ?? undefined));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (form.steps.some((s) => !s.description.trim())) {
      toast.error('All steps must have a description');
      return;
    }
    const dup = checkDuplicate(form.name, form.domain, editingId ?? undefined);
    if (dup) {
      setDuplicateWarning(dup);
      toast.error('Duplicate sub-task name in this domain');
      return;
    }

    if (editingId) {
      setSubTasks((prev) =>
        prev.map((s) => {
          if (s.id !== editingId) return s;
          const newVersion = s.currentVersion + 1;
          return {
            ...s,
            name: form.name,
            description: form.description,
            domain: form.domain,
            steps: form.steps,
            currentVersion: newVersion,
            history: [
              ...s.history,
              {
                version: newVersion,
                editedAt: new Date(),
                editedBy: 'You',
                changeNote: form.changeNote || 'Updated steps',
                steps: form.steps,
              },
            ],
          };
        }),
      );
      toast.success(`Sub-task updated — new version saved`);
    } else {
      const id = `st-${Date.now()}`;
      const now = new Date();
      setSubTasks((prev) => [
        {
          id,
          name: form.name,
          domain: form.domain,
          description: form.description,
          createdAt: now,
          createdBy: 'You',
          successRate: 0,
          totalRuns: 0,
          currentVersion: 1,
          steps: form.steps,
          history: [
            {
              version: 1,
              editedAt: now,
              editedBy: 'You',
              changeNote: 'Initial version',
              steps: form.steps,
            },
          ],
        },
        ...prev,
      ]);
      toast.success('Sub-task created');
    }
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Define Sub-tasks"
        subtitle="Reusable step-by-step playbooks that sub-agents follow for consistent execution"
      />

      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground">Team / Domain</label>
            <Select
              value={selectedDomain}
              onValueChange={(v) => setSelectedDomain(v as Domain)}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOMAINS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">{filtered.length} sub-tasks</Badge>
          </div>
          <Button variant="glow" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Create Sub-task
          </Button>
        </div>

        {/* Info */}
        <Alert>
          <ListChecks className="w-4 h-4" />
          <AlertTitle>What are sub-tasks?</AlertTitle>
          <AlertDescription>
            Define the detailed, deterministic steps for a common action (e.g.
            "MLP Signup"). Sub-agents reuse these playbooks across test cases for
            higher accuracy and consistency.
          </AlertDescription>
        </Alert>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No sub-tasks yet for {selectedDomain}. Click "Create Sub-task" to add one.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((st) => {
              const isOpen = !!expanded[st.id];
              const isHistoryOpen = !!historyOpen[st.id];
              return (
                <div
                  key={st.id}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  {/* Header row */}
                  <div className="p-4 flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mt-0.5"
                      onClick={() =>
                        setExpanded((p) => ({ ...p, [st.id]: !p[st.id] }))
                      }
                    >
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {st.name}
                        </h3>
                        <Badge variant="outline">{st.domain}</Badge>
                        <Badge variant="secondary" className="gap-1">
                          v{st.currentVersion}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {st.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {st.createdBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalIcon className="w-3 h-3" />
                          Created {format(st.createdAt, 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <ListChecks className="w-3 h-3" />
                          {st.steps.length} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {st.successRate}% success · {st.totalRuns} runs
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestEdit(st)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="border-t border-border p-4 space-y-4 bg-background/40">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Steps</h4>
                        <ol className="space-y-2">
                          {st.steps.map((s, i) => (
                            <li
                              key={s.id}
                              className="flex gap-3 items-start text-sm"
                            >
                              <span className="font-mono text-xs text-muted-foreground mt-0.5 w-6">
                                {i + 1}.
                              </span>
                              <span className="flex-1">{s.description}</span>
                              {s.platform && (
                                <Badge variant="outline" className="text-[10px]">
                                  {s.platform}
                                </Badge>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <Collapsible
                        open={isHistoryOpen}
                        onOpenChange={(o) =>
                          setHistoryOpen((p) => ({ ...p, [st.id]: o }))
                        }
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <History className="w-4 h-4" />
                            Version history ({st.history.length})
                            {isHistoryOpen ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-2">
                          {[...st.history].reverse().map((v) => (
                            <div
                              key={v.version}
                              className="rounded-lg border border-border p-3 text-sm"
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant={
                                    v.version === st.currentVersion
                                      ? 'default'
                                      : 'secondary'
                                  }
                                >
                                  v{v.version}
                                  {v.version === st.currentVersion && ' · current'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(v.editedAt, 'MMM d, yyyy')} ·{' '}
                                  {formatDistanceToNow(v.editedAt, {
                                    addSuffix: true,
                                  })}{' '}
                                  by {v.editedBy}
                                </span>
                              </div>
                              {v.changeNote && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {v.changeNote}
                                </p>
                              )}
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit-warning dialog */}
      <Dialog open={showEditWarning} onOpenChange={setShowEditWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Editing a shared sub-task
            </DialogTitle>
            <DialogDescription>
              This sub-task may be referenced by multiple test cases and
              sub-agents. Editing creates a new version — the previous version
              will remain in the history for reference. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditWarning(false);
                setPendingEditId(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Continue editing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit sub-task' : 'Create sub-task'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Saving will create a new version. Previous versions stay in history.'
                : 'Define the reusable steps a sub-agent should follow.'}
            </DialogDescription>
          </DialogHeader>

          {duplicateWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Duplicate name</AlertTitle>
              <AlertDescription>{duplicateWarning}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="e.g., MLP Signup"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Domain *</label>
                <Select
                  value={form.domain}
                  onValueChange={(v) => onDomainChange(v as Domain)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="What does this sub-task accomplish?"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Steps *</label>
              <StepEditor
                steps={form.steps}
                onChange={(steps) => setForm((f) => ({ ...f, steps }))}
              />
            </div>
            {editingId && (
              <div>
                <label className="text-sm font-medium">Change note</label>
                <Input
                  value={form.changeNote}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, changeNote: e.target.value }))
                  }
                  placeholder="What changed in this version?"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!!duplicateWarning}>
              {editingId ? 'Save new version' : 'Create sub-task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
