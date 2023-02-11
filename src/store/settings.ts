import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type Settings = {
  videoAutoPlay: boolean;
  pictureLowDataMode: boolean;
};

type State = {
  settings: Settings;
  update: (settings: Partial<Settings>) => void;
};

const useSettingsStore = create<State>()(
  persist(
    devtools((set, get) => ({
      settings: {
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
