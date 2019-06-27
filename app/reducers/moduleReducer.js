import { fromJS } from 'immutable';

import { FETCH_MODULES_SUCCESS, FETCH_MODULES_ERROR, FETCH_MODULES } from '../actions/types';

const initialState = fromJS({
  modules: [],
  fetching: false,
  success: false,
  error: null,
});

export default function moduleReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MODULES_SUCCESS: {
      const modules = action.payload;
      const nState = state.merge({ fetching: false, success: true });
      return nState.set('modules', fromJS(modules));
    }
    case FETCH_MODULES_ERROR:
      return state.merge({
        fetching: false,
        success: false,
        error: action.payload,
      });
    case FETCH_MODULES:
      return state.merge({
        fetching: true,
        success: false,
        error: null,
      });
    default:
      return state;
  }
}
