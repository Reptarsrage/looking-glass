import { createSelector } from 'reselect'

import { initialState, initialSortState } from 'reducers/sortReducer'
import { currentSearchQuerySelector, currentSortSelector } from './gallerySelectors'
import { moduleSelector } from './moduleSelectors'

const getValueId = (_, props) => props.valueId

const stateSelector = (state) => state.sort || initialState

/** all Values */
export const valuesSelector = createSelector(stateSelector, (state) => state.allIds)

/** specific Value */
export const valueByIdSelector = createSelector(
  [stateSelector, getValueId, currentSearchQuerySelector],
  (state, valueId, searchQuery) => {
    const value = state.byId[valueId] || initialSortState
    if (!value.values) {
      return value
    }

    if (searchQuery) {
      return {
        ...value,
        values: value.values.filter((id) => state.byId[id].availableInSearch),
      }
    }

    return {
      ...value,
      values: value.values.filter((id) => !state.byId[id].exclusiveToSearch),
    }
  }
)

/** translate internal id to siteId */
export const valueSiteIdSelector = createSelector(valueByIdSelector, (value) => value && value.siteId)

/** all values for a given module */
export const moduleValuesSelector = createSelector(
  [moduleSelector, stateSelector, currentSearchQuerySelector],
  (module, sortState, searchQuery) => {
    if (searchQuery) {
      // different sort values when searching
      return module.sortBy.filter((id) => sortState.byId[id].availableInSearch)
    }

    // different sort values when not searching
    return module.sortBy.filter((id) => !sortState.byId[id].exclusiveToSearch)
  }
)

/** default value */
export const defaultSortValueSelector = createSelector(
  [moduleSelector, stateSelector, currentSearchQuerySelector],
  (module, sortState, searchQuery) => {
    let sortVals = sortState.allIds.filter((id) => sortState.byId[id].moduleId === module.id)
    if (searchQuery) {
      // different default sort value when searching
      sortVals = sortVals.filter((id) => sortState.byId[id].availableInSearch)
    } else {
      sortVals = sortVals.filter((id) => !sortState.byId[id].exclusiveToSearch)
    }

    // check un-nested first
    const defaultValueId = sortVals.find((id) => sortState.byId[id].default)
    if (!defaultValueId) {
      for (let i = 0; i < sortVals.length; i += 1) {
        const sortVal = sortVals[i]
        const nestedDefaultValueId = (sortState.byId[sortVal].values || []).find((id) => sortState.byId[id].default)
        if (nestedDefaultValueId) {
          return nestedDefaultValueId
        }
      }
    }

    return defaultValueId
  }
)

export const valueIsCurrentlySelectedSelector = createSelector(
  [defaultSortValueSelector, currentSortSelector, valueByIdSelector],
  (defaultValue, currentlySelectedValue, thisValue) => {
    if (currentlySelectedValue) {
      return (
        thisValue.id === currentlySelectedValue || (thisValue.values || []).some((id) => id === currentlySelectedValue)
      )
    }

    return thisValue.id === defaultValue || (thisValue.values || []).some(({ id }) => id === defaultValue)
  }
)
