import { createContext, useState } from "react";

interface Context {
  readonly fullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FullscreenContext = createContext<Context>({ fullscreen: false, setFullscreen: () => {} });

export const FullscreenProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  return <FullscreenContext.Provider value={{ fullscreen, setFullscreen }}>{children}</FullscreenContext.Provider>;
};
