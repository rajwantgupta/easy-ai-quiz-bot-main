import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Clock, 
  Award,
  Target,
  Download,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  BarChart,
  LineChart,
  PieChart,
  MessageSquare,
  Share2
} from 'lucide-react';
import { TrainingAnalytics } from './TrainingAnalytics';
import { TeamCollaboration } from './TeamCollaboration';
import { NotificationSystem } from './NotificationSystem';

interface TrainingStats {
  totalUsers: number;
  activeUsers: number;
  completedModules: number;
  averageScore: number;
  upcomingDeadlines: number;
}

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'draft' | 'archived';
  enrolledUsers: number;
  completionRate: number;
  averageScore: number;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

interface UpcomingDeadline {
  id: string;
  module: string;
  department: string;
  daysLeft: number;
  status: 'urgent' | 'normal';
}

interface User {
  id: string;
  name: string;
  department: string;
  completedModules: number;
  averageScore: number;
  status: 'active' | 'inactive';
}

export const TrainingAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<TrainingStats>({
    totalUsers: 150,
    activeUsers: 120,
    completedModules: 45,
    averageScore: 85,
    upcomingDeadlines: 5
  });

  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: '1',
      title: 'Customer Service Basics',
      category: 'Customer Service',
      status: 'active',
      enrolledUsers: 45,
      completionRate: 75,
      averageScore: 88
    },
    {
      id: '2',
      title: 'Product Knowledge',
      category: 'Sales',
      status: 'active',
      enrolledUsers: 38,
      completionRate: 82,
      averageScore: 85
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      user: 'John Doe',
      action: 'Completed Customer Service Basics',
      timestamp: '2024-03-15T10:30:00'
    },
    {
      id: '2',
      user: 'Jane Smith',
      action: 'Started Product Knowledge',
      timestamp: '2024-03-15T09:15:00'
    }
  ]);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([
    {
      id: '1',
      module: 'Customer Service Basics',
      department: 'Support',
      daysLeft: 2,
      status: 'urgent'
    },
    {
      id: '2',
      module: 'Product Knowledge',
      department: 'Sales',
      daysLeft: 5,
      status: 'normal'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      department: 'Support',
      completedModules: 3,
      averageScore: 92,
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      department: 'Sales',
      completedModules: 2,
      averageScore: 88,
      status: 'active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Administration</h2>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Module
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm font-medium">
                      <Users className="h-4 w-4 mr-2" />
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeUsers}</div>
                    <p className="text-xs text-gray-500">Currently engaged in training</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm font-medium">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Total Modules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{modules.length}</div>
                    <p className="text-xs text-gray-500">Available training modules</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      Average Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.5 hrs</div>
                    <p className="text-xs text-gray-500">Time spent per module</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm font-medium">
                      <Award className="h-4 w-4 mr-2" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageScore}%</div>
                    <p className="text-xs text-gray-500">Average across all modules</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {activity.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{activity.user}</p>
                            <p className="text-sm text-gray-500">{activity.action}</p>
                            <p className="text-xs text-gray-400">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingDeadlines.map((deadline) => (
                        <div key={deadline.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{deadline.module}</p>
                            <p className="text-sm text-gray-500">{deadline.department}</p>
                          </div>
                          <Badge variant={deadline.status === 'urgent' ? 'destructive' : 'default'}>
                            {deadline.daysLeft} days left
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="modules" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <p className="text-sm text-gray-500">{module.category}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{module.completionRate}%</span>
                        </div>
                        <Progress value={module.completionRate} />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-medium">{module.enrolledUsers} hours</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status</span>
                          <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                            {module.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <p className="text-sm text-gray-500">{user.department}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Completed Modules</span>
                          <span className="font-medium">{user.completedModules}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Average Score</span>
                          <span className="font-medium">{user.averageScore}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status</span>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <Button variant="outline" size="sm">
                            View Progress
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <TrainingAnalytics />
            </TabsContent>

            <TabsContent value="collaboration">
              <TeamCollaboration />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <NotificationSystem />
        </div>
      </div>
    </div>
  );
}; 