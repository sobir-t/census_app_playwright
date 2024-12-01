import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AboutPage extends BasePage {
  readonly $bigLogo: Locator;

  constructor(page: Page) {
    super({ page, url: '/' });

    this.$bigLogo = page.getByTestId('big-logo');
  }
}
