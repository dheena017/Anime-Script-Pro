import { test, expect } from '@playwright/test';
import {
  generateAtlas,
  generateCulture,
  generatePowerSystem,
  generateSystems,
  generateWorld,
  parseWorldLore,
  __setWorldCallAIForTests,
} from '../../frontend/src/services/generators/world';
import {
  WORLD_GENERATION_PROMPT,
  POWER_SYSTEM_PROMPT,
  CULTURE_GENERATION_PROMPT,
  SYSTEMS_GENERATION_PROMPT,
} from '../../frontend/src/services/prompts/world';

test.describe.serial('World Generator Unit Tests', () => {
  const mockPrompt = 'A floating city powered by captured lightning where class is determined by altitude.';
  const mockModel = 'gemini-2.0-flash';
  const mockContentType = 'Anime';
  const mockContext = 'Master World Manifest Content...';

  const callLog: unknown[][] = [];
  const mockCallAI = async (...args: unknown[]) => {
    callLog.push(args);
    return 'Mock AI Response';
  };

  test.beforeEach(() => {
    callLog.length = 0;
    __setWorldCallAIForTests(mockCallAI as any);
  });

  test.afterEach(() => {
    __setWorldCallAIForTests(null);
  });

  test('calls the AI with the master world prompt', async () => {
    const result = await generateWorld(mockPrompt, mockModel, mockContentType);

    expect(result).toBe('Mock AI Response');
    expect(callLog.length).toBe(1);
    expect(callLog[0][0]).toBe(mockModel);
    expect(String(callLog[0][1])).toContain(mockPrompt);
    expect(callLog[0][2]).toBe(WORLD_GENERATION_PROMPT(mockContentType));
  });

  test('throws when the prompt is too short', async () => {
    await expect(generateWorld('Too short', mockModel)).rejects.toThrow(
      'World prompt must be at least 20 characters long.',
    );
  });

  test('generates power system with specialized prompt and context', async () => {
    const powerSeed = 'Music frequency based magic.';
    await generatePowerSystem(powerSeed, mockModel, mockContentType, mockContext);

    expect(callLog.length).toBe(1);
    expect(callLog[0][0]).toBe(mockModel);
    expect(String(callLog[0][1])).toContain(powerSeed);
    expect(callLog[0][2]).toBe(POWER_SYSTEM_PROMPT(powerSeed, 'Universal System'));
    expect(String(callLog[0][1])).toContain(mockContext);
  });

  test('generates atlas using specialized geographic prompt', async () => {
    await generateAtlas(mockPrompt, mockModel, mockContentType, mockContext);

    expect(callLog.length).toBe(1);
    expect(callLog[0][0]).toBe(mockModel);
    expect(String(callLog[0][1])).toContain('Develop a geographical atlas');
    expect(String(callLog[0][2])).toContain('expert Geographic Cartographer');
  });

  test('generates culture using specialized societal prompt', async () => {
    await generateCulture(mockPrompt, mockModel, mockContentType, mockContext);

    expect(callLog.length).toBe(1);
    expect(callLog[0][0]).toBe(mockModel);
    expect(String(callLog[0][1])).toContain('Develop a cultural profile');
    expect(callLog[0][2]).toBe(CULTURE_GENERATION_PROMPT(mockContentType));
  });

  test('generates systems using specialized technical prompt', async () => {
    await generateSystems(mockPrompt, mockModel, mockContentType, mockContext);

    expect(callLog.length).toBe(1);
    expect(callLog[0][0]).toBe(mockModel);
    expect(String(callLog[0][1])).toContain('Architect the mechanical logic');
    expect(callLog[0][2]).toBe(SYSTEMS_GENERATION_PROMPT(mockContentType));
  });

  test('parses world lore blobs into a manifest payload', () => {
    const blob = 'Sample world manifest text';
    const result = parseWorldLore(blob);
    expect(result).toHaveProperty('manifest', blob);
  });
});