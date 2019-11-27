import { FETCH_MODULES, CLEAR_GALLERY } from './types';

export const fetchModules = () => ({
  type: FETCH_MODULES,
});

export const fetchGallery = galleryId => ({
  type: FETCH_MODULES,
  payload: galleryId,
});

export const clearGallery = galleryId => ({
  type: CLEAR_GALLERY,
  payload: galleryId,
});
