import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import App from './containers/App'
import Home from './containers/Home'
import Gallery from './containers/Gallery'
import Login from './containers/Login'
import OAuth from './containers/OAuth'
import ImplicitAuth from './containers/ImplicitAuth'
import NotFound from './containers/NotFound'
import withErrorBoundary from './hocs/WithErrorBoundary'

const Router = () => (
  <HashRouter>
    <App>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery/:moduleId/:galleryId" element={<Gallery />} />
        <Route path="/search/:moduleId/:galleryId" element={<Gallery />} />
        <Route path="/login/:moduleId/:galleryId" element={<Login />} />
        <Route path="/oauth/:moduleId/:galleryId" element={<OAuth />} />
        <Route path="/implicit/:moduleId/:galleryId" element={<ImplicitAuth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </App>
  </HashRouter>
)

export default withErrorBoundary(Router)
