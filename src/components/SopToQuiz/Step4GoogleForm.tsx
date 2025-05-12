import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileInput, ExternalLink, Save, Share2, Copy } from "lucide-react";
import { generateQuizQR } from "@/lib/qr-service";

interface Step4GoogleFormProps {
  questions: any[];
  onQuizSave: (quizTitle: string, questions: any[]) => void;
}

const Step4GoogleForm = ({ questions, onQuizSave }: Step4GoogleFormProps) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [shareWhatsApp, setShareWhatsApp] = useState("");
  
  useEffect(() => {
    // Try to get the SOP title from localStorage
    const savedTitle = localStorage.getItem("currentSopTitle");
    if (savedTitle) {
      setQuizTitle(`${savedTitle} Quiz`);
    } else {
      setQuizTitle("SOP Knowledge Quiz");
    }
  }, []);

  const createGoogleForm = async () => {
    if (!quizTitle.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (passingScore < 0 || passingScore > 100) {
      toast.error("Passing score must be between 0 and 100");
      return;
    }

    if (!questions || questions.length === 0) {
      toast.error("No questions available to create quiz");
      return;
    }

    setIsCreatingForm(true);
    try {
      // Call the Apps Script web app endpoint
      const response = await fetch('https://script.google.com/macros/s/AKfycbx62pW3K6XRdHU8oxXjnRxPvWOpxF1MG0b9xWvfYilGd9hSTBy9AadGTE22j1wRnGwqTA/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createForm',
          title: quizTitle,
          passingScore: passingScore,
          questions: questions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create form');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create form');
      }

      setFormUrl(data.formUrl);
      
      // Generate QR code
      const qrData = {
        quizId: data.formId,
        title: quizTitle,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiry
        maxAttempts: 1
      };
      
      const qrCodeUrl = await generateQuizQR(qrData);
      setQrCode(qrCodeUrl);
      
      toast.success("Quiz form created successfully!");
      
      // Save quiz data to localStorage
      localStorage.setItem("currentQuizData", JSON.stringify({
        title: quizTitle,
        formUrl: data.formUrl,
        formId: data.formId,
        qrCode: qrCodeUrl,
        createdAt: new Date().toISOString()
      }));
      
    } catch (error) {
      console.error("Error creating quiz form:", error);
      toast.error("Failed to create quiz form. Please try again.");
    } finally {
      setIsCreatingForm(false);
    }
  };

  const shareForm = async (method: 'email' | 'whatsapp') => {
    if (!formUrl) {
      toast.error("Please create a form first");
      return;
    }

    try {
      if (method === 'email') {
        if (!shareEmail) {
          toast.error("Please enter an email address");
          return;
        }

        // Create mailto link with quiz details
        const subject = encodeURIComponent(`Quiz Invitation: ${quizTitle}`);
        const body = encodeURIComponent(
          `You have been invited to take the quiz: ${quizTitle}\n\n` +
          `Click here to start: ${formUrl}\n\n` +
          `Note: This quiz requires a passing score of ${passingScore}%`
        );
        
        window.location.href = `mailto:${shareEmail}?subject=${subject}&body=${body}`;
        toast.success(`Email prepared for ${shareEmail}`);

      } else if (method === 'whatsapp') {
        if (!shareWhatsApp) {
          toast.error("Please enter a WhatsApp number");
          return;
        }

        // Format phone number (remove non-digits)
        const formattedPhone = shareWhatsApp.replace(/\D/g, '');
        
        // Create WhatsApp message
        const message = encodeURIComponent(
          `You have been invited to take the quiz: ${quizTitle}\n\n` +
          `Click here to start: ${formUrl}\n\n` +
          `Note: This quiz requires a passing score of ${passingScore}%`
        );
        
        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
        toast.success(`WhatsApp opened with quiz link`);
      }
    } catch (error) {
      console.error(`Error sharing form via ${method}:`, error);
      toast.error(`Failed to share quiz via ${method}. Please try again.`);
    }
  };

  const copyQuizLink = () => {
    if (!formUrl) {
      toast.error("Please create a form first");
      return;
    }

    navigator.clipboard.writeText(formUrl)
      .then(() => toast.success("Quiz link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy quiz link"));
  };

  const handleSaveQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }
    
    if (!questions || questions.length === 0) {
      toast.error("No questions to save");
      return;
    }
    
    onQuizSave(quizTitle, questions);
    toast.success("Quiz saved successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileInput className="mr-2 h-5 w-5 text-primary" />
          Step 4: Create and Share Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Create a quiz form and share it with candidates. The quiz will be automatically graded based on the passing score.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quiz Title:</label>
              <Input
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Passing Score (%):</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={createGoogleForm}
              disabled={isCreatingForm || !quizTitle.trim() || !questions.length}
              className="w-full sm:w-auto"
            >
              {isCreatingForm ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Creating Quiz...
                </>
              ) : (
                "Create Quiz Form"
              )}
            </Button>
            
            <Button
              onClick={() => formUrl && window.open(formUrl, "_blank")}
              variant="outline"
              className="w-full sm:w-auto"
              disabled={!formUrl}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview Quiz
            </Button>
            
            <Button
              onClick={handleSaveQuiz}
              disabled={!questions || questions.length === 0}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Quiz
            </Button>
          </div>

          {formUrl && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Share Quiz</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyQuizLink}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Quiz Link
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Share via Email:</label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                    <Button
                      onClick={() => shareForm('email')}
                      disabled={!shareEmail}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Share via WhatsApp:</label>
                  <div className="flex gap-2">
                    <Input
                      type="tel"
                      value={shareWhatsApp}
                      onChange={(e) => setShareWhatsApp(e.target.value)}
                      placeholder="Enter WhatsApp number"
                    />
                    <Button
                      onClick={() => shareForm('whatsapp')}
                      disabled={!shareWhatsApp}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>

              {qrCode && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">QR Code for Quick Access</h3>
                  <div className="flex justify-center">
                    <img src={qrCode} alt="Quiz QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Scan this QR code to access the quiz directly
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Step4GoogleForm;
