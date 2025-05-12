import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  questions: Question[];
};

const EditQuiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadQuiz = () => {
      try {
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        const foundQuiz = savedQuizzes.find((q: Quiz) => q.id === quizId);
        if (foundQuiz) {
          setQuiz(foundQuiz);
        } else {
          toast.error("Quiz not found");
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuiz(prev => {
      if (!prev) return null;
      if (name === 'passingScore') {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return prev;
        return { ...prev, [name]: numValue };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    setQuiz(prev => {
      if (!prev) return null;
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuiz(prev => {
      if (!prev) return null;
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].options[optionIndex] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleCorrectAnswerChange = (questionIndex: number, value: number) => {
    setQuiz(prev => {
      if (!prev) return null;
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].correctAnswer = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const validateQuiz = (quiz: Quiz | null): boolean => {
    if (!quiz) {
      toast.error("Quiz data is missing");
      return false;
    }

    // Validate basic quiz properties
    if (!quiz.title || !quiz.title.trim()) {
      toast.error("Please enter a quiz title");
      return false;
    }

    if (!quiz.description || !quiz.description.trim()) {
      toast.error("Please enter a quiz description");
      return false;
    }

    // Validate passing score
    const passingScore = Number(quiz.passingScore);
    if (isNaN(passingScore) || passingScore < 0 || passingScore > 100) {
      toast.error("Passing score must be between 0 and 100");
      return false;
    }

    // Validate questions array
    if (!Array.isArray(quiz.questions) || !quiz.questions.length) {
      toast.error("Quiz must have at least one question");
      return false;
    }

    // Validate each question
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      
      if (!question || typeof question !== 'object') {
        toast.error(`Question ${i + 1} is invalid`);
        return false;
      }

      if (!question.text || !question.text.trim()) {
        toast.error(`Question ${i + 1} text cannot be empty`);
        return false;
      }

      if (!Array.isArray(question.options) || question.options.length < 2) {
        toast.error(`Question ${i + 1} must have at least 2 options`);
        return false;
      }

      // Validate each option
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j] || !question.options[j].trim()) {
          toast.error(`Question ${i + 1}, Option ${j + 1} cannot be empty`);
          return false;
        }
      }

      // Validate correct answer
      if (typeof question.correctAnswer !== 'number' || 
          question.correctAnswer < 0 || 
          question.correctAnswer >= question.options.length) {
        toast.error(`Question ${i + 1} must have a valid correct answer`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!quiz) {
      toast.error("No quiz data to save");
      return;
    }

    if (!validateQuiz(quiz)) {
      return;
    }

    setIsSaving(true);

    try {
      const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
      const updatedQuizzes = savedQuizzes.map((q: Quiz) => (q.id === quiz.id ? quiz : q));
      localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
      toast.success("Quiz updated successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
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
            <Button onClick={() => navigate("/admin")}>Go Back</Button>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Edit Quiz</h1>
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <Input
                    name="title"
                    value={quiz.title}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    name="description"
                    value={quiz.description}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                  <Input
                    name="passingScore"
                    type="number"
                    min="0"
                    max="100"
                    value={quiz.passingScore}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Questions</h2>
                  {quiz.questions.map((question, qIndex) => (
                    <Card key={question.id} className="mb-4">
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Question Text</label>
                            <Input
                              value={question.text}
                              onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                              className="mt-1"
                              disabled={isSaving}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Options</label>
                            {question.options.map((option, oIndex) => (
                              <Input
                                key={oIndex}
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                className="mt-1 mb-2"
                                disabled={isSaving}
                              />
                            ))}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Correct Answer (Index)</label>
                            <Input
                              type="number"
                              min="0"
                              max={question.options.length - 1}
                              value={question.correctAnswer}
                              onChange={(e) => handleCorrectAnswerChange(qIndex, parseInt(e.target.value))}
                              className="mt-1"
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button 
                  onClick={handleSave} 
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditQuiz; 