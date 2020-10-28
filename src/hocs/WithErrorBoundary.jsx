import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'

// See https://reactjs.org/docs/error-boundaries.html
const withErrorBoundary = (WrappedComponent) => {
  class WithErrorBoundary extends Component {
    constructor() {
      super()

      this.state = {
        error: null,
        errorInfo: null,
      }
    }

    componentDidCatch(error, errorInfo) {
      this.setState({
        error,
        errorInfo,
      })
    }

    handleClick = () => {
      this.setState({ error: null, errorInfo: null })
      window.location = '/'
    }

    render() {
      const { error, errorInfo } = this.state
      const { ...rest } = this.props

      return (
        <>
          {error ? (
            <>
              <Typography variant="h2">Something went wrong.</Typography>
              <Button color="primary" variant="contained" onClick={this.handleClick}>
                Take me home
                <HomeIcon />
              </Button>

              <Typography style={{ whiteSpace: 'pre-wrap' }}>
                {error.toString()}
                <br />
                {errorInfo.componentStack}
              </Typography>
            </>
          ) : (
            <WrappedComponent {...rest} />
          )}
        </>
      )
    }
  }

  return WithErrorBoundary
}

export default withErrorBoundary
