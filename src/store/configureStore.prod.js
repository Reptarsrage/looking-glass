import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'

import createRootReducer from '../reducers'

const sagaMiddleware = createSagaMiddleware()
const rootReducer = createRootReducer()
const enhancer = applyMiddleware(sagaMiddleware)

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  store.runSaga = sagaMiddleware.run
  store.asyncReducers = {}
  store.close = () => store.dispatch(END)
  return store
}

export default configureStore
