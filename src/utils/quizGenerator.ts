import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment variable
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
});

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

// Fallback questions in case of API errors
const fallbackQuestions: QuizQuestion[] = [
  {
    question: "What is the main topic of the document?",
    options: [
      "Technical specifications",
      "Business strategy",
      "Project management",
      "Customer service"
    ],
    correctAnswer: 0
  },
  {
    question: "Which section contains the most important information?",
    options: [
      "Introduction",
      "Methodology",
      "Results",
      "Conclusion"
    ],
    correctAnswer: 2
  },
  {
    question: "What is the primary goal mentioned in the document?",
    options: [
      "Increase efficiency",
      "Reduce costs",
      "Improve quality",
      "Expand market share"
    ],
    correctAnswer: 0
  }
];

export async function generateQuizQuestions(text: string): Promise<QuizQuestion[]> {
  try {
    // Prepare the prompt for question generation
    const prompt = `You are a quiz generator assistant for corporate training.

Based on the following document content, create up to 20 multiple-choice questions (MCQs) with 4 options each (A–D) and clearly mark the correct answer.

Guidelines:
1. Questions should test understanding of key concepts
2. Each question should have exactly 4 options
3. Mark the correct answer clearly
4. Keep language simple and professional
5. Focus on important information
6. Questions should be based on the actual content provided
7. Generate as many questions as possible (up to 20) based on the content
8. Ensure questions cover different aspects of the content
9. Include both basic and advanced level questions

Here is the document content:
${text.substring(0, 3000)}${text.length > 3000 ? '...' : ''}`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates quiz questions based on provided content. Return the questions in a structured format. Generate as many questions as possible (up to 20) based on the content's depth and complexity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    // Parse the questions from the response
    const questions = parseQuestions(content);
    return questions;

  } catch (error) {
    console.error("Error generating questions:", error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        throw new Error("API rate limit exceeded. Please try again later or upgrade your plan.");
      } else if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error("API authentication failed. Please check your API key.");
      } else if (error.message.includes('500') || error.message.includes('503')) {
        throw new Error("OpenAI service is currently unavailable. Please try again later.");
      }
    }
    
    // Return fallback questions for other errors
    console.warn("Using fallback questions due to API error");
    return fallbackQuestions;
  }
}

function parseQuestions(content: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const lines = content.split('\n');
  
  let currentQuestion: Partial<QuizQuestion> | null = null;
  let currentOptions: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check for question start
    if (trimmedLine.match(/^Question\s*\d+:/) || trimmedLine.match(/^\d+\.\s*[A-Z]/)) {
      // Save previous question if it exists
      if (currentQuestion && currentOptions.length > 0) {
        questions.push({
          question: currentQuestion.question!,
          options: currentOptions,
          correctAnswer: currentQuestion.correctAnswer!
        });
      }
      
      // Start new question
      const questionText = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
      currentQuestion = { question: questionText };
      currentOptions = [];
    }
    // Check for option
    else if (trimmedLine.match(/^[A-D][).:]?\s+/) || trimmedLine.match(/^[a-d][).:]?\s+/)) {
      const option = trimmedLine.substring(trimmedLine.indexOf(' ') + 1).trim();
      currentOptions.push(option);
    }
    // Check for correct answer
    else if (trimmedLine.toLowerCase().includes('correct answer:') || 
             trimmedLine.toLowerCase().includes('answer:')) {
      const answerText = trimmedLine.substring(trimmedLine.indexOf(':') + 1).trim();
      let correctAnswerIndex = 0;
      
      // Parse the correct answer letter
      if (answerText.match(/^[A-Da-d]/)) {
        const letter = answerText.charAt(0).toUpperCase();
        correctAnswerIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0);
      } else if (answerText.includes('A')) correctAnswerIndex = 0;
      else if (answerText.includes('B')) correctAnswerIndex = 1;
      else if (answerText.includes('C')) correctAnswerIndex = 2;
      else if (answerText.includes('D')) correctAnswerIndex = 3;
      
      if (currentQuestion) {
        currentQuestion.correctAnswer = correctAnswerIndex;
      }
    }
  }
  
  // Add the last question
  if (currentQuestion && currentOptions.length > 0) {
    questions.push({
      question: currentQuestion.question!,
      options: currentOptions,
      correctAnswer: currentQuestion.correctAnswer!
    });
  }
  
  return questions;
} 