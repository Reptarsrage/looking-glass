import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import appReducer from './appReducer';
import authReducer from './authReducer';
import moduleReducer from './moduleReducer';
import galleryReducer from './galleryReducer';
import itemReducer from './itemReducer';

const rootReducer = (history, asyncReducers) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    app: appReducer,
    module: moduleReducer,
    gallery: galleryReducer,
    item: itemReducer,
    ...asyncReducers,
  });

export default rootReducer;
