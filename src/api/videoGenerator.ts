import OpenAI from 'openai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TranslationServiceClient } from '@google-cloud/translate';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Google Cloud clients
const ttsClient = new TextToSpeechClient();
const translateClient = new TranslationServiceClient();

export async function generateScript(text: string): Promise<string> {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: `Create a natural-sounding script from the following text:\n\n${text}`,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].text?.trim() || text;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script');
  }
}

export async function generateVisuals(text: string): Promise<any[]> {
  try {
    const response = await openai.images.generate({
      prompt: `Create a visual representation of: ${text}`,
      n: 1,
      size: "1024x1024",
    });

    return [{
      url: response.data[0].url,
      description: text,
    }];
  } catch (error) {
    console.error('Error generating visuals:', error);
    throw new Error('Failed to generate visuals');
  }
}

export async function generateAudio(script: string): Promise<string> {
  try {
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text: script },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    const audioContent = response.audioContent;
    if (!audioContent) {
      throw new Error('No audio content generated');
    }

    // Convert audio content to base64
    const base64Audio = Buffer.from(audioContent).toString('base64');
    return `data:audio/mp3;base64,${base64Audio}`;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Failed to generate audio');
  }
}

export async function generateSubtitles(script: string, language?: string): Promise<string> {
  try {
    if (!language || language === 'en') {
      // If no translation needed, create simple subtitles
      return createSimpleSubtitles(script);
    }

    // Translate the script
    const [translation] = await translateClient.translateText({
      parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/global`,
      contents: [script],
      targetLanguageCode: language,
    });
    
    // Create subtitles with translated text
    return createSimpleSubtitles(translation.translations[0].translatedText);
  } catch (error) {
    console.error('Error generating subtitles:', error);
    throw new Error('Failed to generate subtitles');
  }
}

function createSimpleSubtitles(text: string): string {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Create SRT format
  let srtContent = '';
  let startTime = 0;
  
  sentences.forEach((sentence, index) => {
    const duration = Math.max(2, sentence.length / 10); // Minimum 2 seconds per sentence
    const endTime = startTime + duration;
    
    srtContent += `${index + 1}\n`;
    srtContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    srtContent += `${sentence.trim()}\n\n`;
    
    startTime = endTime;
  });
  
  return srtContent;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(ms, 3)}`;
}

function pad(num: number, size: number = 2): string {
  return num.toString().padStart(size, '0');
} 