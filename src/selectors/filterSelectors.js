import { createSelector } from 'reselect'

// select props
const getFilterId = (_, props) => props.filterId

// simple state selectors
export const byIdSelector = (state) => state.filter.byId
export const allIdsSelector = (state) => state.filter.allIds

// select from a specific filter
export const filterSelector = createSelector([byIdSelector, getFilterId], (byId, filterId) => byId[filterId])
export const filterSiteIdSelector = createSelector(filterSelector, (filter) => filter.siteId)
export const filterNameSelector = createSelector(filterSelector, (filter) => filter.name)
export const filterSectionIdSelector = createSelector(filterSelector, (filter) => filter.filterSectionId)
