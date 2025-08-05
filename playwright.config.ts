import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  

  fullyParallel: false,
  

  forbidOnly: !!process.env.CI,
  

  retries: process.env.CI ? 2 : 0,
  
  workers: 1,
  

  reporter: [
    ['html', { 
      open: 'always',
      host: 'localhost',
      port: 9324 
    }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {

    baseURL: process.env.BASE_URL || 'https://demoqa.com',


    trace: 'on-first-retry',
    

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    actionTimeout: 15000,
    navigationTimeout: 20000,

    headless: process.env.HEADLESS !== 'false',
    

    ignoreHTTPSErrors: true,

    viewport: { width: 1280, height: 720 },
  },

  timeout: 60000,
  

  globalTimeout: 600000,


  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        

        actionTimeout: 15000,
        navigationTimeout: 20000,
        

        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-extensions',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-background-networking',
            '--disable-default-apps',
            '--disable-sync'
          ],
          slowMo: 100,
        }
      },
    },
  ],

  globalSetup: undefined,
  globalTeardown: undefined,


  testMatch: [
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.test.ts'
  ],


  testIgnore: [
    '**/node_modules/**',
    '**/dist/**'
  ],


  outputDir: 'test-results/',


  webServer: undefined,

  expect: {
    
    timeout: 10000,
    
    toHaveScreenshot: { 
      threshold: 0.5, 
      maxDiffPixels: 100 
    },
    toMatchSnapshot: { 
      threshold: 0.5, 
      maxDiffPixels: 100 
    }
  },

  metadata: {
    'test-type': 'LeadSquared Assignment - OPTIMIZED & FIXED',
    'author': 'Priyanka',
    'framework': 'Playwright + TypeScript'
  }
});