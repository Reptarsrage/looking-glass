import { fromJS } from 'immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createLogger } from 'redux-logger';

import createRootReducer from '../reducers';

const sagaMiddleware = createSagaMiddleware();

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = initialState => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Saga Middleware
  middleware.push(sagaMiddleware);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, fromJS(initialState), enhancer);

  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {};
  store.close = () => store.dispatch(END);

  if (module.hot) {
    // Enable webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line global-require
      require('../reducers')
        /* eslint-disable-next-line promise/always-return */
        .then(reducerModule => {
          const createReducers = reducerModule.default;
          const nextReducers = createReducers(history, store.asyncReducers);
          store.replaceReducer(nextReducers);
        })
        .catch(console.error);
    });
  }

  return store;
};

export default { configureStore, history };
