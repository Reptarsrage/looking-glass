import { createSelector } from 'reselect'

// select props
const getGalleryId = (_, props) => props.galleryId

// simple state selectors
export const byIdSelector = (state) => state.gallery.byId
export const allIdsSelector = (state) => state.gallery.allIds

// select from a specific gallery
export const gallerySelector = createSelector([byIdSelector, getGalleryId], (byId, galleryId) => byId[galleryId])
export const galleryFetchingSelector = createSelector(gallerySelector, (gallery) => gallery.fetching)
export const galleryFetchedSelector = createSelector(gallerySelector, (gallery) => gallery.fetched)
export const galleryErrorSelector = createSelector(gallerySelector, (gallery) => gallery.error)
export const gallerySiteIdSelector = createSelector(gallerySelector, (gallery) => gallery.siteId)
export const galleryModuleIdSelector = createSelector(gallerySelector, (gallery) => gallery.moduleId)
export const galleryParentIdSelector = createSelector(gallerySelector, (gallery) => gallery.parentId)
export const galleryOffsetSelector = createSelector(gallerySelector, (gallery) => gallery.offset)
export const galleryAfterSelector = createSelector(gallerySelector, (gallery) => gallery.after)
export const galleryHasNextSelector = createSelector(gallerySelector, (gallery) => gallery.hasNext)
export const gallerySearchQuerySelector = createSelector(gallerySelector, (gallery) => gallery.searchQuery)
export const gallerySortSelector = createSelector(gallerySelector, (gallery) => gallery.currentSort)
export const galleryFilterSelector = createSelector(gallerySelector, (gallery) => gallery.currentFilter)
export const galleryItemsSelector = createSelector(gallerySelector, (gallery) => gallery.items)
export const galleryNameSelector = createSelector(gallerySelector, (gallery) => gallery.name)
export const gallerySavedScrollPositionSelector = createSelector(
  gallerySelector,
  (gallery) => gallery.savedScrollPosition
)
