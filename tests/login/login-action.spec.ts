import test, { expect } from '@/tests/pom/pom';

const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = process.env;

test.describe('Login actions', { tag: ['@UI', '@Smoke'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto('/');
    await loginPage.$avatar.click();
    await loginPage.getMenuItemOf('Sign in').click();
    await loginPage.waitForPageLoaded();
  });

  test('Invalid email text error message', async ({ loginPage }) => {
    await loginPage.login({
      email: 'invalid@email',
      password: '123456',
    });
    await expect(loginPage.$emailErrorMessage).toHaveText(
      'has to be proper email format.'
    );
  });

  test('Invalid password text error message', async ({ loginPage }) => {
    await loginPage.login({
      email: 'invalid@email',
    });
    await expect(loginPage.$passwordErrorMessage).toHaveText(
      'minimum 1 character is required.'
    );
  });

  test('Invalid email credentials text error message', async ({
    loginPage,
  }) => {
    await loginPage.login({
      email: 'invalid@email.com',
      password: '123456',
    });
    await expect(loginPage.$errorMessage).toHaveText('Email does not exist!');
  });

  test('Invalid password credentials text error message', async ({
    loginPage,
  }) => {
    await loginPage.login({
      email: TEST_USER_EMAIL as string,
      password: '999999',
    });
    await expect(loginPage.$errorMessage).toHaveText('Invalid credentials!');
  });

  test('Successful login', async ({ loginPage, dashboardPage }) => {
    await loginPage.login({
      email: TEST_USER_EMAIL as string,
      password: TEST_USER_PASSWORD as string,
    });
    await expect(loginPage.$errorFields).not.toBeVisible({
      timeout: 1000,
    });
    await expect(loginPage.$errorMessage).not.toBeVisible({
      timeout: 1000,
    });
    await dashboardPage.waitForPageLoaded();
    await dashboardPage.validateTitleToBe('Census App | Dashboard', {
      timeout: 30000,
    });
    // expect(await dashboardPage.getTitle()).toMatch('Census App | Dashboard');
  });
});
