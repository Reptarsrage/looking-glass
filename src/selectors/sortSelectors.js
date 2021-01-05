import { createSelector } from 'reselect'

// select props
const getModuleId = (_, props) => props.moduleId
const getValueId = (_, props) => props.valueId
const getSearch = (_, props) => props.search
const getSort = (_, props) => props.sort

// simple state selectors
export const byIdSelector = (state) => state.sort.byId
export const allIdsSelector = (state) => state.sort.allIds

// select all sort values in sorted order
export const valuesSelector = createSelector([allIdsSelector, byIdSelector], (allIds, byId) => {
  const values = [...allIds]
  values.sort((a, b) => byId[a].name.localeCompare(byId[b].name))
  return values
})

// select from a specific sort value
export const valueSelector = createSelector([byIdSelector, getValueId], (byId, valueId) => byId[valueId])
export const valueSiteIdSelector = createSelector(valueSelector, (value) => value.siteId)
export const valueNameSelector = createSelector(valueSelector, (value) => value.name)

export const nestedSelector = createSelector(
  [allIdsSelector, byIdSelector, getValueId, getSearch],
  (allIds, byId, valueId, searchQuery) => {
    let nested = allIds.filter((id) => byId[id].parentId === valueId)

    if (searchQuery) {
      nested = nested.filter((id) => byId[id].availableInSearch)
    } else {
      nested = nested.filter((id) => !byId[id].exclusiveToSearch)
    }

    nested.sort((a, b) => byId[a].name.localeCompare(byId[b].name))

    return nested
  }
)

/** all values for a given module */
export const moduleValuesSelector = createSelector(
  [getModuleId, allIdsSelector, byIdSelector, getSearch],
  (moduleId, allIds, byId, searchQuery) => {
    let values = allIds.filter((id) => byId[id].moduleId === moduleId && !byId[id].parentId)

    if (searchQuery) {
      values = values.filter((id) => byId[id].availableInSearch || byId[id].exclusiveToSearch)
    } else {
      values = values.filter((id) => !byId[id].exclusiveToSearch)
    }

    values.sort((a, b) => byId[a].name.localeCompare(byId[b].name))

    return values
  }
)

/** default value */
export const defaultSortValueSelector = createSelector(
  [getModuleId, allIdsSelector, byIdSelector, getSearch],
  (moduleId, allIds, byId, searchQuery) => {
    let values = allIds.filter((id) => byId[id].moduleId === moduleId)

    if (searchQuery) {
      values = values.filter((id) => byId[id].availableInSearch || byId[id].exclusiveToSearch)
    } else {
      values = values.filter((id) => !byId[id].exclusiveToSearch)
    }

    return values.find((id) => byId[id].isDefault)
  }
)

export const valueIsCurrentlySelectedSelector = createSelector(
  [defaultSortValueSelector, getSort, nestedSelector, getValueId],
  (defaultValue, currentlySelectedValue, nested, valueId) => {
    const currentValueId = currentlySelectedValue || defaultValue
    return valueId === currentValueId || nested.some(({ id }) => id === currentValueId)
  }
)
