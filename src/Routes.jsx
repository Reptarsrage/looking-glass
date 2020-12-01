import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import App from './containers/App'
import Home from './containers/Home'
import Gallery from './containers/Gallery'
import Login from './containers/Login'
import OAuth from './containers/OAuth'
import ImplicitAuth from './containers/ImplicitAuth'
import NotFound from './containers/NotFound'
import withErrorBoundary from './hocs/WithErrorBoundary'

const Routes = () => (
  <HashRouter>
    <App>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/gallery/:moduleId/:galleryId">
          <Gallery />
        </Route>

        <Route path="/search/:moduleId/:galleryId">
          <Gallery />
        </Route>

        <Route path="/login/:moduleId/:galleryId">
          <Login />
        </Route>

        <Route path="/oauth/:moduleId/:galleryId">
          <OAuth />
        </Route>

        <Route path="/implicit/:moduleId/:galleryId">
          <ImplicitAuth />
        </Route>

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </App>
  </HashRouter>
)

export default withErrorBoundary(Routes)
