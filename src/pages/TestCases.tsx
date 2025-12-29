import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { TestCaseCard } from '@/components/tests/TestCaseCard';
import { CreateTestModal } from '@/components/tests/CreateTestModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockProjects } from '@/data/mockProjects';
import { Plus, Search, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TestCase } from '@/types';

export default function TestCases() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { toast } = useToast();

  // Aggregate all test cases from all projects
  const allTestCases: TestCase[] = mockProjects.flatMap(project => project.testCases);

  const filters = [
    { label: 'All', value: null, count: allTestCases.length },
    { label: 'Passed', value: 'passed', count: allTestCases.filter(t => t.status === 'passed').length },
    { label: 'Failed', value: 'failed', count: allTestCases.filter(t => t.status === 'failed').length },
    { label: 'Running', value: 'running', count: allTestCases.filter(t => t.status === 'running').length },
    { label: 'Pending', value: 'pending', count: allTestCases.filter(t => t.status === 'pending').length },
  ];

  const filteredTests = allTestCases.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === null || test.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleRunTest = (testName: string) => {
    toast({
      title: "Test Queued",
      description: `"${testName}" has been added to the execution queue.`,
    });
  };

  const handleCreateTest = (test: { name: string; description: string; steps: string[] }) => {
    toast({
      title: "Test Created",
      description: `"${test.name}" has been created with ${test.steps.length} steps.`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Test Cases" 
        subtitle="Manage your plain-language test definitions"
      />
      
      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search test cases..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Run All
            </Button>
            <Button variant="glow" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Test
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <Button
              key={filter.label}
              variant={selectedFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.value)}
              className="gap-2"
            >
              {filter.label}
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTests.map((test) => (
            <TestCaseCard 
              key={test.id} 
              test={test}
              onRun={() => handleRunTest(test.name)}
            />
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No test cases found matching your criteria.</p>
          </div>
        )}
      </div>

      <CreateTestModal 
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreate={handleCreateTest}
      />
    </div>
  );
}
