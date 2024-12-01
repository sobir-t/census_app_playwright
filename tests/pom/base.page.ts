import { expect, Locator, Page } from '@playwright/test';
import { NavBar } from './nav-bar.layout';

export abstract class BasePage extends NavBar {
  public url: string;

  readonly $headerTitle: Locator;

  constructor({ page, url }: { page: Page; url: string }) {
    super(page);
    this.url = url;

    this.$headerTitle = page.getByTestId('header-title');
  }

  public async getTitle(): Promise<string> {
    return await this.page.title();
  }

  public async validateTitleToBe(
    expectedTitle: string,
    options?: { timeout?: number }
  ): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle, {
      timeout: options?.timeout || 30000,
    });
  }

  public async goto(url?: string): Promise<void> {
    if (!!url) await this.page.goto(url);
    else await this.page.goto(this.url);
  }

  public async waitForPageLoaded(): Promise<void> {
    await this.page.waitForURL(this.url, { waitUntil: 'load' });
  }

  public getByText(text: string): Locator {
    return this.page.getByText(text);
  }
}
