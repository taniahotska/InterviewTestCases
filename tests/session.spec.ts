import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Critical Test Case 3: User Session Management - Logout

test.describe('Session Management Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;

    await loginPage.goto();
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('should logout successfully', async ({ page }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should not access dashboard after logout', async ({ page }) => {
    await dashboardPage.logout();
    
    await page.goto('/web/index.php/dashboard/index');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    await page.reload();
    await dashboardPage.verifyDashboardLoaded();
    await expect(dashboardPage.userDropdown).toBeVisible();
  });
});
