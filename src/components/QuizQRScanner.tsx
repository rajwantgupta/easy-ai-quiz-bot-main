import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { QrCode, Camera, AlertCircle } from 'lucide-react';
import { validateQuizQR, QuizQRData } from '@/lib/qr-service';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';

const QuizQRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startScanning = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          scanQRCode();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setError('Failed to access camera. Please ensure you have granted camera permissions.');
        setIsScanning(false);
      }
    };

    const stopScanning = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data for QR detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Scan for QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleQRCode(code.data);
        stopScanning();
        setIsScanning(false);
      } else {
        // Continue scanning
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
      }
    };

    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isScanning]);

  const handleQRCode = (qrData: string) => {
    try {
      const quizData = validateQuizQR(qrData);
      if (!quizData) {
        setError('Invalid QR code. Please scan a valid quiz QR code.');
        return;
      }

      // Check expiry date
      if (quizData.expiryDate && new Date(quizData.expiryDate) < new Date()) {
        setError('This quiz has expired.');
        return;
      }

      // Navigate to quiz
      router.push(`/quiz/${quizData.quizId}?accessCode=${quizData.accessCode}`);
    } catch (error) {
      console.error('Error processing QR code:', error);
      setError('Failed to process QR code. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5 text-primary" />
          Scan Quiz QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Scan the QR code to access your quiz. Make sure you have a stable internet connection.
          </p>

          {error && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <div className="flex items-center text-red-800">
                <AlertCircle className="mr-2 h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="relative aspect-square max-w-md mx-auto">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-lg"
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setIsScanning(!isScanning)}
              className="w-full sm:w-auto"
            >
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="font-medium text-sm mb-2">Instructions:</h4>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
              <li>Click "Start Scanning" to activate your camera</li>
              <li>Point your camera at the quiz QR code</li>
              <li>Hold steady until the quiz loads</li>
              <li>If scanning fails, try adjusting the distance or lighting</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQRScanner; 