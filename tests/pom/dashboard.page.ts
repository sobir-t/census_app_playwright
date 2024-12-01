import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly $editHouseholdButton: Locator;
  readonly $addHouseholdButton: Locator;
  readonly $addressCard: Locator;
  readonly $recordCard: Locator;
  readonly $noRecordsCard: Locator;

  constructor(page: Page) {
    super({ page, url: '/dashboard' });

    this.$editHouseholdButton = page.locator('//button[.="Edit household"]');
    this.$addressCard = page.locator('.address-card');
    this.$addHouseholdButton = page.getByRole('button', {
      name: 'Add household',
    });
    this.$recordCard = page.locator('.record-card');
    this.$noRecordsCard = page.locator('.no-records-card');
  }

  public getRecordCardFor({
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
  }): Locator {
    return this.$recordCard.filter({ hasText: `${firstName} ${lastName}` });
  }
}
