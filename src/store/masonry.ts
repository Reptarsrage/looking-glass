import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import produce from "immer";

interface State {
  masonryScrollToItemId?: string;
  masonryScrollOffset: number;
}

interface Mutations {
  scrollMasonryTo: (masonryScrollToItemId: string) => void;
  setMasonryScrollOffset: (masonryScrollOffset: number) => void;
}

const name = "masonry";
export const useMasonryStore = create<State & Mutations>(
  persist(
    devtools(
      (set) => ({
        // State
        masonryScrollToItemId: undefined,
        masonryScrollOffset: 0,

        // Mutations
        scrollMasonryTo: (masonryScrollToItemId) =>
          set(
            produce<State>((draft) => {
              draft.masonryScrollToItemId = masonryScrollToItemId;
            }),
            false,
            `${name}/scrollMasonryTo`
          ),
        setMasonryScrollOffset: (scrollOffset) =>
          set(
            produce<State>((draft) => {
              draft.masonryScrollOffset = scrollOffset;
            }),
            false,
            `${name}/setMasonryScrollOffset`
          ),
      }),
      { name }
    ),
    {
      name,
      getStorage: () => sessionStorage,
    }
  )
);
