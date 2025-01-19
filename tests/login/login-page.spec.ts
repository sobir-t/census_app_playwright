import { MenuItem, NavButton } from '@/tests/pom/nav-bar.layout';
import test, { expect } from '@/tests/pom/pom';

test.describe('Login page', { tag: ['@UI'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto('/');
    await loginPage.$avatar.click();
    await loginPage.getMenuItemOf('Sign in').click();
    await loginPage.waitForPageLoaded();
  });

  test('Title is "Census App | login"', async ({ loginPage }) => {
    await loginPage.validateTitleToBe('Census App | Login', { timeout: 30000 });
  });

  test.describe('Navbar validation', () => {
    test('Logo is displayed', async ({ loginPage }) => {
      await expect(loginPage.$logo).toBeVisible();
    });

    const navButtons: NavButton[] = ['About', 'Docs', 'Swagger'];
    test(`loginPage buttons are [${navButtons}]`, async ({ loginPage }) => {
      await expect(loginPage.$navButtons).toHaveText(navButtons);
    });

    test('Notification bell is displayed', async ({ loginPage }) => {
      await expect(loginPage.$notificationBell).toBeVisible();
    });

    test('Avatar button is displayed', async ({ loginPage }) => {
      await expect(loginPage.$avatar).toBeVisible();
    });

    const menuItems: MenuItem[] = ['Sign in', 'Register'];
    test(`Avatar menu items are [${menuItems}]`, async ({ loginPage }) => {
      await loginPage.$avatar.click();
      await expect(loginPage.$menuItems).toHaveText(menuItems);
    });
  });

  test.describe('Login form', () => {
    test('"Welcome back!" title is displayed', async ({ loginPage }) => {
      await expect(loginPage.$welcomeTitle).toBeVisible();
    });

    test('Email input box is displayed', async ({ loginPage }) => {
      await expect(loginPage.$emailLabel).toBeVisible();
      await expect(loginPage.$email).toBeVisible();
    });

    test('Password input box is displayed', async ({ loginPage }) => {
      await expect(loginPage.$passwordLabel).toBeVisible();
      await expect(loginPage.$password).toBeVisible();
    });

    test('"Login: button is displayed', async ({ loginPage }) => {
      await expect(loginPage.$loginButton).toBeVisible();
    });

    test(`"Don't have an account?" link is displayed`, async ({
      loginPage,
    }) => {
      await expect(loginPage.$createAccountLink).toBeVisible();
    });
  });
});
