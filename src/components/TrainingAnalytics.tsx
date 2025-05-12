import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp,
  Users,
  Clock,
  Award,
  Target,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

interface AnalyticsData {
  timeSpent: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  completionRates: {
    byModule: { [key: string]: number };
    byDepartment: { [key: string]: number };
  };
  performance: {
    averageScores: number[];
    topPerformers: string[];
    improvementRate: number;
  };
  engagement: {
    activeUsers: number;
    participationRate: number;
    feedbackScore: number;
  };
}

export const TrainingAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    timeSpent: {
      daily: [2, 3, 4, 2, 5, 3, 4],
      weekly: [15, 18, 20, 22, 19, 21, 23],
      monthly: [65, 70, 75, 80, 85, 90, 95]
    },
    completionRates: {
      byModule: {
        'Company Policies': 85,
        'Customer Service': 75,
        'Product Knowledge': 90,
        'Safety Training': 95
      },
      byDepartment: {
        'Sales': 88,
        'Support': 92,
        'Development': 85,
        'Marketing': 78
      }
    },
    performance: {
      averageScores: [75, 78, 82, 85, 88, 90, 92],
      topPerformers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      improvementRate: 15
    },
    engagement: {
      activeUsers: 120,
      participationRate: 85,
      feedbackScore: 4.5
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Training Analytics</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-medium">
              <Users className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.engagement.activeUsers}</div>
            <p className="text-xs text-gray-500">Currently engaged in training</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-medium">
              <Clock className="h-4 w-4 mr-2" />
              Average Time Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.timeSpent[timeRange].reduce((a, b) => a + b, 0) / 
               analyticsData.timeSpent[timeRange].length} hrs
            </div>
            <p className="text-xs text-gray-500">Per {timeRange} basis</p>
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
            <div className="text-2xl font-bold">
              {Object.values(analyticsData.completionRates.byModule)
                .reduce((a, b) => a + b, 0) / 
                Object.keys(analyticsData.completionRates.byModule).length}%
            </div>
            <p className="text-xs text-gray-500">Average across all modules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-2" />
              Improvement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performance.improvementRate}%</div>
            <p className="text-xs text-gray-500">Score improvement over time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Module Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analyticsData.completionRates.byModule).map(([module, rate]) => (
                <div key={module}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{module}</span>
                    <span>{rate}%</span>
                  </div>
                  <Progress value={rate} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analyticsData.completionRates.byDepartment).map(([dept, rate]) => (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{dept}</span>
                    <span>{rate}%</span>
                  </div>
                  <Progress value={rate} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.performance.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium">{performer}</div>
                  <div className="text-sm text-gray-500">Score: {95 - index * 2}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 