import { ProjectMember, AccessRole } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface AccessControlPanelHorizontalProps {
  members: ProjectMember[];
}

export function AccessControlPanelHorizontal({ members }: AccessControlPanelHorizontalProps) {
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

  const roleLabels: Record<AccessRole, string> = {
    owner: 'Owner',
    edit: 'Can Edit',
    view: 'View Only',
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Crown className="w-5 h-5 text-warning" />
          Access Control
        </h3>
        <Button size="sm" variant="outline" className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-6">
        {Object.entries(groupedMembers).map(([role, roleMembers]) => (
          roleMembers.length > 0 && (
            <div key={role} className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 pb-2 border-b border-border/50">
                {getRoleIcon(role as AccessRole)}
                <span>{roleLabels[role as AccessRole]}</span>
                <span className="text-xs">({roleMembers.length})</span>
              </div>
              <div className="space-y-2">
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
      </div>
    </div>
  );
}