import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';

// Critical Test Case 4: Admin User Management
 
test.describe('Admin User Management Tests', () => {
  let dashboardPage: DashboardPage;
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    adminPage = new AdminPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    
    await loginPage.goto();
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.navigateToModule('admin');
    await adminPage.verifyAdminPageLoaded();
  });

  test('should navigate to Admin module successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*admin/);
  });

  test('should display system users list', async ({ page }) => {
    await expect(adminPage.resultsTable).toBeVisible();
    const recordsText = await adminPage.getRecordsFoundCount();
    expect(recordsText).toContain('Records Found');
  });

  test('should search for existing user', async ({ page }) => {
    const searchUsername = 'Admin';

    await adminPage.searchUser(searchUsername);
    await expect(adminPage.resultsTable).toBeVisible();
    await adminPage.verifyUserInResults(searchUsername);
  });

  test('should display Add User button', async ({ page }) => {
    await expect(adminPage.addButton).toBeVisible();
    await expect(adminPage.addButton).toBeEnabled();
  });

  test('should have search functionality with filters', async ({ page }) => {
    await expect(adminPage.searchUsername).toBeVisible();
    await expect(adminPage.searchButton).toBeVisible();
    await expect(adminPage.userRoleDropdown).toBeVisible();
    await expect(adminPage.statusDropdown).toBeVisible();
  });

  test('should reset search results', async ({ page }) => {
    const resetButton = page.getByRole('button', { name: 'Reset' });
    
    await adminPage.searchUser('Admin');
    await resetButton.click();
    await page.waitForLoadState('networkidle');
    
    await expect(adminPage.searchUsername).toHaveValue('');
    await expect(adminPage.resultsTable).toBeVisible();
  });
});
