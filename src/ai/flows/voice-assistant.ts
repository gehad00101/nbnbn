'use server';
/**
 * @fileOverview A voice assistant flow that answers questions about the business
 * and provides a spoken response.
 *
 * - askVoiceAssistant - Handles a user's question and returns a text and audio answer.
 * - VoiceAssistantInput - The input type for the askVoiceAssistant function.
 * - VoiceAssistantOutput - The return type for the askVoiceAssistant function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

// Mock data - in a real app, this would come from a database.
const mockData = {
  dailySalesData: 'المشروبات الباردة كانت الأكثر مبيعًا اليوم, خاصة بين الساعة 2-5 مساءً.',
  currentInventoryLevels: 'مستوى حبوب البن الإثيوبية منخفض.',
  customerTraffic: 'ذروة حركة العملاء كانت في الصباح الباكر وبعد الظهر.',
};

const VoiceAssistantInputSchema = z.object({
  question: z.string().describe('The user question about their coffee shop business.'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

const VoiceAssistantOutputSchema = z.object({
  answer: z.string().describe('The text answer to the user question.'),
  audio: z.string().describe("The audio response as a base64 encoded WAV data URI."),
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

export async function askVoiceAssistant(input: VoiceAssistantInput): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: { schema: VoiceAssistantInputSchema },
  output: { schema: z.object({ answer: z.string() }) },
  prompt: `You are a helpful AI business assistant for a coffee shop owner.
  Your responses should be concise and to the point.
  Answer the user's question based on the following data.

  Daily Sales Data: ${mockData.dailySalesData}
  Current Inventory Levels: ${mockData.currentInventoryLevels}
  Customer Traffic: ${mockData.customerTraffic}

  Question: {{{question}}}
  Answer:`,
});

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}

const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async (input) => {
    // Generate the text answer first.
    const { output: textOutput } = await prompt(input);
    const answer = textOutput!.answer;

    // Generate the audio response from the text answer.
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: answer,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model.');
    }

    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);

    return {
      answer: answer,
      audio: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
