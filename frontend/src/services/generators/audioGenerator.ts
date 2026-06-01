import { apiRequest } from '@/lib/api-utils';
import { AUDIO_MODELS } from "@/lib/aiModels/audioModels";
import { muteBadWords } from "./safety";

export interface AudioRequest {
  text: string;
  language?: string;
  tld?: string;
  model?: string;
  characterName?: string;
}

export interface AudioResponse {
  success: boolean;
  audioUrl?: string;
  message?: string;
}

function validateAudioText(text: string): void {
  if (!text || typeof text !== 'string' || text.trim().length < 2) {
    throw new Error('Acoustic voice script must be at least 2 characters long.');
  }
}

/**
 * Generate high-fidelity TTS voice track proxying the request to our backend.
 */
export const generateAudio = async (request: AudioRequest): Promise<AudioResponse> => {
  const safeText = muteBadWords(request.text);
  validateAudioText(safeText);
  
  // Standardize core parameters drawing defaults cleanly from the registries
  const language = request.language || "en";
  const tld = request.tld || "com";
  const model = request.model || AUDIO_MODELS[0].id;

  const modelFallbacks = [
    model,
    ...AUDIO_MODELS.map(m => m.id).filter(id => id !== model)
  ];

  let lastError: Error | null = null;
  
  for (const currentModel of modelFallbacks) {
    try {
      const res = await apiRequest<AudioResponse>('/api/audio', {
        method: 'POST',
        label: `Generate Audio voiceover (${currentModel})`,
        body: JSON.stringify({
          text: safeText,
          language,
          tld,
          model: currentModel,
          characterName: request.characterName
        })
      });
      return res;
    } catch (error: any) {
      console.warn(`Audio generator channel failed for model ${currentModel}:`, error);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All audio generation models failed.");
};
