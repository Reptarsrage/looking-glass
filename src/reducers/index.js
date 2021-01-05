import { combineReducers } from 'redux'

import appReducer from './appReducer'
import authReducer from './authReducer'
import moduleReducer from './moduleReducer'
import galleryReducer from './galleryReducer'
import itemReducer from './itemReducer'
import sortReducer from './sortReducer'
import filterSectionReducer from './filterSectionReducer'
import filterReducer from './filterReducer'
import modalReducer from './modalReducer'

export default combineReducers({
  app: appReducer,
  auth: authReducer,
  module: moduleReducer,
  gallery: galleryReducer,
  item: itemReducer,
  sort: sortReducer,
  filterSection: filterSectionReducer,
  filter: filterReducer,
  modal: modalReducer,
})
