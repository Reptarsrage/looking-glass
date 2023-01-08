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
      let calledOnce = false;
      set(() => ({
        open,
        callback: () => {
          if (!calledOnce) {
            calledOnce = true;
            set({ callback: undefined });
            if (callback) {
              callback();
            }
          }
        },
      }));
    },
  }))
);

export default useDrawerStore;
