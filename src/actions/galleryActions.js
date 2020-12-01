import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_FAILURE,
  SEARCH_CHANGE,
  SORT_CHANGE,
  FILTER_ADDED,
  FILTER_REMOVED,
  SAVE_SCROLL_POSITION,
  CLEAR_GALLERY,
  SET_FILE_SYSTEM_DIRECTORY,
} from './types'

/**
 * fetches gallery items
 * @param {string|number} galleryId Gallery ID
 * @param {string[]} filters Filters
 * @param {string} sort Sort value
 * @param {string} search Search query
 */
export const fetchGallery = (galleryId, filters, sort, search) => ({
  type: FETCH_GALLERY,
  payload: { filters, sort, search },
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
 * @param {Object} history Router history
 */
export const searchChange = (galleryId, searchQuery, history) => ({
  type: SEARCH_CHANGE,
  payload: searchQuery,
  meta: { galleryId, history },
})

/**
 * user selected a new sort value
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} sortValueId Sort value ID
 * @param {Object} history Router history
 */
export const sortChange = (galleryId, sortValueId, history) => ({
  type: SORT_CHANGE,
  payload: sortValueId,
  meta: { galleryId, history },
})

/**
 * user selected a new filter value
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} filterId Filter ID
 * @param {Object} history Router history
 */
export const filterAdded = (galleryId, filterId, history) => ({
  type: FILTER_ADDED,
  payload: filterId,
  meta: { galleryId, history },
})

/**
 * user unselected a filter value
 * @param {string|number} galleryId Gallery ID
 * @param {string|number} filterId Filter ID
 * @param {Object} history Router history
 */
export const filterRemoved = (galleryId, filterId, history) => ({
  type: FILTER_REMOVED,
  payload: filterId,
  meta: { galleryId, history },
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
 * file system location has changed
 * @param {string} directoryPath Path of the directory to browse
 */
export const setFileSystemDirectory = (directoryPath) => ({
  type: SET_FILE_SYSTEM_DIRECTORY,
  payload: directoryPath,
})
