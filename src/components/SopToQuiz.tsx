import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const SopToQuiz = () => {
  const [sopText, setSopText] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [candidateResults, setCandidateResults] = useState<CandidateResult[]>([]);

  useEffect(() => {
    const loadCandidateResults = () => {
      try {
        const savedResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
        setCandidateResults(savedResults);
      } catch (error) {
        console.error("Error loading candidate results:", error);
        toast.error("Failed to load candidate results.");
      }
    };

    loadCandidateResults();
  }, []);

  const handleSopUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSopText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!sopText) {
      toast.error("Please upload an SOP document first.");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI call to generate quiz questions
      await new Promise(resolve => setTimeout(resolve, 2000));
      const generatedQuestions = [
        {
          question: "Sample Question 1?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 1
        },
        {
          question: "Sample Question 2?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 2
        },
        // Add more sample questions as needed
      ];
      setQuizQuestions(generatedQuestions);
      toast.success("Quiz questions generated successfully!");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = () => {
    // Simulate form creation and sharing
    toast.success("Quiz form created and shared successfully!");
  };

  const handleTrackResponses = () => {
    // Simulate tracking responses
    toast.success("Responses tracked successfully!");
  };

  const handleGenerateCertificates = () => {
    // Simulate certificate generation
    toast.success("Certificates generated successfully!");
  };

  const handleSendViaEmail = () => {
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    // Simulate sending certificates via email
    toast.success(`Certificates sent to ${email} successfully!`);
  };

  const handleSendViaWhatsApp = () => {
    if (!whatsappNumber) {
      toast.error("Please enter a WhatsApp number.");
      return;
    }
    // Simulate sending certificates via WhatsApp
    toast.success(`Certificates sent to ${whatsappNumber} via WhatsApp successfully!`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Quiz via Link workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Document</label>
            <Input type="file" onChange={handleSopUpload} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SOP Text</label>
            <Textarea value={sopText} onChange={(e) => setSopText(e.target.value)} className="mt-1" />
          </div>
          <Button onClick={handleGenerateQuiz} disabled={loading}>
            {loading ? "Generating..." : "Generate Quiz"}
          </Button>
          {quizQuestions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Generated Quiz Questions</h2>
              {quizQuestions.map((q, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  <ul className="list-disc pl-5">
                    {q.options.map((option: string, i: number) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500">Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)}</p>
                </div>
              ))}
              <Button onClick={handleCreateForm} className="mt-2">Create and Share Quiz Form</Button>
              <Button onClick={handleTrackResponses} className="mt-2 ml-2">Track Responses</Button>
              <Button onClick={handleGenerateCertificates} className="mt-2 ml-2">Generate Certificates</Button>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Send Certificates</h3>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                  <Button onClick={handleSendViaEmail} className="mt-2">Send via Email</Button>
                  <Input
                    type="text"
                    placeholder="Enter WhatsApp number"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="mt-1"
                  />
                  <Button onClick={handleSendViaWhatsApp} className="mt-2">Send via WhatsApp</Button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Candidate Results</h3>
            {candidateResults.length > 0 ? (
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
                  {candidateResults.map((result) => (
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
            ) : (
              <p className="text-center text-gray-500">No candidate results available.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SopToQuiz; 