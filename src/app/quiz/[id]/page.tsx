import React from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface QuizPageProps {
  params: {
    id: string;
  };
  searchParams: {
    accessCode?: string;
  };
}

export default function QuizPage({ params, searchParams }: QuizPageProps) {
  const { id } = params;
  const { accessCode } = searchParams;

  // In a real application, you would validate the access code and fetch quiz data
  // For now, we'll just show a placeholder
  if (!accessCode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="mr-2 h-5 w-5" />
                Invalid Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This quiz requires a valid access code. Please scan the QR code again or contact the quiz administrator.
              </p>
              <Button
                onClick={() => window.location.href = '/scan'}
                className="w-full"
              >
                Back to Scanner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Welcome to the quiz! This is a placeholder for the actual quiz content.
              In a real application, you would see the quiz questions here.
            </p>
            <div className="space-y-4">
              <Button className="w-full">
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 