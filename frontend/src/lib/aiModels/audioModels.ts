import type { AIModel } from '../aiModels';

export const AUDIO_MODELS: AIModel[] = [
  { id: 'gemini-2.5-flash-tts', name: 'Gemini 2.5 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 2.5 with TTS capabilities', isFree: true },
  { id: 'gemini-2.5-pro-tts', name: 'Gemini 2.5 Pro TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 2.5 Pro TTS capabilities', isFree: false },
  { id: 'gemini-3.1-flash-tts', name: 'Gemini 3.1 Flash TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'High-fidelity voice synthesis', isFree: true },
  { id: 'gemini-2.5-flash-native-audio', name: 'Gemini 2.5 Flash Native Audio Dialog', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Native live audio dialog feedback', isFree: true },
  { id: 'gemini-3-flash-live', name: 'Gemini 3 Flash Live', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Gemini 3 Live Real-Time voice API', isFree: true },
  { id: 'whisper-1', name: 'Whisper (OpenAI)', category: 'tts', capabilities: ['multi-modal','tts'], description: 'OpenAI Whisper speech-to-text model', isFree: true },
  { id: 'fish-speech', name: 'Fish Speech', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Free speech synthesis and conversion model', isFree: true },
  { id: 'gpt-sovits', name: 'GPT-SoVITS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Voice cloning and speech synthesis model', isFree: true },
  { id: 'chattts', name: 'ChatTTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Conversational text-to-speech model', isFree: true },
  { id: 'bark', name: 'Bark (by Suno)', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Suno Bark expressive speech model', isFree: true },
  { id: 'elevenlabs-tts', name: 'ElevenLabs TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Professional hyper-realistic voice cloning and TTS API', isFree: false },
  { id: 'runway-tts', name: 'Runway TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Runway ML advanced voice synthesis', isFree: false },
  { id: 'aws-polly', name: 'Amazon Polly', category: 'tts', capabilities: ['multi-modal','tts'], description: 'Cloud TTS with lifelike voices', isFree: false },
  { id: 'gcp-tts', name: 'Google Cloud TTS', category: 'tts', capabilities: ['multi-modal','tts'], description: 'DeepMind WaveNet standard speech synthesis', isFree: true }
];

export default AUDIO_MODELS;
