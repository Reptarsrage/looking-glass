import { createSelector } from 'reselect';

const authState = state => state.get('auth');

const fetchingSelector = () =>
  createSelector(
    authState,
    state => state.get('fetching')
  );

const errorSelector = () =>
  createSelector(
    authState,
    state => state.get('error')
  );

const successSelector = () =>
  createSelector(
    authState,
    state => state.get('success')
  );

const accessTokenSelector = () =>
  createSelector(
    authState,
    state => state.get('accessToken')
  );

const refreshTokenSelector = () =>
  createSelector(
    authState,
    state => state.get('refreshToken')
  );

const expiresSelector = () =>
  createSelector(
    authState,
    state => state.get('expires')
  );

export { successSelector, fetchingSelector, errorSelector, accessTokenSelector, refreshTokenSelector, expiresSelector };
