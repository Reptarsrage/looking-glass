import { createSelector } from 'reselect'

import { initialState, initialFilterSectionState } from 'reducers/filterSectionReducer'
import { stateSelector as filterStateSelector } from './filterSelectors'

const getFilterSectionId = (_, props) => props.filterSectionId

const getSearch = (_, props) => props.search

const stateSelector = (state) => state.filterSection || initialState

/** all filter sections */
export const filterSectionsSelector = createSelector(stateSelector, (state) => state.allIds)

/** specific filter section */
export const filterSectionByIdSelector = createSelector(
  [stateSelector, getFilterSectionId],
  (state, filterSectionId) => state.byId[filterSectionId] || initialFilterSectionState
)

/** filter section site ID */
export const filterSectionSiteIdSelector = createSelector(
  filterSectionByIdSelector,
  (filterSection) => filterSection.siteId
)

/** filter section module ID */
export const filterSectionModuleIdSelector = createSelector(
  filterSectionByIdSelector,
  (filterSection) => filterSection.moduleId
)

export const filterSectionValuesSearchSelector = createSelector(
  [filterSectionByIdSelector, getSearch, filterStateSelector],
  (section, search, filterState) => {
    if (!search) {
      return section.values
    }

    const lower = search.toLowerCase()
    return section.values.filter((id) => filterState.byId[id].name.toLowerCase().includes(lower))
  }
)
