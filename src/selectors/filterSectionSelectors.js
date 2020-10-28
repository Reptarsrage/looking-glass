import { createSelector } from 'reselect'

import { initialState, initialFilterSectionState } from '../reducers/filterSectionReducer'
import { stateSelector as filterStateSelector } from './filterSelectors'

const getFilterSectionId = (_, props) => props.filterSectionId

const getSearch = (_, props) => props.search

const stateSelector = (state) => state.filterSection || initialState

/** All filter sections */
export const filterSectionsSelector = createSelector(stateSelector, (state) => state.allIds)

/** Specific filter section */
export const filterSectionByIdSelector = createSelector(
  [stateSelector, getFilterSectionId],
  (state, filterSectionId) => state.byId[filterSectionId] || initialFilterSectionState
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
