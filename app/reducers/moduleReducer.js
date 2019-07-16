import produce from 'immer';

import { FETCH_MODULES_SUCCESS, FETCH_MODULES_ERROR, FETCH_MODULES } from '../actions/types';

export const initialState = {
  modules: [],
  fetching: false,
  success: false,
  error: null,
};

export const initialModuleState = {
  id: 'default',
  title: null,
  description: null,
  authType: null,
  icon: null,
};

const moduleReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload } = action || {};
    switch (type) {
      case FETCH_MODULES_SUCCESS: {
        draft.fetching = false;
        draft.success = true;
        draft.modules = payload;
        break;
      }
      case FETCH_MODULES_ERROR:
        draft.fetching = false;
        draft.success = false;
        draft.error = payload;
        break;
      case FETCH_MODULES: {
        draft.fetching = true;
        draft.success = false;
        draft.error = null;
        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default moduleReducer;
