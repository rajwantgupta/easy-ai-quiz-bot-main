import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Upload, Check, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  const features = [
    {
      icon: <Upload className="h-10 w-10 text-primary" />,
      title: "Document Upload",
      description: "Upload any document, text file, or spreadsheet to automatically generate a quiz from its content."
    },
    {
      icon: <Check className="h-10 w-10 text-primary" />,
      title: "Auto-Generated Quizzes",
      description: "AI-powered system analyzes documents and creates relevant assessment questions automatically."
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Automatic Certification",
      description: "Candidates who score 75% or higher automatically receive a professionally designed certificate."
    },
    {
      icon: <Mail className="h-10 w-10 text-primary" />,
      title: "Certificate Delivery",
      description: "Certificates can be delivered via email or downloaded for sharing on professional profiles."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  {user ? (user.role === "admin" ? "Admin Dashboard" : "User Dashboard") : "Transform Documents into Assessments & Certifications"}
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  {user ? (user.role === "admin" ? "Manage quizzes and view results." : "Take quizzes and view your results.") : "Upload any document and let our AI generate relevant quizzes. Automatically issue certificates to candidates who pass assessments."}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  {user ? (
                    <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                      <Button size="lg" className="w-full sm:w-auto">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button size="lg" className="w-full sm:w-auto">
                          Get Started
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                          Create Account
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 mt-12 md:mt-0">
                <div className="relative">
                  <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-1 bg-gray-50 border-b">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="h-8 bg-gray-100 rounded-md w-3/4 animate-pulse-slow"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-100 rounded-md w-full animate-pulse-slow"></div>
                          <div className="h-4 bg-gray-100 rounded-md w-5/6 animate-pulse-slow"></div>
                          <div className="h-4 bg-gray-100 rounded-md w-4/6 animate-pulse-slow"></div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-8 bg-blue-100 rounded-md w-1/4 animate-pulse-slow"></div>
                          <div className="h-8 bg-green-100 rounded-md w-1/4 animate-pulse-slow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full z-0"></div>
                  <div className="absolute -left-6 -top-6 w-16 h-16 bg-secondary/10 rounded-full z-0"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform makes it simple to create assessments from any content and automatically certify qualified candidates.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-primary/10 rounded-lg mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Assessment Process?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of organizations using AutoAssess & Certify to streamline their qualification process.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <Link to={user.role === "admin" ? "/admin" : "/dashboard"}>
                    <Button size="lg" variant="secondary">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" variant="secondary">
                        Sign Up Now
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Log In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
