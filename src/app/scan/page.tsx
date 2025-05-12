import React from 'react';
import QuizQRScanner from '@/components/QuizQRScanner';

export default function ScanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Scan Quiz QR Code</h1>
        <QuizQRScanner />
      </div>
    </div>
  );
} 