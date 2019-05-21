import { createSelector } from 'reselect';

const authState = state => state.get('auth');
const appState = state => state.get('app');

const fetchingSelector = () =>
  createSelector(
    authState,
    appState,
    (auth, app) => auth.getIn([app.get('moduleId'), 'fetching'])
  );

const errorSelector = () =>
  createSelector(
    authState,
    appState,
    (auth, app) => auth.getIn([app.get('moduleId'), 'error'])
  );

const successSelector = () =>
  createSelector(
    authState,
    appState,
    (auth, app) => auth.getIn([app.get('moduleId'), 'success'])
  );

const accessTokenSelector = () =>
  createSelector(
    authState,
    appState,
    (auth, app) => auth.getIn([app.get('moduleId'), 'accessToken'])
  );

const refreshTokenSelector = () =>
  createSelector(
    authState,
    appState,
    (auth, app) => auth.getIn([app.get('moduleId'), 'refreshToken'])
  );

const oauthURLSelector = () =>
  createSelector(
    authState,
    appState,
    (auth, app) => auth.getIn([app.get('moduleId'), 'oauthURL'])
  );

const expiresSelector = () =>
  createSelector(
    authState,
    appState,
    (auth, app) => auth.getIn([app.get('moduleId'), 'expires'])
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
