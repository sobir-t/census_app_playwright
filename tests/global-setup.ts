import { chromium, type FullConfig, expect } from '@playwright/test';
import fs from 'fs';
import { Household, Lienholder, Test } from '@/types';
import { define, getRandom, parseObj } from '@/utils/helper/valueGenerator';
import { tests1 } from './templates';
import { login, registerNewUser } from '@/utils/helper/api/auth';
import {
  getAllLienholders,
  saveNewHousehold,
  saveNewLienholder,
} from '@/utils/helper/api/household';
import { lienholders } from '@/utils/helper/enums';
import { saveNewRecordWithRelationship } from '@/utils/helper/api/record';
import fsExists from 'fs.promises.exists';

async function globalSetup(config: FullConfig) {
  const {
    baseURL,
    // , storageState
  } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const request = page.context().request;

  for await (const t of tests1) {
    // tests1.map(async (t: Test) => {
    const {
      email,
      password,
      image,
      householdWithLienholder,
      recordsWithRelationship,
    } = <Test>parseObj(t);

    const response1 = await registerNewUser({
      request,
      baseURL,
      data: {
        email,
        password,
        name: `${email.substring(0, email.indexOf('@'))}`,
        image,
      },
    });
    console.log(JSON.stringify(await response1.json(), null, 2));
    expect(response1.status()).toEqual(201);

    // logging in
    const response2 = await login({ request, baseURL, email, password });
    console.log(JSON.stringify(await response2.json(), null, 2));
    expect(response2.status()).toEqual(200);

    // getting household clear
    if (householdWithLienholder != null) {
      // getting lienholder data clear
      if (householdWithLienholder.lienholder != null) {
        const response3 = await getAllLienholders({ request, baseURL });
        console.log(JSON.stringify(await response3.json(), null, 2));
        let lienholder: Lienholder;
        if (response3.status() == 404) {
          const response4 = await saveNewLienholder({
            request,
            baseURL,
            name: define(`random::pick::${lienholders.join(';')}::;`),
          });
          console.log(JSON.stringify(await response4.json(), null, 2));
          expect(response4.status()).toEqual(201);
          lienholder = (await response4.json()).lienholder as Lienholder;
        } else
          lienholder = getRandom<Lienholder>(
            (await response3.json()).lienholders as Lienholder[]
          );
        householdWithLienholder.lienholderId = lienholder.id;
        householdWithLienholder.lienholder = lienholder;
      }

      // saving new household
      const response5 = await saveNewHousehold({
        request,
        baseURL,
        data: {
          ...(householdWithLienholder as Household),
          userId: (await response1.json()).user.id,
        },
      });
      console.log(JSON.stringify(await response5.json(), null, 2));
      expect(response5.status()).toEqual(201);
      householdWithLienholder.id = (await response5.json()).household.id;
      t.householdWithLienholder = householdWithLienholder;
    }

    console.log(
      `updated lienholder = ${householdWithLienholder?.lienholder?.name}`
    );

    // getting records clear
    if (recordsWithRelationship != null) {
      for await (const eachRecordWithRelationship of recordsWithRelationship) {
        eachRecordWithRelationship.householdId =
          householdWithLienholder?.id as number;
        // save record
        const response6 = await saveNewRecordWithRelationship({
          request,
          baseURL,
          data: {
            ...eachRecordWithRelationship,
            userId: (await response1.json()).user.id,
          },
        });
        console.log(JSON.stringify(await response6.json(), null, 2));
        expect(response6.status()).toEqual(201);
        eachRecordWithRelationship.id = (
          await response6.json()
        ).recordWithRelationship.record.id;
      }
    }
    t.recordsWithRelationship = recordsWithRelationship;
  }

  if (!(await fsExists('tests/fixtures')))
    await fs.promises.mkdir('tests/fixtures');

  await fs.promises.writeFile(
    'tests/fixtures/test1.json',
    JSON.stringify(tests1, null, 2)
  );

  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await page.goto(baseURL!);
  // await page.getByLabel('User Name').fill('user');
  // await page.getByLabel('Password').fill('password');
  // await page.getByText('Sign in').click();
  // await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
