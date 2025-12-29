import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, Globe, Bell, Shield, Zap } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Settings" 
        subtitle="Configure your QA automation platform"
      />
      
      <div className="p-6 max-w-3xl">
        <div className="space-y-8">
          {/* Target Configuration */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Target Configuration</h3>
                <p className="text-sm text-muted-foreground">Configure the e-commerce platform to test</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-url">Target URL</Label>
                <Input 
                  id="target-url"
                  defaultValue="https://www.amazon.com"
                  className="bg-secondary border-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint (for headless testing)</Label>
                <Input 
                  id="api-endpoint"
                  placeholder="https://api.your-service.com"
                  className="bg-secondary border-border font-mono"
                />
              </div>
            </div>
          </div>

          {/* Agent Settings */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Agent Settings</h3>
                <p className="text-sm text-muted-foreground">Configure synthetic agent behavior</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Self-Healing</Label>
                  <p className="text-sm text-muted-foreground">Automatically update selectors when UI changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Human-like Delays</Label>
                  <p className="text-sm text-muted-foreground">Add realistic timing between actions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Screenshot on Failure</Label>
                  <p className="text-sm text-muted-foreground">Capture screenshots when tests fail</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="max-agents">Maximum Concurrent Agents</Label>
                <Input 
                  id="max-agents"
                  type="number"
                  defaultValue="4"
                  className="bg-secondary border-border w-32"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure alert preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Test Failure Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when tests fail</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>UI Drift Detection</Label>
                  <p className="text-sm text-muted-foreground">Alert when visual changes are detected</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                <Input 
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/..."
                  className="bg-secondary border-border font-mono"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="glow">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
