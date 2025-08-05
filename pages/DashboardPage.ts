import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;
  readonly welcomeMessage: Locator;
  readonly navigationMenu: Locator;
  readonly userInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileLink = page.locator('text=Profile');
    this.logoutButton = page.locator('#submit'); // Logout button
    this.welcomeMessage = page.locator('.main-header');
    this.navigationMenu = page.locator('.left-pannel');
    this.userInfo = page.locator('#userName-value');
  }

  async waitForDashboardLoad() {
    console.log('⏳ Waiting for dashboard to load...');
    
    // Wait for any of these elements to indicate successful login
    try {
      await Promise.race([
        expect(this.profileLink).toBeVisible({ timeout: 10000 }),
        expect(this.welcomeMessage).toBeVisible({ timeout: 10000 }),
        expect(this.navigationMenu).toBeVisible({ timeout: 10000 })
      ]);
      console.log('✅ Dashboard loaded successfully');
      return true;
    } catch (error) {
      console.log('❌ Dashboard load failed or login unsuccessful');
      return false;
    }
  }

  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `screenshots/${name}-${timestamp}.png`;
    
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async getUserInfo(): Promise<string | null> {
    try {
      const userText = await this.userInfo.textContent();
      return userText;
    } catch {
      return null;
    }
  }

  async logout() {
    console.log('🚪 Logging out...');
    
    try {
      await this.logoutButton.click();
      await this.page.waitForURL('**/login', { timeout: 5000 });
      console.log('✅ Logout successful');
    } catch (error) {
      console.log('⚠️ Logout may have failed or redirect not detected');
    }
  }

  async verifyDashboardElements() {
    console.log('🔍 Verifying dashboard elements...');
    
    const checks = {
      profileVisible: false,
      navigationVisible: false,
      pageLoaded: false
    };

    try {
      checks.profileVisible = await this.profileLink.isVisible();
    } catch {}

    try {
      checks.navigationVisible = await this.navigationMenu.isVisible();
    } catch {}

    try {
      checks.pageLoaded = await this.page.locator('body').isVisible();
    } catch {}

    console.log('Dashboard verification results:', checks);
    return checks;
  }
}