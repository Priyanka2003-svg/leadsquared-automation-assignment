import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.errorMessage = page.locator('#name');
    this.pageTitle = page.locator('.main-header');
  }

  async navigateToLogin() {
    console.log(' Navigating to login page...');
    
    try {
      await this.page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
      await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
      await expect(this.loginButton).toBeVisible({ timeout: 10000 });
      
      console.log(' Login page loaded successfully');
      return true;
    } catch (error) {
      console.log(' Login page failed to load:', error);
      
      await this.page.goto('/', { waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(2000);
      await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
      
      await expect(this.usernameInput).toBeVisible({ timeout: 5000 });
      console.log(' Login page loaded on second attempt');
      return true;
    }
  }

  async login(username: string, password: string) {
    console.log(` Attempting login with username: ${username}`);
    
    try {
      await this.usernameInput.clear();
      await this.usernameInput.fill(username);
      
      await this.passwordInput.clear();
      await this.passwordInput.fill(password);
      
      await this.loginButton.click();
      
      await this.page.waitForTimeout(3000);
      
      console.log(' Login form submitted');
      return true;
    } catch (error) {
      console.log(' Login failed:', error);
      return false;
    }
  }

  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/${name}-${timestamp}.png`;
    
    try {
      await this.page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(` Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.log(' Screenshot failed:', error);
      return null;
    }
  }

  async verifyLoginError() {
    console.log(' Checking for login error messages...');
    
    try {
      const errorSelectors = [
        'text=Invalid username or password!',
        '#name',
        '.alert',
        '[role="alert"]',
        '.error-message',
        'text=Invalid credentials'
      ];

      for (const selector of errorSelectors) {
        try {
          const errorElement = this.page.locator(selector);
          if (await errorElement.isVisible({ timeout: 3000 })) {
            const errorText = await errorElement.textContent();
            console.log(` Error found: ${errorText}`);
            return true;
          }
        } catch {
          continue;
        }
      }
      
      console.log(' No specific error messages found - checking URL');
      
      const currentUrl = this.page.url();
      if (currentUrl.includes('/login')) {
        console.log(' Still on login page - likely invalid credentials');
        return true;
      }
      
      return false;
    } catch (error) {
      console.log(' Error checking failed:', error);
      return false;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    console.log(' Checking login status...');
    
    try {
      const currentUrl = this.page.url();
      console.log(`Current URL: ${currentUrl}`);
      
      if (currentUrl.includes('/profile') || currentUrl.includes('/books') || !currentUrl.includes('/login')) {
        console.log(' Redirected away from login page - likely successful');
        return true;
      }
      
      const successIndicators = [
        'text=Profile',
        '#userName-value',
        '.main-header',
        'text=Book Store Application',
        'text=Log out'
      ];

      for (const selector of successIndicators) {
        try {
          if (await this.page.locator(selector).isVisible({ timeout: 3000 })) {
            console.log(` Success indicator found: ${selector}`);
            return true;
          }
        } catch {
          continue;
        }
      }
      
      console.log(' No success indicators found');
      return false;
    } catch (error) {
      console.log(' Login status check failed:', error);
      return false;
    }
  }
}