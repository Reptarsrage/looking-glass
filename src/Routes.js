import React from 'react';
import { Switch, Route } from 'react-router';
import { hot } from 'react-hot-loader/root';

import App from './containers/App';
import Home from './containers/Home';
import Gallery from './containers/Gallery';
import Login from './containers/Login';
import OAuth from './containers/OAuth';
import About from './containers/About';
import NotFound from './containers/NotFound';
import WithTransition from './hocs/WithTransition';
import WithRouteParameters from './hocs/WithRouteParameters';

const Routes = () => (
  <App>
    <Switch>
      <Route exact path="/" component={WithTransition(Home)} />
      <Route path="/login/:moduleId" component={WithTransition(WithRouteParameters(Login))} />
      <Route path="/oauth/:moduleId" component={WithTransition(WithRouteParameters(OAuth))} />
      <Route path="/gallery/:moduleId/:galleryId" component={WithTransition(WithRouteParameters(Gallery))} />
      <Route path="/about" component={WithTransition(About)} />
      <Route path="*" component={WithTransition(NotFound)} />
    </Switch>
  </App>
);

export default hot(Routes);
