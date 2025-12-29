import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Sparkles } from 'lucide-react';

interface CreateTestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (test: { name: string; description: string; steps: string[] }) => void;
}

export function CreateTestModal({ open, onOpenChange, onCreate }: CreateTestModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = () => {
    onCreate({
      name,
      description,
      steps: steps.filter(s => s.trim() !== '')
    });
    setName('');
    setDescription('');
    setSteps(['']);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Create New Test Case
          </DialogTitle>
          <DialogDescription>
            Write your test case in plain English. The AI agent will interpret and execute it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Test Name</Label>
            <Input
              id="name"
              placeholder="e.g., Guest User Add to Cart Flow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this test validates..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Test Steps (Plain English)</Label>
            {steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex items-center justify-center w-6 h-10 text-xs text-muted-foreground">
                  {index + 1}.
                </div>
                <Input
                  placeholder={`Step ${index + 1}: e.g., Navigate to the product page...`}
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  className="bg-secondary border-border flex-1"
                />
                {steps.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addStep} className="mt-2">
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="glow" onClick={handleSubmit} disabled={!name.trim()}>
            <Sparkles className="w-4 h-4 mr-1" />
            Create Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
