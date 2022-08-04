import { createContext, useState } from "react";

export enum PreferredTheme {
  Default,
  Light,
  Dark,
}

interface Settings {
  preferredTheme: PreferredTheme;
  videoAutoPlay: boolean;
  videoLowDataMode: boolean;
  pictureLowDataMode: boolean;
  masonryColumnCount: number;
}

interface Context {
  readonly settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const defaultState = {
  videoAutoPlay: false,
  videoLowDataMode: true,
  pictureLowDataMode: true,
  masonryColumnCount: 4,
  preferredTheme: PreferredTheme.Default,
};

const LocalKey = "Settings";
function getInitialState(): Settings {
  const stored = localStorage.getItem(LocalKey);
  if (stored) {
    return JSON.parse(stored) || defaultState;
  }

  return defaultState;
}

export const SettingsContext = createContext<Context>({ settings: defaultState, setSettings: () => {} });

export const SettingsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(getInitialState());
  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
};
