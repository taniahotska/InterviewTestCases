import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';


 //Critical Test Case 1: User Authentication 
 
test.describe('Authentication Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const username = process.env.TEST_USERNAME!;
    const password = process.env.TEST_PASSWORD!;

    await loginPage.goto();
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  
  test('should fail to login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.usernameInput.fill('InvalidUser');
    await loginPage.passwordInput.fill('InvalidPass');
    await loginPage.loginButton.click();
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should fail to login with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginButton.click();
    
    const requiredMessages = page.locator('span.oxd-input-field-error-message');
    await expect(requiredMessages).toHaveCount(2); 
    await expect(requiredMessages.first()).toHaveText('Required');
    await expect(requiredMessages.last()).toHaveText('Required');
    await expect(page).toHaveURL(/.*login/);
  });


  test('should display forgot password link', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });
});
