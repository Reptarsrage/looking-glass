import React from 'react';
import ReactDOM from 'react-dom/client';
import invariant from 'tiny-invariant';

import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
invariant(rootElement, '"root" not found');

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
); // NOTE: Strict mode messes with react-spring onRest/onStart callbacks
