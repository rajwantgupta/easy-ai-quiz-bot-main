import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Award, 
  Users, 
  BarChart, 
  Clock, 
  Star,
  Calendar,
  Target,
  Bookmark,
  Share2
} from 'lucide-react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  category: string;
  dueDate?: string;
  required: boolean;
}

export const EmployeeTraining: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [modules, setModules] = useState<TrainingModule[]>([
    {
      id: '1',
      title: 'Company Policies & Procedures',
      description: 'Learn about company policies, procedures, and compliance requirements.',
      duration: '2 hours',
      progress: 0,
      status: 'not_started',
      category: 'compliance',
      required: true,
      dueDate: '2024-06-01'
    },
    {
      id: '2',
      title: 'Customer Service Excellence',
      description: 'Master customer service skills and best practices.',
      duration: '1.5 hours',
      progress: 75,
      status: 'in_progress',
      category: 'skills',
      required: true
    },
    {
      id: '3',
      title: 'Product Knowledge',
      description: 'Deep dive into our products and services.',
      duration: '3 hours',
      progress: 100,
      status: 'completed',
      category: 'product',
      required: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'compliance':
        return <BookOpen className="h-4 w-4" />;
      case 'skills':
        return <Star className="h-4 w-4" />;
      case 'product':
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Training</h2>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Training
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="required">Required</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {module.title}
                  {module.required && (
                    <Badge variant="destructive" className="ml-2">Required</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(module.category)}
                  <Badge className={getStatusColor(module.status)}>
                    {module.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{module.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} />
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {module.duration}
                    </div>
                    {module.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {new Date(module.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm">
                    {module.status === 'completed' ? 'Review' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Team Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Overall Completion</span>
                <span>75%</span>
              </div>
              <Progress value={75} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge>Fast Learner</Badge>
              <Badge>Perfect Score</Badge>
              <Badge>Team Player</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average Score</span>
                <span>85%</span>
              </div>
              <div className="flex justify-between">
                <span>Time Spent</span>
                <span>12.5 hrs</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 