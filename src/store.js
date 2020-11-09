import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'

import rootReducer from 'reducers'
import rootSaga from './sagas'

const isDevelopment = process.env.NODE_ENV === 'development'

// create saga middleware
const sagaMiddleware = createSagaMiddleware()

// redux Configuration
const middleware = []
const enhancers = []

// saga Middleware
middleware.push(sagaMiddleware)

// logging Middleware
if (isDevelopment) {
  middleware.push(
    createLogger({
      level: 'info',
      collapsed: true,
    })
  )
}

// if Redux DevTools Extension is installed use it, otherwise use Redux compose
const composeEnhancers =
  isDevelopment && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

// apply Middleware & Compose Enhancers
enhancers.push(applyMiddleware(...middleware))
const enhancer = composeEnhancers(...enhancers)

// create Store
const store = createStore(rootReducer, enhancer)

// run sagas
sagaMiddleware.run(rootSaga)

export default store
