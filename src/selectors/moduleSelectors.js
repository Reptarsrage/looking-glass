import { createSelector } from 'reselect'

// select props
const getModuleId = (_, props) => props.moduleId

// simple state selectors
export const byIdSelector = (state) => state.module.byId
export const allIdsSelector = (state) => state.module.allIds
export const fetchedSelector = (state) => state.module.fetched
export const fetchingSelector = (state) => state.module.fetching
export const errorSelector = (state) => state.module.error

// select all modules in sorted order
export const modulesSelector = createSelector([allIdsSelector, byIdSelector], (allIds, byId) => {
  const modules = [...allIds]
  modules.sort((a, b) => byId[a].title.localeCompare(byId[b].title))
  return modules
})

// select from a specific module
export const moduleSelector = createSelector([byIdSelector, getModuleId], (byId, moduleId) => byId[moduleId])
export const moduleSiteIdSelector = createSelector(moduleSelector, (module) => module.siteId)
export const moduleOAuthUrlSelector = createSelector(moduleSelector, (module) => module.oAuthUrl)
export const moduleFilterSectionsSelector = createSelector(moduleSelector, (module) => module.filterBy)
export const moduleSortBySelector = createSelector(moduleSelector, (module) => module.sortBy)
export const moduleDefaultGalleryIdSelector = createSelector(moduleSelector, (module) => module.defaultGalleryId)
export const moduleSupportsItemFiltersSelector = createSelector(moduleSelector, (module) => module.itemFiltersEnabled)

// module supports sorting
export const moduleSupportsSortingSelector = createSelector(
  moduleSortBySelector,
  (sortBy) => Array.isArray(sortBy) && sortBy.length > 0
)

// module supports filtering
export const moduleSupportsFilteringSelector = createSelector(
  moduleFilterSectionsSelector,
  (filterBy) => Array.isArray(filterBy) && filterBy.length > 0
)
