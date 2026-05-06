import { defineConfig, devices } from '@playwright/test';

/**
 * Enhanced Playwright Configuration for Anime Script Pro
 * Includes industrial-grade error handling, trace diagnostics, and performance throttling.
 */
export default defineConfig({
  testDir: '../tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  // Retry strategy for flaky network/DB environments
  retries: process.env.CI ? 2 : 1,
  
  // Throttled workers for local stability
  workers: process.env.CI ? 1 : 2,
  
  // Total time for the entire test suite (prevents infinite hanging)
  globalTimeout: 10 * 60 * 1000, 
  
  // Timeout for each individual test
  timeout: 60 * 1000,

  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 10000,
  },

  /* Reporter configuration for detailed error messages */
  reporter: [
    ['html', { open: 'never' }],
    ['list', { printSteps: true }], // Provides real-time step output in terminal
    ['../playwright-reporters/fix-reporter.ts']
  ],

  /* Shared settings for all projects */
  use: {
    // Base URL for the production studio
    baseURL: 'http://127.0.0.1:3000',

    // Diagnostic settings for error visibility
    trace: 'retain-on-failure',
    screenshot: 'on', 
    video: 'on-first-retry', // Capture video to see EXACTLY what happened

    // Action-level timeouts to prevent hanging on specific clicks/inputs
    actionTimeout: 30000,
    navigationTimeout: 15000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  /* Automatic Background Server Orchestration */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
