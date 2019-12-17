import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import appReducer from './appReducer';
import authReducer from './authReducer';
import moduleReducer from './moduleReducer';
import galleryReducer from './galleryReducer';
import itemReducer from './itemReducer';
import galleryItemReducer from './galleryItemReducer';
import moduleGalleryReducer from './moduleGalleryReducer';

const rootReducer = (history, asyncReducers) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    app: appReducer,
    module: moduleReducer,
    gallery: galleryReducer,
    item: itemReducer,
    galleryItem: galleryItemReducer,
    moduleGallery: moduleGalleryReducer,
    ...asyncReducers,
  });

export default rootReducer;
