require('@dotenvx/dotenvx').config();

import test, { expect } from '@playwright/test';
import { resolve } from 'path';
import { setTimeout } from 'timers/promises';

test.describe('Login actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('avatar-button').click();
    await page.getByTestId('menu-item-Sign-in').click();
    await page.waitForLoadState('load');
  });

  test('Invalid email text error message', async ({ page }) => {
    await page.locator('#email').fill('invalid@email');
    await page.locator('#password').fill('123456');
    await page.locator('//button[.="Login"]').click();
    await expect(
      page.locator(
        '//div[ ./label[.="Email"] ]/p[contains(@class,"text-destructive")]'
      )
    ).toHaveText('has to be proper email format.');
  });

  test('Invalid password text error message', async ({ page }) => {
    await page.locator('#email').fill('invalid@email');
    await page.locator('//button[.="Login"]').click();
    await expect(
      page.locator(
        '//div[ ./label[.="Password"] ]/p[contains(@class,"text-destructive")]'
      )
    ).toHaveText('minimum 1 character is required.');
  });

  test('Invalid email credentials text error message', async ({ page }) => {
    await page.locator('#email').fill('invalid@email.com');
    await page.locator('#password').fill('123456');
    await page.locator('//button[.="Login"]').click();
    await expect(page.getByTestId('error-message')).toHaveText(
      'Email does not exist!'
    );
  });

  test('Invalid password credentials text error message', async ({ page }) => {
    await page.locator('#email').fill(process.env.TEST_USER_EMAIL as string);
    await page.locator('#password').fill('666666');
    await page.locator('//button[.="Login"]').click();
    await expect(page.getByTestId('error-message')).toHaveText(
      'Invalid credentials!'
    );
  });

  test('Successful login', async ({ page }) => {
    await page.locator('#email').fill(process.env.TEST_USER_EMAIL as string);
    await page
      .locator('#password')
      .fill(process.env.TEST_USER_PASSWORD as string);
    await page.locator('//button[.="Login"]').click();
    await expect(page.locator('.text-destructive')).not.toBeVisible({
      timeout: 1000,
    });
    await expect(page.getByTestId('error-message')).not.toBeVisible({
      timeout: 1000,
    });
    await page.waitForURL('/dashboard', { waitUntil: 'load' });
    expect(await page.title()).toMatch('Census App | Dashboard');
  });
});
