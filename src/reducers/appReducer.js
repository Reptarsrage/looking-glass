import produce from 'immer';

import { TOGGLE_DARK_THEME, SET_CURRENT_GALLERY } from '../actions/types';

export const initialState = {
  darkTheme: true,
  currentModuleId: null,
  currentGalleryId: null,
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
      default:
        // Nothing to do
        break;
    }
  });

export default authReducer;
