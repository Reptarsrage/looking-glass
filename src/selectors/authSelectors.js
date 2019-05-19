import { createSelector } from 'reselect';

const authState = state => state.get('auth');

const fetchingSelector = moduleId =>
  createSelector(
    authState,
    state => state.getIn([moduleId, 'fetching'])
  );

const errorSelector = moduleId =>
  createSelector(
    authState,
    state => state.getIn([moduleId, 'error'])
  );

const successSelector = moduleId =>
  createSelector(
    authState,
    state => state.getIn([moduleId, 'success'])
  );

const accessTokenSelector = moduleId =>
  createSelector(
    authState,
    state => state.getIn([moduleId, 'accessToken'])
  );

const refreshTokenSelector = moduleId =>
  createSelector(
    authState,
    state => state.getIn([moduleId, 'refreshToken'])
  );

const oauthURLSelector = moduleId =>
  createSelector(
    authState,
    state => state.getIn([moduleId, 'oauthURL'])
  );

const expiresSelector = moduleId =>
  createSelector(
    authState,
    state => state.getIn([moduleId, 'expires'])
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
