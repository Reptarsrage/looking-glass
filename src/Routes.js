import React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/App';
import Home from './containers/Home';
import Gallery from './containers/Gallery';
import Login from './containers/Login';
import OAuth from './containers/OAuth';
import About from './containers/About';
import NotFound from './containers/NotFound';
import WithRouteParameters from './hocs/WithRouteParameters';
import WithErrorBoundary from './hocs/WithErrorBoundary';

const Routes = () => (
  <App>
    <Switch>
      <Route exact path="/" component={WithErrorBoundary(Home)} />
      <Route path="/login/:moduleId/:galleryId" component={WithErrorBoundary(WithRouteParameters(Login))} />
      <Route path="/oauth/:moduleId/:galleryId" component={WithErrorBoundary(WithRouteParameters(OAuth))} />
      <Route path="/gallery/:moduleId/:galleryId" component={WithErrorBoundary(WithRouteParameters(Gallery))} />
      <Route path="/about" component={WithErrorBoundary(About)} />
      <Route path="*" component={WithErrorBoundary(NotFound)} />
    </Switch>
  </App>
);

export default Routes;
