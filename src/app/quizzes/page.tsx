import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ClipboardList,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';

const mockQuizzes = [
  {
    id: '1',
    title: 'Safety Procedures Quiz',
    status: 'completed',
    score: 85,
    totalQuestions: 20,
    completedAt: '2024-03-15T10:30:00Z',
    certificate: true,
  },
  {
    id: '2',
    title: 'Emergency Response Training',
    status: 'in_progress',
    score: 60,
    totalQuestions: 15,
    completedAt: null,
    certificate: false,
  },
  {
    id: '3',
    title: 'Equipment Operation Quiz',
    status: 'not_started',
    score: 0,
    totalQuestions: 25,
    completedAt: null,
    certificate: false,
  },
];

export default function UserQuizzes() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-gray-600 mt-2">
            Track your progress and access your certificates.
          </p>
        </div>

        {/* Quiz List */}
        <div className="space-y-4">
          {mockQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{quiz.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        {quiz.totalQuestions} Questions
                      </div>
                      {quiz.completedAt && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(quiz.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end space-y-2">
                    {quiz.status === 'completed' ? (
                      <>
                        <div className="flex items-center space-x-2">
                          {quiz.score >= 70 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-semibold">{quiz.score}%</span>
                        </div>
                        {quiz.certificate && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-primary"
                            onClick={() => window.location.href = `/certificates/${quiz.id}`}
                          >
                            <Award className="h-4 w-4 mr-2" />
                            View Certificate
                          </Button>
                        )}
                      </>
                    ) : quiz.status === 'in_progress' ? (
                      <div className="w-full md:w-48">
                        <Progress value={quiz.score} className="h-2" />
                        <p className="text-sm text-gray-600 mt-1">
                          {quiz.score}% Complete
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => window.location.href = `/quiz/${quiz.id}`}
                      >
                        Start Quiz
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Scan Quiz QR Code</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Have a quiz QR code? Scan it to start a new quiz.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
                    onClick={() => window.location.href = '/scan'}
                  >
                    Go to Scanner
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">View Certificates</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Access all your earned certificates in one place.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
                    onClick={() => window.location.href = '/certificates'}
                  >
                    View Certificates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 