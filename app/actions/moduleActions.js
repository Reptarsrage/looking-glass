import { FETCH_MODULES, FETCH_GALLERY, UPDATE_SEARCH, ADD_GALLERY } from './types';

export const fetchModules = () => ({
  type: FETCH_MODULES,
});

export const addGallery = (moduleId, galleryId) => ({
  type: ADD_GALLERY,
  payload: { moduleId, galleryId },
});

export const fetchGallery = (moduleId, galleryId) => ({
  type: FETCH_GALLERY,
  payload: { moduleId, galleryId },
});

export const updateSearch = (query, moduleId, galleryId) => ({
  type: UPDATE_SEARCH,
  payload: query,
  meta: { moduleId, galleryId },
});
