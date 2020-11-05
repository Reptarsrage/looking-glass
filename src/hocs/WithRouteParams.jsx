import React from 'react'
import { useParams } from 'react-router-dom'

const withRouteParams = (WrappedComponent) => (props) => {
  const routeParams = useParams()
  return <WrappedComponent {...props} {...routeParams} />
}

export default withRouteParams
