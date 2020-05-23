import {
  TOGGLE_DARK_THEME,
  SET_CURRENT_GALLERY,
  FULL_SCREEN_TRANSITION_IN,
  FULL_SCREEN_TRANSITION_OUT,
  FULL_SCREEN_TRANSITION_OVER,
  FULL_SCREEN_ITEM_CHANGE,
} from './types';

export const toggleDarkTheme = () => ({
  type: TOGGLE_DARK_THEME,
});

export const setCurrentGallery = (moduleId, galleryId) => ({
  type: SET_CURRENT_GALLERY,
  payload: { moduleId, galleryId },
});

export const fullScreenItemChange = (itemId) => ({
  type: FULL_SCREEN_ITEM_CHANGE,
  payload: itemId,
});

export const fullScreenTransitionIn = (itemId) => ({
  type: FULL_SCREEN_TRANSITION_IN,
  payload: itemId,
});

export const fullScreenTransitionOut = () => ({
  type: FULL_SCREEN_TRANSITION_OUT,
});

export const fullScreenTransitionOver = () => ({
  type: FULL_SCREEN_TRANSITION_OVER,
});
