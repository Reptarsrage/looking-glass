import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { fetchedSelector, fetchingSelector, errorSelector } from '../selectors/authSelectors'
import * as authActions from '../actions/authActions'
import LoadingIndicator from '../components/LoadingIndicator'
import withRouteParams from '../hocs/WithRouteParams'

const ImplicitAuth = ({ login, fetching, error, fetched, moduleId, galleryId }) => {
  useEffect(() => {
    if (!fetching && !fetched) {
      login(moduleId, '', '')
    }
  }, [fetching, fetched, login, moduleId])

  if (fetched && !error) {
    return <Redirect to={`/gallery/${moduleId}/${galleryId}/`} />
  }

  return <LoadingIndicator />
}

ImplicitAuth.defaultProps = {
  error: null,
}

ImplicitAuth.propTypes = {
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired,
  fetched: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
}

const mapStateToProps = createStructuredSelector({
  fetched: fetchedSelector,
  fetching: fetchingSelector,
  error: errorSelector,
})

const mapDispatchToProps = {
  login: authActions.login,
}

export default withRouteParams(connect(mapStateToProps, mapDispatchToProps)(ImplicitAuth))
