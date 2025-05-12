import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ShareCertificate } from "./ShareCertificate";

export type Quiz = {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  passingScore: number;
  completed?: boolean;
  score?: number;
  passed?: boolean;
};

type QuizListProps = {
  quizzes: Quiz[];
  userRole: "admin" | "candidate";
  userId?: string;
  onEditQuiz?: (quiz: Quiz) => void;
  onViewResults?: (quiz: Quiz) => void;
};

const QuizList = ({ quizzes, userRole, userId, onEditQuiz, onViewResults }: QuizListProps) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">
          {userRole === "admin" 
            ? "No quizzes created yet. Upload a document to create a new quiz."
            : "No quizzes available for you at the moment."}
        </p>
      </div>
    );
  }

  // Filter quizzes based on assignments if the user is a candidate
  const availableQuizzes = userRole === "candidate" && userId ? 
    quizzes.filter(quiz => {
      const assignments = JSON.parse(localStorage.getItem("quizAssignments") || "{}");
      const userAssignments = assignments[userId] || [];
      return userAssignments.includes(quiz.id);
    }) : quizzes;

  if (userRole === "candidate" && availableQuizzes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">
          No quizzes have been assigned to you yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableQuizzes.map((quiz) => (
        <Card key={quiz.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
              {userRole === "candidate" && quiz.completed && (
                <Badge variant={quiz.passed ? "default" : "destructive"}>
                  {quiz.passed ? "PASSED" : "FAILED"}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div>Questions: {quiz.questionsCount}</div>
              <div>Passing: {quiz.passingScore}%</div>
            </div>
            
            {userRole === "candidate" && quiz.completed ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">
                  Your score: <span className={quiz.passed ? "text-green-600" : "text-red-600"}>
                    {quiz.score}%
                  </span>
                </div>
                
                {quiz.passed && (
                  <div className="flex gap-2">
                    <Link to={`/certificate/${quiz.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Certificate
                      </Button>
                    </Link>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" className="px-3">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Certificate</DialogTitle>
                        </DialogHeader>
                        <ShareCertificate quizId={quiz.id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                
                <Link to={`/quiz/${quiz.id}`}>
                  <Button variant="secondary" className="w-full">
                    Review Quiz
                  </Button>
                </Link>
              </div>
            ) : userRole === "candidate" ? (
              <Link to={`/quiz/${quiz.id}`}>
                <Button className="w-full">Take Quiz</Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => onEditQuiz && onEditQuiz(quiz)}>
                  Edit Quiz
                </Button>
                <Button className="w-full" variant="secondary" onClick={() => onViewResults && onViewResults(quiz)}>
                  View Results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuizList;
