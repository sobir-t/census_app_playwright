import { Obj } from '../../index';

export default class Storage {
  storage: Obj;

  constructor() {
    this.storage = {};
  }

  save(key: string, value: any) {
    this.storage[key] = value;
  }

  get<T>(key: string): T | null {
    return this.storage[key] ? this.storage[key] : null;
  }

  has(key: string): boolean {
    return !!this.storage[key];
  }

  clear(): void {
    this.storage = {};
  }
}
