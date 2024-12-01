import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly $welcomeTitle: Locator;
  readonly $emailLabel: Locator;
  readonly $email: Locator;
  readonly $emailErrorMessage: Locator;
  readonly $passwordLabel: Locator;
  readonly $password: Locator;
  readonly $passwordErrorMessage: Locator;
  readonly $loginButton: Locator;
  readonly $createAccountLink: Locator;
  readonly $errorMessage: Locator;
  readonly $errorFields: Locator;

  constructor(page: Page) {
    super({ page, url: '/auth/login' });

    this.$welcomeTitle = page.getByText('Welcome back!');
    this.$emailLabel = page.locator('//label[.="Email"]');
    this.$email = page.locator('#email');
    this.$emailErrorMessage = page.locator(
      '//div[ ./label[.="Email"] ]/p[contains(@class,"text-destructive")]'
    );
    this.$passwordLabel = page.locator('//label[.="Password"]');
    this.$password = page.locator('#password');
    this.$passwordErrorMessage = page.locator(
      '//div[ ./label[.="Password"] ]/p[contains(@class,"text-destructive")]'
    );
    this.$loginButton = page.getByRole('button', { name: 'Login' });
    this.$createAccountLink = page.getByRole('link', {
      name: `Don't have an account?`,
    });
    this.$errorMessage = page.getByTestId('error-message');
    this.$errorFields = page.locator('.text-destructive');
  }

  public async login({
    email,
    password,
  }: {
    email?: string;
    password?: string;
  }): Promise<void> {
    if (!!email) await this.$email.fill(email);
    if (!!password) await this.$password.fill(password);
    await this.$loginButton.click();
  }
}
