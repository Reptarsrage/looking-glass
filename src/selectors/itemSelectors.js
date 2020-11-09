import { createSelector } from 'reselect'

import { initialState, initialItemState } from 'reducers/itemReducer'
import { generateGalleryId } from 'reducers/constants'
import { byIdSelector as galleriesByIdSelector } from './gallerySelectors'
import { moduleFilterSectionsSelector } from './moduleSelectors'
import { byIdSelector as filterByIdSelector } from './filterSelectors'

const getItemId = (_, props) => props.itemId
const getFilterSectionId = (_, props) => props.filterSectionId
const getSearch = (_, props) => props.search

export const itemsStateSelector = (state) => state.item || initialState

/** all items */
export const itemsSelector = createSelector(itemsStateSelector, (state) => state.allIds)

/** specific item */
export const itemByIdSelector = createSelector(
  [itemsStateSelector, getItemId],
  (state, itemId) => state.byId[itemId] || initialItemState
)

/** item siteId */
export const itemSiteIdSelector = createSelector(itemByIdSelector, (item) => item.siteId)

/** item dimensions */
export const itemDimensionsSelector = createSelector(itemByIdSelector, (item) => ({
  width: item.width,
  height: item.height,
}))

/** item gallery URL */
export const itemGalleryUrlSelector = createSelector(
  [itemByIdSelector, galleriesByIdSelector],
  (item, galleriesById) => {
    if (!item.isGallery) {
      return null
    }

    const { galleryId, siteId } = item
    const { moduleId } = galleriesById[galleryId]
    const itemGalleryId = generateGalleryId(moduleId, siteId)
    return `/gallery/${moduleId}/${itemGalleryId}`
  }
)

/** item filters are pending */
export const itemFetchingFiltersSelector = createSelector(itemByIdSelector, (item) => item.fetching)

/** item filters are fetched */
export const itemFetchedFiltersSelector = createSelector(itemByIdSelector, (item) => item.fetched)

/** item filters error */
export const itemFetchFiltersErrorSelector = createSelector(itemByIdSelector, (item) => item.error)

/** item filters */
export const itemFiltersSelector = createSelector(itemByIdSelector, (item) => item.filters)

export const itemFiltersSectionCountsSelector = createSelector(
  [moduleFilterSectionsSelector, itemFiltersSelector, filterByIdSelector, getSearch],
  (moduleFilterSectionIds, itemFilters, filterById, searchQuery) => {
    if (searchQuery) {
      // count the number of item filters in each section
      // but also filter on item filters matching the search query
      const upper = searchQuery.toUpperCase()
      return moduleFilterSectionIds.map(
        (filterSectionId) =>
          itemFilters.filter(
            (filterId) =>
              filterById[filterId].filterSectionId === filterSectionId &&
              filterById[filterId].name.toUpperCase().includes(upper)
          ).length
      )
    }

    // count the number of item filters in each section
    return moduleFilterSectionIds.map(
      (filterSectionId) =>
        itemFilters.filter((filterId) => filterById[filterId].filterSectionId === filterSectionId).length
    )
  }
)

export const itemFiltersSectionItemsSelector = createSelector(
  [itemFiltersSelector, filterByIdSelector, getFilterSectionId, getSearch],
  (itemFilters, filterById, filterSectionId, searchQuery) => {
    // filter down item filters to just one section
    let sectionItems = itemFilters.filter((filterId) => filterById[filterId].filterSectionId === filterSectionId)

    // filter on search
    if (searchQuery) {
      const upper = searchQuery.toUpperCase()
      sectionItems = sectionItems.filter((filterId) => filterById[filterId].name.toUpperCase().includes(upper))
    } else {
      // sort by name
      sectionItems.sort((a, b) => filterById[a].name.localeCompare(filterById[b].name))
    }

    return sectionItems
  }
)
