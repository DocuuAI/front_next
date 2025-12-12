'use client';
import { Bell, Calendar, AlertTriangle, FileText, Settings as SettingsIcon, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';

export default function Notifications() {
    const markNotificationRead= useAppStore((s) => s.markNotificationRead);
    const notifications = useAppStore((s) => s.notifications);
  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline': return Calendar;
      case 'compliance': return AlertTriangle;
      case 'document': return FileText;
      case 'system': return SettingsIcon;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'deadline': return 'text-yellow-500 bg-yellow-500/10';
      case 'compliance': return 'text-red-500 bg-red-500/10';
      case 'document': return 'text-blue-500 bg-blue-500/10';
      case 'system': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadNotifications.length} unread notifications
          </p>
        </div>
        <Button variant="outline">
          Mark All as Read
        </Button>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Unread</h2>
          {unreadNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const iconColor = getIconColor(notification.type);

            return (
              <Card
                key={notification.id}
                className="p-4 bg-card border-border hover:shadow-lg transition-all cursor-pointer"
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </span>
                      {notification.actionUrl && (
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Earlier</h2>
          {readNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const iconColor = getIconColor(notification.type);

            return (
              <Card
                key={notification.id}
                className="p-4 bg-card border-border opacity-60 hover:opacity-100 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {notification.title}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {notification.message}
                    </p>
                    
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {notifications.length === 0 && (
        <Card className="p-12 bg-card border-border text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No notifications
          </h3>
          <p className="text-sm text-muted-foreground">
            You're all caught up! Check back later for updates.
          </p>
        </Card>
      )}
    </div>
  );
}