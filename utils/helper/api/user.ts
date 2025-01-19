import { APIRequestContext, APIResponse } from '@playwright/test';
import { Obj } from '@/types';

interface UserQueryParams extends Obj {
  id?: number;
  email?: string;
}

export const getUserByParams = async ({
  request,
  baseURL,
  params,
}: {
  request: APIRequestContext;
  baseURL?: string;
  params: UserQueryParams;
}): Promise<APIResponse> => {
  return await request.get(`${baseURL ? baseURL : ''}/api/user`, {
    headers: {
      'Content-Type': 'application/json',
    },
    params,
  });
};
