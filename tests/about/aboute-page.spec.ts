import { MenuItem, NavButton } from '../pom/nav-bar.layout';
import test, { expect } from '../pom/pom';

test.describe('Base page', { tag: ['@UI'] }, () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.goto();
  });

  test('Title is "Census App"', async ({ aboutPage }) => {
    await aboutPage.validateTitleToBe('Census App');
  });

  test.describe('Navbar validation', { tag: ['@Smoke'] }, () => {
    test('Logo is displayed', async ({ aboutPage }) => {
      await expect(aboutPage.$logo).toBeVisible();
    });

    const navButtons: NavButton[] = ['About', 'Docs', 'Swagger'];
    test(`Navbar buttons are [${navButtons}]`, async ({ aboutPage }) => {
      await expect(aboutPage.$navButtons).toHaveText(navButtons);
    });

    test('Notification bell is displayed', async ({ aboutPage }) => {
      await expect(aboutPage.$notificationBell).toBeVisible();
    });

    test('Avatar button is displayed', async ({ aboutPage }) => {
      await expect(aboutPage.$avatar).toBeVisible();
    });

    const menuItems: MenuItem[] = ['Sign in', 'Register'];
    test(`Avatar menu items are [${menuItems}]`, async ({ aboutPage }) => {
      await aboutPage.$avatar.click();
      await expect(aboutPage.$menuItems).toHaveText(menuItems);
    });
  });

  test.describe('"About" page content validation', () => {
    test('Default header title is "About', async ({ aboutPage }) => {
      await expect(aboutPage.$headerTitle).toHaveText('About');
    });

    test('Big logo is displayed', async ({ aboutPage }) => {
      await expect(aboutPage.$bigLogo).toBeVisible();
    });

    interface TextValidation {
      title: string;
      texts: string[];
    }
    const tests: TextValidation[] = [
      {
        title: '"Welcome to Census Registration"',
        texts: ['Welcome to Census Registration'],
      },
      {
        title: 'App intention',
        texts: [
          'This app is intended to be used by Quality Assurance Engineers for software testing training',
        ],
      },
      {
        title: 'Author responsibility',
        texts: [
          'Author has no responsibility for any official or commercial usage',
          'You are using this app at your own risk',
        ],
      },
      {
        title: 'PII PHI warning',
        texts: [
          'Please DO NOT save any PII (Personal Identifiable information)',
          'All information has to be of unreal people',
        ],
      },
      {
        title: 'Security information',
        texts: [
          'This app has no any security protection for any information submitted',
        ],
      },
    ];
    tests.forEach(({ title, texts }) => {
      test(`${title} title is displayed`, async ({ aboutPage }) => {
        for await (const text of texts) {
          await expect(aboutPage.getByText(text)).toBeVisible();
        }
      });
    });
  });
});
