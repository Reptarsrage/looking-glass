import { createSelector } from 'reselect';

import { initialState } from '../reducers/authReducer';
import { moduleByIdSelector } from './moduleSelectors';

const authState = state => state.auth || initialState;

const getModuleId = (_, props) => props.moduleId;

const authByModuleIdSelector = createSelector([authState, getModuleId], (state, moduleId) => state.byId[moduleId]);

const fetchingSelector = createSelector(authByModuleIdSelector, state => state.fetching);

const errorSelector = createSelector(authByModuleIdSelector, state => state.error);

const successSelector = createSelector(authByModuleIdSelector, state => state.success);

const accessTokenSelector = createSelector(authByModuleIdSelector, state => state.accessToken);

const refreshTokenSelector = createSelector(authByModuleIdSelector, state => state.refreshToken);

const expiresSelector = createSelector(authByModuleIdSelector, state => state.expires);

const oauthURLSelector = createSelector(authByModuleIdSelector, state => state.oauth.url);

const oauthURLSuccessSelector = createSelector(authByModuleIdSelector, state => state.oauth.success);

const oauthURLFetchingSelector = createSelector(authByModuleIdSelector, state => state.oauth.fetching);

const oauthURLErrorSelector = createSelector(authByModuleIdSelector, state => state.oauth.error);

const isAuthenticatedSelector = createSelector(authByModuleIdSelector, state => state.success);

const authUrlSelector = createSelector([moduleByIdSelector], ({ id, authType }) =>
  authType ? `/${authType}/${id}` : null
);

const requiresAuthSelector = createSelector([moduleByIdSelector], module => !!module.authType);

export {
  authByModuleIdSelector,
  successSelector,
  fetchingSelector,
  errorSelector,
  accessTokenSelector,
  oauthURLSelector,
  expiresSelector,
  refreshTokenSelector,
  oauthURLSuccessSelector,
  oauthURLFetchingSelector,
  oauthURLErrorSelector,
  isAuthenticatedSelector,
  authUrlSelector,
  requiresAuthSelector,
};
