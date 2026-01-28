import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Clock, Users, Calendar, FileText, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useActivities, ActivityDB } from '@/hooks/useActivities';
import { formatDistanceToNow } from 'date-fns';

const getActivityIcon = (entityType: string) => {
  switch (entityType) {
    case 'cohort':
      return Users;
    case 'candidate':
      return Users;
    case 'effort':
      return Clock;
    case 'report':
      return FileText;
    default:
      return Info;
  }
};

const getActivityColor = (action: string) => {
  if (action.includes('create') || action.includes('add')) return 'text-success';
  if (action.includes('update') || action.includes('edit')) return 'text-info';
  if (action.includes('delete') || action.includes('remove')) return 'text-destructive';
  return 'text-primary';
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: activities, isLoading } = useActivities(10);

  useEffect(() => {
    if (activities) {
      // Count activities from the last 24 hours as "unread"
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentCount = activities.filter(
        (a) => new Date(a.created_at) > dayAgo
      ).length;
      setUnreadCount(recentCount);
    }
  }, [activities]);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 border-border/50 bg-background/95 p-0 backdrop-blur-xl"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : activities && activities.length > 0 ? (
            <AnimatePresence>
              {activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.entity_type);
                const colorClass = getActivityColor(activity.action);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 border-b border-border/30 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground line-clamp-2">
                        <span className="font-medium capitalize">{activity.action.replace(/_/g, ' ')}</span>
                        {' '}on{' '}
                        <span className="capitalize">{activity.entity_type}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </div>

        <div className="border-t border-border/50 p-2">
          <button className="w-full rounded-lg py-2 text-center text-sm font-medium text-primary hover:bg-muted">
            View all activity
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};