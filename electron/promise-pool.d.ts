declare module '@mixmaxhq/promise-pool' {
  interface PromisePoolOptions {
    numConcurrent?: number;
  }

  class PromisePool {
    constructor(config?: PromisePoolOptions);

    start<A extends []>(fn: (...args: A) => Promise<void>, ...args: A): Promise<void>;

    flush(): Promise<Error[]>;
  }

  export = PromisePool;
}
