import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

type QuizFormProps = {
  questions: Question[];
};

const QuizForm = ({ questions }: QuizFormProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Assessment Quiz");
  const [description, setDescription] = useState("Quiz generated from uploaded document");
  const [passingScore, setPassingScore] = useState(75);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, boolean>>(
    Object.fromEntries(questions.map(q => [q.id, true]))
  );

  const handleQuestionToggle = (questionId: string, checked: boolean) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [questionId]: checked
    }));
  };

  const handleCreateQuiz = () => {
    try {
      const filteredQuestions = questions.filter(q => selectedQuestions[q.id]);
      
      if (filteredQuestions.length < 5) {
        toast.error("Please select at least 5 questions for the quiz");
        return;
      }
      
      if (!title.trim()) {
        toast.error("Please enter a quiz title");
        return;
      }
      
      if (passingScore < 0 || passingScore > 100) {
        toast.error("Passing score must be between 0 and 100");
        return;
      }
      
      // Confirm quiz creation
      if (!window.confirm("Are you sure you want to create this quiz?")) {
        return;
      }
      
      // In a real app, this would save the quiz to a database
      const quizId = `quiz-${Date.now()}`;
      
      // Save quiz to local storage for demo purposes
      const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
      savedQuizzes.push({
        id: quizId,
        title,
        description,
        questions: filteredQuestions,
        passingScore,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
      
      toast.success("Quiz created successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Score (%)</Label>
            <Input
              id="passingScore"
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value, 10))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Questions</CardTitle>
          <p className="text-sm text-gray-500">
            {Object.values(selectedQuestions).filter(Boolean).length} of {questions.length} questions selected
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={`question-${question.id}`}
                  checked={selectedQuestions[question.id] || false}
                  onCheckedChange={(checked) => handleQuestionToggle(question.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="space-y-2 flex-1">
                  <Label
                    htmlFor={`question-${question.id}`}
                    className="font-medium text-gray-800 cursor-pointer"
                  >
                    {index + 1}. {question.question}
                  </Label>
                  <div className="pl-4 space-y-1">
                    {question.options.map((option, i) => (
                      <div key={i} className={`text-sm ${i === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        {String.fromCharCode(65 + i)}. {option}
                        {i === question.correctAnswer && " (Correct)"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateQuiz} className="ml-auto">
            Create Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizForm;
