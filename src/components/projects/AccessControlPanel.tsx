import { ProjectMember, AccessRole } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Crown, 
  Pencil, 
  Eye,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AccessControlPanelProps {
  members: ProjectMember[];
}

export function AccessControlPanel({ members }: AccessControlPanelProps) {
  const getRoleIcon = (role: AccessRole) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-warning" />;
      case 'edit':
        return <Pencil className="w-4 h-4 text-primary" />;
      case 'view':
        return <Eye className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: AccessRole) => {
    switch (role) {
      case 'owner':
        return <Badge variant="warning" className="text-xs">Owner</Badge>;
      case 'edit':
        return <Badge variant="default" className="text-xs">Edit</Badge>;
      case 'view':
        return <Badge variant="secondary" className="text-xs">View</Badge>;
    }
  };

  const groupedMembers = {
    owner: members.filter(m => m.role === 'owner'),
    edit: members.filter(m => m.role === 'edit'),
    view: members.filter(m => m.role === 'view'),
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="w-4 h-4 text-warning" />
            Access Control
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedMembers).map(([role, roleMembers]) => (
          roleMembers.length > 0 && (
            <div key={role} className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getRoleIcon(role as AccessRole)}
                <span className="capitalize">{role === 'edit' ? 'Can Edit' : role === 'view' ? 'View Only' : 'Owner'}</span>
                <span className="text-xs">({roleMembers.length})</span>
              </div>
              <div className="space-y-1">
                {roleMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary/20 text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(member.role)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove Access</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </CardContent>
    </Card>
  );
}
