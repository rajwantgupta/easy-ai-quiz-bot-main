import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  quiz: {
    id: string;
    title: string;
    questions: Question[];
    passingScore: number;
    attempts: number;
    bestScore: number;
  };
  onSubmit: (answers: number[]) => void;
}

export const TrainingQuiz: React.FC<QuizProps> = ({ quiz, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const question = quiz.questions[currentQuestion];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          <div className="text-sm text-gray-500">
            Best Score: {quiz.bestScore}%
          </div>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            <RadioGroup
              value={answers[currentQuestion].toString()}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion < quiz.questions.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 