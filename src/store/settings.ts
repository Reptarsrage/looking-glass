import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type Settings = {
  videoAutoPlay: boolean;
  pictureLowDataMode: boolean;
  theme: 'system' | 'light' | 'dark';
};

type State = {
  settings: Settings;
  update: (settings: Partial<Settings>) => void;
};

const useSettingsStore = create<State>()(
  persist(
    devtools((set, get) => ({
      settings: {
        theme: 'system',
        videoAutoPlay: false,
        pictureLowDataMode: true,
      },
      update: async (settings) => {
        set({
          settings: {
            ...get().settings,
            ...settings,
          },
        });
      },
    })),
    {
      name: 'settings',
    }
  )
);

export default useSettingsStore;
