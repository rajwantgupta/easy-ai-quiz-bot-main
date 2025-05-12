import React, { useState } from 'react';
import { VideoGeneratorComponent } from '../components/VideoGenerator';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const VideoGeneratorPage: React.FC = () => {
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleVideoGenerated = (videoUrl: string) => {
    setGeneratedVideoUrl(videoUrl);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            AI-Powered Video Generator
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <VideoGeneratorComponent onVideoGenerated={handleVideoGenerated} />
            </div>
            
            {generatedVideoUrl && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Generated Video</h2>
                <video
                  controls
                  className="w-full rounded-lg"
                  src={generatedVideoUrl}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="mt-4">
                  <a
                    href={generatedVideoUrl}
                    download
                    className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                  >
                    Download Video
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">How it works</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Upload your PDF document</li>
              <li>Choose video quality and options</li>
              <li>Our AI will analyze the content</li>
              <li>Generate engaging video with narration</li>
              <li>Download or share your video</li>
            </ol>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}; 