import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Timer, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
};

type UserAnswer = {
  questionId: string;
  selectedOption: number | null;
};

const QuizAttempt = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // In a real app, this would fetch from a backend API
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        const targetQuiz = savedQuizzes.find((q: any) => q.id === id);
        
        if (!targetQuiz) {
          toast.error("Quiz not found");
          navigate("/dashboard");
          return;
        }
        
        setQuiz(targetQuiz);
        
        // Check if user has already completed this quiz
        const userResults = JSON.parse(localStorage.getItem(`results-${user?.id}`) || "[]");
        const existingResult = userResults.find((r: any) => r.quizId === id);
        
        if (existingResult) {
          setQuizSubmitted(true);
          setQuizResult({
            score: existingResult.score,
            passed: existingResult.passed
          });
          setReviewMode(true);
          
          // Pre-fill answers for review mode
          setUserAnswers(targetQuiz.questions.map((q: Question, index: number) => ({
            questionId: q.id,
            selectedOption: existingResult.answers[index]
          })));
        } else {
          // Initialize blank answers for fresh quiz attempt
          setUserAnswers(targetQuiz.questions.map((q: Question) => ({
            questionId: q.id,
            selectedOption: null
          })));
          
          // Set timer - 2 minutes per question with a maximum of 30 minutes
          const calculatedTime = Math.min(targetQuiz.questions.length * 2 * 60, 30 * 60);
          setRemainingTime(calculatedTime);
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast.error("Failed to load quiz data");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    if (user && id) {
      loadQuiz();
    }
    
    return () => {
      // Clean up any timers if component unmounts
    };
  }, [id, user, navigate]);
  
  // Timer countdown
  useEffect(() => {
    let timer: number | null = null;
    
    if (remainingTime && remainingTime > 0 && !quizSubmitted) {
      timer = window.setInterval(() => {
        setRemainingTime(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            // Auto-submit when time runs out
            submitQuiz();
            return 0;
          }
        });
      }, 1000);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [remainingTime, quizSubmitted]);

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => 
      prev.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, selectedOption: optionIndex } 
          : answer
      )
    );
  };

  const moveToQuestion = (index: number) => {
    if (index >= 0 && quiz && index < quiz.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const submitQuiz = () => {
    if (!quiz || !user) return;
    
    try {
      // Calculate score
      let correctAnswers = 0;
      
      quiz.questions.forEach((question, index) => {
        if (userAnswers[index].selectedOption === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      const score = Math.round((correctAnswers / quiz.questions.length) * 100);
      const passed = score >= quiz.passingScore;
      
      setQuizResult({ score, passed });
      setQuizSubmitted(true);
      
      // Save result
      const userResults = JSON.parse(localStorage.getItem(`results-${user.id}`) || "[]");
      userResults.push({
        quizId: quiz.id,
        score,
        passed,
        completedAt: new Date().toISOString(),
        answers: userAnswers.map(answer => answer.selectedOption)
      });
      localStorage.setItem(`results-${user.id}`, JSON.stringify(userResults));
      
      if (passed) {
        toast.success(`Congratulations! You passed with ${score}%`);
      } else {
        toast.error(`Quiz completed. Your score: ${score}%. Required: ${quiz.passingScore}%`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz. Please try again.");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!user || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Quiz Not Found</h1>
            <p className="mb-4">The quiz you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestionIndex];
  const unansweredCount = userAnswers.filter(a => a.selectedOption === null).length;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  if (quizSubmitted && quizResult) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quiz Results: {quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="p-6 text-center border rounded-lg bg-gray-50">
                  <h2 className="text-2xl font-bold mb-2">Your Score</h2>
                  <div className="text-5xl font-bold mb-4">
                    {quizResult.score}%
                  </div>
                  <Progress value={quizResult.score} className="h-3" />
                  <p className="mt-4 text-gray-600">
                    Passing score: {quiz.passingScore}%
                  </p>
                </div>
                
                {quizResult.passed ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">Congratulations!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      You've successfully passed this quiz. Your certificate has been issued.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-red-50 border-red-200">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <AlertTitle className="text-red-800">Not Passed</AlertTitle>
                    <AlertDescription className="text-red-700">
                      You didn't achieve the minimum passing score. You can review your answers or try again later.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <Button onClick={() => setReviewMode(true)} variant="outline">
                    Review Answers
                  </Button>
                  
                  {quizResult.passed && (
                    <Button onClick={() => navigate(`/certificate/${quiz.id}`)}>
                      View Certificate
                    </Button>
                  )}
                  
                  <Button onClick={() => navigate("/dashboard")} variant="secondary">
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {reviewMode && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Question Review</h2>
                
                {quiz.questions.map((question, index) => {
                  const userAnswer = userAnswers[index].selectedOption;
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <Card 
                      key={question.id}
                      className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
                    >
                      <CardContent className="pt-6">
                        <div className="font-medium mb-3">
                          Question {index + 1}: {question.question}
                        </div>
                        
                        <div className="space-y-3 pl-4">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex}
                              className={`p-3 rounded-md ${
                                optIndex === question.correctAnswer
                                  ? 'bg-green-50 border border-green-200'
                                  : userAnswer === optIndex
                                    ? 'bg-red-50 border border-red-200'
                                    : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="mr-2">
                                  {String.fromCharCode(65 + optIndex)}.
                                </div>
                                <div>{option}</div>
                              </div>
                              
                              {optIndex === question.correctAnswer && (
                                <div className="text-sm text-green-600 mt-2 pl-6">
                                  Correct Answer
                                </div>
                              )}
                              
                              {userAnswer === optIndex && userAnswer !== question.correctAnswer && (
                                <div className="text-sm text-red-600 mt-2 pl-6">
                                  Your Answer
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                <div className="flex justify-end pt-4">
                  <Button onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription className="mt-1">{quiz.description}</CardDescription>
                </div>
                
                {remainingTime !== null && (
                  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md text-gray-700 mt-4 sm:mt-0">
                    <Timer className="mr-2 h-5 w-5 text-gray-500" />
                    <span className="font-medium">{formatTime(remainingTime)}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </div>
                <div className="text-sm">
                  {unansweredCount} unanswered
                </div>
              </div>
              
              <Progress 
                value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} 
                className="h-2 mb-8" 
              />
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {currentQuestion.question}
                </h2>
                
                <RadioGroup
                  value={currentAnswer.selectedOption?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(currentAnswer.questionId, parseInt(value, 10))}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center border rounded-md p-4 hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        className="mr-3"
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-grow cursor-pointer"
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex justify-between">
                <Button
                  onClick={() => moveToQuestion(currentQuestionIndex - 1)}
                  variant="outline"
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {isLastQuestion ? (
                  <Button 
                    onClick={submitQuiz}
                    disabled={unansweredCount > 0}
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() => moveToQuestion(currentQuestionIndex + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
              
              {unansweredCount > 0 && isLastQuestion && (
                <Alert className="mt-6" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    You still have {unansweredCount} unanswered question(s). Please answer all questions before submitting.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {quiz.questions.map((_, index) => {
              const isAnswered = userAnswers[index].selectedOption !== null;
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => moveToQuestion(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : isAnswered
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="text-center">
            <Button onClick={submitQuiz} disabled={unansweredCount > 0}>
              Submit Quiz
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizAttempt;
