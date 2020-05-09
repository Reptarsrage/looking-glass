import {
  FETCH_MODULES,
  FETCH_GALLERY,
  UPDATE_SEARCH,
  UPDATE_SORT,
  ADD_GALLERY,
  SEARCH_CHANGE,
  SORT_CHANGE,
  CLEAR_GALLERY,
  FILTER_CHANGE,
  UPDATE_FILTER,
} from './types';

export const fetchModules = () => ({
  type: FETCH_MODULES,
});

export const addGallery = (moduleId, galleryId, title) => ({
  type: ADD_GALLERY,
  payload: { moduleId, galleryId, title },
});

export const fetchGallery = (moduleId, galleryId) => ({
  type: FETCH_GALLERY,
  payload: { moduleId, galleryId },
});

export const clearGallery = galleryId => ({ type: CLEAR_GALLERY, payload: galleryId });

export const searchChange = (moduleId, galleryId, query) => ({
  type: SEARCH_CHANGE,
  payload: query,
  meta: { moduleId, galleryId },
});

export const updateSearch = (galleryId, query) => ({
  type: UPDATE_SEARCH,
  payload: query,
  meta: galleryId,
});

export const sortChange = (moduleId, galleryId, valueId) => ({
  type: SORT_CHANGE,
  payload: valueId,
  meta: { moduleId, galleryId },
});

export const updateSort = (galleryId, valueId) => ({
  type: UPDATE_SORT,
  payload: valueId,
  meta: galleryId,
});

export const filterChange = (moduleId, galleryId, filterId) => ({
  type: FILTER_CHANGE,
  payload: filterId,
  meta: { moduleId, galleryId },
});

export const updateFilter = (galleryId, filterId) => ({
  type: UPDATE_FILTER,
  payload: filterId,
  meta: galleryId,
});
