import { LOGIN, AUTHORIZE, FETCH_OATH_URL, REFRESH } from './types';

export const refresh = moduleId => ({
  type: REFRESH,
  payload: moduleId,
  meta: { moduleId },
});

export const authorize = (moduleId, code) => ({
  type: AUTHORIZE,
  payload: code,
  meta: { moduleId },
});

export const fetchOAuthURL = moduleId => ({
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
