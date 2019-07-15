import { fromJS, List, Map } from 'immutable';

import {
  FETCH_IMAGES,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_ERROR,
  FETCH_MODULES_SUCCESS,
  LOCATION_CHANGE,
  UPDATE_SEARCH,
  CLEAR_IMAGES,
  CLEAR_SEARCH,
} from '../actions/types';

export const initialState = fromJS({
  images: new List([]),
  offset: 1,
  before: null,
  after: null,
  hasNext: true,
  fetching: false,
  success: false,
  error: null,
  searchQuery: null,
});

export default function galleryReducer(state = new Map(), action) {
  const { type, payload, meta } = action || {};
  let { moduleId, galleryId = 'default' } = meta || {};

  switch (type) {
    case CLEAR_SEARCH: {
      return state.mergeIn([moduleId, galleryId], {
        images: new List([]),
        offset: 1,
        before: null,
        after: null,
        hasNext: true,
        fetching: true,
        success: false,
        searchQuery: null,
        error: null,
      });
    }
    case CLEAR_IMAGES: {
      return state.mergeIn([moduleId, galleryId], {
        images: new List([]),
        offset: 1,
        before: null,
        after: null,
        hasNext: true,
        fetching: true,
        success: false,
        error: null,
      });
    }
    case UPDATE_SEARCH: {
      return state.mergeIn([moduleId, galleryId], { searchQuery: payload });
    }
    case LOCATION_CHANGE: {
      const { location } = payload;
      const { pathname } = location;
      const parts = pathname.split('/');

      if (parts[1] === 'gallery') {
        [, , moduleId, galleryId] = parts;
        if (!state.hasIn([moduleId, galleryId])) {
          return state.setIn([moduleId, galleryId], initialState);
        }
        // reset so that we're in a good state even if FECH_IMAGES is cancelled
        return state.mergeIn([moduleId, galleryId], { fetching: false, error: null, success: false });
      }

      return state;
    }
    case FETCH_MODULES_SUCCESS: {
      let nState = state;
      for (const module of payload) {
        nState = nState.setIn([module.id, galleryId], initialState);
      }
      return nState;
    }
    case FETCH_IMAGES:
      return state.mergeIn([moduleId, galleryId], { fetching: true, success: false, error: null });
    case FETCH_IMAGES_SUCCESS: {
      const { offset, images, hasNext, after, before } = payload;

      const newState = state.updateIn([moduleId, galleryId, 'images'], prevImages => prevImages.concat(fromJS(images)));
      return newState.mergeIn([moduleId, galleryId], {
        offset,
        hasNext,
        after,
        before,
        fetching: false,
        success: true,
        error: null,
      });
    }
    case FETCH_IMAGES_ERROR:
      return state.mergeIn([moduleId, galleryId], {
        fetching: false,
        success: false,
        error: payload,
      });
    default:
      return state;
  }
}
