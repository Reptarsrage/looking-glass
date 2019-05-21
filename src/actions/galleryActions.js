import { FETCH_IMAGES } from './types';

/* eslint-disable-next-line import/prefer-default-export */
export const fetchImages = (moduleId, galleryId) => ({
  type: FETCH_IMAGES,
  meta: { moduleId, galleryId },
});
