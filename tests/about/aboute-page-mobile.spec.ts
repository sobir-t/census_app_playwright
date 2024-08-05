import test, { expect } from '@playwright/test';

test.describe('Base page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Title is "Census App"', async ({ page }) => {
    await expect(page).toHaveTitle(/Census App/);
  });

  test.describe('Navbar validation', () => {
    test('Logo is displayed', async ({ page }) => {
      await expect(page.getByTestId('logo')).toBeVisible();
    });

    test('Menu button is displayed', async ({ page }) => {
      await expect(page.getByTestId('mobile-navbar')).toBeVisible();
    });

    const menuOptions: string[] = ['About', 'Docs', 'Swagger'];
    test(`Menu options are [${menuOptions}]`, async ({ page }) => {
      await page.getByTestId('mobile-navbar').click();
      await expect(
        page.getByTestId('nav-menu-items').getByRole('link')
      ).toHaveText(menuOptions);
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

  test.describe('"About" page content validation', () => {
    test('Default header title is "About', async ({ page }) => {
      await expect(page.getByTestId('header-title')).toHaveText('About');
    });

    test('Big logo is displayed', async ({ page }) => {
      await expect(page.getByTestId('big-logo')).toBeVisible();
    });

    interface TextValidation {
      title: string;
      text: string[];
    }
    const tests: TextValidation[] = [
      {
        title: '"Welcome to Census Registration"',
        text: ['Welcome to Census Registration'],
      },
      {
        title: 'App intention',
        text: [
          'This app is intended to be used by Quality Assurance Engineers for software testing training',
        ],
      },
      {
        title: 'Author responsibility',
        text: [
          'Author has no responsibility for any official or commercial usage',
          'You are using this app at your own risk',
        ],
      },
      {
        title: 'PII PHI warning',
        text: [
          'Please DO NOT save any PII (Personal Identifiable information)',
          'All information has to be of unreal people',
        ],
      },
      {
        title: 'Security information',
        text: [
          'This app has no any security protection for any information submitted',
        ],
      },
    ];
    tests.forEach(({ title, text }) => {
      test(`${title} title is displayed`, async ({ page }) => {
        for await (const t of text) {
          await expect(page.getByText(t)).toBeVisible();
        }
      });
    });
  });
});
