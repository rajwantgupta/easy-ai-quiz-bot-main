import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, File, X, AlertCircle, Info } from "lucide-react";
import { generateQuizQuestions } from "@/utils/quizGenerator";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/plain": [".txt"],
};

type DocumentUploaderProps = {
  onDocumentProcessed: (questions: any[]) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
};

const DocumentUploader = ({ onDocumentProcessed, isProcessing, setIsProcessing }: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large! Maximum size is 10MB");
        return;
      }
      
      setFile(selectedFile);
      toast.success(`File "${selectedFile.name}" selected successfully`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      const validFileType = Object.keys(ACCEPTED_FILE_TYPES).includes(droppedFile.type);
      if (!validFileType) {
        toast.error("Invalid file type. Please upload PDF, DOCX, XLSX or TXT files only.");
        return;
      }
      
      // Check file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large! Maximum size is 10MB");
        return;
      }
      
      setFile(droppedFile);
      toast.success(`File "${droppedFile.name}" dropped successfully`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processDocument = async () => {
    if (!file) {
      toast.error("Please select a file to process");
      return;
    }

    setIsProcessing(true);
    setApiError(null);
    
    try {
      // Read the file content
      const text = await readFileContent(file);
      
      if (!text.trim()) {
        throw new Error("No text content found in the document");
      }
      
      // Generate questions using the actual document content
      const questions = await generateQuizQuestions(text);
      
      if (!questions || questions.length === 0) {
        throw new Error("Failed to generate questions from document");
      }

      onDocumentProcessed(questions);
      
      // Show different messages based on whether we're using fallback questions
      if (questions.length === 3 && questions[0].question === "What is the main topic of the document?") {
        setApiError("API_LIMIT");
        toast.warning("Using fallback questions due to API limitations");
      } else {
        toast.success(`Generated ${questions.length} questions successfully!`);
      }
    } catch (error) {
      console.error("Processing error:", error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('rate limit') || error.message.includes('quota')) {
          setApiError("API_LIMIT");
          toast.error("API rate limit exceeded");
        } else if (error.message.includes('authentication')) {
          setApiError("API_AUTH");
          toast.error("API authentication failed");
        } else if (error.message.includes('unavailable')) {
          setApiError("API_UNAVAILABLE");
          toast.error("OpenAI service is currently unavailable");
        } else {
          toast.error(error.message || "Failed to process document");
        }
      } else {
        toast.error("Failed to process document");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to read file content
  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result;
          
          if (!content) {
            throw new Error("Failed to read file content");
          }
          
          // Handle different file types
          if (file.type === "application/pdf") {
            // For PDF files, we'll need to extract text
            const pdfText = await extractTextFromPDF(content as ArrayBuffer);
            resolve(pdfText);
          } else if (file.type === "text/plain") {
            // For text files, content is already in text format
            resolve(content as string);
          } else if (file.type.includes("wordprocessingml.document")) {
            // For DOCX files, we'll need to extract text
            const docxText = await extractTextFromDOCX(content as ArrayBuffer);
            resolve(docxText);
          } else if (file.type.includes("spreadsheetml.sheet")) {
            // For XLSX files, we'll need to extract text
            const xlsxText = await extractTextFromXLSX(content as ArrayBuffer);
            resolve(xlsxText);
          } else {
            reject(new Error("Unsupported file type"));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      
      // Read file as ArrayBuffer for binary files (PDF, DOCX, XLSX)
      if (file.type !== "text/plain") {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // Helper functions for different file types
  const extractTextFromPDF = async (content: ArrayBuffer): Promise<string> => {
    try {
      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(content);
      
      // Load the PDF document with more options
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/'
      });

      const pdf = await loadingTask.promise;
      let fullText = '';
      
      // Process each page
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Extract text items and join them with proper spacing
          const pageText = textContent.items
            .map((item: any) => {
              // Handle different types of text items
              if (item.str) {
                return item.str;
              } else if (item.text) {
                return item.text;
              }
              return '';
            })
            .filter(Boolean)
            .join(' ');
            
          fullText += pageText + '\n';
        } catch (pageError) {
          console.warn(`Error processing page ${i}:`, pageError);
          // Continue with next page even if one fails
          continue;
        }
      }
      
      if (!fullText.trim()) {
        throw new Error("No text content found in PDF");
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
      }
      throw new Error('Failed to extract text from PDF. Please ensure the PDF contains text and is not scanned.');
    }
  };

  const extractTextFromDOCX = async (content: ArrayBuffer): Promise<string> => {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: content });
      if (!result.value.trim()) {
        throw new Error("No text content found in DOCX");
      }
      return result.value;
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      throw new Error('Failed to extract text from DOCX. Please ensure the document contains text.');
    }
  };

  const extractTextFromXLSX = async (content: ArrayBuffer): Promise<string> => {
    try {
      const workbook = XLSX.read(content, { type: 'array' });
      let fullText = '';
      
      // Process each sheet
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Convert each row to text
        jsonData.forEach((row: any[]) => {
          if (Array.isArray(row)) {
            fullText += row.join(' ') + '\n';
          }
        });
      });
      
      if (!fullText.trim()) {
        throw new Error("No text content found in XLSX");
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from XLSX:', error);
      throw new Error('Failed to extract text from XLSX. Please ensure the spreadsheet contains data.');
    }
  };

  const renderApiError = () => {
    if (!apiError) return null;

    switch (apiError) {
      case "API_LIMIT":
        return (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Rate Limit Exceeded</AlertTitle>
            <AlertDescription className="mt-2">
              <p>We've hit the API rate limit. Here's what you can do:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Try again in a few minutes</li>
                <li>Upgrade your OpenAI plan</li>
                <li>Use a different API key</li>
              </ul>
              <p className="mt-2 text-sm">
                For now, we're using some basic questions to help you continue.
              </p>
            </AlertDescription>
          </Alert>
        );
      case "API_AUTH":
        return (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Authentication Failed</AlertTitle>
            <AlertDescription>
              Please check your OpenAI API key configuration.
            </AlertDescription>
          </Alert>
        );
      case "API_UNAVAILABLE":
        return (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Service Unavailable</AlertTitle>
            <AlertDescription>
              OpenAI service is currently unavailable. Please try again later.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center h-48 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer p-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={Object.entries(ACCEPTED_FILE_TYPES)
                .map(([mimeType, extensions]) => extensions.join(","))
                .join(",")}
            />
            
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {file ? file.name : "Drop your file here, or click to browse"}
            </p>
            <p className="text-xs text-gray-500">
              Supports PDF, DOCX, XLSX, and TXT (Max 10MB)
            </p>
          </div>
          
          {file && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center">
                <File className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                  setApiError(null);
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          <div className="mt-4">
            <Button 
              onClick={processDocument} 
              disabled={!file || isProcessing} 
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing Document...
                </>
              ) : (
                "Generate Quiz Questions"
              )}
            </Button>
          </div>

          {renderApiError()}

          {!apiError && (
            <div className="mt-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tips for best results</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Use documents with clear, readable text</li>
                    <li>Keep file size under 10MB</li>
                    <li>PDFs should not be scanned images</li>
                    <li>Documents should be in English</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUploader;
