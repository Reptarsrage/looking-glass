import {
  NAVIGATE_HOME,
  NAVIGATE_TO_SEARCH,
  NAVIGATE_FROM_SEARCH,
  NAVIGATE_GALLERY,
  NAVIGATE_BACK,
  NAVIGATE_BREADCRUMB,
} from './types';

export const navigateHome = () => ({
  type: NAVIGATE_HOME,
});

export const navigateToSearch = (moduleId) => ({
  type: NAVIGATE_TO_SEARCH,
  payload: { moduleId },
});

export const navigateFromSearch = (moduleId) => ({
  type: NAVIGATE_FROM_SEARCH,
  payload: { moduleId },
});

export const navigateToGallery = (moduleId, galleryId, title) => ({
  type: NAVIGATE_GALLERY,
  payload: { moduleId, galleryId, title },
});

export const navigateBack = () => ({
  type: NAVIGATE_BACK,
});

export const navigateToBreadcrumb = (breadcrumbId) => ({
  type: NAVIGATE_BREADCRUMB,
  payload: { breadcrumbId },
});
