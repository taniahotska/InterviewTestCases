import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';

// Critical Test Case 4: Admin User Management
 
test.describe('Admin User Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    const baseURL = process.env.BASE_URL!;
    
    await page.goto(baseURL);   
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('should navigate to Admin module successfully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);
    await dashboardPage.navigateToModule('admin');
    await adminPage.verifyAdminPageLoaded();
    await expect(page).toHaveURL(/.*admin/);
  });

  test('should display system users list', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);
    await dashboardPage.navigateToModule('admin');
    await adminPage.verifyAdminPageLoaded();
    await expect(adminPage.resultsTable).toBeVisible();
    const recordsText = await adminPage.getRecordsFoundCount();
    expect(recordsText).toContain('Records Found');
  });

  test('should search for existing user', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);
    const searchUsername = 'Admin';

    await dashboardPage.navigateToModule('admin');
    await adminPage.verifyAdminPageLoaded();
    await adminPage.searchUser(searchUsername);
    await expect(adminPage.resultsTable).toBeVisible();
    await adminPage.verifyUserInResults(searchUsername);
  });

  test('should display Add User button', async ({ page }) => {
  
    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);
    
    await dashboardPage.navigateToModule('admin');
    await adminPage.verifyAdminPageLoaded();
    await expect(adminPage.addButton).toBeVisible();
    await expect(adminPage.addButton).toBeEnabled();
  });

  test('should have search functionality with filters', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);

    await dashboardPage.navigateToModule('admin');
    await adminPage.verifyAdminPageLoaded();
    
    await expect(adminPage.searchUsername).toBeVisible();
    await expect(adminPage.searchButton).toBeVisible();
    await expect(adminPage.userRoleDropdown).toBeVisible();
    await expect(adminPage.statusDropdown).toBeVisible();
  });

  test('should reset search results', async ({ page }) => {

    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);
    const resetButton = page.getByRole('button', { name: 'Reset' });
    
    await dashboardPage.navigateToModule('admin');
    await adminPage.verifyAdminPageLoaded();
    await adminPage.searchUser('Admin');
    await resetButton.click();
    await page.waitForLoadState('networkidle');
    
    await expect(adminPage.searchUsername).toHaveValue('');
    await expect(adminPage.resultsTable).toBeVisible();
  });
});
