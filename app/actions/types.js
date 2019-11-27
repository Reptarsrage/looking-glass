const actionTyper = (prefix = '', separator = '/') => {
  return new Proxy(
    {},
    {
      get(target, name) {
        return `${prefix}${separator}${name}`;
      },
    }
  );
};

export const { LOCATION_CHANGE } = actionTyper('@@router');

export const { TOGGLE_DARK_THEME, UPDATE_SEARCH } = actionTyper('app');

export const {
  FETCH_MODULES,
  FETCH_MODULES_SUCCESS,
  FETCH_MODULES_ERROR,
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  CLEAR_GALLERY,
  ADD_MODULE,
  REMOVE_MODULE,
  UPDATE_MODULE,
  ADD_GALLERY,
  REMOVE_GALLERY,
  UPDATE_GALLERY,
  ADD_IMAGE,
  REMOVE_IMAGE,
  UPDATE_IMAGE,
} = actionTyper('module');

export const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  FETCH_OATH_URL,
  FETCH_OATH_URL_SUCCESS,
  FETCH_OATH_URL_ERROR,
  REFRESH,
  REFRESH_SUCCESS,
  REFRESH_ERROR,
  AUTHORIZE,
  AUTHORIZE_SUCCESS,
  AUTHORIZE_ERROR,
} = actionTyper('auth');
