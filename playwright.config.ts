import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only - Set to 0 for local development to ensure tests are robust */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests to avoid conflicts */
  workers: 1,
  
  /* Reporter to use - Auto-open HTML report */
  reporter: [
    ['html', { 
      open: 'always',
      host: 'localhost',
      port: 9323
    }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL */
    baseURL: process.env.BASE_URL || 'https://demoqa.com',

    /* Collect trace when retrying failed tests */
    trace: 'on-first-retry',
    
    /* Screenshot settings - capture more for debugging */
    screenshot: 'only-on-failure',
    
    /* Video settings */
    video: 'retain-on-failure',
    
    /* OPTIMIZED: Reduced timeouts for faster execution */
    actionTimeout: 15000, // Reduced from 45000
    navigationTimeout: 20000, // Reduced from 45000
    
    /* Headless mode */
    headless: process.env.HEADLESS !== 'false',
    
    /* Extra browser context options for stability */
    ignoreHTTPSErrors: true,
    
    /* Viewport settings */
    viewport: { width: 1280, height: 720 },
  },

  /* OPTIMIZED: Reduced global timeout */
  timeout: 60000, // Reduced from 120000
  
  /* OPTIMIZED: Reduced global timeout for whole test run */
  globalTimeout: 600000, // Reduced from 900000

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        
        /* OPTIMIZED: Reduced timeouts */
        actionTimeout: 15000, // Reduced from 60000
        navigationTimeout: 20000, // Reduced from 60000
        
        /* OPTIMIZED: Browser launch options for speed */
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Added for performance
            '--disable-background-networking', // Added for speed
            '--disable-default-apps', // Added for speed
            '--disable-sync' // Added for speed
          ],
          slowMo: 100, // Reduced from 500 for faster execution
        }
      },
    },
  ],

  /* Global setup and teardown */
  globalSetup: undefined,
  globalTeardown: undefined,

  /* Test directory patterns */
  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts'
  ],

  /* Ignore certain files */
  testIgnore: [
    '**/node_modules/**',
    '**/dist/**'
  ],

  /* Output directory */
  outputDir: 'test-results/',

  /* Web Server configuration - not needed for this project */
  webServer: undefined,

  /* OPTIMIZED: Reduced expect timeouts */
  expect: {
    /* OPTIMIZED: Reduced timeout for expect() */
    timeout: 10000, // Reduced from 30000
    
    /* Custom matchers timeout */
    toHaveScreenshot: { 
      threshold: 0.5, 
      maxDiffPixels: 100 
    },
    toMatchSnapshot: { 
      threshold: 0.5, 
      maxDiffPixels: 100 
    }
  },

  /* Metadata */
  metadata: {
    'test-type': 'LeadSquared Assignment - OPTIMIZED',
    'author': 'Priyanka',
    'framework': 'Playwright + TypeScript'
  }
});