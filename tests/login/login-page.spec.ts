import test, { expect } from '@playwright/test';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('avatar-button').click();
    await page.getByTestId('menu-item-Sign-in').click();
    await page.waitForLoadState('load');
  });

  test('Title is "Census App | login"', async ({ page }) => {
    await expect(page).toHaveTitle('Census App | Login', { timeout: 30000 });
  });

  test.describe('Navbar validation', () => {
    test('Logo is displayed', async ({ page }) => {
      await expect(page.getByTestId('logo')).toBeVisible();
    });

    const navButtons: string[] = ['About', 'Docs', 'Swagger'];
    test(`Navbar buttons are [${navButtons}]`, async ({ page }) => {
      await expect(
        page.getByTestId('navbar-buttons').getByRole('link')
      ).toHaveText(navButtons);
    });

    test('Notification bell is displayed', async ({ page }) => {
      await expect(page.getByTestId('notification-bell')).toBeVisible();
    });

    test('Avatar button is displayed', async ({ page }) => {
      await expect(page.getByTestId('avatar-button')).toBeVisible();
    });

    const menuItems: string[] = ['Sign in', 'Register'];
    test(`Avatar menu items are [${menuItems}]`, async ({ page }) => {
      await page.getByTestId('avatar-button').click();
      await expect(page.locator('.user-menu-item > a')).toHaveText(menuItems);
    });
  });

  test.describe('Login form', () => {
    test('"Welcome back!" title is displayed', async ({ page }) => {
      await expect(page.getByText('Welcome back!')).toBeVisible();
    });

    test('Email input box is displayed', async ({ page }) => {
      await expect(page.locator('//label[.="Email"]')).toBeVisible();
      await expect(page.locator('#email')).toBeVisible();
    });

    test('Password input box is displayed', async ({ page }) => {
      await expect(page.locator('//label[.="Password"]')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
    });

    test('"Login: button is displayed', async ({ page }) => {
      await expect(page.locator('//button[.="Login"]')).toBeVisible();
    });

    test(`"Don't have an account?" link is displayed`, async ({ page }) => {
      await expect(
        page.getByRole('link', { name: "Don't have an account?" })
      ).toBeVisible();
    });
  });
});
