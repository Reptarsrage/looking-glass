import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export enum PreferredTheme {
  Default,
  Light,
  Dark,
}

interface State {
  preferredTheme: PreferredTheme;
  videoAutoPlay: boolean;
  videoLowDataMode: boolean;
  pictureLowDataMode: boolean;
  masonryColumnCount: number;
}

interface UpdateParams {
  videoAutoPlay?: boolean;
  videoLowDataMode?: boolean;
  pictureLowDataMode?: boolean;
  preferredTheme?: PreferredTheme;
}

interface Mutations {
  update: (params: UpdateParams) => void;
}

const name = "settings";
export const useSettingsStore = create<State & Mutations>(
  persist(
    devtools(
      (set, get) => ({
        // State
        videoAutoPlay: false,
        videoLowDataMode: true,
        pictureLowDataMode: true,
        masonryColumnCount: 4,
        preferredTheme: PreferredTheme.Default,

        // Mutations
        update: (params) => set({ ...get(), ...params }, false, `${name}/update`),
      }),
      { name }
    ),
    {
      name,
    }
  )
);
