import {
  AVATAR,
  HISPANIC,
  HOME_TYPE,
  OTHER_STAY,
  OWNERSHIP,
  RACE,
  STATE,
  Test,
} from '@/types';
import {
  avatars,
  hispanic,
  homeTypes,
  otherStay,
  ownerships,
  race,
} from '../utils/helper/enums';

export const tests1: Test[] = [
  {
    testTitle: 'Household w/ records',
    email: 'random::email',
    password: 'random::password',
    image: `random::pick::${avatars.join(',')}` as AVATAR,
    householdWithLienholder: {
      id: 1,
      homeType: `random::pick::${homeTypes.join(',')}` as HOME_TYPE,
      ownership: `random::pick::${ownerships.join(',')}` as OWNERSHIP,
      lienholderId: 1,
      lienholder: {
        id: 1,
        name: 'Bank of America, LLC',
      },
      address1: 'random::address1',
      address2: 'random::address2',
      city: 'random::city',
      state: 'random::state' as STATE,
      zip: 'random::zip',
    },
    recordsWithRelationship: [
      {
        id: 1,
        relationship: 'SELF',
        firstName: 'random::firstName::male',
        lastName: 'random::lastName|save::lastName1',
        dob: 'random::dob::55-75|format::uiFormat',
        gender: 'MALE',
        telephone: 'random::phone',
        householdId: 1,
        hispanic: `random::pick::${hispanic
          .filter((p) => p != 'OTHER')
          .join(',')}` as HISPANIC,
        hispanicOther: '',
        race: `random::pick::${race
          .filter((p) => p != 'OTHER')
          .join(',')}` as RACE,
        raceOther: '',
        otherStay: `random::pick::${otherStay
          .filter((p) => p != 'OTHER')
          .join(',')}` as OTHER_STAY,
      },
      {
        id: 1,
        relationship: 'SPOUSE',
        firstName: 'random::firstName::female',
        lastName: 'get::lastName1',
        dob: 'random::dob::45-65|format::uiFormat',
        gender: 'FEMALE',
        telephone: 'random::phone',
        householdId: 1,
        hispanic: `random::pick::${hispanic
          .filter((p) => p != 'OTHER')
          .join(',')}` as HISPANIC,
        hispanicOther: '',
        race: `random::pick::${race
          .filter((p) => p != 'OTHER')
          .join(',')}` as RACE,
        raceOther: '',
        otherStay: `random::pick::${otherStay
          .filter((p) => p != 'OTHER')
          .join(',')}` as OTHER_STAY,
      },
    ],
  },
  {
    testTitle: 'Household w/o records',
    email: 'random::email',
    password: 'random::password',
    image: `random::pick::${avatars.join(',')}` as AVATAR,
    householdWithLienholder: {
      id: 1,
      homeType: `random::pick::${homeTypes.join(',')}` as HOME_TYPE,
      ownership: `random::pick::${ownerships.join(',')}` as OWNERSHIP,
      lienholderId: 1,
      lienholder: {
        id: 1,
        name: 'Bank of America, LLC',
      },
      address1: 'random::address1',
      address2: 'random::address2',
      city: 'random::city',
      state: 'random::state' as STATE,
      zip: 'random::zip',
    },
    recordsWithRelationship: null,
  },
  {
    testTitle: 'No household and no records',
    email: 'random::email',
    password: 'random::password',
    image: `random::pick::${avatars.join(',')}` as AVATAR,
    householdWithLienholder: null,
    recordsWithRelationship: null,
  },
];
