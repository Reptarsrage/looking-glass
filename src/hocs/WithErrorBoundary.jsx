import React, { Component } from 'react'
import Error from 'components/Error'

// see https://reactjs.org/docs/error-boundaries.html
const withErrorBoundary = (WrappedComponent) => {
  class WithErrorBoundary extends Component {
    constructor() {
      super()

      this.state = {
        error: null,
      }
    }

    componentDidCatch(error) {
      this.setState({
        error,
      })
    }

    handleClick = () => {
      this.setState({ error: null })
      window.location = '/'
    }

    render() {
      const { error } = this.state
      const { ...rest } = this.props

      return <>{error ? <Error /> : <WrappedComponent {...rest} />}</>
    }
  }

  return WithErrorBoundary
}

export default withErrorBoundary
