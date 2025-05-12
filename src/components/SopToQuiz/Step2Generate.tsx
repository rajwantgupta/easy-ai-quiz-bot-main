import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Loader2, RefreshCw, Check, AlertCircle } from "lucide-react";
import { generateQuizQuestions } from "@/utils/quizGenerator";

interface Step2GenerateProps {
  sopText: string;
  onQuestionsGenerated: (questions: any[]) => void;
}

const Step2Generate = ({ sopText, onQuestionsGenerated }: Step2GenerateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generationAttempts, setGenerationAttempts] = useState(0);

  const generateQuestions = async () => {
    if (!sopText || sopText.length < 50) {
      toast.error("Please provide valid SOP text first");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Generate questions using the quiz generator utility
      const generatedQuestions = await generateQuizQuestions(sopText);
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("Failed to generate questions");
      }

      // Validate generated questions
      const validQuestions = generatedQuestions.filter(q => 
        q.question && 
        q.options && 
        q.options.length >= 2 && 
        typeof q.correctAnswer === 'number'
      );

      if (validQuestions.length === 0) {
        throw new Error("Generated questions are not valid");
      }

      setQuestions(validQuestions);
      onQuestionsGenerated(validQuestions);
      toast.success(`Generated ${validQuestions.length} questions successfully!`);
      
      // Save questions to localStorage
      localStorage.setItem("currentQuizQuestions", JSON.stringify(validQuestions));
      
    } catch (error) {
      console.error("Question generation error:", error);
      setError("Failed to generate questions. Please try again.");
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
      setGenerationAttempts(prev => prev + 1);
    }
  };

  const regenerateQuestions = () => {
    setQuestions([]);
    setError(null);
    generateQuestions();
  };

  const copyToClipboard = () => {
    if (!questions.length) return;
    
    const text = questions.map((q, index) => {
      return `Question ${index + 1}: ${q.question}\n` +
             `Options:\n${q.options.map((opt: string, i: number) => 
               `${i + 1}. ${opt}${i === q.correctAnswer ? ' (Correct)' : ''}`
             ).join('\n')}\n`;
    }).join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Questions copied to clipboard!"))
      .catch(() => toast.error("Failed to copy questions"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Step 2: Generate Quiz Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={generateQuestions}
            disabled={isLoading || !sopText}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
          
          {questions.length > 0 && (
            <Button
              variant="outline"
              onClick={regenerateQuestions}
              disabled={isLoading}
              className="flex-1"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Questions
            </Button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {questions.length > 0 && (
          <div className="mt-4">
            <div className="font-medium text-sm mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                {questions.length} Questions Generated
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                Copy Questions
              </Button>
            </div>
            <div className="bg-gray-50 border rounded-md p-3 max-h-96 overflow-auto">
              {questions.map((q, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="font-medium text-sm mb-2">
                    {index + 1}. {q.question}
                  </p>
                  <div className="ml-4 space-y-1">
                    {q.options.map((option: string, optIndex: number) => (
                      <p 
                        key={optIndex}
                        className={`text-sm ${
                          optIndex === q.correctAnswer 
                            ? 'text-green-600 font-medium' 
                            : 'text-gray-600'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === q.correctAnswer && ' ✓'}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Step2Generate;
