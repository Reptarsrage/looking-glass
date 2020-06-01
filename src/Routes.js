import React from 'react';
import { Switch, Route } from 'react-router';
import { hot } from 'react-hot-loader/root';

import WithErrors from './hocs/WithErrors';
import App from './containers/App';
import Home from './containers/Home';
import Gallery from './containers/Gallery';
import Login from './containers/Login';
import OAuth from './containers/OAuth';
import About from './containers/About';
import NotFound from './containers/NotFound';
import WithRouteParameters from './hocs/WithRouteParameters';

const Routes = () => (
  <App>
    <Switch>
      <Route exact path="/" component={WithErrors(Home)} />
      <Route path="/login/:moduleId" component={WithRouteParameters(WithErrors(Login))} />
      <Route path="/oauth/:moduleId" component={WithRouteParameters(WithErrors(OAuth))} />
      <Route path="/gallery/:moduleId/:galleryId" component={WithRouteParameters(WithErrors(Gallery))} />
      <Route path="/about" component={WithErrors(About)} />
      <Route path="*" component={WithErrors(NotFound)} />
    </Switch>
  </App>
);

export default hot(Routes);
