import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createMemorySource, createHistory, LocationProvider } from '@reach/router'

import './index.css'
import Routes from './Routes'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import './titleBar'

const source = createMemorySource('/')
const history = createHistory(source)

const store = configureStore()
store.runSaga(rootSaga)

render(
  <React.StrictMode>
    <Provider store={store}>
      <LocationProvider history={history}>
        <Routes />
      </LocationProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
