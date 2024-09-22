import axios, { AxiosResponse, Method } from 'axios';
import { Obj } from '../../index';

export default class Api {
  baseURL: string;
  email: string;
  password: string;
  cookies: string[] | undefined = undefined;
  cookiesTime: Date | null = null;

  constructor({
    baseURL,
    email,
    password,
  }: {
    baseURL: string;
    email: string;
    password: string;
  }) {
    this.baseURL = baseURL;
    this.email = email;
    this.password = password;
  }

  hourDifference(date1: Date, date2: Date = new Date()): number {
    if (date1 > date2) {
      const temp = date1;
      date1 = date2;
      date2 = temp;
    }
    const millisecondsDifference = date2.getTime() - date1.getTime();
    const hoursDifference = millisecondsDifference / (1000 * 60 * 60);
    return Math.round(hoursDifference);
  }

  async login() {
    const response = await axios({
      method: 'POST',
      url: `${this.baseURL}/api/auth/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: this.email,
        password: this.password,
      },
    });
    this.cookies = response.headers['set-cookie'];
    this.cookiesTime = new Date();
  }

  async call({
    method,
    endpoint,
    params,
    data,
  }: {
    method: Method;
    endpoint: string;
    params?: Obj;
    data?: Obj;
  }): Promise<AxiosResponse<any, any>> {
    if (
      this.cookies == undefined ||
      this.cookiesTime == null ||
      this.hourDifference(this.cookiesTime) > 4
    )
      await this.login();
    return await axios({
      method,
      url: `${this.baseURL}${endpoint}`,
      headers: {
        Cookie: this.cookies,
        // 'Content-Type': 'application/json',
        Accept: '*/*',
      },
      params,
      data,
    });
  }
}
