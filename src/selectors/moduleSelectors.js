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
  modules.sort((a, b) => byId[a].name.localeCompare(byId[b].name))
  return modules
})

// select from a specific module
export const moduleSelector = createSelector([byIdSelector, getModuleId], (byId, moduleId) => byId[moduleId])
export const moduleSiteIdSelector = createSelector(moduleSelector, (module) => module.siteId)
export const moduleNameSelector = createSelector(moduleSelector, (module) => module.name)
export const moduleDescriptionSelector = createSelector(moduleSelector, (module) => module.description)
export const moduleIconSelector = createSelector(moduleSelector, (module) => module.icon)
export const moduleOAuthUrlSelector = createSelector(moduleSelector, (module) => module.oAuthUrl)
export const moduleAuthTypeSelector = createSelector(moduleSelector, (module) => module.authType)
export const moduleFilterSectionsSelector = createSelector(moduleSelector, (module) => module.filters)
export const moduleSortSelector = createSelector(moduleSelector, (module) => module.sort)
export const moduleDefaultGalleryIdSelector = createSelector(moduleSelector, (module) => module.defaultGalleryId)
export const moduleSupportsItemFiltersSelector = createSelector(moduleSelector, (module) => module.supportsItemFilters)

// module supports sorting
export const moduleSupportsSortingSelector = createSelector(
  moduleSortSelector,
  (sort) => Array.isArray(sort) && sort.length > 0
)

// module supports filtering
export const moduleSupportsFilteringSelector = createSelector(
  moduleFilterSectionsSelector,
  (filters) => Array.isArray(filters) && filters.length > 0
)
