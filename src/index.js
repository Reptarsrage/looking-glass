import React from 'react';
import { render } from 'react-dom';
import * as serviceWorker from './serviceWorker';

import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import rootSaga from './sagas';
import './index.css';

const store = configureStore();
store.runSaga(rootSaga);

render(<Root store={store} history={history} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
