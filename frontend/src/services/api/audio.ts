export type AudioRequest = {
  text: string;
  tld?: string;
};

export type AudioResponse = {
  success: boolean;
  audioUrl?: string;
  message?: string;
};

export async function generateAudio(request: AudioRequest): Promise<AudioResponse> {
  if (!request || !request.text || request.text.trim().length === 0) {
    return { success: false, message: 'No text provided for audio generation.' };
  }

  return {
    success: false,
    message: 'Audio generation is currently unavailable in this workspace.',
  };
}
