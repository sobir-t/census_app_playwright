import { APIRequestContext, APIResponse } from '@playwright/test';
import { AVATAR } from '../../..';

interface RegisterProps {
  email: string;
  password: string;
  name: string;
  image: AVATAR;
}

export const registerNewUser = async ({
  request,
  baseURL,
  data,
}: {
  request: APIRequestContext;
  baseURL?: string;
  data: RegisterProps;
}): Promise<APIResponse> => {
  return await request.post(`${baseURL ? baseURL : ''}/api/auth/register`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
};

interface Credentials {
  email: string;
  password: string;
}

export const login = async ({
  request,
  baseURL,
  email,
  password,
}: {
  request: APIRequestContext;
  baseURL?: string;
  email: string;
  password: string;
}): Promise<APIResponse> => {
  return await request.post(`${baseURL ? baseURL : ''}/api/auth/login`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      email,
      password,
    },
  });
};
