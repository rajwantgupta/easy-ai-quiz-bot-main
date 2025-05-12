import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Award, Mail, MessageSquare, RefreshCw, Download } from "lucide-react";

interface Step7CertificatesProps {
  savedQuizId: string | null;
}

interface CandidateResult {
  id: string;
  candidateName: string;
  email: string;
  whatsapp?: string;
  score: number;
  passed: boolean;
  completedAt: string;
  quizId: string;
  certificateSent?: boolean;
}

const Step7Certificates = ({ savedQuizId }: Step7CertificatesProps) => {
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateResult | null>(null);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  
  useEffect(() => {
    loadCandidates();
  }, [savedQuizId]);
  
  const loadCandidates = async () => {
    if (!savedQuizId) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll use localStorage
      const savedResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
      const quizResults = savedResults.filter((r: CandidateResult) => r.quizId === savedQuizId);
      setCandidates(quizResults);
    } catch (error) {
      console.error("Error loading candidates:", error);
      toast.error("Failed to load candidate results");
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateCertificate = async (candidate: CandidateResult) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would generate a PDF certificate
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate certificate generation
      const certificateData = {
        candidateName: candidate.candidateName,
        score: candidate.score,
        quizId: candidate.quizId,
        issuedAt: new Date().toISOString()
      };
      
      // In a real implementation, this would save the certificate
      console.log("Certificate data:", certificateData);
      
      toast.success("Certificate generated successfully!");
      
      // Update candidate's certificate status
      const updatedCandidates = candidates.map(c => 
        c.id === candidate.id ? { ...c, certificateSent: true } : c
      );
      setCandidates(updatedCandidates);
      
      // Save to localStorage
      localStorage.setItem("quizResults", JSON.stringify(updatedCandidates));
      
      return certificateData;
    } catch (error) {
      toast.error("Failed to generate certificate");
      console.error("Certificate generation error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendCertificate = async (candidate: CandidateResult, method: 'email' | 'whatsapp') => {
    if (!candidate.passed) {
      toast.error("Only passed candidates can receive certificates");
      return;
    }
    
    setIsLoading(true);
    try {
      // Generate certificate first
      const certificate = await generateCertificate(candidate);
      if (!certificate) return;
      
      // In a real implementation, this would send via email or WhatsApp
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (method === 'email') {
        // Simulate email sending
        console.log("Sending certificate via email to:", candidate.email);
        toast.success("Certificate sent via email!");
      } else {
        // Simulate WhatsApp sending
        console.log("Sending certificate via WhatsApp to:", candidate.whatsapp);
        toast.success("Certificate sent via WhatsApp!");
      }
      
      // Update candidate's certificate status
      const updatedCandidates = candidates.map(c => 
        c.id === candidate.id ? { ...c, certificateSent: true } : c
      );
      setCandidates(updatedCandidates);
      
      // Save to localStorage
      localStorage.setItem("quizResults", JSON.stringify(updatedCandidates));
    } catch (error) {
      toast.error(`Failed to send certificate via ${method}`);
      console.error("Certificate sending error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadCertificate = async (candidate: CandidateResult) => {
    if (!candidate.passed) {
      toast.error("Only passed candidates can download certificates");
      return;
    }
    
    setIsLoading(true);
    try {
      // Generate certificate first
      const certificate = await generateCertificate(candidate);
      if (!certificate) return;
      
      // In a real implementation, this would download a PDF
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate file download
      const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate_${candidate.candidateName.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download certificate");
      console.error("Certificate download error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-primary" />
          Step 7: Generate Certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate and send certificates to candidates who have passed the quiz.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
            <h4 className="font-medium text-sm mb-3">Certificate Generation Instructions:</h4>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li>Select a candidate from the list below</li>
              <li>Choose to send the certificate via email or WhatsApp</li>
              <li>Or download the certificate directly</li>
              <li>Only passed candidates can receive certificates</li>
            </ol>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Candidate</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Score</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Status</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Certificate</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length > 0 ? (
                  candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-800">{candidate.candidateName}</td>
                      <td className="py-2 px-3 text-gray-800">{candidate.score}%</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          candidate.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {candidate.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-800">
                        {candidate.certificateSent ? (
                          <span className="text-green-600">Sent</span>
                        ) : (
                          <span className="text-gray-500">Not Sent</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedCandidate(candidate)}
                            disabled={!candidate.passed || isLoading}
                          >
                            Send
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadCertificate(candidate)}
                            disabled={!candidate.passed || isLoading}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No candidates yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {selectedCandidate && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
              <h4 className="font-medium">Send Certificate to {selectedCandidate.candidateName}</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Enter WhatsApp number"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => sendCertificate(selectedCandidate, 'email')}
                    disabled={!email || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send via Email
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => sendCertificate(selectedCandidate, 'whatsapp')}
                    disabled={!whatsapp || isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send via WhatsApp
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step7Certificates;
