import { createSelector } from 'reselect'

import { initialState, initialFilterState } from 'reducers/filterReducer'

const getFilterId = (_, props) => props.filterId

export const stateSelector = (state) => state.filter || initialState

/** all filters */
export const filtersSelector = createSelector(stateSelector, (state) => state.allIds)

/** specific filter */
export const filterByIdSelector = createSelector(
  [stateSelector, getFilterId],
  (state, filterId) => state.byId[filterId] || initialFilterState
)

/** site Id for a specific filter */
export const filterSiteIdSelector = createSelector(filterByIdSelector, (value) => value.siteId || undefined)
