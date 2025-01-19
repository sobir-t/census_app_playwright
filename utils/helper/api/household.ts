import { APIRequestContext, APIResponse } from '@playwright/test';
import { HOME_TYPE, OWNERSHIP, STATE } from '@/types';

export const getAllLienholders = async ({
  request,
  baseURL,
}: {
  request: APIRequestContext;
  baseURL?: string;
}): Promise<APIResponse> => {
  return await request.get(`${baseURL ? baseURL : ''}/api/lienholder`);
};

export const saveNewLienholder = async ({
  request,
  baseURL,
  name,
}: {
  request: APIRequestContext;
  baseURL?: string;
  name: string;
}): Promise<APIResponse> => {
  return await request.put(`${baseURL ? baseURL : ''}/api/lienholder`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      name,
    },
  });
};

interface HouseholdProps {
  userId: number;
  homeType: HOME_TYPE;
  ownership: OWNERSHIP;
  lienholderId: number | null;
  address1: string;
  address2: string | null;
  city: string;
  state: STATE;
  zip: string;
}

export const saveNewHousehold = async ({
  request,
  baseURL,
  data,
}: {
  request: APIRequestContext;
  baseURL?: string;
  data: HouseholdProps;
}): Promise<APIResponse> => {
  return await request.put(`${baseURL ? baseURL : ''}/api/household`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
};
