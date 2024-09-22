import { APIRequestContext, APIResponse } from '@playwright/test';
import { HISPANIC, OTHER_STAY, RACE, RELATIONSHIP } from '../../..';

interface RecordProps {
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'MALE' | 'FEMALE';
  telephone: string | null;
  householdId: number;
  hispanic: HISPANIC;
  hispanicOther: string | null;
  race: RACE;
  raceOther: string | null;
  otherStay: OTHER_STAY;
}

export const saveNewRecord = async ({
  request,
  baseURL,
  data,
}: {
  request: APIRequestContext;
  baseURL?: string;
  data: RecordProps;
}): Promise<APIResponse> => {
  return await request.put(`${baseURL ? baseURL : ''}/api/record`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
};

interface RecordWithRelationshipProps extends RecordProps {
  relationship: RELATIONSHIP;
  userId: number;
}

export const saveNewRecordWithRelationship = async ({
  request,
  baseURL,
  data,
}: {
  request: APIRequestContext;
  baseURL?: string;
  data: RecordWithRelationshipProps;
}): Promise<APIResponse> => {
  return await request.put(`${baseURL ? baseURL : ''}/api/record/relative`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
};
