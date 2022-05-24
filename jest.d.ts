/// <reference types="jest" />

declare namespace jest {
  interface It {
    mocked<T = any>(thing: T): jest.Mocked<T>;
  }
}
