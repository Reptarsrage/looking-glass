import { createSelector } from 'reselect'

import { moduleAuthTypeSelector } from './moduleSelectors'

// select props
const getGalleryId = (_, props) => props.galleryId
const getModuleId = (_, props) => props.moduleId

// simple state selectors
export const byIdSelector = (state) => state.auth.byId
export const allIdsSelector = (state) => state.auth.allIds

// select from a specific module
export const authByModuleIdSelector = createSelector([byIdSelector, getModuleId], (byId, moduleId) => byId[moduleId])
export const fetchingSelector = createSelector(authByModuleIdSelector, (auth) => auth && auth.fetching)
export const errorSelector = createSelector(authByModuleIdSelector, (auth) => auth && auth.error)
export const fetchedSelector = createSelector(authByModuleIdSelector, (auth) => auth && auth.fetched)
export const accessTokenSelector = createSelector(authByModuleIdSelector, (auth) => auth && auth.accessToken)
export const refreshTokenSelector = createSelector(authByModuleIdSelector, (auth) => auth && auth.refreshToken)
export const expiresSelector = createSelector(authByModuleIdSelector, (auth) => auth && auth.expires)
export const requiresAuthSelector = createSelector([moduleAuthTypeSelector], Boolean)

// form auth url
export const authUrlSelector = createSelector(
  [getModuleId, getGalleryId, requiresAuthSelector, moduleAuthTypeSelector],
  (moduleId, galleryId, requiresAuth, authType) => (requiresAuth ? `/${authType}/${moduleId}/${galleryId}` : null)
)

// module needs authentication
export const isAuthenticatedSelector = createSelector(
  [requiresAuthSelector, fetchedSelector],
  (requiresAuth, fetched) => !requiresAuth || fetched || false
)
