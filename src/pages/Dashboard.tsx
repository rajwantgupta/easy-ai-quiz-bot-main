
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import QuizList, { Quiz } from "@/components/QuizList";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch quizzes
    const fetchQuizzes = async () => {
      try {
        if (!user) return;
        
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
        
        // Get all quizzes
        const allQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        
        // Get user's quiz results
        const userResults = JSON.parse(localStorage.getItem(`results-${user.id}`) || "[]");
        
        // Check which quizzes the user has been assigned
        const assignments = JSON.parse(localStorage.getItem("quizAssignments") || "{}");
        const userAssignments = assignments[user.id] || [];
        
        // Format quizzes with user's results
        const formattedQuizzes = allQuizzes
          .filter((quiz: any) => userAssignments.includes(quiz.id))
          .map((quiz: any) => {
            const result = userResults.find((r: any) => r.quizId === quiz.id);
            
            return {
              id: quiz.id,
              title: quiz.title,
              description: quiz.description,
              questionsCount: quiz.questions.length,
              passingScore: quiz.passingScore,
              completed: !!result,
              score: result?.score,
              passed: result?.passed,
            };
          });
        
        setQuizzes(formattedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [user]);
  
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
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Welcome, {user.name}!
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Assigned Quizzes</h2>
            {quizzes.length > 0 ? (
              <QuizList quizzes={quizzes} userRole="candidate" userId={user.id} />
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">
                      You don't have any assigned quizzes yet.
                    </p>
                    <p className="text-sm text-gray-400">
                      Your administrator will assign quizzes to you when they're ready.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
