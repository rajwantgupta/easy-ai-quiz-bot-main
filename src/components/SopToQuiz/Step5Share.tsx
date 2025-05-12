
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Send, Mail, MessageSquare } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Step5ShareProps {
  savedQuizId: string | null;
}

const Step5Share = ({ savedQuizId }: Step5ShareProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, boolean>>({});
  const [deadline, setDeadline] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2); // 48 hours from now
    return date.toISOString().split('T')[0];
  });
  
  // Fetch candidates from localStorage
  const candidates: Candidate[] = JSON.parse(localStorage.getItem("candidates") || "[]");
  
  const handleCandidateToggle = (candidateId: string, checked: boolean) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [candidateId]: checked
    }));
  };

  const assignQuiz = () => {
    if (!savedQuizId) {
      toast.error("No quiz available to assign");
      return;
    }
    
    const selectedCandidateIds = Object.entries(selectedCandidates)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedCandidateIds.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }
    
    try {
      // Get candidate assignments
      const assignments = JSON.parse(localStorage.getItem("quizAssignments") || "{}");
      
      // Assign quiz to selected candidates
      selectedCandidateIds.forEach(candidateId => {
        if (!assignments[candidateId]) {
          assignments[candidateId] = [];
        }
        
        if (!assignments[candidateId].includes(savedQuizId)) {
          assignments[candidateId].push(savedQuizId);
        }
      });
      
      localStorage.setItem("quizAssignments", JSON.stringify(assignments));
      toast.success(`Quiz assigned to ${selectedCandidateIds.length} candidates`);
      
      // Reset selection
      setSelectedCandidates({});
    } catch (error) {
      console.error("Error assigning quiz:", error);
      toast.error("Failed to assign quiz");
    }
  };

  const shareViaEmail = () => {
    if (!savedQuizId) {
      toast.error("No quiz available to share");
      return;
    }
    
    const selectedCandidateIds = Object.entries(selectedCandidates)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedCandidateIds.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }
    
    const selectedCandidateEmails = candidates
      .filter(c => selectedCandidateIds.includes(c.id))
      .map(c => c.email);
    
    // Format email subject and body
    const subject = `New Quiz Assignment: Complete by ${new Date(deadline).toLocaleDateString()}`;
    const body = `You have been assigned a new quiz. Please complete it by ${new Date(deadline).toLocaleDateString()}. Login to your account to access the quiz.`;
    
    // Create mailto link
    const mailtoLink = `mailto:${selectedCandidateEmails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.open(mailtoLink);
    
    toast.success(`Email prepared for ${selectedCandidateEmails.length} candidates`);
  };

  const shareViaWhatsApp = () => {
    if (!savedQuizId) {
      toast.error("No quiz available to share");
      return;
    }
    
    const selectedCandidateIds = Object.entries(selectedCandidates)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedCandidateIds.length === 0) {
      toast.error("Please select at least one candidate");
      return;
    }
    
    // For demo purposes, just show a success message
    // In a real app, this would generate individual WhatsApp links or use the WhatsApp Business API
    toast.success("WhatsApp sharing initiated (demo only)");
    
    // Example of a WhatsApp link (would normally include a valid phone number)
    const message = `You have been assigned a new quiz. Please complete it by ${new Date(deadline).toLocaleDateString()}. Login to your account to access it.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      const allSelected = candidates.reduce((acc, candidate) => {
        acc[candidate.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedCandidates(allSelected);
    } else {
      setSelectedCandidates({});
    }
  };

  const isAllSelected = candidates.length > 0 && 
    candidates.every(c => selectedCandidates[c.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5 text-primary" />
          Step 5: Share the Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {!savedQuizId ? (
            <div className="text-center p-4 text-gray-500">
              Save the quiz first to enable sharing
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Select Candidates:</label>
                  <div className="flex items-center">
                    <Checkbox 
                      id="select-all" 
                      checked={isAllSelected}
                      onCheckedChange={selectAll}
                    />
                    <label htmlFor="select-all" className="ml-2 text-xs text-gray-500">
                      Select All
                    </label>
                  </div>
                </div>
                
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {candidates.length > 0 ? (
                    <div className="divide-y">
                      {candidates.map((candidate) => (
                        <div key={candidate.id} className="flex items-center p-2 hover:bg-gray-50">
                          <Checkbox
                            id={`candidate-${candidate.id}`}
                            checked={selectedCandidates[candidate.id] || false}
                            onCheckedChange={(checked) => 
                              handleCandidateToggle(candidate.id, checked as boolean)
                            }
                          />
                          <label 
                            htmlFor={`candidate-${candidate.id}`} 
                            className="ml-2 flex-1 cursor-pointer"
                          >
                            <div className="text-sm font-medium">{candidate.name}</div>
                            <div className="text-xs text-gray-500">{candidate.email}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No candidates found
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline:</label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={assignQuiz}
                  disabled={Object.values(selectedCandidates).filter(Boolean).length === 0}
                  className="flex-1"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Assign Quiz
                </Button>
                
                <Button
                  variant="outline"
                  onClick={shareViaEmail}
                  disabled={Object.values(selectedCandidates).filter(Boolean).length === 0}
                  className="flex-1"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                
                <Button
                  variant="outline"
                  onClick={shareViaWhatsApp}
                  disabled={Object.values(selectedCandidates).filter(Boolean).length === 0}
                  className="flex-1"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step5Share;
