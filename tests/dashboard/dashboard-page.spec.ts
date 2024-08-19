import { test, expect, Page } from '@playwright/test';
import { Test } from '../..';
import { format } from 'date-fns';

let page: Page;

const tests: Test[] = [
  {
    testTitle: 'Household w/ records',
    email: 'family1@test.com',
    password: '123456',
    householdWithLienholder: {
      id: 3,
      homeType: 'HOUSE',
      ownership: 'MORTGAGE',
      lienholderId: 1,
      lienholder: {
        id: 1,
        name: 'Bank of America, LLC',
      },
      address1: '123 Family1 Street',
      address2: '',
      city: 'Leander',
      state: 'TN',
      zip: '78641',
    },
    recordsWithRelationship: [
      {
        relationship: 'SELF',
        id: 3,
        firstName: 'John',
        lastName: 'Smith',
        dob: '1912-12-12T12:00:00.000Z',
        gender: 'MALE',
        telephone: '1212121212',
        householdId: 3,
        hispanic: 'OTHER',
        hispanicOther: 'Other hispanic',
        race: 'OTHER',
        raceOther: 'other race',
        otherStay: 'OTHER',
      },
      {
        relationship: 'SPOUSE',
        id: 4,
        firstName: 'Mary',
        lastName: 'Smith',
        dob: '1912-12-12T12:00:00.000Z',
        gender: 'FEMALE',
        telephone: '1212121212',
        householdId: 3,
        hispanic: 'OTHER',
        hispanicOther: 'Other hispanic',
        race: 'OTHER',
        raceOther: 'other race',
        otherStay: 'NO',
      },
    ],
  },
  {
    testTitle: 'Household w/o records',
    email: 'family2@test.com',
    password: '123456',
    householdWithLienholder: {
      id: 4,
      homeType: 'APARTMENT',
      ownership: 'RENT',
      lienholderId: null,
      lienholder: null,
      address1: '123 Family2 Street',
      address2: 'F2',
      city: 'Leander',
      state: 'NM',
      zip: '12345',
    },
    recordsWithRelationship: null,
  },
  {
    testTitle: 'No household and no records',
    email: 'family3@test.com',
    password: '123456',
    householdWithLienholder: null,
    recordsWithRelationship: null,
  },
];

tests.forEach(
  ({
    testTitle,
    email,
    password,
    householdWithLienholder,
    recordsWithRelationship,
  }) => {
    test.describe(`Dashboard page ${testTitle}`, () => {
      // test.describe.configure({ mode: 'serial' });

      test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto('/');
        await page.getByTestId('avatar-button').click();
        await page.getByTestId('menu-item-Sign-in').click();
        await page.waitForURL('/auth/login', { waitUntil: 'load' });
        await page.locator('#email').fill(email);
        await page.locator('#password').fill(password);
        await page.locator('//button[.="Login"]').click();
        await page.waitForURL('/dashboard', { waitUntil: 'load' });
      });

      test('Title is "Census App | Dashboard"', async () => {
        expect(await page.title()).toMatch('Census App | Dashboard');
      });

      test.describe('Navbar validation', () => {
        test('Logo is displayed', async () => {
          await expect(page.getByTestId('logo')).toBeVisible();
        });

        const navButtons: string[] = ['Dashboard', 'About', 'Docs', 'Swagger'];
        test(`Navbar buttons are [${navButtons}]`, async () => {
          await expect(
            page.getByTestId('navbar-buttons').getByRole('link')
          ).toHaveText(navButtons);
        });

        test('Notification bell is displayed', async () => {
          await expect(page.getByTestId('notification-bell')).toBeVisible();
        });

        test('Avatar button is displayed', async () => {
          await expect(page.getByTestId('avatar-button')).toBeVisible();
        });

        const menuItems: string[] = ['You profile', 'Settings', 'Sign out'];
        test(`Avatar menu items are [${menuItems}]`, async () => {
          await page.getByTestId('avatar-button').click();
          await expect(page.locator('.user-menu-item > a')).toHaveText(
            menuItems
          );
          await page.getByTestId('avatar-button').click();
        });
      });

      test.describe('"Dashboard" page content validation', () => {
        test('Default header title is "Dashboard', async () => {
          await expect(page.getByTestId('header-title')).toHaveText(
            'Dashboard'
          );
        });

        test.describe('Household card', async () => {
          test('"Household information:" is displayed', async () => {
            await expect(
              page.getByText('Household information:')
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
                page.locator('//button[.="Edit household"]')
              ).toBeVisible();
            });

            test(`Type is "${homeType}"`, async () => {
              await expect(
                page
                  .locator('.address-card')
                  .getByText(`Type: ${homeType as string}`)
              ).toBeVisible();
            });

            test(`Ownership is "${ownership}"`, async () => {
              await expect(
                page
                  .locator('.address-card')
                  .getByText(`Ownership: ${ownership as string}`)
              ).toBeVisible();
            });

            if (lienholderId != null && lienholder != null) {
              test(`Lienholder is "${lienholder.name}"`, async () => {
                await expect(
                  page
                    .locator('.address-card')
                    .getByText(`Lienholder: ${lienholder?.name}`)
                ).toBeVisible();
              });
            } else {
              test('Lienholder is absent', async () => {
                await expect(
                  page.locator('.address-card').getByText('Lienholder:')
                ).not.toBeVisible();
              });
            }

            test(`Address line 1 is "${address1}"`, async () => {
              await expect(
                page.locator('.address-card').getByText(address1 as string)
              ).toBeVisible();
            });

            if (address2 != null && address2 != '')
              test(`Address line 2 is "${address2}:`, async () => {
                await expect(
                  page.locator('.address-card').getByText(address2 as string)
                ).toBeVisible();
              });

            test(`City, state and zip are "${city}, ${state} ${zip}"`, async () => {
              await expect(
                page
                  .locator('.address-card')
                  .getByText(`${city}, ${state} ${zip}`)
              ).toBeVisible();
            });
          } else {
            test('"You have not entered your household yet" is displayed', async () => {
              await expect(
                page
                  .locator('.address-card')
                  .getByText('You have not entered your household yet')
              ).toBeVisible();
            });

            test('"Add household" button is displayed', async () => {
              await expect(
                page.getByRole('button', { name: 'Add household' })
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
                    const cardElements = [
                      `Relationship: ${relationship}`,
                      `Full name: ${firstName} ${lastName}`,
                      `Date of Birth: ${format(dob, 'MM/dd/yyyy')}`,
                      `Gender: ${gender}`,
                      `Hispanic: ${hispanic}${' ' + hispanicOther || ''}`,
                      `Race: ${race}${' ' + raceOther || ''}`,
                      `Other stay: ${otherStay}`,
                    ];
                    if (telephone) cardElements.push(`Telephone: ${telephone}`);
                    cardElements.forEach((cardElement) => {
                      test(`"${cardElement}" is displayed`, async () => {
                        await expect(
                          page
                            .locator('.record-card')
                            .filter({ hasText: `${firstName} ${lastName}` })
                            .getByText(cardElement)
                        ).toBeVisible();
                      });
                    });

                    ['Edit', 'Delete'].forEach((buttonText) => {
                      test(`"${buttonText}" is displayed`, async () => {
                        test.skip(!recordsWithRelationship?.length);
                        expect(
                          page
                            .locator('.record-card')
                            .filter({ hasText: `${firstName} ${lastName}` })
                            .getByRole('button', { name: buttonText })
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
                await expect(page.locator('.record-card')).toHaveCount(0);
              });
              test('"You do not have any records yet." card is displayed', async () => {
                await expect(
                  page
                    .locator('.no-records-card')
                    .getByText('You do not have any records yet.')
                ).toBeVisible();
              });
              test('"Add record" button is displayed', async () => {
                await expect(
                  page
                    .locator('.no-records-card')
                    .getByRole('button', { name: 'Add record' })
                ).toBeVisible();
              });
            });
          }
        }
      });
    });
  }
);
