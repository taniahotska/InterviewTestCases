import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PIMPage extends BasePage {
  readonly pageHeader: Locator;
  readonly addButton: Locator;
  readonly employeeList: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h6').filter({ hasText: 'PIM' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.employeeList = page.locator('.oxd-table-body');
  }

  async verifyPIMPageLoaded() {
    await expect(this.pageHeader).toBeVisible();
    await expect(this.page).toHaveURL(/.*pim/);
  }
}
