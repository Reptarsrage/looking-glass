import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { createHashHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'

import createRootReducer from '../reducers'

const sagaMiddleware = createSagaMiddleware()
const history = createHashHistory()
const rootReducer = createRootReducer(history)
const router = routerMiddleware(history)
const enhancer = applyMiddleware(sagaMiddleware, router)

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)
  store.runSaga = sagaMiddleware.run
  store.asyncReducers = {}
  store.close = () => store.dispatch(END)
  return store
}

export default { configureStore, history }
