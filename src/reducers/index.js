import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import galleryReducer from './galleryReducer';
import authReducer from './authReducer';

const rootReducer = (history, asyncReducers) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    gallery: galleryReducer,
    ...asyncReducers,
  });

export default rootReducer;
