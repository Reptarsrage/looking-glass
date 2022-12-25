import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  open: boolean;
  callback: (() => void) | undefined;
  toggleDrawer: (value: boolean, callback?: () => void) => void;
}

const useDrawerStore = create<State>()(
  devtools((set) => ({
    open: false,
    callback: undefined,
    toggleDrawer: (open, callback) => {
      set(() => ({ open, callback }));
    },
  }))
);

export default useDrawerStore;
