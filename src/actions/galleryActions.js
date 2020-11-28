import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_FAILURE,
  SEARCH_CHANGE,
  UPDATE_SEARCH,
  SORT_CHANGE,
  UPDATE_SORT,
  FILTER_ADDED,
  FILTER_REMOVED,
  ADD_FILTER,
  REMOVE_FILTER,
  SAVE_SCROLL_POSITION,
  CLEAR_GALLERY,
  SET_FILE_SYSTEM_DIRECTORY,
} from './types'

/**
 * fetches gallery items
 * @param {string|number} galleryId Gallery ID
 */
export const fetchGallery = (galleryId) => ({
  type: FETCH_GALLERY,
  meta: galleryId,
})

/**
 * removes all items from gallery
 * @param {string|number} galleryId Gallery ID
 */
export const clearGallery = (galleryId) => ({
  type: CLEAR_GALLERY,
  meta: galleryId,
})

/**
 * successfully fetched gallery items
 * @param {string|number} moduleId Module ID
 * @param {string|number} galleryId Gallery ID
 * @param {*} gallery Response data
 */
export const fetchGallerySuccess = (moduleId, galleryId, gallery) => ({
  type: FETCH_GALLERY_SUCCESS,
  payload: gallery,
  meta: { moduleId, galleryId },
})

/**
 * failed to fetch gallery items
 * @param {string|number} galleryId Gallery ID
 * @param {Error} error Error data
 */
export const fetchGalleryFailure = (galleryId, error) => ({
  type: FETCH_GALLERY_FAILURE,
  payload: error,
  meta: galleryId,
})

/**
 * user typed in search
 * @param {string|number} galleryId Gallery ID
 * @param {string} searchQuery Search query string
 */
export const searchChange = (galleryId, searchQuery) => ({
  type: SEARCH_CHANGE,
  payload: searchQuery,
  meta: galleryId,
})

/**
 * underlying gallery search query has been updated
 * @param {string|number} galleryId Gallery ID
 * @param {string} searchQuery Search query string
 */
export const updateSearch = (galleryId, searchQuery) => ({
  type: UPDATE_SEARCH,
  payload: searchQuery,
  meta: galleryId,
})

/**
 * saves gallery scroll position
 * @param {string|number} galleryId Gallery ID
 * @param {number} scrollPosition Scroll top value
 */
export const saveScrollPosition = (galleryId, scrollPosition) => ({
  type: SAVE_SCROLL_POSITION,
  payload: scrollPosition,
  meta: galleryId,
})

/**
 * user selected a new sort value
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} sortValueId Sort value ID
 */
export const sortChange = (galleryId, sortValueId) => ({
  type: SORT_CHANGE,
  payload: sortValueId,
  meta: galleryId,
})

/**
 * underlying gallery sort value has been updated
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} sortValueId Sort value ID
 */
export const updateSort = (galleryId, valueId) => ({
  type: UPDATE_SORT,
  payload: valueId,
  meta: galleryId,
})

/**
 * user selected a new filter value
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} filterId Filter ID
 */
export const filterAdded = (galleryId, filterId) => ({
  type: FILTER_ADDED,
  payload: filterId,
  meta: galleryId,
})

/**
 * user unselected a filter value
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} filterId Filter ID
 */
export const filterRemoved = (galleryId, filterId) => ({
  type: FILTER_REMOVED,
  payload: filterId,
  meta: galleryId,
})

/**
 * underlying gallery filter value has been added
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} filterId Filter ID
 */
export const addFilter = (galleryId, filterId) => ({
  type: ADD_FILTER,
  payload: filterId,
  meta: galleryId,
})

/**
 * underlying gallery filter value has been removed
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} filterId Filter ID
 */
export const removeFilter = (galleryId, filterId) => ({
  type: REMOVE_FILTER,
  payload: filterId,
  meta: galleryId,
})

/**
 * file system location has changed
 * @param {string} directoryPath Path of the directory to browse
 */
export const setFileSystemDirectory = (directoryPath) => ({
  type: SET_FILE_SYSTEM_DIRECTORY,
  payload: directoryPath,
})
