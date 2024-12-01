import { test as pom } from '@playwright/test';
import { LoginPage } from './login.page';
import { AboutPage } from './about.page';
import { DashboardPage } from './dashboard.page';

type Fixtures = {
  aboutPage: AboutPage;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

const test = pom.extend<Fixtures>({
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export default test;
export { expect } from '@playwright/test';
