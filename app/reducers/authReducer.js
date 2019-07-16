import produce from 'immer';
import moment from 'moment';
import Store from 'electron-store';

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

export const initialState = {};

export const initialAuthState = {
  accessToken: '',
  oauthURL: '',
  refreshToken: '',
  expires: 0,
  fetching: false,
  success: false,
  error: null,
};

const authReducer = (state = initialState, action) =>
  produce(state, draft => {
    const { type, payload, meta } = action || {};
    const { moduleId } = meta || {};

    switch (type) {
      case FETCH_MODULES_SUCCESS: {
        for (const { id } of payload) {
          // Load module authentication from persistent electron store
          draft[id] = { ...initialAuthState, ...store.get(id, {}) };
        }

        break;
      }
      case FETCH_OATH_URL: {
        draft[moduleId].fetching = true;

        break;
      }
      case FETCH_OATH_URL_SUCCESS: {
        draft[moduleId].fetching = false;
        draft[moduleId].oauthURL = payload;

        break;
      }
      case FETCH_OATH_URL_ERROR: {
        draft[moduleId].fetching = false;
        draft[moduleId].error = payload;

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

        draft[moduleId] = {
          ...state[moduleId],
          ...mergeState,
        };

        break;
      }
      case REFRESH_ERROR:
      case AUTHORIZE_ERROR:
      case LOGIN_ERROR: {
        draft[moduleId].fetching = false;
        draft[moduleId].success = false;
        draft[moduleId].error = payload;

        break;
      }
      case AUTHORIZE:
      case LOGIN: {
        draft[moduleId].fetching = true;

        break;
      }
      default:
        // Nothing to do
        break;
    }
  });

export default authReducer;
