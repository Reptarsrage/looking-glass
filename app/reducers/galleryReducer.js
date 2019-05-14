import { fromJS, List } from 'immutable';

import { FETCH_IMAGES, FETCH_IMAGES_SUCCESS, FETCH_IMAGES_FAILURE } from '../actions/types';

const initialState = fromJS({
  images: new List([]),
  offset: 0,
  hasNext: true,
  fetching: false,
  success: false,
  error: null
});

export default function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_IMAGES:
      return state.merge({ fetching: true, success: false, error: null });
    case FETCH_IMAGES_SUCCESS: {
      const { payload } = action;
      const { offset, images, hasNext, count } = payload;

      const newState = state.update('images', prevImages => prevImages.concat(fromJS(images)));
      return newState.merge({
        offset: offset + count,
        hasNext,
        fetching: false,
        success: true,
        error: null
      });
    }
    case FETCH_IMAGES_FAILURE:
      return state.merge({
        fetching: false,
        success: false,
        error: action.payload
      });
    default:
      return state;
  }
}
