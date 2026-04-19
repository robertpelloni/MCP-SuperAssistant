import type React from 'react';
import { useState } from 'react';
import { useProfileStore, type ConnectionProfile } from '@src/stores/profile.store';
import { useConnectionStore } from '@src/stores/connection.store';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Typography, Icon, Button, Input, Select } from '../ui';
import { cn } from '@src/lib/utils';
import { useToastStore } from '@src/stores/toast.store';

const ServerProfiles: React.FC = () => {
  const { profiles, activeProfileId, addProfile, removeProfile, updateProfile, setActiveProfile } = useProfileStore();
  const { setServerConfig } = useConnectionStore();
  const { addToast } = useToastStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [uri, setUri] = useState('');
  const [type, setType] = useState<'sse' | 'websocket'>('sse');

  const handleEdit = (profile: ConnectionProfile) => {
    setEditingId(profile.id);
    setName(profile.name);
    setUri(profile.uri);
    setType(profile.connectionType as any);
    setIsCreating(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setName('');
    setUri('http://localhost:3006/sse');
    setType('sse');
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!name.trim() || !uri.trim()) {
      addToast({ title: 'Validation Error', message: 'Name and URI are required', type: 'error' });
      return;
    }

    if (editingId) {
      updateProfile(editingId, { name, uri, connectionType: type });
      addToast({ title: 'Updated', message: 'Profile updated', type: 'success' });
    } else {
      addProfile({ name, uri, connectionType: type });
      addToast({ title: 'Created', message: 'New profile created', type: 'success' });
    }
    setIsCreating(false);
  };

  const handleActivate = (profile: ConnectionProfile) => {
    setActiveProfile(profile.id);
    // Update the actual connection config to trigger a reconnect in McpClient
    setServerConfig({
      uri: profile.uri,
      connectionType: profile.connectionType,
    });
    addToast({ title: 'Switched', message: `Switched to ${profile.name}`, type: 'success' });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeProfileId === id) {
      addToast({ title: 'Error', message: 'Cannot delete active profile', type: 'error' });
      return;
    }
    if (confirm('Delete this profile?')) {
      removeProfile(id);
    }
  };

  if (isCreating) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 flex flex-row justify-between items-center">
          <CardTitle className="text-sm font-semibold">{editingId ? 'Edit Profile' : 'New Profile'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Local Server"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">URI</label>
            <Input
              value={uri}
              onChange={e => setUri(e.target.value)}
              placeholder="http://localhost:3006/sse"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 p-2 text-slate-900 dark:text-slate-100">
              <option value="sse">SSE</option>
              <option value="websocket">WebSocket</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end">
            <Button size="sm" onClick={handleSave} className="bg-primary-600 text-white">
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-100 dark:bg-primary-900/30 rounded text-primary-600 dark:text-primary-400">
            <Icon name="server" size="sm" />
          </div>
          <CardTitle className="text-base font-medium">Server Profiles</CardTitle>
        </div>
        <Button size="sm" variant="outline" onClick={handleCreate}>
          <Icon name="plus" size="xs" className="mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {profiles.map(profile => (
            <div
              key={profile.id}
              className={cn(
                'p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                activeProfileId === profile.id &&
                  'bg-primary-50/50 dark:bg-primary-900/10 border-l-4 border-primary-500',
              )}>
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleActivate(profile)}>
                <div className="flex items-center gap-2">
                  <Typography variant="subtitle" className="font-medium text-slate-900 dark:text-slate-100">
                    {profile.name}
                  </Typography>
                  {activeProfileId === profile.id && (
                    <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-1.5 py-0.5 rounded uppercase font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-2 mt-0.5">
                  <span className="uppercase text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded">
                    {profile.connectionType}
                  </span>
                  {profile.uri}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-primary-600"
                  onClick={() => handleEdit(profile)}>
                  <Icon name="edit" size="xs" />
                </Button>
                {activeProfileId !== profile.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-red-600"
                    onClick={e => handleDelete(profile.id, e)}>
                    <Icon name="trash" size="xs" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerProfiles;
