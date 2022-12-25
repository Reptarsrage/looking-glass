import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  open: boolean;
  item: string | null;
  bounds: DOMRect | null;
  showInfo: boolean;
  onOpen: (() => void) | null;
  onClose: (() => void) | null;
  clearItem: () => void;
  toggleInfo: () => void;
  updateItem: (postId: string) => void;
  updateModalBounds: (domRect: DOMRect) => void;
  toggleModal: (
    value: boolean,
    domRect?: DOMRect | null,
    postId?: string | null,
    callback?: (() => void) | null
  ) => void;
}

const useModalStore = create<State>()(
  devtools((set, get) => ({
    open: false,
    showInfo: false,
    item: null,
    bounds: null,
    onOpen: null,
    onClose: null,

    toggleInfo: () => {
      set(() => ({
        showInfo: !get().showInfo,
      }));
    },

    toggleModal: (value, domRect = null, postId = null, callback = null) => {
      if (value && !get().open) {
        document.body.classList.add('overflow-hidden');
        set(() => ({
          open: true,
          item: postId,
          bounds: domRect,
          onOpen: callback,
          onClose: null,
        }));
      } else if (!value && get().open) {
        document.body.classList.remove('overflow-hidden');
        set(() => ({
          open: false,
          onClose: callback,
          onOpen: null,
        }));
      }
    },

    updateItem: (postId) => {
      set(() => ({
        item: postId,
      }));
    },

    updateModalBounds: (domRect) => {
      set(() => ({
        bounds: domRect,
      }));
    },

    clearItem: () => {
      set(() => ({
        item: null,
        bounds: null,
      }));
    },
  }))
);

export default useModalStore;
