import { LOGIN } from './types';

/* eslint-disable-next-line import/prefer-default-export */
export const login = (username, password) => ({
  type: LOGIN,
  payload: {
    username,
    password,
  },
});
