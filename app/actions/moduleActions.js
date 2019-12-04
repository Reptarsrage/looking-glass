import { FETCH_MODULES, FETCH_GALLERY, UPDATE_SEARCH } from './types';

export const fetchModules = () => ({
  type: FETCH_MODULES,
});

export const fetchGallery = (moduleId, galleryId) => ({
  type: FETCH_GALLERY,
  payload: { moduleId, galleryId },
});

export const updateSearch = (query, galleryId) => ({
  type: UPDATE_SEARCH,
  payload: query,
  meta: { galleryId },
});
