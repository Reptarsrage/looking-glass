import {
  FETCH_MODULES,
  FETCH_GALLERY,
  UPDATE_SEARCH,
  UPDATE_SORT,
  ADD_GALLERY,
  SORT_CHANGE,
  CLEAR_GALLERY,
} from './types';

export const fetchModules = () => ({
  type: FETCH_MODULES,
});

export const addGallery = (moduleId, galleryId, siteId, title) => ({
  type: ADD_GALLERY,
  payload: { moduleId, galleryId, siteId, title },
});

export const fetchGallery = (moduleId, galleryId) => ({
  type: FETCH_GALLERY,
  payload: { moduleId, galleryId },
});

export const clearGallery = galleryId => ({ type: CLEAR_GALLERY, payload: galleryId });

export const updateSearch = (moduleId, galleryId, query) => ({
  type: UPDATE_SEARCH,
  payload: query,
  meta: { moduleId, galleryId },
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
