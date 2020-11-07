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

        <Route path="/login/:moduleId/:galleryId" render={({ match }) => <Login {...match.params} />} />
        <Route path="/oauth/:moduleId/:galleryId" render={({ match }) => <OAuth {...match.params} />} />
        <Route path="/implicit/:moduleId/:galleryId" render={({ match }) => <ImplicitAuth {...match.params} />} />
        <Route path="/gallery/:moduleId/:galleryId" render={({ match }) => <Gallery {...match.params} />} />

        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </App>
  </HashRouter>
)

export default withErrorBoundary(Routes)
