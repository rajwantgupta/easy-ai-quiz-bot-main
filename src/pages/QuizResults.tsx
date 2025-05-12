import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type CandidateResult = {
  candidateId: string;
  candidateName: string;
  score: number;
  passed: boolean;
  completedAt: string;
  quizId: string;
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  passingScore: number;
};

const QuizResults = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadQuizAndResults = () => {
      try {
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        const foundQuiz = savedQuizzes.find((q: Quiz) => q.id === quizId);
        if (foundQuiz) {
          setQuiz(foundQuiz);
        } else {
          toast.error("Quiz not found");
          navigate("/admin/dashboard");
          return;
        }

        const savedResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
        const quizResults = savedResults.filter((r: CandidateResult) => r.quizId === quizId);
        setResults(quizResults);

        // Calculate total pages
        const pageSize = 10; // Define a default page size
        setTotalPages(Math.ceil(quizResults.length / pageSize));
      } catch (error) {
        console.error("Error loading quiz results:", error);
        toast.error("Failed to load quiz results");
      } finally {
        setLoading(false);
      }
    };

    loadQuizAndResults();
  }, [quizId, navigate]);

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
            <Button onClick={() => navigate("/admin/dashboard")}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentResults = results.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Quiz Results: {quiz.title}</h1>
          <Card>
            <CardHeader>
              <CardTitle>Candidate Results</CardTitle>
            </CardHeader>
            <CardContent>
              {currentResults.length > 0 ? (
                <>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentResults.map((result) => (
                        <tr key={result.candidateId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.candidateName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.score}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {result.passed ? "PASSED" : "FAILED"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.completedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500">No results available for this quiz.</p>
              )}
              <Button onClick={() => navigate("/admin")} className="mt-4">Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResults; 