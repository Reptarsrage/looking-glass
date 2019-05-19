import { fromJS, Map } from 'immutable';

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
} from '../actions/types';

export const initialState = fromJS({
  accessToken: '',
  oauthURL: '',
  refreshToken: '',
  expiresIn: 0,
  fetching: false,
  success: false,
  error: null,
});

export default function authReducer(state = new Map(), action) {
  const { type, payload, meta } = action || {};
  const { moduleId } = meta || {};

  switch (type) {
    case FETCH_MODULES_SUCCESS: {
      let nState = state;
      for (const module of payload) {
        nState = nState.set(module.id, initialState);
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
    case AUTHORIZE_SUCCESS:
    case LOGIN_SUCCESS: {
      const { accessToken, refreshToken, expiresIn } = payload;
      return state.mergeIn([moduleId], { accessToken, refreshToken, expiresIn, fetching: false, success: true });
    }
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
