import { TOGGLE_DARK_THEME, SET_CURRENT_GALLERY } from './types';

// eslint-disable-next-line import/prefer-default-export
export const toggleDarkTheme = () => ({
  type: TOGGLE_DARK_THEME,
});

export const setCurrentGallery = (moduleId, galleryId) => ({
  type: SET_CURRENT_GALLERY,
  payload: { moduleId, galleryId },
});
