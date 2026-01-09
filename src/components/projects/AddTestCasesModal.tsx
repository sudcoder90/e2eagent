import { useState } from 'react';
import { Plus, Upload, FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
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

type PlatformType = 'Web' | 'Android' | 'iOS';
type TabType = 'manual' | 'confluence' | 'upload';

interface TestCaseInput {
  name: string;
  description: string;
  steps: string[];
}

interface AddTestCasesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { 
    platform: PlatformType; 
    minimumVersion?: string; 
    testCases: TestCaseInput[];
    runNow: boolean;
  }) => void;
}

export function AddTestCasesModal({ open, onOpenChange, onSave }: AddTestCasesModalProps) {
  const [platform, setPlatform] = useState<PlatformType>('Web');
  const [minimumVersion, setMinimumVersion] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('manual');
  const [testCases, setTestCases] = useState<TestCaseInput[]>([]);
  const [confluenceUrl, setConfluenceUrl] = useState('');

  const resetForm = () => {
    setPlatform('Web');
    setMinimumVersion('');
    setActiveTab('manual');
    setTestCases([]);
    setConfluenceUrl('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { name: '', description: '', steps: [''] }]);
  };

  const updateTestCase = (index: number, field: keyof TestCaseInput, value: string | string[]) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const addStep = (testCaseIndex: number) => {
    const updated = [...testCases];
    updated[testCaseIndex].steps.push('');
    setTestCases(updated);
  };

  const updateStep = (testCaseIndex: number, stepIndex: number, value: string) => {
    const updated = [...testCases];
    updated[testCaseIndex].steps[stepIndex] = value;
    setTestCases(updated);
  };

  const removeStep = (testCaseIndex: number, stepIndex: number) => {
    const updated = [...testCases];
    updated[testCaseIndex].steps = updated[testCaseIndex].steps.filter((_, i) => i !== stepIndex);
    setTestCases(updated);
  };

  const handleSave = (runNow: boolean) => {
    onSave?.({
      platform,
      minimumVersion: platform !== 'Web' ? minimumVersion : undefined,
      testCases,
      runNow,
    });
    handleClose();
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'manual', label: 'Add Manually' },
    { id: 'confluence', label: 'Import from Confluence' },
    { id: 'upload', label: 'Upload Document' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Test Cases</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
              <Badge variant="outline" className="text-xs">
                {testCases.length} test cases
              </Badge>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg border border-border bg-muted/30 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'manual' && (
                <>
                  {testCases.map((testCase, tcIndex) => (
                    <div key={tcIndex} className="rounded-lg border border-border bg-card p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">Test Case {tcIndex + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestCase(tcIndex)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Test Name *</Label>
                          <Input
                            placeholder="Enter test case name"
                            value={testCase.name}
                            onChange={(e) => updateTestCase(tcIndex, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Enter test case description"
                            value={testCase.description}
                            onChange={(e) => updateTestCase(tcIndex, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Steps</Label>
                          {testCase.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground w-6">{stepIndex + 1}.</span>
                              <Input
                                placeholder={`Step ${stepIndex + 1}`}
                                value={step}
                                onChange={(e) => updateStep(tcIndex, stepIndex, e.target.value)}
                                className="flex-1"
                              />
                              {testCase.steps.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeStep(tcIndex, stepIndex)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addStep(tcIndex)}
                            className="text-muted-foreground"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Step
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Test Case Button */}
                  <button
                    onClick={addTestCase}
                    className="w-full rounded-lg border-2 border-dashed border-border hover:border-muted-foreground py-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Test Case
                  </button>
                </>
              )}

              {activeTab === 'confluence' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Confluence URL</Label>
                    <Input
                      placeholder="https://confluence.example.com/pages/..."
                      value={confluenceUrl}
                      onChange={(e) => setConfluenceUrl(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Import from Confluence
                  </Button>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div className="rounded-lg border-2 border-dashed border-border hover:border-muted-foreground p-8 text-center transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports CSV, Excel, or JSON files
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleSave(false)}>
              Save & Run Later
            </Button>
            <Button variant="glow" onClick={() => handleSave(true)}>
              Save & Run Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
