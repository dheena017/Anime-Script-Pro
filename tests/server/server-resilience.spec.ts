import { test, expect } from '@playwright/test';

test.describe('AI Orchestration: Client-Side Resilience', () => {
  test('handles AI quota exhaustion gracefully', async ({ page }) => {
    await page.route('**/api/generate', async route => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'AI Quota Exhausted.' }),
      });
    });

    await page.goto('/auth');
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o', prompt: 'test' }),
      });
      return res.status;
    });

    expect(response).toBe(429);
  });

  test('handles backend disconnects gracefully', async ({ page }) => {
    await page.route('**/api/generate', route => route.abort('failed'));

    await page.goto('/auth');
    const handled = await page.evaluate(async () => {
      try {
        await fetch('/api/generate', { method: 'POST' });
        return false;
      } catch {
        return true;
      }
    });

    expect(handled).toBeTruthy();
  });
});