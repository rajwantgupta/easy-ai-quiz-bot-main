import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Settings,
  Filter,
  Search
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Module Completed',
      message: 'You have successfully completed the Customer Service Basics module.',
      timestamp: '2024-03-15T10:30:00',
      read: false,
      action: {
        label: 'View Certificate',
        onClick: () => console.log('View certificate')
      }
    },
    {
      id: '2',
      type: 'warning',
      title: 'Upcoming Deadline',
      message: 'Product Knowledge assessment is due in 2 days.',
      timestamp: '2024-03-15T09:15:00',
      read: false,
      action: {
        label: 'Start Assessment',
        onClick: () => console.log('Start assessment')
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'New Module Available',
      message: 'Advanced Customer Service Techniques is now available.',
      timestamp: '2024-03-14T15:45:00',
      read: true,
      action: {
        label: 'Enroll Now',
        onClick: () => console.log('Enroll in module')
      }
    }
  ]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const filteredNotifications = showAll
    ? notifications
    : notifications.filter(notification => !notification.read);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Unread' : 'Show All'}
          </Button>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={notification.read ? 'opacity-75' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {notification.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={notification.action.onClick}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications to display</p>
          </div>
        )}
      </div>
    </div>
  );
}; 