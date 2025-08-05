import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class TestUtils {
  static async waitForPageLoad(page: Page, timeout: number = 5000) { // Reduced from 10000
    try {
      await page.waitForLoadState('domcontentloaded', { timeout });
      console.log('✅ Page loaded successfully');
    } catch (error) {
      console.log('⚠️ Page load timeout, continuing anyway');
    }
  }

  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotName = `${name}-${timestamp}.png`;
    const screenshotPath = path.join('screenshots', screenshotName);
    
    try {
      // Ensure screenshots directory exists
      this.ensureDirectoryExists('screenshots');
      
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.log('❌ Screenshot failed:', error);
      return null;
    }
  }

  static generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // OPTIMIZED: Reduced retry attempts and delay
  static async retryAction<T>(
    action: () => Promise<T>,
    maxRetries: number = 2, // Reduced from 3
    delay: number = 500 // Reduced from 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`🔄 Attempt ${i + 1}/${maxRetries}`);
        const result = await action();
        console.log(`✅ Action succeeded on attempt ${i + 1}`);
        return result;
      } catch (error) {
        lastError = error;
        console.log(`❌ Attempt ${i + 1} failed:`, error);
        
        if (i === maxRetries - 1) {
          console.log('❌ All retry attempts failed');
          break;
        }
        
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  // OPTIMIZED: Reduced timeout
  static async waitForElement(page: Page, selector: string, timeout: number = 5000) { // Reduced from 10000
    try {
      await page.waitForSelector(selector, { timeout, state: 'visible' });
      console.log(`✅ Element found: ${selector}`);
      return true;
    } catch (error) {
      console.log(`❌ Element not found: ${selector}`);
      return false;
    }
  }

  // OPTIMIZED: Reduced timeout
  static async safeClick(page: Page, selector: string, timeout: number = 5000) { // Reduced from 10000
    try {
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      await element.click();
      console.log(`✅ Clicked: ${selector}`);
      return true;
    } catch (error) {
      console.log(`❌ Click failed: ${selector}`, error);
      return false;
    }
  }

  // OPTIMIZED: Reduced timeout
  static async safeFill(page: Page, selector: string, text: string, timeout: number = 5000) { // Reduced from 10000
    try {
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      await element.clear();
      await element.fill(text);
      console.log(`✅ Filled "${text}" in: ${selector}`);
      return true;
    } catch (error) {
      console.log(`❌ Fill failed: ${selector}`, error);
      return false;
    }
  }

  // OPTIMIZED: Reduced timeout
  static async getElementText(page: Page, selector: string): Promise<string | null> {
    try {
      const element = page.locator(selector);
      const text = await element.textContent({ timeout: 3000 }); // Reduced from 5000
      console.log(`✅ Got text from ${selector}: ${text?.substring(0, 50)}...`);
      return text;
    } catch (error) {
      console.log(`❌ Failed to get text from: ${selector}`);
      return null;
    }
  }

  // OPTIMIZED: Reduced timeout
  static async isElementVisible(page: Page, selector: string, timeout: number = 3000): Promise<boolean> { // Reduced from 5000
    try {
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // OPTIMIZED: Reduced timeout
  static async waitForNetworkIdle(page: Page, timeout: number = 5000) { // Reduced from 10000
    try {
      await page.waitForLoadState('networkidle', { timeout });
      console.log('✅ Network idle achieved');
    } catch (error) {
      console.log('⚠️ Network idle timeout, continuing anyway');
    }
  }

  static ensureDirectoryExists(dirPath: string) {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
      }
    } catch (error) {
      console.log(`❌ Failed to create directory ${dirPath}:`, error);
    }
  }

  static formatTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  static async scrollToElement(page: Page, selector: string) {
    try {
      const element = page.locator(selector);
      await element.scrollIntoViewIfNeeded();
      console.log(`✅ Scrolled to: ${selector}`);
      return true;
    } catch (error) {
      console.log(`❌ Scroll failed: ${selector}`, error);
      return false;
    }
  }

  static async verifyElementCount(page: Page, selector: string, expectedCount: number) {
    try {
      const elements = page.locator(selector);
      const actualCount = await elements.count();
      
      console.log(`🔢 Expected: ${expectedCount}, Actual: ${actualCount} for selector: ${selector}`);
      
      expect(actualCount).toBe(expectedCount);
      return true;
    } catch (error) {
      console.log(`❌ Element count verification failed: ${selector}`, error);
      return false;
    }
  }

  // OPTIMIZED: Streamlined clear and type
  static async clearAndType(page: Page, selector: string, text: string) {
    try {
      const element = page.locator(selector);
      
      // Faster clear and fill approach
      await element.click();
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Delete');
      await element.fill(text);
      
      // Quick verification
      const actualValue = await element.inputValue();
      expect(actualValue).toBe(text);
      
      console.log(`✅ Successfully entered "${text}" in ${selector}`);
      return true;
    } catch (error) {
      console.log(`❌ Clear and type failed for ${selector}:`, error);
      return false;
    }
  }

  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateRandomEmail(): string {
    const username = this.generateRandomString(8);
    const domain = this.generateRandomString(6);
    return `${username}@${domain}.com`;
  }

  static async logPageInfo(page: Page) {
    try {
      const title = await page.title();
      const url = page.url();
      console.log(`📄 Page Info - Title: "${title}", URL: "${url}"`);
    } catch (error) {
      console.log('❌ Failed to get page info:', error);
    }
  }

  static async handleAlert(page: Page, accept: boolean = true) {
    try {
      page.on('dialog', async dialog => {
        console.log(`🚨 Alert detected: ${dialog.message()}`);
        if (accept) {
          await dialog.accept();
          console.log('✅ Alert accepted');
        } else {
          await dialog.dismiss();
          console.log('❌ Alert dismissed');
        }
      });
    } catch (error) {
      console.log('❌ Alert handling failed:', error);
    }
  }

  // OPTIMIZED: Fast element wait with early exit
  static async waitForAnyElement(page: Page, selectors: string[], timeout: number = 3000): Promise<string | null> {
    try {
      const promises = selectors.map(selector => 
        page.waitForSelector(selector, { state: 'visible', timeout })
          .then(() => selector)
          .catch(() => null)
      );
      
      const result = await Promise.race(promises);
      if (result) {
        console.log(`✅ Found element: ${result}`);
        return result;
      }
      
      console.log('❌ No elements found from list');
      return null;
    } catch (error) {
      console.log('❌ Wait for any element failed:', error);
      return null;
    }
  }

  // OPTIMIZED: Fast stability check
  static async quickStabilityCheck(page: Page): Promise<boolean> {
    try {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(200); // Very short wait
      
      // Quick check if page is responsive
      const isResponsive = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      
      console.log(`✅ Page stability: ${isResponsive ? 'Good' : 'Loading'}`);
      return isResponsive;
    } catch (error) {
      console.log('⚠️ Stability check failed:', error);
      return false;
    }
  }

  // OPTIMIZED: Fast text content check
  static async hasTextContent(page: Page, selector: string, expectedText: string): Promise<boolean> {
    try {
      const element = page.locator(selector);
      const content = await element.textContent({ timeout: 2000 });
      const hasText = content && content.toLowerCase().includes(expectedText.toLowerCase());
      
      console.log(`🔍 Text check - Expected: "${expectedText}", Found: ${hasText ? 'Yes' : 'No'}`);
      return !!hasText;
    } catch (error) {
      console.log(`❌ Text content check failed for ${selector}:`, error);
      return false;
    }
  }

  // OPTIMIZED: Batch element visibility check
  static async checkMultipleElements(page: Page, selectors: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    const promises = selectors.map(async selector => {
      try {
        const isVisible = await page.locator(selector).isVisible({ timeout: 1000 });
        results[selector] = isVisible;
        return { selector, isVisible };
      } catch {
        results[selector] = false;
        return { selector, isVisible: false };
      }
    });
    
    await Promise.all(promises);
    
    const visibleCount = Object.values(results).filter(Boolean).length;
    console.log(`🔍 Element check: ${visibleCount}/${selectors.length} elements visible`);
    
    return results;
  }

  // OPTIMIZED: Fast form validation
  static async validateFormFields(page: Page, fieldSelectors: Record<string, string>): Promise<boolean> {
    try {
      const validationPromises = Object.entries(fieldSelectors).map(async ([field, selector]) => {
        try {
          const element = page.locator(selector);
          const isVisible = await element.isVisible({ timeout: 1000 });
          const isEnabled = isVisible ? await element.isEnabled() : false;
          
          console.log(`📝 Field ${field}: Visible=${isVisible}, Enabled=${isEnabled}`);
          return isVisible && isEnabled;
        } catch {
          console.log(`❌ Field ${field}: Validation failed`);
          return false;
        }
      });
      
      const results = await Promise.all(validationPromises);
      const allValid = results.every(Boolean);
      
      console.log(`✅ Form validation: ${allValid ? 'All fields ready' : 'Some fields unavailable'}`);
      return allValid;
    } catch (error) {
      console.log('❌ Form validation failed:', error);
      return false;
    }
  }

  // OPTIMIZED: Quick page readiness check
  static async isPageReady(page: Page): Promise<boolean> {
    try {
      const isReady = await page.evaluate(() => {
        // Quick checks for page readiness
        return document.readyState === 'complete' && 
               document.body !== null &&
               !document.querySelector('.loading, .spinner, [class*="loading"]');
      });
      
      console.log(`🚦 Page ready: ${isReady}`);
      return isReady;
    } catch (error) {
      console.log('⚠️ Page readiness check failed:', error);
      return false;
    }
  }
}