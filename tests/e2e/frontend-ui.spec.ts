import { test, expect } from '@playwright/test';

test.describe('Public Access & Branding', () => {
  test('loads the landing page with branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Autonomous Production Engine v2.0', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /TURN YOUR IMAGINATION/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /discover/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /community/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /anime world/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Generating for Free/i })).toBeVisible();
  });

  test('loads the auth portal and login controls', async ({ page }) => {
    await page.goto('/auth');
    const main = page.locator('main');
    await expect(main.getByRole('heading', { name: /Access Portal/i })).toBeVisible();
    await expect(main.getByLabel(/node identity|email/i)).toBeVisible();
    await expect(main.getByLabel(/cryptographic key|password/i)).toBeVisible();
    await expect(main.getByRole('button', { name: /Log In|Sign In|Initialize Node|Establish Neural Link/i })).toBeVisible();
    await expect(main.getByRole('button', { name: /Log In|Sign In|Initialize Node|Establish Neural Link/i })).toHaveCSS('cursor', 'pointer');
  });
});

test.describe('Navigation Smoke Tests', () => {
  test('redirects protected studio routes to auth when unauthenticated', async ({ page }) => {
    for (const route of ['/anime/script', '/anime/cast', '/anime/world', '/anime/engine']) {
      await page.goto(route);
      await page.waitForURL(url => url.pathname.includes('/auth') || url.pathname === '/', { timeout: 10000 });
      expect(page.url()).toMatch(/.*(auth|127\.0\.0\.1:3000\/)$/);
    }
  });

  test('core public and studio routes resolve', async ({ page }) => {
    const routes = [
      ['/discover', /Discover/i],
      ['/community', /Social Hub/i],
      ['/tutorials', /LEARNING CENTER/i],
      ['/settings', /Settings/i],
      ['/dashboard', /Sign In|Dashboard/i],
      ['/library', /Sign In|Production History/i],
    ] as const;

    for (const [route, heading] of routes) {
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      if (page.url().includes('/auth')) {
        await expect(page.locator('main').getByRole('heading', { name: /sign in/i })).toBeVisible();
      } else {
        await expect(page.locator('main').getByRole('heading', { name: heading })).toBeVisible();
      }
    }
  });
});

test.describe('Anime Studio Panels', () => {
  test('world architect flow remains navigable', async ({ page }) => {
    await page.goto('/anime/world');

    if (page.url().includes('/auth')) {
      await expect(page.locator('main').getByRole('heading', { name: /sign in/i })).toBeVisible();
      return;
    }

    await expect(page.locator('h1')).toContainText(/world architect/i);
    await expect(page.getByRole('button', { name: /synthesize/i }).first()).toBeVisible();

    for (const tab of ['History', 'Factions', 'Architecture', 'Atlas', 'Culture', 'Systems']) {
      await page.click(`button:has-text("${tab}")`);
      await expect(page.locator('span:has-text("Neural Seed")')).toBeVisible();
    }
  });

  test('production core panel renders expected controls', async ({ page }) => {
    await page.goto('/anime/script');

    if (page.url().includes('/auth')) {
      await expect(page.locator('main').getByRole('heading', { name: /sign in/i })).toBeVisible();
      return;
    }

    await expect(page.getByText('Production Core')).toBeVisible();
    await expect(page.getByText('Mission Control / Series Config')).toBeVisible();
    await expect(page.getByTestId('sidebar-link-anime-studio').first()).toBeVisible();
    await expect(page.getByTestId('label-sessions')).toBeVisible();
    await expect(page.getByTestId('label-episodes')).toBeVisible();
    await expect(page.getByTestId('label-scenes')).toBeVisible();
    await expect(page.getByText('Concept / Theme')).toBeVisible();
    await expect(page.getByText('Initiate Master Production Loop')).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Production Script/i })).toBeVisible();
  });

  test('anime studio roadmap modules render markers when available', async ({ page }) => {
    const modules = [
      ['/anime/world', 'marker-world-architecture'],
      ['/anime/cast', 'marker-character-cast'],
      ['/anime/series', 'marker-series-planning'],
      ['/anime/script', 'marker-production-script'],
      ['/anime/storyboard', 'marker-visual-storyboard'],
      ['/anime/prompts', 'marker-ai-image-prompts'],
      ['/anime/screening', 'marker-screening-room'],
      ['/anime/seo', 'marker-marketing-specs'],
    ] as const;

    for (const [route, marker] of modules) {
      await page.goto(route);
      if (page.url().includes('/auth')) {
        await expect(page.locator('main').getByRole('heading', { name: /sign in/i })).toBeVisible();
        continue;
      }

      await expect(page.getByRole('link', { name: /God Mode/i })).toBeVisible();
      await expect(page.getByTestId(marker)).toBeVisible();
    }
  });
});