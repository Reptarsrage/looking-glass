import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import Routes from './Routes'
import configureStore from './store/configureStore'
import rootSaga from './sagas'
import './titleBar'

const store = configureStore()
store.runSaga(rootSaga)

render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
