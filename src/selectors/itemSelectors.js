import { createSelector } from 'reselect'

import { generateGalleryId } from 'reducers/constants'
import { byIdSelector as galleriesByIdSelector } from './gallerySelectors'
import { moduleFilterSectionsSelector } from './moduleSelectors'
import { byIdSelector as filterByIdSelector } from './filterSelectors'

// select props
const getItemId = (_, props) => props.itemId
const getFilterSectionId = (_, props) => props.filterSectionId
const getSearch = (_, props) => props.search

// simple state selectors
export const byIdSelector = (state) => state.item.byId
export const allIdsSelector = (state) => state.item.allIds

// select from a specific gallery
export const itemSelector = createSelector([byIdSelector, getItemId], (byId, itemId) => byId[itemId])
export const itemSiteIdSelector = createSelector(itemSelector, (item) => item.siteId)
export const itemGalleryIdSelector = createSelector(itemSelector, (item) => item.galleryId)
export const itemNameSelector = createSelector(itemSelector, (item) => item.name)
export const itemWidthSelector = createSelector(itemSelector, (item) => item.width)
export const itemHeightSelector = createSelector(itemSelector, (item) => item.height)
export const itemIsVideoSelector = createSelector(itemSelector, (item) => item.isVideo)
export const itemIsGallerySelector = createSelector(itemSelector, (item) => item.isGallery)
export const itemPosterSelector = createSelector(itemSelector, (item) => item.poster)
export const itemDateSelector = createSelector(itemSelector, (item) => item.date)
export const itemSourceSelector = createSelector(itemSelector, (item) => item.source)
export const itemAuthorSelector = createSelector(itemSelector, (item) => item.author)
export const itemFetchingFiltersSelector = createSelector(itemSelector, (item) => item.fetching)
export const itemFetchedFiltersSelector = createSelector(itemSelector, (item) => item.fetched)
export const itemFetchFiltersErrorSelector = createSelector(itemSelector, (item) => item.error)

// item filters
export const itemFiltersSelector = createSelector([itemSelector, filterByIdSelector], (item, filterById) => {
  const filters = [...item.filters]
  filters.sort((a, b) => filterById[a].name.localeCompare(filterById[b].name))
  return filters
})

// item dimensions
export const itemDimensionsSelector = createSelector([itemWidthSelector, itemHeightSelector], (width, height) => ({
  width,
  height,
}))

// item gallery URL
export const itemGalleryUrlSelector = createSelector(
  [itemIsGallerySelector, galleriesByIdSelector, itemGalleryIdSelector, itemSiteIdSelector],
  (isGallery, galleriesById, galleryId, siteId) => {
    if (!isGallery) {
      return null
    }

    const { moduleId } = galleriesById[galleryId]
    const itemGalleryId = generateGalleryId(moduleId, siteId)
    return `/gallery/${moduleId}/${itemGalleryId}`
  }
)

// item URLS
export const itemUrlsSelector = createSelector(itemSelector, (item) => {
  const urls = [...item.urls]
  urls.sort((a, b) => b.width - a.width)
  return urls
})

// item filter section counts
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

// item filter section filters
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
