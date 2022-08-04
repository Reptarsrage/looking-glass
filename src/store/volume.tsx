import { createContext, useState } from "react";

interface Context {
  readonly volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
}

export const VolumeContext = createContext<Context>({ volume: 1, setVolume: () => {} });

export const VolumeProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState<number>(1);
  return <VolumeContext.Provider value={{ volume, setVolume }}>{children}</VolumeContext.Provider>;
};
