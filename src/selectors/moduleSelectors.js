import { createSelector } from 'reselect'

import { initialState, initialModuleState } from '../reducers/moduleReducer'

const getModuleId = (_, props) => props.moduleId

const moduleStateSelector = (state) => state.module || initialState

/** All modules */
export const modulesSelector = createSelector(moduleStateSelector, (state) => state.allIds)

/** Specific module */
export const moduleByIdSelector = createSelector(
  moduleStateSelector,
  getModuleId,
  (state, moduleId) => state.byId[moduleId] || initialModuleState
)

/** Have modules been fetched? */
export const fetchedSelector = createSelector(moduleStateSelector, (state) => state.fetched)

/** Are modules currently fetching? */
export const fetchingSelector = createSelector(moduleStateSelector, (state) => state.fetching)

/** Did we encounter an error while fetching modules? */
export const errorSelector = createSelector(moduleStateSelector, (state) => state.error)

/** Filter values configured for module */
export const filterBySelector = createSelector(moduleByIdSelector, (module) => module.filterBy)

/** Sort values configured for module */
export const sortBySelector = createSelector(moduleByIdSelector, (module) => module.sortBy)

/** Default gallery for this module */
export const defaultGalleryIdSelector = createSelector(moduleByIdSelector, (module) => module.defaultGalleryId)

/** Module supports sorting */
export const supportsSortingSelector = createSelector(
  moduleByIdSelector,
  (module) => (module.sortBy && module.sortBy.length > 0) || false
)

/** Module supports filtering */
export const supportsFilteringSelector = createSelector(
  moduleByIdSelector,
  (module) => (module.filterBy && module.filterBy.length > 0) || false
)

/** Module supports fetching filters for individual items */
export const itemFiltersEnabledSelector = createSelector(moduleByIdSelector, (module) => module.itemFiltersEnabled)
