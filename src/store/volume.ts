import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type State = {
  volume: number;
  muted: boolean;
  setVolume: (muted: boolean, volume: number) => void;
};

const useVolumeStore = create<State>()(
  persist(
    devtools((set) => ({
      volume: 1,
      muted: false,
      setVolume: (muted, volume) => {
        set({ muted, volume });
      },
    })),
    {
      name: 'volume',
      getStorage: () => sessionStorage, // Do we want this to persist between sessions?
    }
  )
);

export default useVolumeStore;
