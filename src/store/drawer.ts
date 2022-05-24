import create from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  open: boolean;
}

interface Mutations {
  setOpen: () => void;
  setClose: () => void;
}

const name = "drawer";
export const useDrawerStore = create<State & Mutations>(
  devtools(
    (set) => ({
      // State
      open: false,

      // Mutations
      setOpen: () => set({ open: true }, false, `${name}/setOpen`),
      setClose: () => set({ open: false }, false, `${name}/setClose`),
    }),
    { name }
  )
);
