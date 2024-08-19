export type HOME_TYPE = 'HOUSE' | 'APARTMENT' | 'MOBILE_HOME' | 'SHELTER';

export type OWNERSHIP = 'MORTGAGE' | 'OWN' | 'RENT' | 'FREE_LIVING';

export type STATE =
  | 'AL'
  | 'AK'
  | 'AZ'
  | 'AR'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DE'
  | 'DC'
  | 'FL'
  | 'GA'
  | 'HI'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'IA'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'ME'
  | 'MD'
  | 'MA'
  | 'MI'
  | 'MN'
  | 'MS'
  | 'MO'
  | 'MT'
  | 'NE'
  | 'NV'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NY'
  | 'NC'
  | 'ND'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VT'
  | 'VA'
  | 'WA'
  | 'WV'
  | 'WI'
  | 'WY';

export interface Household {
  id: number;
  homeType: HOME_TYPE;
  ownership: OWNERSHIP;
  lienholderId: number | null;
  address1: string;
  address2: string | null;
  city: string;
  state: STATE;
  zip: string;
}

export interface Lienholder {
  id: number;
  name: string;
}

export interface HouseholdWithLienholder extends Household {
  lienholder: Lienholder | null;
}

export type GENDER = 'MALE' | 'FEMALE';

export type HISPANIC =
  | 'NO'
  | 'MEXICAN'
  | 'PUERTO_RICAN'
  | 'CUBAN'
  | 'OTHER'
  | 'NO_ANSWER';

export type RACE =
  | 'WHITE'
  | 'BLACK'
  | 'CHINESE'
  | 'FILIPINO'
  | 'ASIAN_INDIAN'
  | 'VIETNAMESE'
  | 'KOREAN'
  | 'JAPANESE'
  | 'OTHER_ASIAN'
  | 'NATIVE_HAWAIIAN'
  | 'SAMOAN'
  | 'CHAMORRO'
  | 'OTHER_PACIFIC'
  | 'OTHER'
  | 'NO_ANSWER';

export type OTHER_STAY =
  | 'NO'
  | 'COLLEGE'
  | 'MILITARY_ASSIGNMENT'
  | 'JOB_OR_BUSINESS'
  | 'NURSING_HOME'
  | 'WITH_PARENT_OR_OTHER_RELATIVE'
  | 'SEASONAL_OR_SECOND_RESIDENT'
  | 'JAIL_OR_PRISON'
  | 'OTHER';

export type RELATIONSHIP =
  | 'SELF'
  | 'SPOUSE'
  | 'PARTNER'
  | 'BIOLOGICAL_CHILD'
  | 'ADOPTED_CHILD'
  | 'STEP_CHILD'
  | 'COSINE'
  | 'PARENT'
  | 'GRANDCHILD'
  | 'GRANDPARENT'
  | 'OTHER_RELATIVE'
  | 'OTHER_NON_RELATIVE'
  | 'ROOMMATE_HOUSEMATE';

export interface Record {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: GENDER;
  telephone: string;
  householdId: number;
  hispanic: HISPANIC;
  hispanicOther: string | null;
  race: RACE;
  raceOther: string | null;
  otherStay: OTHER_STAY;
}

export interface RecordWithRelationship extends Record {
  relationship: RELATIONSHIP;
}

export interface Test {
  testTitle: string;
  email: string;
  password: string;
  householdWithLienholder: HouseholdWithLienholder | null;
  recordsWithRelationship: RecordWithRelationship[] | null;
}
