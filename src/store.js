import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'

import rootReducer from 'reducers'
import rootSaga from './sagas'

const isDevelopment = process.env.NODE_ENV === 'development'

// Create saga middleware
const sagaMiddleware = createSagaMiddleware()

// Redux Configuration
const middleware = []
const enhancers = []

// Saga Middleware
middleware.push(sagaMiddleware)

// Logging Middleware
if (isDevelopment) {
  middleware.push(
    createLogger({
      level: 'info',
      collapsed: true,
    })
  )
}

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
const composeEnhancers =
  isDevelopment && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

// Apply Middleware & Compose Enhancers
enhancers.push(applyMiddleware(...middleware))
const enhancer = composeEnhancers(...enhancers)

// Create Store
const store = createStore(rootReducer, enhancer)

// Run sagas
sagaMiddleware.run(rootSaga)

export default store
