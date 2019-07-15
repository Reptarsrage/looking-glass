import { createSelector } from 'reselect';

import { moduleIdSelector } from './appSelectors';
import { initialAuthState, initialState } from '../reducers/authReducer';

const authState = state => state.auth || initialState;

const getStateOrInitial = (state, moduleId) =>
  moduleId && Object.prototype.hasOwnProperty.call(state, moduleId) ? state[moduleId] : initialAuthState;

const fetchingSelector = createSelector(
  [authState, moduleIdSelector],
  (state, moduleId) => getStateOrInitial(state, moduleId).fetching
);

const errorSelector = createSelector(
  [authState, moduleIdSelector],
  (state, moduleId) => getStateOrInitial(state, moduleId).error
);

const successSelector = createSelector(
  [authState, moduleIdSelector],
  (state, moduleId) => getStateOrInitial(state, moduleId).success
);

const accessTokenSelector = createSelector(
  [authState, moduleIdSelector],
  (state, moduleId) => getStateOrInitial(state, moduleId).accessToken
);

const refreshTokenSelector = createSelector(
  [authState, moduleIdSelector],
  (state, moduleId) => getStateOrInitial(state, moduleId).refreshToken
);

const oauthURLSelector = createSelector(
  [authState, moduleIdSelector],
  (state, moduleId) => getStateOrInitial(state, moduleId).oauthURL
);

const expiresSelector = createSelector(
  [authState, moduleIdSelector],
  (state, moduleId) => getStateOrInitial(state, moduleId).expires
);

export {
  successSelector,
  fetchingSelector,
  errorSelector,
  accessTokenSelector,
  oauthURLSelector,
  expiresSelector,
  refreshTokenSelector,
};
