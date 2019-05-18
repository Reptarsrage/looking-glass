import { fromJS } from 'immutable';

import { LOGIN_SUCCESS, LOGIN_ERROR, LOGIN } from '../actions/types';

const initialState = fromJS({
  accessToken: '',
  refreshToken: '',
  expires: 0,
  fetching: false,
  success: false,
  error: null,
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      const { accessToken, refreshToken, expires } = action.payload;
      return state.merge({ accessToken, refreshToken, expires, fetching: false, success: true });
    }
    case LOGIN_ERROR:
      return state.merge({
        fetching: false,
        success: false,
        error: action.payload,
      });
    case LOGIN:
      return state.merge({
        fetching: true,
        success: false,
        error: null,
      });
    default:
      return state;
  }
}
