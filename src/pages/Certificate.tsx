
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const Certificate = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadCertificate = async () => {
      try {
        if (!id || !user) return;
        
        const savedQuizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
        const quiz = savedQuizzes.find((q: any) => q.id === id);
        
        if (!quiz) {
          toast.error("Certificate not found");
          navigate("/dashboard");
          return;
        }
        
        const userResults = JSON.parse(localStorage.getItem(`results-${user.id}`) || "[]");
        const result = userResults.find((r: any) => r.quizId === id);
        
        if (!result || !result.passed) {
          toast.error("No certificate available for this quiz");
          navigate("/dashboard");
          return;
        }
        
        setQuizData(quiz);
        setResultData(result);
      } catch (error) {
        console.error("Error loading certificate:", error);
        toast.error("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };
    
    loadCertificate();
  }, [id, user, navigate]);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      toast.info("Preparing certificate for download...");
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: "#ffffff",
        logging: false
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Certificate_${quizData.title.replace(/\s+/g, '_')}.png`;
      link.click();
      
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to download certificate");
    }
  };

  const handleSendEmail = () => {
    // In a real app, this would trigger an API call to send the email
    toast.success("Certificate has been sent to your email!");
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

  if (!quizData || !resultData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Certificate Not Found</h1>
            <p className="mb-4">The certificate you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")} 
            className="mb-6"
          >
            Back to Dashboard
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Certificate</h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button onClick={handleSendEmail}>
                  <Mail className="mr-2 h-4 w-4" /> Send via Email
                </Button>
              </div>
            </div>
            
            <Card className="p-0 overflow-hidden">
              <div 
                ref={certificateRef} 
                className="certificate p-0 relative flex flex-col items-center text-center bg-white"
                style={{ aspectRatio: '1.414/1' }} 
              >
                {/* Red corners */}
                <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-red-600"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-red-600"></div>
                
                {/* White background overlay */}
                <div className="absolute top-[20px] left-[20px] right-[20px] bottom-[20px] bg-white z-10"></div>
                
                {/* Certificate content */}
                <div className="absolute top-[20px] left-[20px] right-[20px] bottom-[20px] flex flex-col items-center p-8 z-20">
                  
                  {/* Logo at top right */}
                  <div className="absolute top-4 right-4 text-red-600 font-bold">
                    <div className="text-3xl md:text-4xl">easy</div>
                    <div className="text-xs text-gray-500">EASY AI Quiz</div>
                  </div>
                  
                  {/* Award ribbon on left */}
                  <div className="absolute top-20 left-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-yellow-300 border-4 border-yellow-500 flex items-center justify-center shadow-md">
                        <div className="w-16 h-16 rounded-full bg-yellow-200 border-2 border-yellow-400"></div>
                      </div>
                      <div className="absolute bottom-[-30px] left-[5px] w-5 h-16 bg-yellow-400 transform rotate-[15deg]"></div>
                      <div className="absolute bottom-[-30px] left-[10px] w-5 h-16 bg-yellow-500 transform rotate-[5deg]"></div>
                      <div className="absolute bottom-[-30px] right-[5px] w-5 h-16 bg-yellow-400 transform rotate-[-15deg]"></div>
                      <div className="absolute bottom-[-30px] right-[10px] w-5 h-16 bg-yellow-500 transform rotate-[-5deg]"></div>
                    </div>
                  </div>
                  
                  {/* Main certificate title */}
                  <div className="mt-12 mb-2 w-full">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800">CERTIFICATE</h1>
                    <h2 className="text-xl md:text-2xl text-gray-600 mt-1">OF APPRECIATION</h2>
                  </div>
                  
                  {/* Recipient info */}
                  <div className="my-8 w-full">
                    <p className="text-gray-600 mb-2">PROUDLY PRESENTED TO</p>
                    <div className="border-b-2 border-gray-300 max-w-md mx-auto">
                      <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 py-2">
                        {user.name}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Recognition text */}
                  <div className="mb-4 max-w-lg mx-auto">
                    <p className="text-gray-600">
                      In recognition and appreciation of the successful completion
                      of the {quizData.title} quiz in {getMonthName(resultData.completedAt)}
                    </p>
                  </div>
                  
                  {/* Star statement */}
                  <div className="mb-8 mt-4">
                    <h2 className="text-3xl md:text-4xl font-bold">
                      YOU ARE <span className="text-red-600">A STAR</span>
                    </h2>
                  </div>
                  
                  {/* Signature */}
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="w-40 mx-auto mb-1 border-b border-gray-400">
                      <p className="italic text-gray-600">Signed</p>
                    </div>
                    <p className="font-semibold">Rohit Chokhani</p>
                    <p className="text-xs text-gray-600">Managing Director</p>
                  </div>
                  
                  {/* Certificate ID */}
                  <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                    Certificate ID: CERT-{id?.substring(0, 8).toUpperCase()}
                  </div>
                  
                  {/* Date */}
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    Date: {formatDate(resultData.completedAt)}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Certificate;
