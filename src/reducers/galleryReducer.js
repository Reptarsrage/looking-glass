import { fromJS, List, Map } from 'immutable';

import { FETCH_IMAGES, FETCH_IMAGES_SUCCESS, FETCH_IMAGES_ERROR, FETCH_MODULES_SUCCESS } from '../actions/types';

export const initialState = fromJS({
  images: new List([]),
  offset: 0,
  before: null,
  after: null,
  hasNext: true,
  fetching: false,
  success: false,
  error: null,
});

export default function galleryReducer(state = new Map(), action) {
  const { type, payload, meta } = action || {};
  const { moduleId } = meta || {};

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      let nState = state;
      for (const module of payload) {
        nState = nState.set(module.id, initialState);
      }
      return nState;
    }
    case FETCH_IMAGES:
      return state.mergeIn([moduleId], { fetching: true, success: false, error: null });
    case FETCH_IMAGES_SUCCESS: {
      const { offset, images, hasNext, count, after, before } = payload;

      const newState = state.updateIn([moduleId, 'images'], prevImages => prevImages.concat(fromJS(images)));
      return newState.mergeIn([moduleId], {
        offset: offset + count,
        hasNext,
        after,
        before,
        fetching: false,
        success: true,
        error: null,
      });
    }
    case FETCH_IMAGES_ERROR:
      return state.mergeIn([moduleId], {
        fetching: false,
        success: false,
        error: payload,
      });
    default:
      return state;
  }
}
