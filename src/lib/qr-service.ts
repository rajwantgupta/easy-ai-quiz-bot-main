import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export interface QuizQRData {
  quizId: string;
  title: string;
  expiryDate?: string;
  maxAttempts?: number;
  accessCode?: string;
}

export const generateQuizQR = async (quizData: QuizQRData): Promise<string> => {
  try {
    // Generate a unique access code if not provided
    const accessCode = quizData.accessCode || uuidv4().substring(0, 8);
    
    // Create QR data object
    const qrData = {
      ...quizData,
      accessCode,
      timestamp: new Date().toISOString(),
    };

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const validateQuizQR = (qrData: string): QuizQRData | null => {
  try {
    const data = JSON.parse(qrData);
    
    // Validate required fields
    if (!data.quizId || !data.title) {
      return null;
    }

    // Check expiry date if set
    if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error validating QR code:', error);
    return null;
  }
}; 