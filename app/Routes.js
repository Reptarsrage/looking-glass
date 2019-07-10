import React from 'react';
import { Switch, Route } from 'react-router';

import App from './containers/App';
import Home from './containers/Home';
import Gallery from './containers/Gallery';
import Login from './containers/Login';
import OAuth from './containers/OAuth';
import About from './containers/About';
import NotFound from './containers/NotFound';
import WithTransition from './hocs/WithTransition';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={WithTransition(Home)} />
      <Route path="/login/:moduleId" component={WithTransition(Login)} />
      <Route path="/oauth/:moduleId" component={WithTransition(OAuth)} />
      <Route path="/gallery/:moduleId/:galleryId" component={WithTransition(Gallery)} />
      <Route path="/about" component={WithTransition(About)} />
      <Route path="*" component={WithTransition(NotFound)} />
    </Switch>
  </App>
);
