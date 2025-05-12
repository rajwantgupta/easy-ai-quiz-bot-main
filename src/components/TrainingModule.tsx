import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle, 
  Clock, 
  Users, 
  MessageSquare,
  Download,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz';
  duration: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  resources: Resource[];
  quiz?: Quiz;
}

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'link';
  url: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  attempts: number;
  bestScore: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const TrainingModule: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/training/modules');
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load training modules');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
  };

  const handleProgressUpdate = async (moduleId: string, progress: number) => {
    try {
      const response = await fetch(`/api/training/modules/${moduleId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) throw new Error('Failed to update progress');

      setModules(modules.map(module => 
        module.id === moduleId 
          ? { ...module, progress, status: progress === 100 ? 'completed' : 'in_progress' }
          : module
      ));

      toast.success('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleQuizSubmit = async (moduleId: string, answers: number[]) => {
    try {
      const response = await fetch(`/api/training/modules/${moduleId}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) throw new Error('Failed to submit quiz');

      const { score, passed } = await response.json();
      
      if (passed) {
        handleProgressUpdate(moduleId, 100);
        toast.success('Congratulations! You passed the quiz');
      } else {
        toast.error(`Quiz score: ${score}%. Please try again.`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const handleResourceDownload = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/training/resources/${resourceId}/download`);
      if (!response.ok) throw new Error('Failed to download resource');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resource';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast.error('Failed to download resource');
    }
  };

  const handleShareModule = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/training/modules/${moduleId}/share`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to generate share link');

      const { shareUrl } = await response.json();
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      console.error('Error sharing module:', error);
      toast.error('Failed to share module');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Training Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map(module => (
                  <div
                    key={module.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedModule?.id === module.id
                        ? 'bg-primary/10'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleModuleSelect(module)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {module.type === 'video' && <Video className="h-5 w-5" />}
                        {module.type === 'document' && <FileText className="h-5 w-5" />}
                        {module.type === 'quiz' && <BookOpen className="h-5 w-5" />}
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <Badge variant={
                        module.status === 'completed' ? 'success' :
                        module.status === 'in_progress' ? 'warning' :
                        'default'
                      }>
                        {module.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Progress value={module.progress} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Content */}
        <div className="md:col-span-2">
          {selectedModule ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedModule.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedModule.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareModule(selectedModule.id)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResourceDownload(selectedModule.resources[0].id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    {selectedModule.quiz && (
                      <TabsTrigger value="quiz">Quiz</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="content">
                    <div className="space-y-4">
                      {selectedModule.type === 'video' && (
                        <video
                          controls
                          className="w-full rounded-lg"
                          src={selectedModule.resources[0].url}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {selectedModule.type === 'document' && (
                        <iframe
                          src={selectedModule.resources[0].url}
                          className="w-full h-[600px] rounded-lg"
                          title={selectedModule.title}
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="resources">
                    <div className="space-y-4">
                      {selectedModule.resources.map(resource => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            {resource.type === 'video' && <Video className="h-5 w-5" />}
                            {resource.type === 'document' && <FileText className="h-5 w-5" />}
                            <span>{resource.title}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResourceDownload(resource.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {selectedModule.quiz && (
                    <TabsContent value="quiz">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Quiz: {selectedModule.quiz.title}</h3>
                            <p className="text-sm text-gray-500">
                              Passing Score: {selectedModule.quiz.passingScore}%
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            Best Score: {selectedModule.quiz.bestScore}%
                          </div>
                        </div>
                        {/* Quiz questions will be rendered here */}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex justify-center items-center h-64">
                <p className="text-gray-500">Select a module to view its content</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 