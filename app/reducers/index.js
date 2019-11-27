import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import appReducer from './appReducer';
import authReducer from './authReducer';
import moduleReducer from './moduleReducer';

const rootReducer = (history, asyncReducers) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    app: appReducer,
    module: moduleReducer,
    ...asyncReducers,
  });

export default rootReducer;
