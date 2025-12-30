import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  Trash2,
  Eye,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockMemoryItems = [
  {
    id: '1',
    type: 'screenshot',
    name: 'Splash Page - Expected State',
    description: 'Reference screenshot for splash page validation with monthly/annual toggle',
    project: 'Integrated Signup Flow Enhancement',
    createdAt: new Date('2024-12-15'),
    size: '245 KB',
  },
  {
    id: '2',
    type: 'screenshot',
    name: 'Cart Page - New Feature Layout',
    description: 'Expected cart layout with new promotional banner placement',
    project: 'New Feature on Cart Page Q1 2026',
    createdAt: new Date('2024-12-20'),
    size: '312 KB',
  },
  {
    id: '3',
    type: 'document',
    name: 'Login Flow Test Instructions',
    description: 'Detailed step-by-step instructions for validating the login user journey',
    project: 'Integrated Signup Flow Enhancement',
    createdAt: new Date('2024-12-18'),
    size: '45 KB',
  },
  {
    id: '4',
    type: 'screenshot',
    name: 'Membership Plans Comparison',
    description: 'Reference for validating plan colors and pricing display',
    project: 'Splashpage Enhancements',
    createdAt: new Date('2024-12-22'),
    size: '189 KB',
  },
];

export default function AgentMemory() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Agent Memory" 
        subtitle="Manage screenshots and reference documents for AI agent testing"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockMemoryItems.length}</p>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <ImageIcon className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockMemoryItems.filter(i => i.type === 'screenshot').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Screenshots</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <FileText className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockMemoryItems.filter(i => i.type === 'document').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">791 KB</p>
                  <p className="text-xs text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-dashed">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Upload Reference Files
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Upload screenshots and documents that agents will use as reference for visual assertions and test validation
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Upload Screenshot
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memory Items */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Stored Memory Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMemoryItems.map((item) => (
              <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.type === 'screenshot' ? 'bg-success/10' : 'bg-warning/10'
                      }`}>
                        {item.type === 'screenshot' ? (
                          <ImageIcon className={`w-4 h-4 ${
                            item.type === 'screenshot' ? 'text-success' : 'text-warning'
                          }`} />
                        ) : (
                          <FileText className="w-4 h-4 text-warning" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {item.project}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
