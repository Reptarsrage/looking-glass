import {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_FAILURE,
  SEARCH_CHANGE,
  UPDATE_SEARCH,
  SORT_CHANGE,
  UPDATE_SORT,
  FILTER_CHANGE,
  UPDATE_FILTER,
  SAVE_SCROLL_POSITION,
  CLEAR_GALLERY,
} from './types';

export const fetchGallery = (galleryId) => ({
  type: FETCH_GALLERY,
  meta: galleryId,
});

export const clearGallery = (galleryId) => ({
  type: CLEAR_GALLERY,
  meta: galleryId,
});

export const fetchGallerySuccess = (galleryId, data) => ({
  type: FETCH_GALLERY_SUCCESS,
  payload: data,
  meta: galleryId,
});

export const fetchGalleryFailure = (galleryId, error) => ({
  type: FETCH_GALLERY_FAILURE,
  payload: error,
  meta: galleryId,
});

export const searchChange = (galleryId, searchQuery) => ({
  type: SEARCH_CHANGE,
  payload: searchQuery,
  meta: galleryId,
});

export const updateSearch = (galleryId, searchQuery) => ({
  type: UPDATE_SEARCH,
  payload: searchQuery,
  meta: galleryId,
});

export const saveScrollPosition = (galleryId, scrollPosition) => ({
  type: SAVE_SCROLL_POSITION,
  payload: scrollPosition,
  meta: galleryId,
});

export const sortChange = (galleryId, valueId) => ({
  type: SORT_CHANGE,
  payload: valueId,
  meta: galleryId,
});

export const updateSort = (galleryId, valueId) => ({
  type: UPDATE_SORT,
  payload: valueId,
  meta: galleryId,
});

export const filterChange = (galleryId, filterId) => ({
  type: FILTER_CHANGE,
  payload: filterId,
  meta: galleryId,
});

export const updateFilter = (galleryId, filterId) => ({
  type: UPDATE_FILTER,
  payload: filterId,
  meta: galleryId,
});
