import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import Routes from './Routes';
import { configureStore, history } from './store/configureStore';
import rootSaga from './sagas';
import './index.css';

const store = configureStore();
store.runSaga(rootSaga);

const render = Component =>
  ReactDom.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );

render(Routes);

if (module.hot) {
  module.hot.accept('./Routes', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('./Routes').default;
    render(NextApp);
  });
}
