import { TOGGLE_DARK_THEME, SET_CURRENT_GALLERY } from './types';

export const toggleDarkTheme = () => ({
  type: TOGGLE_DARK_THEME,
});

export const setCurrentGallery = (moduleId, galleryId) => ({
  type: SET_CURRENT_GALLERY,
  payload: { moduleId, galleryId },
});
