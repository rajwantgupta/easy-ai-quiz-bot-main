import React, { useState } from 'react';
import { VideoGenerator } from '../utils/videoGenerator';

interface VideoGeneratorProps {
  onVideoGenerated?: (videoUrl: string) => void;
}

type VideoQuality = 'low' | 'medium' | 'high';

export const VideoGeneratorComponent: React.FC<VideoGeneratorProps> = ({ onVideoGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState({
    quality: 'medium' as VideoQuality,
    includeAudio: true,
    includeSubtitles: true,
    language: 'en'
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      alert('Please select a PDF file first');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      const generator = VideoGenerator.getInstance();
      const videoUrl = await generator.generateVideoFromPDF(file, options);
      
      if (onVideoGenerated) {
        onVideoGenerated(videoUrl);
      }
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Generate Video from PDF</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select PDF File
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary-dark"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Quality
        </label>
        <select
          value={options.quality}
          onChange={(e) => setOptions({ ...options, quality: e.target.value as VideoQuality })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeAudio}
            onChange={(e) => setOptions({ ...options, includeAudio: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="ml-2 text-sm text-gray-700">Include Audio Narration</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.includeSubtitles}
            onChange={(e) => setOptions({ ...options, includeSubtitles: e.target.checked })}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="ml-2 text-sm text-gray-700">Include Subtitles</span>
        </label>
      </div>

      {options.includeSubtitles && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle Language
          </label>
          <select
            value={options.language}
            onChange={(e) => setOptions({ ...options, language: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      )}

      {isGenerating && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Generating video... {progress}%</p>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!file || isGenerating}
        className={`w-full py-2 px-4 rounded-md text-white font-medium
          ${!file || isGenerating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark'
          }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Video'}
      </button>
    </div>
  );
}; 