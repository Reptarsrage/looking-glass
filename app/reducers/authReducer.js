import produce from 'immer';
import moment from 'moment';
import uuidv3 from 'uuid/v3';
import Store from 'electron-store';

import { initialAsyncState, handleAsyncFetch, handleAsyncError, handleAsyncSuccess } from './asyncActionReducer';
import { MODULES_NAMESPACE } from './moduleReducer';
import {
  ADD_MODULE,
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
      case ADD_MODULE: {
        const module = payload;

        // generate id
        const id = uuidv3(module.id, MODULES_NAMESPACE);

        // load from persistent store
        draft.byId[id] = initialAuthState; // store.get(id, initialAuthState); // TODO: remove this ASAP
        draft.allIds.push(id);
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
