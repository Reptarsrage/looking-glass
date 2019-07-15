import { fromJS, Map } from 'immutable';
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

const initialModuleState = {
  accessToken: '',
  oauthURL: '',
  refreshToken: '',
  expires: 0,
  fetching: false,
  success: false,
  error: null,
};

export default function authReducer(state = new Map(), action) {
  const { type, payload, meta } = action || {};
  const { moduleId } = meta || {};

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      let nState = state;
      for (const module of payload) {
        nState = nState.set(module.id, fromJS(store.get(module.id, initialModuleState)));
      }
      return nState;
    }
    case FETCH_OATH_URL: {
      return state.mergeIn([moduleId], { fetching: true });
    }
    case FETCH_OATH_URL_SUCCESS: {
      return state.mergeIn([moduleId], { oauthURL: payload, fetching: false });
    }
    case FETCH_OATH_URL_ERROR: {
      return state.mergeIn([moduleId], { error: payload, fetching: false });
    }
    case REFRESH_SUCCESS:
    case AUTHORIZE_SUCCESS:
    case LOGIN_SUCCESS: {
      const { expiresIn } = payload;
      const date = moment();
      date.add(expiresIn, 'seconds');

      const mergeState = { ...payload, expires: date.valueOf(), fetching: false, success: true, error: null };

      store.set(moduleId, mergeState);
      return state.mergeIn([moduleId], mergeState);
    }
    case REFRESH_ERROR:
    case AUTHORIZE_ERROR:
    case LOGIN_ERROR: {
      return state.mergeIn([moduleId], {
        fetching: false,
        success: false,
        error: payload,
      });
    }
    case AUTHORIZE:
    case LOGIN:
      return state.mergeIn([moduleId], { fetching: true });
    default:
      return state;
  }
}
