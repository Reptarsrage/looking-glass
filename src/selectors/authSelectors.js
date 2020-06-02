import { createSelector } from 'reselect';

import { initialState } from '../reducers/authReducer';
import { moduleByIdSelector } from './moduleSelectors';

const authState = (state) => state.auth || initialState;

const getGalleryId = (_, props) => props.galleryId;

const getModuleId = (_, props) => props.moduleId;

export const authByModuleIdSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId]
);

export const fetchingSelector = createSelector(authByModuleIdSelector, (state) => state.fetching);

export const errorSelector = createSelector(authByModuleIdSelector, (state) => state.error);

export const fetchedSelector = createSelector(authByModuleIdSelector, (state) => state.fetched);

export const accessTokenSelector = createSelector(authByModuleIdSelector, (state) => state.accessToken);

export const refreshTokenSelector = createSelector(authByModuleIdSelector, (state) => state.refreshToken);

export const expiresSelector = createSelector(authByModuleIdSelector, (state) => state.expires);

export const oauthURLSelector = createSelector(authByModuleIdSelector, (state) => state.oauth.url);

export const oauthURLSuccessSelector = createSelector(authByModuleIdSelector, (state) => state.oauth.fetched);

export const oauthURLFetchingSelector = createSelector(authByModuleIdSelector, (state) => state.oauth.fetching);

export const oauthURLErrorSelector = createSelector(authByModuleIdSelector, (state) => state.oauth.error);

export const isAuthenticatedSelector = createSelector(authByModuleIdSelector, (state) => state.fetched);

export const authUrlSelector = createSelector(
  [getModuleId, getGalleryId, moduleByIdSelector],
  (moduleId, galleryId, { authType }) => (authType ? `/${authType}/${moduleId}/${galleryId}` : null)
);

export const requiresAuthSelector = createSelector([moduleByIdSelector], (module) => !!module.authType);
