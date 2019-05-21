import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import galleryReducer from './galleryReducer';
import authReducer from './authReducer';
import moduleReducer from './moduleReducer';
import appReducer from './appReducer';

const rootReducer = (history, asyncReducers) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    gallery: galleryReducer,
    module: moduleReducer,
    app: appReducer,
    ...asyncReducers,
  });

export default rootReducer;
