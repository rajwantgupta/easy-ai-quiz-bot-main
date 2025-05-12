
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Quiz } from "@/components/QuizList";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, UserPlus, Check, X } from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  organization?: string;
  role: "candidate";
  createdAt: string;
  lastLogin: string;
};

type CandidateManagementProps = {
  quizzes: Quiz[];
  onAssignQuiz: (candidateId: string, quizId: string) => void;
  onRevokeQuiz: (candidateId: string, quizId: string) => void;
};

const CandidateManagement = ({ quizzes, onAssignQuiz, onRevokeQuiz }: CandidateManagementProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  
  // Form states for adding a new candidate
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newOrganization, setNewOrganization] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Get candidates from localStorage
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
        const candidates = Object.values(registeredUsers)
          .filter((userData: any) => userData.user.role === "candidate")
          .map((userData: any) => userData.user);
        
        setCandidates(candidates as Candidate[]);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to load candidates");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, []);
  
  // Get candidate's assigned quizzes
  const getCandidateQuizzes = (candidateId: string) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("quizAssignments") || "{}");
      return assignments[candidateId] || [];
    } catch (error) {
      console.error("Error fetching candidate quizzes:", error);
      return [];
    }
  };
  
  // Handle adding a new candidate
  const handleAddCandidate = () => {
    if (!newName || !newEmail || !newUsername || !newPassword) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    try {
      // Check if email or username already exists
      const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
      
      if (registeredUsers[newEmail]) {
        toast.error("Email already registered");
        return;
      }
      
      const usernameTaken = Object.values(registeredUsers).some(
        (userData: any) => userData.user.username === newUsername
      );
      
      if (usernameTaken) {
        toast.error("Username already taken");
        return;
      }
      
      // Create new candidate
      const newCandidate = {
        id: `user-${Date.now()}`,
        name: newName,
        email: newEmail,
        username: newUsername,
        phone: newPhone || undefined,
        organization: newOrganization || undefined,
        role: "candidate" as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      // Add to registered users
      registeredUsers[newEmail] = {
        user: newCandidate,
        password: newPassword
      };
      
      localStorage.setItem("registered_users", JSON.stringify(registeredUsers));
      
      // Update state
      setCandidates([...candidates, newCandidate]);
      
      // Reset form
      setNewName("");
      setNewEmail("");
      setNewUsername("");
      setNewPhone("");
      setNewOrganization("");
      setNewPassword("");
      
      setShowAddDialog(false);
      toast.success("Candidate added successfully");
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error("Failed to add candidate");
    }
  };
  
  // Handle deleting a candidate
  const handleDeleteCandidate = (candidateId: string, email: string) => {
    try {
      // Remove from registered users
      const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "{}");
      delete registeredUsers[email];
      localStorage.setItem("registered_users", JSON.stringify(registeredUsers));
      
      // Remove from assignments
      const assignments = JSON.parse(localStorage.getItem("quizAssignments") || "{}");
      delete assignments[candidateId];
      localStorage.setItem("quizAssignments", JSON.stringify(assignments));
      
      // Update state
      setCandidates(candidates.filter(c => c.id !== candidateId));
      
      toast.success("Candidate removed successfully");
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate");
    }
  };
  
  // Handle assigning a quiz to a candidate
  const handleAssignQuiz = () => {
    if (!selectedCandidate || !selectedQuiz) {
      toast.error("Please select a candidate and quiz");
      return;
    }
    
    onAssignQuiz(selectedCandidate.id, selectedQuiz);
    setSelectedQuiz("");
    setShowAssignDialog(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Registered Candidates</h3>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="johndoe"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={newOrganization}
                    onChange={(e) => setNewOrganization(e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCandidate}>Add Candidate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {candidates.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Assigned Quizzes</TableHead>
                  <TableHead className="w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => {
                  const assignedQuizzes = getCandidateQuizzes(candidate.id);
                  
                  return (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.organization || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignedQuizzes.length > 0 ? (
                            assignedQuizzes.map((quizId: string) => {
                              const quiz = quizzes.find(q => q.id === quizId);
                              return (
                                <Badge key={quizId} variant="outline" className="mr-1">
                                  {quiz?.title || "Unknown Quiz"}
                                </Badge>
                              );
                            })
                          ) : (
                            <span className="text-gray-500 text-sm">No quizzes assigned</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCandidate(candidate);
                                  setShowAssignDialog(true);
                                }}
                              >
                                Assign Quiz
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Quiz to {candidate.name}</DialogTitle>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="quiz-select">Select Quiz</Label>
                                  <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a quiz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {quizzes.map((quiz) => (
                                        <SelectItem key={quiz.id} value={quiz.id}>
                                          {quiz.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                {assignedQuizzes.length > 0 && (
                                  <div>
                                    <Label className="mb-2 block">Currently Assigned</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {assignedQuizzes.map((quizId: string) => {
                                        const quiz = quizzes.find(q => q.id === quizId);
                                        return (
                                          <div key={quizId} className="flex items-center">
                                            <Badge variant="secondary" className="mr-1">
                                              {quiz?.title || "Unknown Quiz"}
                                            </Badge>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-6 w-6"
                                              onClick={() => onRevokeQuiz(candidate.id, quizId)}
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAssignQuiz} disabled={!selectedQuiz}>
                                  Assign Quiz
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCandidate(candidate.id, candidate.email)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-8">
          <CardContent className="text-center">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No candidates registered yet</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Candidate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateManagement;
