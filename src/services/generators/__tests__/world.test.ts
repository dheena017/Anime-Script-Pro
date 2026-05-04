import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as worldGenerators from '../world';
import * as worldPrompts from '../../prompts/world';
import { callAI } from '../core';

// Mock the AI call
vi.mock('../core', () => ({
  callAI: vi.fn().mockResolvedValue("Mock AI Response"),
  RateLimitError: class extends Error {}
}));

describe('World Architect Synthesis Flow', () => {
  const mockPrompt = "A floating city powered by captured lightning where class is determined by altitude.";
  const mockModel = "gemini-2.0-flash";
  const mockContentType = "Anime";
  const mockContext = "Master World Manifest Content...";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Stage 1: Master Manifest Generation', () => {
    it('should call the AI with the master world prompt', async () => {
      await worldGenerators.generateWorld(mockPrompt, mockModel, mockContentType);
      
      const expectedSystemPrompt = worldPrompts.WORLD_GENERATION_PROMPT(mockContentType);
      expect(callAI).toHaveBeenCalledWith(
        mockModel,
        expect.stringContaining(mockPrompt),
        expectedSystemPrompt
      );
    });

    it('should throw error if prompt is too short', async () => {
      await expect(worldGenerators.generateWorld("Too short", mockModel))
        .rejects.toThrow('World prompt must be at least 20 characters long.');
    });
  });

  describe('Stage 2: Modular Synthesis (Specialized Tabs)', () => {
    it('should generate Power System using specialized prompt and context', async () => {
      const powerSeed = "Music frequency based magic.";
      await worldGenerators.generatePowerSystem(powerSeed, mockModel, mockContentType, mockContext);

      const expectedSystemPrompt = worldPrompts.POWER_SYSTEM_PROMPT(powerSeed, "Universal System");
      expect(callAI).toHaveBeenCalledWith(
        mockModel,
        expect.stringContaining(powerSeed),
        expectedSystemPrompt
      );
      
      // Ensure the context (Master Manifest) was passed to the AI
      expect(callAI).lastCalledWith(
        expect.anything(),
        expect.stringContaining(mockContext),
        expect.anything()
      );
    });

    it('should generate Atlas using specialized geographic prompt', async () => {
      await worldGenerators.generateAtlas(mockPrompt, mockModel, mockContentType, mockContext);
      
      expect(callAI).toHaveBeenCalledWith(
        mockModel,
        expect.stringContaining("Develop a geographical atlas"),
        expect.stringContaining("expert Geographic Cartographer")
      );
    });

    it('should generate Systems using specialized tech prompt', async () => {
      await worldGenerators.generateSystems(mockPrompt, mockModel, mockContentType, mockContext);
      
      expect(callAI).toHaveBeenCalledWith(
        mockModel,
        expect.stringContaining("Architect the mechanical logic"),
        expect.stringContaining("expert Systems Architect")
      );
    });
  });

  describe('Stage 3: Data Integrity', () => {
    it('should return a valid ParsedWorldLore object', () => {
      const blob = "Sample world manifest text";
      const result = worldGenerators.parseWorldLore(blob);
      expect(result).toHaveProperty('manifest', blob);
    });
  });
});
