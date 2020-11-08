import { createSelector } from 'reselect'

import { initialState, initialAuthState } from 'reducers/authReducer'
import { moduleSelector } from './moduleSelectors'

const authState = (state) => state.auth || initialState

const getGalleryId = (_, props) => props.galleryId

const getModuleId = (_, props) => props.moduleId

export const authByModuleIdSelector = createSelector(
  [authState, getModuleId],
  (state, moduleId) => state.byId[moduleId] || initialAuthState
)

export const fetchingSelector = createSelector(authByModuleIdSelector, (state) => state.fetching)

export const errorSelector = createSelector(authByModuleIdSelector, (state) => state.error)

export const fetchedSelector = createSelector(authByModuleIdSelector, (state) => state.fetched)

export const accessTokenSelector = createSelector(authByModuleIdSelector, (state) => state.accessToken)

export const refreshTokenSelector = createSelector(authByModuleIdSelector, (state) => state.refreshToken)

export const expiresSelector = createSelector(authByModuleIdSelector, (state) => state.expires)

export const isAuthenticatedSelector = createSelector(authByModuleIdSelector, (state) => state.fetched)

export const authUrlSelector = createSelector(
  [getModuleId, getGalleryId, moduleSelector],
  (moduleId, galleryId, { authType }) => (authType ? `/${authType}/${moduleId}/${galleryId}` : null)
)

export const requiresAuthSelector = createSelector([moduleSelector], (module) => !!module.authType)
