import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Link, 
  Upload, 
  FileText, 
  Figma, 
  Ticket,
  Calendar as CalendarLucide,
  Play,
  Trash2,
  ExternalLink,
  Users,
  Crown,
  Pencil,
  Eye,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useProjects } from '@/context/ProjectsContext';
import { Project, TestCase, ProjectMember, AccessRole } from '@/types';

interface CreateProjectModalProps {
  trigger?: React.ReactNode;
}

interface TestCaseInput {
  id: string;
  name: string;
  description: string;
}

interface ContributorInput {
  id: string;
  name: string;
  email: string;
  role: AccessRole;
}

type PlatformType = 'Web' | 'Android' | 'iOS';

export function CreateProjectModal({ trigger }: CreateProjectModalProps) {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [projectDate, setProjectDate] = useState<Date>(new Date());
  const [team, setTeam] = useState('');
  const [prdLink, setPrdLink] = useState('');
  const [figmaLink, setFigmaLink] = useState('');
  const [opifTicket, setOpifTicket] = useState('');
  const [confluenceLink, setConfluenceLink] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('Web');
  const [minimumVersion, setMinimumVersion] = useState('');
  const [testCases, setTestCases] = useState<TestCaseInput[]>([]);
  const [scheduleFrequency, setScheduleFrequency] = useState<string>('manual');
  const [scheduleDate, setScheduleDate] = useState('');
  const [contributors, setContributors] = useState<ContributorInput[]>([]);
  const [newContributorName, setNewContributorName] = useState('');
  const [newContributorEmail, setNewContributorEmail] = useState('');
  const [newContributorRole, setNewContributorRole] = useState<AccessRole>('edit');
  const { toast } = useToast();
  const { addProject } = useProjects();

  const projectOwner: ContributorInput = {
    id: 'm-owner',
    name: 'You (Project Owner)',
    email: 'you@walmart.com',
    role: 'owner'
  };

  const addContributor = () => {
    if (!newContributorName.trim() || !newContributorEmail.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both name and email for the contributor",
        variant: "destructive"
      });
      return;
    }
    setContributors([
      ...contributors,
      {
        id: `contrib-${Date.now()}`,
        name: newContributorName,
        email: newContributorEmail,
        role: newContributorRole
      }
    ]);
    setNewContributorName('');
    setNewContributorEmail('');
    setNewContributorRole('edit');
  };

  const removeContributor = (id: string) => {
    setContributors(contributors.filter(c => c.id !== id));
  };

  const getRoleIcon = (role: AccessRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-3 h-3 text-warning" />;
      case 'edit':
        return <Pencil className="w-3 h-3 text-primary" />;
      case 'view':
        return <Eye className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { id: `tc-${Date.now()}`, name: '', description: '' }
    ]);
  };

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
  };

  const updateTestCase = (id: string, field: 'name' | 'description', value: string) => {
    setTestCases(testCases.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const createProjectObject = (): Project => {
    const projectTestCases: TestCase[] = testCases.map((tc, index) => ({
      id: `${projectName.toLowerCase().replace(/\s+/g, '-')}-tc-${index + 1}`,
      name: tc.name || `Test Case ${index + 1}`,
      description: tc.description || 'No description provided',
      steps: [],
      status: 'pending' as const,
      assertions: [],
    }));

    return {
      id: `proj-${Date.now()}`,
      name: projectName,
      description: projectSummary || 'No description provided',
      summary: projectSummary || 'No summary provided',
      quarter: format(projectDate, 'MMM d, yyyy'),
      team: team || 'General',
      testCases: projectTestCases,
      members: [
        { id: projectOwner.id, name: 'You', email: projectOwner.email, role: 'owner' as const },
        ...contributors.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          role: c.role
        }))
      ],
      createdAt: new Date(),
      lastUpdated: new Date(),
      status: 'active' as const,
      links: {
        prd: prdLink || undefined,
        figma: figmaLink || undefined,
      },
      scheduledRun: scheduleFrequency !== 'manual' ? {
        nextRun: scheduleDate ? new Date(scheduleDate) : new Date(Date.now() + 86400000),
        frequency: scheduleFrequency as 'daily' | 'weekly' | 'monthly',
        enabled: true,
      } : undefined,
    };
  };

  const handleCreate = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive"
      });
      return;
    }

    const newProject = createProjectObject();
    addProject(newProject);

    toast({
      title: "Project Created",
      description: `"${projectName}" has been created successfully with ${testCases.length} test cases`,
    });
    setOpen(false);
    resetForm();
  };

  const handleRunNow = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project before running tests",
        variant: "destructive"
      });
      return;
    }

    const newProject = createProjectObject();
    addProject(newProject);

    toast({
      title: "Tests Started",
      description: `Running ${testCases.length} test cases for "${projectName}"...`,
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectName('');
    setProjectSummary('');
    setProjectDate(new Date());
    setTeam('');
    setPrdLink('');
    setFigmaLink('');
    setOpifTicket('');
    setConfluenceLink('');
    setPlatform('Web');
    setMinimumVersion('');
    setTestCases([]);
    setScheduleFrequency('manual');
    setScheduleDate('');
    setContributors([]);
    setNewContributorName('');
    setNewContributorEmail('');
    setNewContributorRole('edit');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Cart Page Enhancement"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team *</Label>
                <Input
                  id="team"
                  placeholder="e.g., Cart, CXO, Walmart+"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !projectDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {projectDate ? format(projectDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={projectDate}
                      onSelect={(date) => date && setProjectDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Project Summary</Label>
              <Textarea
                id="summary"
                placeholder="Describe the project scope and goals..."
                value={projectSummary}
                onChange={(e) => setProjectSummary(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Link className="w-4 h-4" />
              Project Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prd" className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  PRD Link
                </Label>
                <Input
                  id="prd"
                  placeholder="https://docs.google.com/..."
                  value={prdLink}
                  onChange={(e) => setPrdLink(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="figma" className="flex items-center gap-2">
                  <Figma className="w-3 h-3" />
                  Figma Link
                </Label>
                <Input
                  id="figma"
                  placeholder="https://figma.com/..."
                  value={figmaLink}
                  onChange={(e) => setFigmaLink(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opif" className="flex items-center gap-2">
                  <Ticket className="w-3 h-3" />
                  OPIF Ticket
                </Label>
                <Input
                  id="opif"
                  placeholder="OPIF-12345"
                  value={opifTicket}
                  onChange={(e) => setOpifTicket(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confluence" className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Confluence Page
                </Label>
                <Input
                  id="confluence"
                  placeholder="https://confluence.amazon.com/..."
                  value={confluenceLink}
                  onChange={(e) => setConfluenceLink(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={platform} onValueChange={(value: PlatformType) => setPlatform(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Android">Android</SelectItem>
                    <SelectItem value="iOS">iOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(platform === 'Android' || platform === 'iOS') && (
                <div className="space-y-2">
                  <Label htmlFor="minimumVersion">Minimum Version *</Label>
                  <Input
                    id="minimumVersion"
                    placeholder={platform === 'Android' ? "e.g., 12.0" : "e.g., 15.0"}
                    value={minimumVersion}
                    onChange={(e) => setMinimumVersion(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Test Cases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Test Cases</h3>
              <Badge variant="secondary">{testCases.length} test cases</Badge>
            </div>

            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="manual">Add Manually</TabsTrigger>
                <TabsTrigger value="confluence">Import from Confluence</TabsTrigger>
                <TabsTrigger value="upload">Upload Document</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-3 mt-4">
                {testCases.map((tc, index) => (
                  <Card key={tc.id} className="bg-muted/30 border-border/50">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-mono text-muted-foreground mt-2">
                          {index + 1}
                        </span>
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Test case name"
                            value={tc.name}
                            onChange={(e) => updateTestCase(tc.id, 'name', e.target.value)}
                            className="h-8"
                          />
                          <Textarea
                            placeholder="Describe the test steps in plain English..."
                            value={tc.description}
                            onChange={(e) => updateTestCase(tc.id, 'description', e.target.value)}
                            rows={2}
                            className="resize-none"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeTestCase(tc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full gap-2 border-dashed"
                  onClick={addTestCase}
                >
                  <Plus className="w-4 h-4" />
                  Add Test Case
                </Button>
              </TabsContent>

              <TabsContent value="confluence" className="mt-4">
                <Card className="bg-muted/30 border-border/50 border-dashed">
                  <CardContent className="p-6 text-center">
                    <ExternalLink className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Paste your Confluence page URL to import test cases
                    </p>
                    <Input
                      placeholder="https://confluence.amazon.com/display/..."
                      value={confluenceLink}
                      onChange={(e) => setConfluenceLink(e.target.value)}
                    />
                    <Button variant="outline" className="mt-3 gap-2">
                      <Link className="w-4 h-4" />
                      Import Test Cases
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="mt-4">
                <Card className="bg-muted/30 border-border/50 border-dashed">
                  <CardContent className="p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a document containing your test cases
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supported formats: .doc, .docx, .pdf, .txt, .md
                    </p>
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Choose File
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Scheduling Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CalendarLucide className="w-4 h-4" />
              Test Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Run Frequency</Label>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Only</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {scheduleFrequency !== 'manual' && (
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contributors Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contributors
              </h3>
              <Badge variant="secondary">{contributors.length + 1} members</Badge>
            </div>

            {/* Project Owner (always shown) */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-warning/20 text-warning">
                        YO
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        You
                        <Crown className="w-3 h-3 text-warning" />
                      </p>
                      <p className="text-xs text-muted-foreground">{projectOwner.email}</p>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-xs">Owner</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Added Contributors */}
            {contributors.map((contributor) => (
              <Card key={contributor.id} className="bg-muted/30 border-border/50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">
                          {contributor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          {contributor.name}
                          {getRoleIcon(contributor.role)}
                        </p>
                        <p className="text-xs text-muted-foreground">{contributor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={contributor.role === 'edit' ? 'default' : 'secondary'} className="text-xs">
                        {contributor.role === 'edit' ? 'Can Edit' : 'View Only'}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeContributor(contributor.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Contributor Form */}
            <Card className="bg-muted/30 border-border/50 border-dashed">
              <CardContent className="p-3">
                <div className="grid grid-cols-4 gap-2">
                  <Input
                    placeholder="Name"
                    value={newContributorName}
                    onChange={(e) => setNewContributorName(e.target.value)}
                    className="h-8"
                  />
                  <Input
                    placeholder="Email"
                    value={newContributorEmail}
                    onChange={(e) => setNewContributorEmail(e.target.value)}
                    className="h-8"
                  />
                  <Select value={newContributorRole} onValueChange={(v) => setNewContributorRole(v as AccessRole)}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Can Edit</SelectItem>
                      <SelectItem value="view">View Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={addContributor}
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleRunNow}
                disabled={testCases.length === 0}
              >
                <Play className="w-4 h-4" />
                Create & Run Now
              </Button>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
