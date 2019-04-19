import React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/App';
import Gallery from './containers/Gallery';
import About from './containers/About';
import NotFound from './containers/NotFound';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={Gallery} />
      <Route path="/about" component={About} />
      <Route path="*" component={NotFound} />
    </Switch>
  </App>
);
