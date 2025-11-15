import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMPage';

// Critical Test Case 2: Navigation - Menu Access and Navigation
 
test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    await loginPage.goto();
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('should navigate to Admin module', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToModule('admin');
    await expect(page).toHaveURL(/.*admin/);
  });

  test('should navigate to PIM module', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const pimPage = new PIMPage(page);
    await dashboardPage.navigateToModule('pim');
    await pimPage.verifyPIMPageLoaded();
  });

  test('should navigate to Leave module', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToModule('leave');
    await expect(page).toHaveURL(/.*leave/);
  });

  test('should navigate to Time module', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToModule('time');
    await expect(page).toHaveURL(/.*time/);
  });

  test('should navigate to Recruitment module', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToModule('recruitment');
    await expect(page).toHaveURL(/.*recruitment/);
  });

  test('should search menu items', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.searchMenu('Admin');
    const adminMenuItem = await dashboardPage.getMenuItemByName('Admin');
    await expect(adminMenuItem).toBeVisible();
  });

  test('should display user dropdown', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.userDropdown.click();
    await expect(dashboardPage.logoutButton).toBeVisible();
  });
});
