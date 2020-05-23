import produce from 'immer';

import {
  TOGGLE_DARK_THEME,
  SET_CURRENT_GALLERY,
  FULL_SCREEN_TRANSITION_IN,
  FULL_SCREEN_TRANSITION_OUT,
  FULL_SCREEN_TRANSITION_OVER,
} from '../actions/types';

export const initialState = {
  darkTheme: true,
  currentModuleId: null,
  currentGalleryId: null,
  fullScreenItem: null,
  fullScreenIn: false,
};

const authReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    const { type, payload } = action || {};
    switch (type) {
      case SET_CURRENT_GALLERY: {
        const { moduleId, galleryId } = payload;
        draft.currentModuleId = moduleId;
        draft.currentGalleryId = galleryId;
        break;
      }
      case TOGGLE_DARK_THEME: {
        draft.darkTheme = !state.darkTheme;
        break;
      }
      case FULL_SCREEN_TRANSITION_IN: {
        const itemId = payload;
        draft.fullScreenItem = itemId;
        draft.fullScreenIn = true;
        break;
      }
      case FULL_SCREEN_TRANSITION_OUT: {
        draft.fullScreenIn = false;
        break;
      }
      case FULL_SCREEN_TRANSITION_OVER: {
        draft.fullScreenItem = null;
        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default authReducer;
