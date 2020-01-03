import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const WithErrors = WrappedComponent =>
  class ErrorBoundary extends Component {
    constructor() {
      super();

      this.state = {
        error: null,
        errorInfo: null,
      };
    }

    componentDidCatch(error, errorInfo) {
      this.setState({
        error,
        errorInfo,
      });
    }

    handleClick = () => {
      this.setState({ error: null, errorInfo: null });
    };

    render() {
      const { error, errorInfo } = this.state;

      return (
        <>
          {error ? (
            <>
              <Typography variant="h2">Something went wrong.</Typography>
              <Button color="primary" variant="contained" onClick={this.handleClick} component={Link} to="/">
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
            <WrappedComponent {...this.props} />
          )}
        </>
      );
    }
  };

export default WithErrors;
