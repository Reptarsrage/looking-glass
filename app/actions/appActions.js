import { TOGGLE_DARK_THEME, UPDATE_SEARCH } from './types';

export const toggleDarkTheme = () => ({
  type: TOGGLE_DARK_THEME,
});

export const updateSearch = (query, moduleId, galleryId) => ({
  type: UPDATE_SEARCH,
  payload: query,
  meta: { moduleId, galleryId },
});
