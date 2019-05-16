import React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/App';
import Gallery from './containers/Gallery';
import Login from './containers/Login';
import OAuth from './containers/OAuth';
import About from './containers/About';
import NotFound from './containers/NotFound';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={OAuth} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/gallery" component={Gallery} />
      <Route path="/about" component={About} />
      <Route path="*" component={NotFound} />
    </Switch>
  </App>
);
