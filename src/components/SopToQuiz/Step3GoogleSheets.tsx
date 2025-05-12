import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileSpreadsheet, Copy, ExternalLink } from "lucide-react";
import { google } from "googleapis";

interface Step3GoogleSheetsProps {
  questions: any[];
}

const Step3GoogleSheets = ({ questions }: Step3GoogleSheetsProps) => {
  const [sopTitle, setSopTitle] = useState<string>("Leave Policy");
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  
  useEffect(() => {
    // Try to get the SOP title from localStorage
    const savedTitle = localStorage.getItem("currentSopTitle");
    if (savedTitle) {
      setSopTitle(savedTitle);
    }
  }, []);
  
  const generateSheetData = () => {
    if (!questions || questions.length === 0) return [];
    
    // Headers
    const headers = [
      "SOP Title",
      "Original Policy Text",
      "Question",
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Correct Answer"
    ];
    
    // Data rows
    const rows = questions.map(q => {
      const correctLetter = String.fromCharCode(65 + q.correctAnswer);
      return [
        sopTitle,
        "-",
        q.question,
        q.options[0],
        q.options[1],
        q.options[2],
        q.options[3],
        `Option ${correctLetter}`
      ];
    });
    
    return [headers, ...rows];
  };

  const copyToClipboard = () => {
    const data = generateSheetData();
    
    if (!data.length) {
      toast.error("No questions to copy");
      return;
    }
    
    const text = data.map(row => row.join('\t')).join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Questions copied in spreadsheet format!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  const createGoogleSheet = async () => {
    setIsCreatingSheet(true);
    try {
      // Initialize Google Sheets API
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}"),
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      const sheets = google.sheets({ version: 'v4', auth });
      
      // Create a new spreadsheet
      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `${sopTitle} Quiz Questions`
          }
        }
      });
      
      const spreadsheetId = spreadsheet.data.spreadsheetId;
      
      if (!spreadsheetId) {
        throw new Error("Failed to create spreadsheet");
      }
      
      // Prepare the data
      const data = generateSheetData();
      
      // Update the spreadsheet with the data
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: data
        }
      });
      
      // Format the spreadsheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  startRowIndex: 0,
                  endRowIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.8,
                      green: 0.8,
                      blue: 0.8
                    },
                    textFormat: {
                      bold: true
                    }
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: {
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 8
                }
              }
            }
          ]
        }
      });
      
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
      setSheetUrl(sheetUrl);
      
      toast.success("Google Sheet created successfully!");
      
      // Open the sheet in a new tab
      window.open(sheetUrl, "_blank");
    } catch (error) {
      console.error("Sheet creation error:", error);
      toast.error("Failed to create Google Sheet. Please check your Google API credentials.");
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const openGoogleSheets = () => {
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
          <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
          Step 3: Prepare for Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
            <label className="text-sm font-medium w-full sm:w-auto">SOP Title:</label>
            <input 
              type="text" 
              value={sopTitle}
              onChange={(e) => setSopTitle(e.target.value)}
              className="w-full sm:w-auto flex-1 px-3 py-2 border rounded-md"
            />
          </div>
          
          <p className="text-sm text-gray-600">
            Create a Google Sheet to store and manage your quiz questions. You can either create a new sheet automatically or copy the formatted questions to paste into an existing sheet.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2">
            <h4 className="font-medium text-sm mb-3">Google Sheets Instructions:</h4>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
              <li>Click "Create Google Sheet" to automatically create a new sheet with your questions</li>
              <li>Or click "Copy for Google Sheets" to copy the formatted questions</li>
              <li>If copying manually:</li>
              <ul className="list-disc pl-5 mt-1">
                <li>Create a new blank spreadsheet</li>
                <li>Click on cell A1</li>
                <li>Paste the content (Ctrl+V or Cmd+V)</li>
                <li>The data will automatically format into columns</li>
              </ul>
              <li>Use this spreadsheet for question management and reference</li>
            </ol>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-500">SOP Title</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Question</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option A</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option B</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option C</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Option D</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-500">Correct</th>
                </tr>
              </thead>
              <tbody>
                {questions.slice(0, 5).map((q, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-3">{sopTitle}</td>
                    <td className="py-2 px-3">{q.question}</td>
                    <td className="py-2 px-3">{q.options[0]}</td>
                    <td className="py-2 px-3">{q.options[1]}</td>
                    <td className="py-2 px-3">{q.options[2]}</td>
                    <td className="py-2 px-3">{q.options[3]}</td>
                    <td className="py-2 px-3">Option {String.fromCharCode(65 + q.correctAnswer)}</td>
                  </tr>
                ))}
                {questions.length > 5 && (
                  <tr>
                    <td colSpan={7} className="py-2 px-3 text-center text-gray-500">
                      ...and {questions.length - 5} more questions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={createGoogleSheet}
              disabled={isCreatingSheet || !questions.length}
              className="flex-1"
            >
              {isCreatingSheet ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Creating Sheet...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Create Google Sheet
                </>
              )}
            </Button>
            
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex-1"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy for Google Sheets
            </Button>
            
            <Button
              onClick={openGoogleSheets}
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {sheetUrl ? "Open Created Sheet" : "Open Google Sheets"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step3GoogleSheets;
