import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface State {
  volume: number;
}

interface Mutations {
  setVolume: (volume: number) => void;
}

const name = "volume";
export const useVolumeStore = create<State & Mutations>(
  persist(
    devtools(
      (set) => ({
        // State
        volume: 1,

        // Mutations
        setVolume: (volume: number) => set({ volume }, false, `${name}/setVolume`),
      }),
      { name }
    ),
    {
      name,
      getStorage: () => localStorage,
    }
  )
);
