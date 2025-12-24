'use client';

import {
  Bell,
  Calendar,
  AlertTriangle,
  FileText,
  Settings as SettingsIcon,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/* ---------------------------------- */
/* TYPES */
/* ---------------------------------- */
type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'entity' | 'system' | 'compliance' | 'document';
  priority?: 'high' | 'medium' | 'low';
  read: boolean;
  created_at: string;
  action_url?: string;
  metadata?: any;
};

function NotificationSkeleton() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-6 h-6 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------- */
  /* FETCH + GENERATE */
  /* ---------------------------------- */
  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    if (!res.ok) return;
    const data = await res.json();
    setNotifications(data.notifications ?? []);
  };

  useEffect(() => {
    const init = async () => {
      // 🔥 REQUIRED
      await fetch('/api/notifications/generate', { method: 'POST' });

      // fetch after generate
      await fetchNotifications();
      setLoading(false);
    };

    init();
  }, []);

  /* ---------------------------------- */
  /* ACTIONS */
  /* ---------------------------------- */
  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'PATCH' });

    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  /* ---------------------------------- */
  /* HELPERS */
  /* ---------------------------------- */
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'deadline':
        return Calendar;
      case 'compliance':
        return AlertTriangle;
      case 'document':
        return FileText;
      case 'entity':
        return Users;
      case 'system':
        return SettingsIcon;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (p?: string) =>
    p === 'high'
      ? 'bg-red-500/10 text-red-500'
      : p === 'medium'
      ? 'bg-yellow-500/10 text-yellow-500'
      : 'bg-green-500/10 text-green-500';

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */
  if (loading) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 animate-pulse text-muted-foreground" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

          <div className="space-y-4">
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        </div>
      );
    }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unread.length} unread
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" onClick={markAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {unread.map(n => {
        const Icon = getIcon(n.type);
        return (
          <Card
            key={n.id}
            className="p-4 cursor-pointer hover:shadow"
            onClick={() => markRead(n.id)}
          >
            <div className="flex gap-4">
              <Icon className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{n.title}</h3>
                  {n.priority && (
                    <Badge className={getPriorityColor(n.priority)}>
                      {n.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </Card>
        );
      })}

      {read.length > 0 && (
        <>
          <h2 className="text-lg font-semibold">Earlier</h2>
          {read.map(n => {
            const Icon = getIcon(n.type);
            return (
              <Card key={n.id} className="p-4 opacity-60">
                <div className="flex gap-4">
                  <Icon className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">{n.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {n.message}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}

      {notifications.length === 0 && (
        <Card className="p-12 text-center">
          <Bell className="w-10 h-10 mx-auto mb-3" />
          <p>No notifications yet</p>
        </Card>
      )}
    </div>
  );
}