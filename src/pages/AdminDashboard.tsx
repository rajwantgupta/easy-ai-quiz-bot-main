import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import QuizList, { Quiz } from "@/components/QuizList";
import DocumentUploader from "@/components/DocumentUploader";
import { Upload, Users } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CandidateManagement from "@/components/CandidateManagement";
import { toast } from "sonner";
import SopToQuiz from "@/components/SopToQuiz";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  
  useEffect(() => {
    // Simulate loading quizzes from an API
    const loadQuizzes = async () => {
      try {
        // In a real app, this would be fetched from a backend API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        
        const formattedQuizzes = savedQuizzes.map((quiz: any) => ({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          questionsCount: quiz.questions.length,
          passingScore: quiz.passingScore,
        }));
        
        setQuizzes(formattedQuizzes);
      } catch (error) {
        console.error("Error loading quizzes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.role === "admin") {
      loadQuizzes();
    }
  }, [user]);

  const handleDocumentProcessed = (questions: any[]) => {
    setGeneratedQuestions(questions);
    // Navigate to quiz creation
    window.location.href = "/admin/quiz/create";
    
    // In a real application, we'd store this in a state management system
    // or backend. For this demo, we'll use localStorage
    localStorage.setItem("generatedQuestions", JSON.stringify(questions));
  };

  // Handle quiz allocation
  const handleQuizAllocation = (candidateId: string, quizId: string) => {
    try {
      // Get candidate assignments
      const assignments = JSON.parse(localStorage.getItem("quizAssignments") || "{}");
      
      // Assign quiz to candidate
      if (!assignments[candidateId]) {
        assignments[candidateId] = [];
      }
      
      // Check if quiz is already assigned
      if (!assignments[candidateId].includes(quizId)) {
        assignments[candidateId].push(quizId);
        localStorage.setItem("quizAssignments", JSON.stringify(assignments));
        toast.success("Quiz assigned successfully");
      } else {
        toast.info("Quiz already assigned to this candidate");
      }
    } catch (error) {
      console.error("Error assigning quiz:", error);
      toast.error("Failed to assign quiz");
    }
  };

  // Handle quiz revocation
  const handleQuizRevocation = (candidateId: string, quizId: string) => {
    try {
      // Get candidate assignments
      const assignments = JSON.parse(localStorage.getItem("quizAssignments") || "{}");
      
      // Check if candidate has any assignments
      if (!assignments[candidateId]) {
        toast.error("No quizzes assigned to this candidate");
        return;
      }
      
      // Filter out the quiz to revoke
      assignments[candidateId] = assignments[candidateId].filter(
        (id: string) => id !== quizId
      );
      
      localStorage.setItem("quizAssignments", JSON.stringify(assignments));
      toast.success("Quiz access revoked successfully");
    } catch (error) {
      console.error("Error revoking quiz access:", error);
      toast.error("Failed to revoke quiz access");
    }
  };

  // Function to handle quiz editing
  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    // Navigate to quiz edit page or open edit modal
    window.location.href = `/admin/quiz/edit/${quiz.id}`;
  };

  // Function to view quiz results
  const handleViewResults = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    // Navigate to quiz results page or open results modal
    window.location.href = `/admin/quiz/results/${quiz.id}`;
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

  if (user.role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="mb-4">You don't have permission to access the admin dashboard.</p>
            <Link to="/dashboard">
              <Button>Go to your Dashboard</Button>
            </Link>
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
            </div>
          </div>
          
          <Tabs defaultValue="create" className="space-y-6">
            <TabsList>
              <TabsTrigger value="create">Create Quiz</TabsTrigger>

              <TabsTrigger value="manage">Manage Quizzes</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="sop">Share Quiz via Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Upload Document</h2>
                <p className="text-gray-600 mb-4">
                  Upload a document to automatically generate quiz questions using AI.
                </p>
                
                <DocumentUploader 
                  onDocumentProcessed={handleDocumentProcessed} 
                  isProcessing={isProcessingDocument}
                  setIsProcessing={setIsProcessingDocument}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="sop">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Share Quiz via Link Workflow</h2>
                <p className="text-gray-600 mb-4">
                  Follow the step-by-step process to convert Pdf/txt into quizzes.
                </p>
                
                <SopToQuiz />
              </div>
            </TabsContent>
            
            <TabsContent value="manage">
              <h2 className="text-xl font-semibold mb-4">Quiz Library</h2>
              
              {quizzes.length > 0 ? (
                <QuizList 
                  quizzes={quizzes} 
                  userRole="admin" 
                  onEditQuiz={handleEditQuiz} 
                  onViewResults={handleViewResults} 
                />
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        You haven't created any quizzes yet
                      </p>
                      <p className="text-sm text-gray-400 mb-6">
                        Upload a document to generate quiz questions with AI
                      </p>
                      <Button asChild variant="secondary">
                        <a href="#create">Create Your First Quiz</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="candidates">
              <h2 className="text-xl font-semibold mb-4">Candidate Management</h2>
              
              <CandidateManagement 
                quizzes={quizzes} 
                onAssignQuiz={handleQuizAllocation} 
                onRevokeQuiz={handleQuizRevocation}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
