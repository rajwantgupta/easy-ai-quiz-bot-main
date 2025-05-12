
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import QuizForm from "@/components/QuizForm";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const QuizCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Retrieve the generated questions from localStorage or state
    const retrieveQuestions = async () => {
      try {
        const savedQuestions = localStorage.getItem("generatedQuestions");
        
        if (savedQuestions) {
          setQuestions(JSON.parse(savedQuestions));
        } else {
          // If no questions are found, redirect to admin dashboard
          toast.error("No quiz data found. Please upload a document first.");
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error retrieving questions:", error);
        toast.error("Failed to load quiz data.");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.role === "admin") {
      retrieveQuestions();
    }
  }, [user, navigate]);

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

  if (user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">
                    No quiz questions found. Please upload a document to generate questions.
                  </p>
                  <Button onClick={() => navigate("/admin")}>
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")} 
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Create Quiz
            </h1>
            <p className="text-gray-600 mb-6">
              Review and select questions to include in your quiz.
            </p>
          </div>
          
          <QuizForm questions={questions} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuizCreation;
