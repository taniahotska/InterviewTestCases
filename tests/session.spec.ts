import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Critical Test Case 3: User Session Management - Logout

test.describe('Session Management Tests', () => {
  test('should logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    const baseURL = process.env.BASE_URL!;

    await page.goto(baseURL);
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should not access dashboard after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    const baseURL = process.env.BASE_URL!;

    await page.goto(baseURL);
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.logout();
    
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;
    const baseURL = process.env.BASE_URL!;
    
    await page.goto(baseURL);
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
    await page.reload();
    await dashboardPage.verifyDashboardLoaded();
    await expect(dashboardPage.userDropdown).toBeVisible();
  });
});
