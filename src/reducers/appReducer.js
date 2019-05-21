import { fromJS } from 'immutable';

import { LOCATION_CHANGE } from '../actions/types';

const initialState = fromJS({
  moduleId: null,
  galleryId: null,
});

export default function authReducer(state = initialState, action) {
  const { type, payload } = action || {};

  switch (type) {
    case LOCATION_CHANGE: {
      const { location } = payload;
      const { pathname } = location;
      const parts = pathname.split('/');

      if (parts[1] === 'gallery') {
        const [, , moduleId, galleryId] = parts;
        return state.merge({ moduleId, galleryId });
      } else if (parts[1] === 'login' || parts[1] === 'oauth') {
        const [, , moduleId] = parts;
        return state.merge({ moduleId, galleryId: 'default' });
      }

      return state;
    }
    default:
      return state;
  }
}
