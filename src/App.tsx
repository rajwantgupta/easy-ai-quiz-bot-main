import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import QuizCreation from "./pages/QuizCreation";
import QuizAttempt from "./pages/QuizAttempt";
import Certificate from "./pages/Certificate";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import SupportChat from "./components/SupportChat";
import { useEffect } from "react";
import EditQuiz from "./pages/EditQuiz";
import QuizResults from "./pages/QuizResults";
import { VideoGeneratorPage } from "./pages/VideoGeneratorPage";
import EmployeeTrainingPage from "./pages/EmployeeTrainingPage";
import TrainingAdminPage from "./pages/TrainingAdminPage";

const queryClient = new QueryClient();

const App = () => {
  // Set document title
  useEffect(() => {
    document.title = "EASY AI Quiz";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/quiz/create" 
                  element={
                    <AdminRoute>
                      <QuizCreation />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/quiz/edit/:quizId" 
                  element={
                    <AdminRoute>
                      <EditQuiz />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/quiz/results/:quizId" 
                  element={
                    <AdminRoute>
                      <QuizResults />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/quiz/:id" 
                  element={
                    <ProtectedRoute>
                      <QuizAttempt />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/certificate/:id" 
                  element={
                    <ProtectedRoute>
                      <Certificate />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/video-generator" 
                  element={
                    <ProtectedRoute>
                      <VideoGeneratorPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/training" 
                  element={
                    <ProtectedRoute>
                      <EmployeeTrainingPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/training" 
                  element={
                    <AdminRoute>
                      <TrainingAdminPage />
                    </AdminRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <ProtectedRoute>
                <SupportChat />
              </ProtectedRoute>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
