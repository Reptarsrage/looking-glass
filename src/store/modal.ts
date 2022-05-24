import create from "zustand";
import produce from "immer";
import { devtools } from "zustand/middleware";

interface State {
  modalIsOpen: boolean;
  modalIsExited: boolean;
  modalItem: string | null;
  modalBoundingRect: DOMRect | null;
}

interface Mutations {
  openModal: (boundingRect: DOMRect, postId: string) => void;
  setModalItemBounds: (boundingRect: DOMRect, postId: string) => void;
  setCurrentModalItem: (item: string | null) => void;
  closeModal: () => void;
  exitModal: () => void;
}

const name = "modal";
export const useModalStore = create<State & Mutations>(
  devtools(
    (set) => ({
      // State
      modalIsOpen: false,
      modalIsExited: true,
      modalItem: null,
      modalBoundingRect: null,

      // Mutations
      openModal: (boundingRect: DOMRect, postId: string) =>
        set(
          produce<State>((draft) => {
            draft.modalIsOpen = true;
            draft.modalIsExited = false;
            draft.modalItem = postId;
            draft.modalBoundingRect = boundingRect;
          }),
          false,
          `${name}/openModal`
        ),
      setModalItemBounds: (boundingRect: DOMRect, postId: string) =>
        set(
          produce<State>((draft) => {
            if (draft.modalItem === postId && draft.modalIsOpen) {
              draft.modalBoundingRect = boundingRect;
            }
          }),
          false,
          `${name}/setModalItemBounds`
        ),
      setCurrentModalItem: (item) =>
        set(
          produce<State>((draft) => {
            draft.modalItem = item;
          }),
          false,
          `${name}/setCurrentModalItem`
        ),
      closeModal: () =>
        set(
          produce<State>((draft) => {
            draft.modalIsOpen = false;
          }),
          false,
          `${name}/closeModal`
        ),
      exitModal: () =>
        set(
          produce<State>((draft) => {
            draft.modalIsExited = true;
          }),
          false,
          `${name}/exitModal`
        ),
    }),
    { name }
  )
);
