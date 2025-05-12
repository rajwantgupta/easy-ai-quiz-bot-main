import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { QrCode, Download, Share2, Calendar, Users } from 'lucide-react';
import { generateQuizQR, QuizQRData } from '@/lib/qr-service';

interface QuizQRShareProps {
  quizId: string;
  quizTitle: string;
}

const QuizQRShare = ({ quizId, quizTitle }: QuizQRShareProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [maxAttempts, setMaxAttempts] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      const quizData: QuizQRData = {
        quizId,
        title: quizTitle,
        expiryDate: expiryDate || undefined,
        maxAttempts: maxAttempts || undefined,
      };

      const qrDataUrl = await generateQuizQR(quizData);
      setQrCode(qrDataUrl);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `quiz_${quizId}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQR = async () => {
    if (!qrCode) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Quiz: ${quizTitle}`,
          text: `Scan this QR code to take the ${quizTitle} quiz!`,
          files: [await fetch(qrCode).then(r => r.blob())],
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Quiz link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      toast.error('Failed to share QR code');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5 text-primary" />
          Share Quiz via QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate a QR code to share this quiz with candidates. You can set an expiry date and maximum attempts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Maximum Attempts (Optional)</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="0"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                placeholder="0 for unlimited"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={generateQR}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>

          {qrCode && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={qrCode}
                  alt="Quiz QR Code"
                  className="w-64 h-64 border rounded-lg"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>

                <Button
                  onClick={shareQR}
                  variant="outline"
                  className="flex-1"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share QR Code
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium text-sm mb-2">QR Code Details:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {expiryDate ? `Expires: ${new Date(expiryDate).toLocaleString()}` : 'No expiry date'}
                  </li>
                  <li className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {maxAttempts ? `Max attempts: ${maxAttempts}` : 'Unlimited attempts'}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQRShare; 