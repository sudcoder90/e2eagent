import { useState } from 'react';
import { ProjectMember, AccessRole } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Pencil, 
  Eye,
  UserPlus,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AccessControlPanelHorizontalProps {
  members: ProjectMember[];
}

const COLLAPSED_LIMIT = 3;

export function AccessControlPanelHorizontal({ members }: AccessControlPanelHorizontalProps) {
  const [expanded, setExpanded] = useState(false);

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

  const totalMembers = members.length;
  const needsCollapse = totalMembers > COLLAPSED_LIMIT;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Crown className="w-5 h-5 text-warning" />
            Access Control
          </h3>
          <Badge variant="secondary" className="text-xs">{totalMembers} member{totalMembers !== 1 ? 's' : ''}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {/* Stacked avatar preview */}
          {!expanded && needsCollapse && (
            <TooltipProvider>
              <div className="flex items-center -space-x-2 mr-2">
                {members.slice(0, 4).map((member) => (
                  <Tooltip key={member.id}>
                    <TooltipTrigger asChild>
                      <Avatar className="w-7 h-7 border-2 border-card">
                        <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {member.name} · {roleLabels[member.role]}
                    </TooltipContent>
                  </Tooltip>
                ))}
                {totalMembers > 4 && (
                  <Avatar className="w-7 h-7 border-2 border-card">
                    <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                      +{totalMembers - 4}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </TooltipProvider>
          )}
          {needsCollapse && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="gap-1 text-xs text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? 'Collapse' : 'View All'}
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        </div>
      </div>
      
      {/* Collapsed: compact summary row */}
      {!expanded && needsCollapse && (
        <div className="flex flex-wrap gap-4">
          {Object.entries(groupedMembers).map(([role, roleMembers]) => (
            roleMembers.length > 0 && (
              <div key={role} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                {getRoleIcon(role as AccessRole)}
                <span className="text-sm text-muted-foreground">{roleLabels[role as AccessRole]}</span>
                <Badge variant="outline" className="text-xs">{roleMembers.length}</Badge>
              </div>
            )
          ))}
        </div>
      )}

      {/* Expanded or few members: full detail view */}
      {(expanded || !needsCollapse) && (
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
      )}
    </div>
  );
}