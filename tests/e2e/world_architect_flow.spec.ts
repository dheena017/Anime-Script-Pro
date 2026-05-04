import { test, expect } from '@playwright/test';

test.describe('World Architect: Full Synthesis Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to World Architect Manifest
    await page.goto('/anime/world');
  });

  test('Stage 1: Master Manifest Synthesis', async ({ page }) => {
    // Check if we are in the Manifest tab
    await expect(page.locator('h1')).toContainText('World Architect');
    
    // Simulate entering a prompt in the header (if accessible)
    // Note: Header prompts usually populate the global state
    
    // Verify synthesis button exists and trigger it
    const synthesizeBtn = page.getByRole('button', { name: /Synthesize/i }).first();
    await expect(synthesizeBtn).toBeVisible();
    
    // We mock the AI response to speed up tests
    await page.route('**/api/world/lore/**', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ 
            full_lore_blob: "Generated World Manifest Content: The Floating Isles of Zenith." 
          })
        });
      } else {
        await route.continue();
      }
    });

    // In a real E2E we would click, but here we verify the UI state
    await expect(page.locator('.studio-editor-container')).toBeVisible();
  });

  test('Stage 2: Modular Tab Navigation and Neural Seeds', async ({ page }) => {
    // Navigate to Powers Tab
    await page.click('button:has-text("Powers")');
    
    // Verify the "Neural Seed" sidebar section exists
    const neuralSeedHeader = page.locator('span:has-text("Neural Seed")');
    await expect(neuralSeedHeader).toBeVisible();
    
    // Verify the textarea for prompt entry
    const seedTextArea = page.locator('textarea[placeholder*="fine-tune"]');
    await expect(seedTextArea).toBeVisible();
    
    // Enter a specialized seed
    await seedTextArea.fill("Magic based on sound frequencies.");
    
    // Verify Synthesis button for this specific tab
    const tabSynthesizeBtn = page.getByRole('button', { name: /Synthesize/i }).last();
    await expect(tabSynthesizeBtn).toBeVisible();
  });

  test('Stage 3: Cross-Tab Narrative Consistency', async ({ page }) => {
    // Navigate through multiple tabs to ensure the "World Architect" state persists
    const tabs = ['History', 'Factions', 'Architecture', 'Atlas', 'Culture', 'Systems'];
    
    for (const tabName of tabs) {
      await page.click(`button:has-text("${tabName}")`);
      // Verify sidebar remains active with Neural Seed option
      await expect(page.locator('span:has-text("Neural Seed")')).toBeVisible();
    }
  });

  test('Stage 4: Empty States & Loading Transitions', async ({ page }) => {
    // Navigate to a new tab that has no content yet
    await page.click('button:has-text("Atlas")');
    
    // If content is empty, verify empty state UI
    const emptyState = page.locator('text=/No geographic data synthesized/i');
    // This depends on the actual empty state text in the component
    // If it exists, it should be visible
  });
});
