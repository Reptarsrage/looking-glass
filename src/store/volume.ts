import { create } from 'zustand';
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
    }
  )
);

export default useVolumeStore;
