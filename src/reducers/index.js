import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import appReducer from './appReducer';
import authReducer from './authReducer';
import moduleReducer from './moduleReducer';
import galleryReducer from './galleryReducer';
import itemReducer from './itemReducer';
import sortReducer from './sortReducer';
import filterSectionReducer from './filterSectionReducer';
import filterReducer from './filterReducer';
import modalReducer from './modalReducer';

const rootReducer = (history, asyncReducers) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    app: appReducer,
    module: moduleReducer,
    gallery: galleryReducer,
    item: itemReducer,
    sort: sortReducer,
    filterSection: filterSectionReducer,
    filter: filterReducer,
    modal: modalReducer,
    ...asyncReducers,
  });

export default rootReducer;
