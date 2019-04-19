import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import galleryReducer from './galleryReducer';

const rootReducer = (history, asyncReducers) =>
  combineReducers({
    router: connectRouter(history),
    gallery: galleryReducer,
    ...asyncReducers
  });

export default rootReducer;
