import { test, expect, Page, Locator } from '@playwright/test';
import { Test } from '../..';
import { format } from 'date-fns';
import { MenuItem, NavButton } from '../pom/nav-bar.layout';
import { LoginPage } from '../pom/login.page';
import { DashboardPage } from '../pom/dashboard.page';

let page: Page;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;

const tests: Test[] = require('../fixtures/test1.json');

tests.forEach((t) => {
  test.describe(`Dashboard page ${t.testTitle} @UI`, () => {
    // test.describe.configure({ mode: 'serial' });

    const {
      email,
      password,
      image,
      householdWithLienholder,
      recordsWithRelationship,
    } = t;

    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      loginPage = new LoginPage(page);
      dashboardPage = new DashboardPage(page);
      await loginPage.goto('/');
      await loginPage.$avatar.click();
      await loginPage.getMenuItemOf('Sign in').click();
      await loginPage.waitForPageLoaded();
      await loginPage.login({ email, password });
      await dashboardPage.waitForPageLoaded();
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('Title is "Census App | Dashboard"', async () => {
      await dashboardPage.validateTitleToBe('Census App | Dashboard');
    });

    test.describe('Navbar validation', () => {
      test('Logo is displayed', async () => {
        await expect(dashboardPage.$logo).toBeVisible();
      });

      const navButtons: NavButton[] = ['Dashboard', 'About', 'Docs', 'Swagger'];
      test(`Navbar buttons are [${navButtons}]`, async () => {
        await expect(dashboardPage.$navButtons).toHaveText(navButtons);
      });

      test('Notification bell is displayed', async () => {
        await expect(dashboardPage.$notificationBell).toBeVisible();
      });

      test('Avatar button is displayed', async () => {
        await expect(dashboardPage.$avatar).toBeVisible();
      });

      const menuItems: MenuItem[] = ['You profile', 'Settings', 'Sign out'];
      test(`Avatar menu items are [${menuItems}]`, async () => {
        await dashboardPage.$avatar.click();
        await expect(dashboardPage.$menuItems).toHaveText(menuItems);
        await dashboardPage.$avatar.click();
      });
    });

    test.describe('"Dashboard" page content validation', () => {
      test('Default header title is "Dashboard', async () => {
        await expect(dashboardPage.$headerTitle).toHaveText('Dashboard');
      });

      test.describe('Household card', async () => {
        test('"Household information:" is displayed', async () => {
          await expect(
            dashboardPage.getByText('Household information:')
          ).toBeVisible();
        });

        if (householdWithLienholder != null) {
          const {
            id,
            homeType,
            ownership,
            lienholderId,
            lienholder,
            address1,
            address2,
            city,
            state,
            zip,
          } = householdWithLienholder;
          test('"Edit household" button is displayed', async () => {
            await expect(
              // page.getByRole('button', { name: 'Edit household' })
              dashboardPage.$editHouseholdButton
            ).toBeVisible();
          });

          test(`Type is "${homeType}"`, async () => {
            await expect(
              dashboardPage.$addressCard.getByText(
                `Type: ${homeType as string}`
              )
            ).toBeVisible();
          });

          test(`Ownership is "${ownership}"`, async () => {
            await expect(
              dashboardPage.$addressCard.getByText(
                `Ownership: ${ownership as string}`
              )
            ).toBeVisible();
          });

          if (lienholderId != null && lienholder != null) {
            test(`Lienholder is "${lienholder.name}"`, async () => {
              await expect(
                dashboardPage.$addressCard.getByText(
                  `Lienholder: ${lienholder?.name}`
                )
              ).toBeVisible();
            });
          } else {
            test('Lienholder is absent', async () => {
              await expect(
                dashboardPage.$addressCard.getByText('Lienholder:')
              ).not.toBeVisible();
            });
          }

          test(`Address line 1 is "${address1}"`, async () => {
            await expect(
              dashboardPage.$addressCard.getByText(address1 as string)
            ).toBeVisible();
          });

          if (address2 != null && address2 != '')
            test(`Address line 2 is "${address2}:`, async () => {
              await expect(
                dashboardPage.$addressCard.getByText(address2 as string)
              ).toBeVisible();
            });

          test(`City, state and zip are "${city}, ${state} ${zip}"`, async () => {
            await expect(
              dashboardPage.$addressCard.getByText(`${city}, ${state} ${zip}`)
            ).toBeVisible();
          });
        } else {
          test('"You have not entered your household yet" is displayed', async () => {
            await expect(
              dashboardPage.$addressCard.getByText(
                'You have not entered your household yet'
              )
            ).toBeVisible();
          });

          test('"Add household" button is displayed', async () => {
            await expect(
              dashboardPage.$addHouseholdButton
              // page.locator('//button[.="Edit household"]')
            ).toBeVisible();
          });
        }
      });

      if (householdWithLienholder != null) {
        if (
          recordsWithRelationship != null &&
          recordsWithRelationship.length > 0
        ) {
          test.describe('Record cards', async () => {
            recordsWithRelationship?.forEach(
              ({
                relationship,
                firstName,
                lastName,
                dob,
                gender,
                telephone,
                hispanic,
                hispanicOther,
                race,
                raceOther,
                otherStay,
              }) => {
                test.describe(`Record for "${firstName} ${lastName}"`, () => {
                  test.skip(!recordsWithRelationship?.length);

                  let recordCard: Locator;

                  test.beforeAll(() => {
                    recordCard = dashboardPage.getRecordCardFor({
                      firstName,
                      lastName,
                    });
                  });

                  const cardElements = [
                    `Relationship: ${relationship}`,
                    `Full name: ${firstName} ${lastName}`,
                    `Date of Birth: ${format(dob, 'MM/dd/yyyy')
                      .split('/')
                      .map((p) => p.replace(/^0+/, ''))
                      .join('/')}`,
                    `Gender: ${gender}`,
                    `Hispanic: ${hispanic}${' ' + hispanicOther || ''}`,
                    `Race: ${race}${' ' + raceOther || ''}`,
                    `Other stay: ${otherStay}`,
                  ];
                  if (telephone) cardElements.push(`Telephone: ${telephone}`);
                  cardElements.forEach((cardElement) => {
                    test(`"${cardElement}" is displayed`, async () => {
                      await expect(
                        recordCard.getByText(cardElement)
                      ).toBeVisible();
                    });
                  });

                  ['Edit', 'Delete'].forEach((buttonText) => {
                    test(`"${buttonText}" is displayed`, async () => {
                      test.skip(!recordsWithRelationship?.length);
                      await expect(
                        recordCard.getByRole('button', { name: buttonText })
                      ).toBeVisible();
                    });
                  });
                });
              }
            );
          });
        } else {
          test.describe('No Records', () => {
            test('Records cards are not displayed', async () => {
              await expect(dashboardPage.$recordCard).toHaveCount(0);
            });
            test('"You do not have any records yet." card is displayed', async () => {
              await expect(
                dashboardPage.$noRecordsCard.getByText(
                  'You do not have any records yet.'
                )
              ).toBeVisible();
            });
            test('"Add record" button is displayed', async () => {
              await expect(
                dashboardPage.$noRecordsCard.getByRole('button', {
                  name: 'Add record',
                })
              ).toBeVisible();
            });
          });
        }
      }
    });
  });
});
