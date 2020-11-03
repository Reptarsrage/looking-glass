import React from 'react'
import { Router, Location } from '@reach/router'

import App from './containers/App'
import Home from './containers/Home'
import Gallery from './containers/Gallery'
import Login from './containers/Login'
import OAuth from './containers/OAuth'
import ImplicitAuth from './containers/ImplicitAuth'
import NotFound from './containers/NotFound'
import withErrorBoundary from './hocs/WithErrorBoundary'

const Routes = () => (
  <Location>
    {({ location }) => (
      <App>
        <Router
          location={location}
          style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', overflow: 'hidden' }}
        >
          <Home path="/" />
          <Login path="/login/:moduleId/:galleryId" />
          <OAuth path="/oauth/:moduleId/:galleryId" />
          <ImplicitAuth path="/implicit/:moduleId/:galleryId" />
          <Gallery path="/gallery/:moduleId/:galleryId" />
          <NotFound default />
        </Router>
      </App>
    )}
  </Location>
)

export default withErrorBoundary(Routes)
