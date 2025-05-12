import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Table, ExternalLink, RefreshCw, FileSpreadsheet } from "lucide-react";

interface Step6TrackProps {
  savedQuizId: string | null;
  onViewResults: () => void;
}

interface QuizResponse {
  id: string;
  candidateName: string;
  email: string;
  score: number;
  passed: boolean;
  completedAt: string;
  quizId: string;
}

const Step6Track = ({ savedQuizId, onViewResults }: Step6TrackProps) => {
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  
  useEffect(() => {
    loadResponses();
  }, [savedQuizId]);
  
  const loadResponses = async () => {
    if (!savedQuizId) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll use localStorage
      const savedResponses = JSON.parse(localStorage.getItem("quizResponses") || "[]");
      const quizResponses = savedResponses.filter((r: QuizResponse) => r.quizId === savedQuizId);
      setResponses(quizResponses);
    } catch (error) {
      console.error("Error loading responses:", error);
      toast.error("Failed to load responses");
    } finally {
      setIsLoading(false);
    }
  };
  
  const createResponseSheet = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would use the Google Sheets API
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock sheet URL
      const mockSheetId = Math.random().toString(36).substring(7);
      const mockSheetUrl = `https://docs.google.com/spreadsheets/d/${mockSheetId}/edit`;
      setSheetUrl(mockSheetUrl);
      
      // Format responses for Google Sheets
      const sheetData = responses.map(r => ({
        "Candidate Name": r.candidateName,
        "Email": r.email,
        "Score": r.score,
        "Status": r.passed ? "Passed" : "Failed",
        "Completed At": new Date(r.completedAt).toLocaleString()
      }));
      
      // In a real implementation, this would write to the sheet
      console.log("Sheet data:", sheetData);
      
      toast.success("Response tracking sheet created!");
      
      // Open the sheet in a new tab
      window.open(mockSheetUrl, "_blank");
    } catch (error) {
      toast.error("Failed to create tracking sheet");
      console.error("Sheet creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const openResponseSheet = () => {
    if (sheetUrl) {
      window.open(sheetUrl, "_blank");
    } else {
      window.open("https://sheets.google.com", "_blank");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Table className="mr-2 h-5 w-5 text-primary" />
          Step 6: Track Responses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Track candidate responses and create a response tracking sheet in Google Sheets.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
            <h4 className="font-medium text-sm mb-3">Response Tracking Instructions:</h4>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li>Click "Create Tracking Sheet" to create a new Google Sheet for tracking responses</li>
              <li>The sheet will include:</li>
              <ul className="list-disc pl-5 mt-1">
                <li>Candidate Name</li>
                <li>Email</li>
                <li>Score</li>
                <li>Pass/Fail Status</li>
                <li>Completion Date/Time</li>
              </ul>
              <li>Use this sheet to monitor candidate progress and results</li>
            </ol>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Candidate</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Email</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Score</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Status</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Completed</th>
                </tr>
              </thead>
              <tbody>
                {responses.length > 0 ? (
                  responses.map((response) => (
                    <tr key={response.id} className="border-b border-gray-200">
                      <td className="py-2 px-3 text-gray-800">{response.candidateName}</td>
                      <td className="py-2 px-3 text-gray-800">{response.email}</td>
                      <td className="py-2 px-3 text-gray-800">{response.score}%</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          response.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {response.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-800">
                        {new Date(response.completedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No responses yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={createResponseSheet}
              disabled={!responses.length || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating Sheet...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Create Tracking Sheet
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={openResponseSheet}
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {sheetUrl ? "Open Tracking Sheet" : "Open Google Sheets"}
            </Button>
            
            <Button
              onClick={onViewResults}
              className="flex-1"
            >
              <Table className="mr-2 h-4 w-4" />
              View Detailed Results
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step6Track;
