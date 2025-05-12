import { PDFDocument } from 'pdf-lib';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { toast } from 'sonner';

interface VideoGenerationOptions {
  quality?: 'low' | 'medium' | 'high';
  includeAudio?: boolean;
  includeSubtitles?: boolean;
  language?: string;
}

export class VideoGenerator {
  private static instance: VideoGenerator;
  private isProcessing: boolean = false;
  private ffmpeg: FFmpeg;

  private constructor() {
    this.ffmpeg = new FFmpeg();
  }

  public static getInstance(): VideoGenerator {
    if (!VideoGenerator.instance) {
      VideoGenerator.instance = new VideoGenerator();
    }
    return VideoGenerator.instance;
  }

  async generateVideoFromPDF(
    pdfFile: File,
    options: VideoGenerationOptions = {}
  ): Promise<string> {
    if (this.isProcessing) {
      throw new Error('Video generation already in progress');
    }

    try {
      this.isProcessing = true;
      
      // Load FFmpeg
      if (!this.ffmpeg.loaded) {
        await this.ffmpeg.load();
      }

      // 1. Extract text from PDF
      const pdfText = await this.extractTextFromPDF(pdfFile);
      
      // 2. Generate script from text
      const script = await this.generateScript(pdfText);
      
      // 3. Create visual elements
      const visuals = await this.createVisuals(pdfText);
      
      // 4. Generate audio if requested
      const audio = options.includeAudio ? await this.generateAudio(script) : null;
      
      // 5. Generate subtitles if requested
      const subtitles = options.includeSubtitles ? await this.generateSubtitles(script, options.language) : null;
      
      // 6. Combine all elements into video
      const videoUrl = await this.combineElements(visuals, audio, subtitles, options);
      
      return videoUrl;
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video. Please try again.');
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  private async extractTextFromPDF(pdfFile: File): Promise<string> {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      let text = '';
      
      // Extract text from each page
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const { text: pageText } = await page.getText();
        text += pageText + '\n';
      }
      
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async generateScript(text: string): Promise<string> {
    try {
      // Use OpenAI API to generate a natural-sounding script
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const data = await response.json();
      return data.script;
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script');
    }
  }

  private async createVisuals(text: string): Promise<any[]> {
    try {
      // Use OpenAI API to generate visual elements
      const response = await fetch('/api/generate-visuals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate visuals');
      }

      const data = await response.json();
      return data.visuals;
    } catch (error) {
      console.error('Error creating visuals:', error);
      throw new Error('Failed to create visuals');
    }
  }

  private async generateAudio(script: string): Promise<string> {
    try {
      // Use text-to-speech API to generate audio
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw new Error('Failed to generate audio');
    }
  }

  private async generateSubtitles(script: string, language?: string): Promise<string> {
    try {
      // Use translation API to generate subtitles
      const response = await fetch('/api/generate-subtitles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate subtitles');
      }

      const data = await response.json();
      return data.subtitlesUrl;
    } catch (error) {
      console.error('Error generating subtitles:', error);
      throw new Error('Failed to generate subtitles');
    }
  }

  private async combineElements(
    visuals: any[],
    audio: string | null,
    subtitles: string | null,
    options: VideoGenerationOptions
  ): Promise<string> {
    try {
      // Write visual elements to FFmpeg virtual filesystem
      for (let i = 0; i < visuals.length; i++) {
        const visual = visuals[i];
        this.ffmpeg.FS('writeFile', `visual_${i}.png`, await fetchFile(visual.url));
      }

      // Write audio to FFmpeg virtual filesystem if available
      if (audio) {
        this.ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audio));
      }

      // Write subtitles to FFmpeg virtual filesystem if available
      if (subtitles) {
        this.ffmpeg.FS('writeFile', 'subtitles.srt', await fetchFile(subtitles));
      }

      // Set video quality parameters
      const qualityParams = {
        low: '-crf 28',
        medium: '-crf 23',
        high: '-crf 18',
      }[options.quality || 'medium'];

      // Combine elements into video
      const command = [
        '-i', 'visual_0.png',
        '-i', 'audio.mp3',
        '-vf', 'subtitles=subtitles.srt',
        qualityParams,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-b:a', '192k',
        'output.mp4'
      ];

      await this.ffmpeg.run(...command);

      // Read the output file
      const data = this.ffmpeg.FS('readFile', 'output.mp4');
      
      // Create a blob URL for the video
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);

      // Clean up FFmpeg virtual filesystem
      this.ffmpeg.FS('unlink', 'output.mp4');
      if (audio) this.ffmpeg.FS('unlink', 'audio.mp3');
      if (subtitles) this.ffmpeg.FS('unlink', 'subtitles.srt');
      visuals.forEach((_, i) => this.ffmpeg.FS('unlink', `visual_${i}.png`));

      return videoUrl;
    } catch (error) {
      console.error('Error combining elements:', error);
      throw new Error('Failed to combine elements into video');
    }
  }
} 