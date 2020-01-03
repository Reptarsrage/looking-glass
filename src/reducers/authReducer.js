import produce from 'immer';
import moment from 'moment';
import Store from 'electron-store';

import {
  FILE_SYSTEM_MODULE_ID,
  generateModuleId,
  handleAsyncError,
  handleAsyncFetch,
  handleAsyncSuccess,
  initialAsyncState,
} from './constants';
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGIN,
  FETCH_OATH_URL,
  FETCH_OATH_URL_ERROR,
  FETCH_OATH_URL_SUCCESS,
  AUTHORIZE,
  AUTHORIZE_SUCCESS,
  AUTHORIZE_ERROR,
  REFRESH_SUCCESS,
  REFRESH_ERROR,
  FETCH_MODULES_SUCCESS,
} from '../actions/types';

// Allow store to be passed via unit test
let electronStore;
const getStore = () => {
  if (!electronStore) {
    electronStore = new Store();
  }

  return electronStore;
};

export const initialState = {
  byId: {},
  allIds: [],
};

export const initialAuthState = {
  accessToken: '',
  oauth: {
    url: null,
    ...initialAsyncState,
  },
  refreshToken: '',
  expires: 0,
  ...initialAsyncState,
};

const authReducer = (state = initialState, action, store = getStore()) =>
  produce(state, draft => {
    const { type, payload, meta } = action || {};
    const { moduleId } = meta || {};

    switch (type) {
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;

        modules.forEach(module => {
          // generate id
          const id = generateModuleId(module.id);

          // load from persistent store
          draft.byId[id] = store.get(id, initialAuthState);
          draft.allIds.push(id);
        });

        // add file system
        draft.byId[FILE_SYSTEM_MODULE_ID] = initialAuthState;
        draft.allIds.push(FILE_SYSTEM_MODULE_ID);

        break;
      }
      case FETCH_OATH_URL: {
        handleAsyncFetch(state.byId[moduleId].oauth, draft.byId[moduleId].oauth);
        break;
      }
      case FETCH_OATH_URL_SUCCESS: {
        handleAsyncSuccess(state.byId[moduleId].oauth, draft.byId[moduleId].oauth);
        draft.byId[moduleId].oauth.url = payload;
        break;
      }
      case FETCH_OATH_URL_ERROR: {
        handleAsyncError(state.byId[moduleId].oauth, draft.byId[moduleId].oauth, payload);
        break;
      }
      case AUTHORIZE:
      case LOGIN: {
        handleAsyncFetch(state.byId[moduleId], draft.byId[moduleId]);
        break;
      }
      case REFRESH_SUCCESS:
      case AUTHORIZE_SUCCESS:
      case LOGIN_SUCCESS: {
        const { expiresIn } = payload;
        const date = moment();
        date.add(expiresIn, 'seconds');

        handleAsyncSuccess(state.byId[moduleId], draft.byId[moduleId]);
        draft.byId[moduleId] = {
          ...draft.byId[moduleId],
          ...payload,
          expires: date.valueOf(),
        };

        // save to persistent store
        store.set(moduleId, draft.byId[moduleId]);
        break;
      }
      case REFRESH_ERROR:
      case AUTHORIZE_ERROR:
      case LOGIN_ERROR: {
        handleAsyncError(state.byId[moduleId], draft.byId[moduleId], payload);
        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default authReducer;
