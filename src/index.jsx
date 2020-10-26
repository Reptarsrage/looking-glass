import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import './index.css';
import Routes from './Routes';
import { configureStore, history } from './store/configureStore';
import rootSaga from './sagas';
import './titleBar';

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

if (module.hot) {
  module.hot.accept('./Routes', () => {
    render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
}
