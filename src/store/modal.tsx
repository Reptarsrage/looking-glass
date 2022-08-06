import React, { createContext, useReducer } from "react";

interface State {
  modalIsOpen: boolean;
  modalIsExited: boolean;
  modalItem: string | null;
  modalBoundingRect: DOMRect | null;
  modalCloseCallback: (() => void) | null;
}

interface OpenModalAction {
  type: "OPEN_MODAL";
  payload: { boundingRect: DOMRect; postId: string };
}

interface SetModalBoundsAction {
  type: "SET_MODAL_BOUNDS";
  payload: { boundingRect: DOMRect; postId: string };
}

interface SetModalItemAction {
  type: "SET_MODAL_ITEM";
  payload: { item: string | null };
}

interface CloseModalAction {
  type: "CLOSE_MODAL";
  payload?: () => void;
}

interface ExitModalAction {
  type: "EXIT_MODAL";
}

type Action = OpenModalAction | SetModalBoundsAction | SetModalItemAction | CloseModalAction | ExitModalAction;

interface Context {
  readonly state: State;
  dispatch: React.Dispatch<Action>;
}

const initialState: State = {
  modalIsOpen: false,
  modalIsExited: true,
  modalItem: null,
  modalBoundingRect: null,
  modalCloseCallback: null,
};

function reducer(state: State = initialState, action: Action) {
  const draft = { ...state };
  switch (action.type) {
    case "OPEN_MODAL": {
      const { postId, boundingRect } = action.payload;
      draft.modalIsOpen = true;
      draft.modalIsExited = false;
      draft.modalItem = postId;
      draft.modalBoundingRect = boundingRect;
      break;
    }
    case "SET_MODAL_BOUNDS": {
      const { postId, boundingRect } = action.payload;
      if (draft.modalItem === postId && draft.modalIsOpen) {
        draft.modalBoundingRect = boundingRect;
      }
      break;
    }
    case "SET_MODAL_ITEM": {
      const { item } = action.payload;
      draft.modalItem = item;
      break;
    }
    case "CLOSE_MODAL": {
      draft.modalIsOpen = false;
      draft.modalCloseCallback = action.payload ?? null;
      break;
    }
    case "EXIT_MODAL": {
      draft.modalIsExited = true;
      break;
    }
    default: {
      throw new Error("Unknown action");
    }
  }

  return draft;
}

export const ModalContext = createContext<Context>({ state: initialState, dispatch: () => {} });

export const ModalProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <ModalContext.Provider value={{ state, dispatch }}>{children}</ModalContext.Provider>;
};
