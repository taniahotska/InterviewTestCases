import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  readonly pageHeader: Locator;
  readonly addButton: Locator;
  readonly searchUsername: Locator;
  readonly searchButton: Locator;
  readonly userRoleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly resultsTable: Locator;
  readonly recordsFoundText: Locator;
  readonly deleteButton: Locator;
  readonly systemUsersTab: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h6').filter({ hasText: 'Admin' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchUsername = page.locator('input[placeholder*="Type for hints"]').first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.userRoleDropdown = page.locator('.oxd-select-text').first();
    this.statusDropdown = page.locator('.oxd-select-text').last();
    this.resultsTable = page.locator('.oxd-table-body');
    this.recordsFoundText = page.locator('.orangehrm-horizontal-padding span').first();
    this.deleteButton = page.locator('button').filter({ hasText: 'Delete' }).first();
    this.systemUsersTab = page.locator('a').filter({ hasText: 'User Management' });
  }

  async verifyAdminPageLoaded() {
    await expect(this.pageHeader).toBeVisible();
    await expect(this.page).toHaveURL(/.*admin/);
  }

  async searchUser(username: string) {
    await this.searchUsername.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchUsername.fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyUserInResults(username: string) {
    await this.resultsTable.waitFor({ state: 'visible', timeout: 10000 });
    const userRow = this.page.locator('div').filter({ hasText: /^Username$/ }).nth(2)
    await expect(userRow).toBeVisible();
  }

  async getRecordsFoundCount(): Promise<string> {
    await this.recordsFoundText.waitFor({ state: 'visible', timeout: 10000 });
    return await this.recordsFoundText.textContent() || '';
  }

  async clickAddUser() {
    await this.addButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
