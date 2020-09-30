import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  FETCH_OATH_URL,
  FETCH_OATH_URL_SUCCESS,
  FETCH_OATH_URL_FAILURE,
  REFRESH_SUCCESS,
  REFRESH_FAILURE,
  AUTHORIZE,
  AUTHORIZE_SUCCESS,
  AUTHORIZE_FAILURE,
} from './types';

export const authorize = (moduleId, code) => ({
  type: AUTHORIZE,
  payload: code,
  meta: moduleId,
});

export const fetchOAuthURL = (moduleId) => ({
  type: FETCH_OATH_URL,
  meta: moduleId,
});

export const login = (moduleId, username, password) => ({
  type: LOGIN,
  payload: {
    username,
    password,
  },
  meta: moduleId,
});

export const loginSuccess = (moduleId, data) => ({
  type: LOGIN_SUCCESS,
  payload: data,
  meta: moduleId,
});

export const loginFailure = (moduleId, error) => ({
  type: LOGIN_FAILURE,
  payload: error,
  meta: moduleId,
});

export const fetchOathUrlSuccess = (moduleId, data) => ({
  type: FETCH_OATH_URL_SUCCESS,
  payload: data,
  meta: moduleId,
});

export const fetchOathUrlFailure = (moduleId, error) => ({
  type: FETCH_OATH_URL_FAILURE,
  payload: error,
  meta: moduleId,
});

export const refreshSuccess = (moduleId, data) => ({
  type: REFRESH_SUCCESS,
  payload: data,
  meta: moduleId,
});

export const refreshFailure = (moduleId, error) => ({
  type: REFRESH_FAILURE,
  payload: error,
  meta: moduleId,
});

export const authorizeSuccess = (moduleId, data) => ({
  type: AUTHORIZE_SUCCESS,
  payload: data,
  meta: moduleId,
});

export const authorizeFailure = (moduleId, error) => ({
  type: AUTHORIZE_FAILURE,
  payload: error,
  meta: moduleId,
});
