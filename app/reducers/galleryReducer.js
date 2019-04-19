import { fromJS, List } from 'immutable';

import {
  LOAD_IMAGE_SUCCESS,
  LOAD_IMAGE_ERROR,
  FETCH_IMAGES,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_FAILURE
} from '../actions/types';

const initialState = fromJS({
  images: new List([]),
  fetching: false,
  success: false,
  error: null
});

export default function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_IMAGES:
      return state.merge({ fetching: true, success: false, error: null });
    case FETCH_IMAGES_SUCCESS:
      return state.merge({
        fetching: false,
        success: true,
        error: null
      });
    case FETCH_IMAGES_FAILURE:
      return state.merge({
        fetching: false,
        success: false,
        error: action.payload
      });
    case LOAD_IMAGE_SUCCESS:
      try {
        return state.update('images', images => images.push(fromJS(action.payload)));
      } catch (e) {
        console.error(e);
      }

      return state;
    case LOAD_IMAGE_ERROR:
    default:
      return state;
  }
}
