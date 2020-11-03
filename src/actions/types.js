const actionTyper = (prefix = '', separator = '/') =>
  new Proxy(
    {},
    {
      get: (_, name) => `${prefix}${separator}${name}`,
    }
  )

export const { TOGGLE_DARK_THEME } = actionTyper('app')

export const { MODAL_OPEN, MODAL_BOUNDS_UPDATE, MODAL_CLOSE, MODAL_CLEAR, MODAL_SET_ITEM } = actionTyper('modal')

export const {
  FETCH_GALLERY,
  FETCH_GALLERY_SUCCESS,
  FETCH_GALLERY_FAILURE,
  SEARCH_CHANGE,
  UPDATE_SEARCH,
  SORT_CHANGE,
  UPDATE_SORT,
  FILTER_CHANGE,
  UPDATE_FILTER,
  SAVE_SCROLL_POSITION,
  CLEAR_GALLERY,
  SET_FILE_SYSTEM_DIRECTORY,
} = actionTyper('gallery')

export const { FETCH_MODULES, FETCH_MODULES_SUCCESS, FETCH_MODULES_FAILURE } = actionTyper('module')

export const {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  FETCH_OATH_URL,
  FETCH_OATH_URL_SUCCESS,
  FETCH_OATH_URL_FAILURE,
  REFRESH_SUCCESS,
  REFRESH_FAILURE,
  AUTHORIZE,
  AUTHORIZE_SUCCESS,
  AUTHORIZE_FAILURE,
} = actionTyper('auth')

export const {
  FETCH_FILTERS,
  FETCH_FILTERS_SUCCESS,
  FETCH_FILTERS_FAILURE,
  FETCH_ITEM_FILTERS,
  FETCH_ITEM_FILTERS_SUCCESS,
  FETCH_ITEM_FILTERS_FAILURE,
} = actionTyper('filter')
