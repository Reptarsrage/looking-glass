import { createSelector } from 'reselect'

import { byIdSelector as filterByIdSelector } from './filterSelectors'
import { moduleFilterSectionsSelector } from './moduleSelectors'

// select props
const getFilterSectionId = (_, props) => props.filterSectionId
const getSearch = (_, props) => props.search

// simple state selectors
export const byIdSelector = (state) => state.filterSection.byId
export const allIdsSelector = (state) => state.filterSection.allIds

// select from a specific filter section
export const filterSectionSelector = createSelector(
  [byIdSelector, getFilterSectionId],
  (byId, filterSectionId) => byId[filterSectionId]
)

export const filterSectionSiteIdSelector = createSelector(filterSectionSelector, (section) => section.siteId)
export const filterSectionNameSelector = createSelector(filterSectionSelector, (section) => section.name)
export const filterSectionFetchingSelector = createSelector(filterSectionSelector, (section) => section.fetching)
export const filterSectionFetchedSelector = createSelector(filterSectionSelector, (section) => section.fetched)
export const filterSectionErrorSelector = createSelector(filterSectionSelector, (section) => section.errpr)
export const filterSectionDescriptionSelector = createSelector(filterSectionSelector, (section) => section.description)
export const filterSectionSupportsMultipleSelector = createSelector(
  filterSectionSelector,
  (section) => section.supportsMultiple
)
export const filterSectionSupportsSearchSelector = createSelector(
  filterSectionSelector,
  (section) => section.supportsSearch
)

export const filtersFetchingSelector = createSelector(
  [moduleFilterSectionsSelector, byIdSelector],
  (sectionIds, byId) => sectionIds.every((id) => byId[id].fetching)
)
export const filtersFetchedSelector = createSelector([moduleFilterSectionsSelector, byIdSelector], (sectionIds, byId) =>
  sectionIds.some((id) => byId[id].fetched)
)
export const filtersErrorSelector = createSelector([moduleFilterSectionsSelector, byIdSelector], (sectionIds, byId) =>
  sectionIds.find((id) => byId[id].error)
)
export const filterSectionModuleIdSelector = createSelector(filterSectionSelector, (section) => section.moduleId)

// select lengths of all sections for the given module
export const sectionCountsSelector = createSelector(
  [moduleFilterSectionsSelector, byIdSelector, filterByIdSelector, getSearch],
  (moduleFilterSectionIds, sectionById, filterById, searchQuery) => {
    if (searchQuery) {
      const upper = searchQuery.toUpperCase()
      return moduleFilterSectionIds.map(
        (filterSectionId) =>
          sectionById[filterSectionId].values.filter((filterId) =>
            filterById[filterId].name.toUpperCase().includes(upper)
          ).length
      )
    }

    return moduleFilterSectionIds.map((filterSectionId) => sectionById[filterSectionId].values.length)
  }
)

// select all item ids for the given section
export const sectionItemsSelector = createSelector(
  [filterSectionSelector, filterByIdSelector, getSearch],
  (section, filterById, searchQuery) => {
    let sectionItems = [...section.values]

    if (searchQuery) {
      const upper = searchQuery.toUpperCase()
      sectionItems = sectionItems.map((filterId) => ({
        index: filterById[filterId].name.toUpperCase().indexOf(upper),
        filterId,
      }))

      sectionItems = sectionItems.filter((item) => item.index >= 0)
      sectionItems.sort((a, b) => {
        const diff = a.index - b.index
        return diff || filterById[a.filterId].name.localeCompare(filterById[b.filterId].name)
      })
      sectionItems = sectionItems.map((item) => item.filterId)
    } else {
      // sort by name
      sectionItems.sort((a, b) => filterById[a].name.localeCompare(filterById[b].name))
    }

    return sectionItems
  }
)

// select a flat list of filterIds
export const sectionItemIdsSelector = createSelector(
  [moduleFilterSectionsSelector, byIdSelector, filterByIdSelector, getSearch],
  (moduleFilterSectionIds, sectionById, filterById, searchQuery) => {
    return moduleFilterSectionIds
      .map((filterSectionId) => {
        const section = sectionById[filterSectionId]
        let sectionItems = [...section.values]
        if (searchQuery) {
          const upper = searchQuery.toUpperCase()
          sectionItems = sectionItems.map((filterId) => ({
            index: filterById[filterId].name.toUpperCase().indexOf(upper),
            filterId,
          }))

          sectionItems = sectionItems.filter((item) => item.index >= 0)
          sectionItems.sort((a, b) => {
            const diff = a.index - b.index
            return diff || filterById[a.filterId].name.localeCompare(filterById[b.filterId].name)
          })
          sectionItems = sectionItems.map((item) => item.filterId)
        } else {
          // sort by name
          sectionItems.sort((a, b) => filterById[a].name.localeCompare(filterById[b].name))
        }

        return sectionItems
      })
      .flat()
  }
)
