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

export const { TOGGLE_DARK_THEME, UPDATE_SEARCH, SET_CURRENT_GALLERY } = actionTyper('app');

export const {
  ADD_GALLERY,
  FETCH_MODULES,
  FETCH_MODULES_SUCCESS,
  FETCH_MODULES_ERROR,
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_ERROR,
  CLEAR_GALLERY,
  UPDATE_SORT,
  SORT_CHANGE,
} = actionTyper('module');

export const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  FETCH_OATH_URL,
  FETCH_OATH_URL_SUCCESS,
  FETCH_OATH_URL_ERROR,
  REFRESH_SUCCESS,
  REFRESH_ERROR,
  AUTHORIZE,
  AUTHORIZE_SUCCESS,
  AUTHORIZE_ERROR,
} = actionTyper('auth');

export const { CLEAR_BREADCRUMBS, PUSH_BREADCRUMB, POP_BREADCRUMB } = actionTyper('breadcrumb');

export const {
  NAVIGATE_HOME,
  NAVIGATE_TO_SEARCH,
  NAVIGATE_FROM_SEARCH,
  NAVIGATE_GALLERY,
  NAVIGATE_BACK,
  NAVIGATE_BREADCRUMB,
} = actionTyper('navigation');
