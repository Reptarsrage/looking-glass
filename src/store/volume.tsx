import { createContext, useEffect, useState } from "react";

interface Context {
  readonly volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
}

const LocalKey = "Volume";
function getInitialState(): number {
  const stored = localStorage.getItem(LocalKey);
  if (stored) {
    const volume = parseInt(stored, 10);
    return isNaN(volume) ? 1 : volume;
  }

  return 1;
}

export const VolumeContext = createContext<Context>({ volume: 1, setVolume: () => {} });

export const VolumeProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState<number>(getInitialState());

  useEffect(() => {
    localStorage.setItem(LocalKey, volume.toString());
  }, [volume]);

  return <VolumeContext.Provider value={{ volume, setVolume }}>{children}</VolumeContext.Provider>;
};
