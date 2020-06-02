import 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import './index.scss';
import Routes from './Routes';
import { configureStore, history } from './store/configureStore';
import rootSaga from './sagas';

const store = configureStore();
store.runSaga(rootSaga);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
