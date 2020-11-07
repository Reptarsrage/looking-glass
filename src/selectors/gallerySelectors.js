import { createSelector } from 'reselect'

import { initialState, initialGalleryState } from 'reducers/galleryReducer'

const getGalleryId = (_, props) => props.galleryId

export const galleriesStateSelector = (state) => state.gallery || initialState

/** specific gallery */
export const galleryByIdSelector = createSelector(
  [galleriesStateSelector, getGalleryId],
  (state, galleryId) => state.byId[galleryId] || initialGalleryState
)

/** gallery module ID */
export const galleryModuleIdSelector = createSelector(galleryByIdSelector, (gallery) => gallery.moduleId)

/** gallery site ID */
export const gallerySiteIdSelector = createSelector(galleryByIdSelector, (gallery) => gallery.siteId)

/** gallery after */
export const galleryAfterSelector = createSelector(galleryByIdSelector, (gallery) => gallery.after)

/** gallery offset */
export const galleryOffsetSelector = createSelector(galleryByIdSelector, (gallery) => gallery.offset)

/** all galleries */
export const galleriesSelector = createSelector(galleriesStateSelector, (state) => state.allIds)

/** all gallery items */
export const itemsInGallerySelector = createSelector(galleryByIdSelector, (gallery) => gallery.items)

/** gallery search query value */
export const currentSearchQuerySelector = createSelector(galleryByIdSelector, (gallery) => gallery.searchQuery)

/** gallery sort value */
export const currentSortSelector = createSelector(galleryByIdSelector, (gallery) => gallery.currentSort)

/** gallery filter value  */
export const currentFilterSelector = createSelector(galleryByIdSelector, (gallery) => gallery.currentFilter)

/** gallery saved scroll position */
export const savedScrollPositionSelector = createSelector(galleryByIdSelector, (gallery) => gallery.savedScrollPosition)
