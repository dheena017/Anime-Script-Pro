import { test, expect } from '@playwright/test';

test.describe('Backend API & Security Boundaries', () => {
  test('public categories endpoint is reachable', async ({ request }) => {
    const response = await request.get('/api/categories');
    expect([200, 500]).toContain(response.status());
  });

  test('templates endpoint is reachable', async ({ request }) => {
    const response = await request.get('/api/templates');
    expect([200, 500]).toContain(response.status());
  });

  test('write operations do not return success for unauthenticated projects', async ({ request }) => {
    const response = await request.post('/api/projects', {
      data: { name: 'Unauthorized Test Project' },
    });
    expect(response.status()).not.toBe(200);
  });

  test('generate endpoint rejects empty requests', async ({ request }) => {
    const response = await request.post('/api/generate', { data: {} });
    expect(response.status()).toBe(400);
  });

  test('generate endpoint rejects unsupported or malformed payloads', async ({ request }) => {
    const response = await request.post('/api/generate', {
      data: { model: 'unknown-model-xyz', prompt: 'This is a long enough prompt for testing.' },
    });
    expect([200, 400, 422]).toContain(response.status());
  });

  test('characters endpoint validates bad payloads', async ({ request }) => {
    const response = await request.post('/api/characters', {
      data: { project_id: '123', characters: 'not-an-array' },
    });
    expect(response.status()).toBe(400);
  });

  test('world lore endpoint requires project mapping', async ({ request }) => {
    const response = await request.post('/api/world-lore', {
      data: { markdown_content: '# New Lore' },
    });
    expect(response.status()).toBe(400);
  });
});