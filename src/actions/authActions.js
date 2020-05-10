import { LOGIN, AUTHORIZE, FETCH_OATH_URL } from './types';

export const authorize = (moduleId, code) => ({
  type: AUTHORIZE,
  payload: code,
  meta: { moduleId },
});

export const fetchOAuthURL = (moduleId) => ({
  type: FETCH_OATH_URL,
  meta: { moduleId },
});

export const login = (moduleId, username, password) => ({
  type: LOGIN,
  payload: {
    username,
    password,
  },
  meta: { moduleId },
});
