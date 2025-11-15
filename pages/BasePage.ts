import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;
  readonly sideMenu: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.sideMenu = page.locator('.oxd-main-menu');
    this.searchInput = page.locator('.oxd-main-menu-search input');
  }

  async logout() {
    await this.userDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.userDropdown.click();
    await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutButton.click();
  }

  async searchMenu(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async navigateToModule(moduleName: string) {
    const menuItem = this.page.locator(`a[href*="/${moduleName.toLowerCase()}"]`).first();
    await menuItem.waitFor({ state: 'visible', timeout: 10000 });
    await menuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getMenuItemByName(menuName: string): Promise<Locator> {
    return this.page.getByRole('link', { name: menuName });
  }

  async clickMenuByText(menuText: string) {
    await (await this.getMenuItemByName(menuText)).click();
  }
}
