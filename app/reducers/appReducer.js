import produce from 'immer';

import { LOCATION_CHANGE, TOGGLE_DARK_THEME } from '../actions/types';

export const initialState = {
  moduleId: null,
  galleryId: null,
  darkTheme: true,
};

const authReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload } = action || {};
    switch (type) {
      case LOCATION_CHANGE: {
        const { location } = payload;
        const { pathname } = location;
        const parts = pathname.split('/');
        let moduleId;
        let galleryId;

        if (parts[1] === 'gallery') {
          [, , moduleId, galleryId] = parts;
          draft.moduleId = moduleId;
          draft.galleryId = galleryId;
        } else if (parts[1] === 'login' || parts[1] === 'oauth') {
          [, , moduleId] = parts;
          galleryId = 'default';
        }

        draft.moduleId = moduleId;
        draft.galleryId = galleryId;
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
