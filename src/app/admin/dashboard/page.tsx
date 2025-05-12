import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  ClipboardList,
  Users,
  Award,
  ArrowRight,
  BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const workflowSteps = [
  {
    title: 'Create SOP',
    description: 'Upload your SOP document or create a new one',
    icon: <FileText className="h-6 w-6" />,
    href: '/admin/sops/new',
  },
  {
    title: 'Generate Quiz',
    description: 'Convert your SOP into an interactive quiz',
    icon: <ClipboardList className="h-6 w-6" />,
    href: '/admin/quizzes/new',
  },
  {
    title: 'Share Quiz',
    description: 'Share quiz with candidates via QR code or link',
    icon: <Users className="h-6 w-6" />,
    href: '/admin/quizzes/share',
  },
  {
    title: 'Track Results',
    description: 'Monitor candidate performance and generate certificates',
    icon: <Award className="h-6 w-6" />,
    href: '/admin/analytics',
  },
];

const stats = [
  {
    title: 'Total SOPs',
    value: '12',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Active Quizzes',
    value: '8',
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: 'Total Candidates',
    value: '156',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Certificates Issued',
    value: '89',
    icon: <Award className="h-5 w-5" />,
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <MainLayout userRole="admin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your quiz management system.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Steps */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step) => (
              <Card key={step.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      <Button
                        variant="ghost"
                        className="mt-4 p-0 h-auto text-primary hover:text-primary/80"
                        onClick={() => router.push(step.href)}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Certificate Issued</p>
                      <p className="text-sm text-gray-600">John Doe completed the Safety Quiz</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <ClipboardList className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Quiz Created</p>
                      <p className="text-sm text-gray-600">Emergency Response Quiz</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">5 hours ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Candidate Registered</p>
                      <p className="text-sm text-gray-600">Sarah Smith joined the platform</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 