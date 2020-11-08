import { createSelector } from 'reselect'

import { initialState, initialItemState } from 'reducers/itemReducer'
import { generateGalleryId } from 'reducers/constants'
import { byIdSelector as galleriesByIdSelector } from './gallerySelectors'
import { filterSectionByIdSelector } from './filterSectionSelectors'
import { stateSelector as filterStateSelector } from './filterSelectors'

const getItemId = (_, props) => props.itemId

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
export const itemFetchingFiltersSelector = createSelector(itemByIdSelector, (item) => item.fetchingFilters)

/** item filters are fetched */
export const itemFetchedFiltersSelector = createSelector(itemByIdSelector, (item) => item.fetchedFilters)

/** item filters error */
export const itemFetchFiltersErrorSelector = createSelector(itemByIdSelector, (item) => item.fetchFiltersError)

/** item filters */
export const itemFiltersSelector = createSelector(itemByIdSelector, (item) => item.filters)

/** item filters by section */
export const itemFiltersSectionSelector = createSelector(
  [itemByIdSelector, filterStateSelector, filterSectionByIdSelector],
  (item, filterState, filterSection) => {
    const values = item.filters.filter((id) => {
      if (id in filterState.byId) {
        return filterState.byId[id].filterSectionId === filterSection.id
      }

      console.warn('Filter not found', id)
      return false
    })

    return {
      ...filterSection,
      values,
    }
  }
)
