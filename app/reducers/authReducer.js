import produce from 'immer';
import moment from 'moment';
import Store from 'electron-store';

import { initialAsyncState } from './asyncActionReducer';

import {
  FETCH_MODULES_SUCCESS,
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
  oauthURL: '',
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
        draft.byId = {};
        draft.allIds = [];
        for (const { id } of payload) {
          // Load module authentication from persistent electron store
          draft.byId[id] = store.get(id, initialAuthState);
          draft.allIds.push(id);
        }

        break;
      }
      case FETCH_OATH_URL: {
        draft.byId[moduleId].fetching = true;

        break;
      }
      case FETCH_OATH_URL_SUCCESS: {
        draft.byId[moduleId].fetching = false;
        draft.byId[moduleId].oauthURL = payload;

        break;
      }
      case FETCH_OATH_URL_ERROR: {
        draft.byId[moduleId].fetching = false;
        draft.byId[moduleId].error = payload;

        break;
      }
      case REFRESH_SUCCESS:
      case AUTHORIZE_SUCCESS:
      case LOGIN_SUCCESS: {
        const { expiresIn } = payload;
        const date = moment();
        date.add(expiresIn, 'seconds');

        const mergeState = { ...payload, expires: date.valueOf(), fetching: false, success: true, error: null };

        // Save module authentication from persistent electron store
        store.set(moduleId, mergeState);

        draft.byId[moduleId] = {
          ...state.byId[moduleId],
          ...mergeState,
        };

        break;
      }
      case REFRESH_ERROR:
      case AUTHORIZE_ERROR:
      case LOGIN_ERROR: {
        draft.byId[moduleId].fetching = false;
        draft.byId[moduleId].success = false;
        draft.byId[moduleId].error = payload;

        break;
      }
      case AUTHORIZE:
      case LOGIN: {
        draft.byId[moduleId].fetching = true;

        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default authReducer;
