import { format } from 'date-fns';
import faker from 'faker';
import Storage from './storage';

import { alphabets, numbers, uiFormat, apiFormat, states } from './enums';
import { Obj } from '@/types';

export const storage = new Storage();

export const getRandom = <T>(array: T[]): T => {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
};

const getRandomInLength = (array: string[], length: number = 1): string => {
  let result: string = '';
  while (result.length < length) {
    result = `${result}${getRandom<string>(array)}`;
  }
  return result;
};

const getRandomAlphabetic = (): string => {
  return getRandom<string>(alphabets);
};

const getRandomNumeric = (): string => {
  return getRandom<string>(numbers);
};

const getRandomBetween = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const define = (instruction: string): string => {
  const commands: string[] = instruction.split('|');
  let value: string = '';

  commands.forEach((command: string) => {
    if (command.includes('::')) {
      const [method, arg1, arg2, arg3]: string[] = command.split('::');
      switch (method) {
        case 'random':
          switch (arg1) {
            case 'firstFakeName':
              value = 'FAKE';
              while (value.length < 13) {
                value = `${value}${
                  Math.random() > 0.5
                    ? getRandomAlphabetic()
                    : getRandomNumeric()
                }`;
              }
              console.log(`arg2 = ${arg2}`);
              break;
            case 'firstName':
              value = faker.name.firstName(
                arg2 ? (arg2 == 'male' ? 0 : 1) : undefined
              );
              break;
            case 'LastFakeName':
              value = 'FAKE';
              while (value.length < 18) {
                value = `${value}${
                  Math.random() > 0.5
                    ? getRandomAlphabetic()
                    : getRandomNumeric()
                }`;
              }
              break;
            case 'lastName':
              value = faker.name.lastName(
                arg2 ? (arg2 == 'male' ? 1 : 0) : undefined
              );
              break;
            case 'dob':
              let age: number = 0;
              if (arg2.includes('-')) {
                const [min, max]: number[] = arg2
                  .split('-')
                  .reduce((r: number[], e: string) => {
                    r.push(parseInt(e));
                    return r;
                  }, []);
                if (max < min)
                  throw new Error(
                    `When requesting for random age with age range you have to provide 'min-max', but you've provided ${min}-${max}`
                  );
                age = getRandomBetween(min, max);
              } else age = parseInt(arg1);
              const currentYear = new Date().getFullYear();
              const birthYear = currentYear - age;

              // Generate a random day of the year between 1 and 365 (excluding leap years)
              const randomDayOfYear = Math.floor(Math.random() * 365) + 1;

              // Convert the random day of the year to a date object
              const birthDate = new Date(birthYear, 0, randomDayOfYear);
              value = birthDate.toISOString().substring(0, 10);
              break;
            case 'email':
              value = faker.internet.email();
              break;
            case 'password':
              value = faker.internet.password(9);
              break;
            case 'phone':
              value = getRandomInLength(numbers, arg2 ? parseInt(arg2) : 9);
              break;
            case 'gender':
              value = Math.random() > 0.5 ? 'male' : 'female';
              break;
            case 'address1':
              value = faker.address.streetAddress();
              break;
            case 'address2':
              value =
                Math.random() > 0.5 ? faker.address.secondaryAddress() : '';
              break;
            case 'city':
              value = faker.address.city();
              break;
            case 'state':
              value = getRandom<string>(states);
              break;
            case 'zip':
              value = getRandomInLength(numbers, 5);
              break;
            case 'pick':
              if (arg3) value = getRandom<string>(arg2.split(arg3));
              else value = getRandom<string>(arg2.split(','));
              break;
          }
          break; // random method arguments end
        case 'format':
          switch (arg1) {
            case 'uiFormat':
              value = format(new Date(value), uiFormat);
              break;
            case 'apiFormat':
              value = format(new Date(value), apiFormat);
              break;
          }
          break;
        case 'save':
          storage.save(arg1, value);
          break;
        case 'get':
          const v = storage.get<string>(arg1);
          if (v == null)
            throw new Error(`storage doesn't have value for ${arg1}`);
          value = v;
          break;
        default:
          throw new Error(`method ${method} is not added to value generator.`);
      }
    } else value = command;
  });
  return value;
};

export const parseObj = (obj: Obj): Obj => {
  Object.keys(obj).forEach((key: string) => {
    if (typeof obj[key] == 'string') obj[key] = define(obj[key]);
    else if (obj[key] instanceof Array) obj[key] = parseObjArray(obj[key]);
    else if (typeof obj[key] == 'object' && obj[key] != null)
      obj[key] = parseObj(obj[key]);
  });
  return obj;
};

export const parseObjArray = (objArray: Obj[]): Obj[] => {
  objArray.forEach((obj: Obj) => parseObj(obj));
  return objArray;
};
