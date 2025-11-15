import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('h6').filter({ hasText: 'Dashboard' });
  }

  async verifyDashboardLoaded() {
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.page).toHaveURL(/.*dashboard/);
  }
}
