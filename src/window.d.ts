export {}; // let the transpiler know this is a module

declare global {
  interface Window {
    // see preload.js and ipc.js for definitions
    electronAPI: {
      setTitle: (title?: string) => void;
      chooseFolder: () => Promise<string>;
      oauth: (uri: string) => Promise<string>;
      minimize: () => void;
      maximize: () => void;
      unmaximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      on: (eventName: string, callback: () => void) => void;
      off: (eventName: string, callback: () => void) => void;
    };

    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
      v8: () => string;
      os: () => Promise<string>;
      app: () => Promise<string>;
    };
  }
}
