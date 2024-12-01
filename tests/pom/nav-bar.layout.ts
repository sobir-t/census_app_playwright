import { Locator, Page } from '@playwright/test';

export type NavButton = 'Dashboard' | 'About' | 'Docs' | 'Swagger';
export type MenuItem =
  | 'Sign in'
  | 'Register'
  | 'You profile'
  | 'Settings'
  | 'Sign out';

export class NavBar {
  readonly page: Page;

  readonly $logo: Locator;
  readonly $navButtons: Locator;
  readonly $notificationBell: Locator;
  readonly $avatar: Locator;
  readonly $menuItems: Locator;

  readonly $mobileNavBar: Locator;
  readonly $mobileNavMenuItems: Locator;

  constructor(page: Page) {
    this.page = page;

    this.$logo = page.getByTestId('logo');
    this.$navButtons = page.getByTestId('navbar-buttons').getByRole('link');
    this.$notificationBell = page.getByTestId('notification-bell');
    this.$avatar = page.getByTestId('avatar-button');
    this.$menuItems = page.locator('.user-menu-item > a');

    this.$mobileNavBar = page.getByTestId('mobile-navbar');
    this.$mobileNavMenuItems = page
      .getByTestId('nav-menu-items')
      .getByRole('link');
  }

  public getNavButtonOf(navButtonText: NavButton): Locator {
    return this.page
      .getByTestId('navbar-buttons')
      .getByRole('link')
      .getByText(navButtonText);
  }

  public getMenuItemOf(menuItemText: MenuItem): Locator {
    return this.page.locator('.user-menu-item > a').getByText(menuItemText);
  }
}
