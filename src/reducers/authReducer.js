import produce from 'immer';
import moment from 'moment';
import uuidv3 from 'uuid/v3';
import Store from 'electron-store';

import { initialAsyncState, handleAsyncFetch, handleAsyncError, handleAsyncSuccess } from './asyncActionReducer';
import { MODULES_NAMESPACE, FILE_SYSTEM_MODULE_ID } from './moduleReducer';
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

const store = new Store();

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

const authReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload, meta } = action || {};
    const { moduleId } = meta || {};

    switch (type) {
      case FETCH_MODULES_SUCCESS: {
        const modules = payload;

        modules.forEach(module => {
          // generate id
          const id = uuidv3(module.id, MODULES_NAMESPACE);

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
