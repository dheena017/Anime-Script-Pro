import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductionOrchestrator } from './productionOrchestrator';
import { apiRequest } from '@/lib/api-utils';

vi.mock('@/lib/api-utils', () => ({
  apiRequest: vi.fn(),
}));

describe('ProductionOrchestrator - scaffoldGeneration baseline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call apiRequest only once for all scenes (Optimized)', async () => {
    const orchestrator = new ProductionOrchestrator({
      prompt: 'test prompt',
      contentType: 'anime',
      model: 'test-model',
      userId: 'user-123',
    });

    // Manually set project since it's private
    (orchestrator as any).project = { id: 1 };

    // Mock apiRequest to return a list of episodes
    const mockEpisodes = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      episode_number: i + 1,
    }));

    (apiRequest as any).mockImplementation((url: string) => {
      if (url.includes('/api/episodes')) {
        return Promise.resolve(mockEpisodes);
      }
      return Promise.resolve({});
    });

    // Call the private method
    await (orchestrator as any).scaffoldGeneration([]);

    // Verify Optimization: 1 call for episodes + 1 bulk call for scenes
    const sceneCalls = (apiRequest as any).mock.calls.filter((call: any) => call[0] === '/api/scenes');
    expect(sceneCalls.length).toBe(1);

    // Check payload structure
    const bulkPayload = sceneCalls[0][1].body;
    const parsedPayload = JSON.parse(bulkPayload);
    expect(parsedPayload.project_id).toBe(1);
    expect(Array.isArray(parsedPayload.scenes)).toBe(true);
    // 5 episodes * 16 scenes/ep = 80 scenes
    expect(parsedPayload.scenes.length).toBe(80);
    expect(parsedPayload.scenes[0]).toHaveProperty('episode_id');
    expect(parsedPayload.scenes[0]).toHaveProperty('scene_number');

    const episodeCalls = (apiRequest as any).mock.calls.filter((call: any) => call[0].includes('/api/episodes'));
    expect(episodeCalls.length).toBe(1);
  });
});
