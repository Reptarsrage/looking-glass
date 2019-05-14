import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { parse } from 'url';
import { remote } from 'electron';
import qs from 'qs';

import * as authActions from '../actions/authActions';
import WithErrors from '../hocs/WithErrors';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative'
  },
  progress: {
    top: '50%',
    left: '50%',
    color: 'white',
    position: 'absolute',
    marginLeft: '-12px'
  }
});

class OAuth extends React.Component {
  static showOauthModal() {
    return new Promise((resolve, reject) => {
      // TODO: load these values from service
      const urlParams = {
        client_id: 'W04e7edrJhsUTA',
        redirect_uri: 'http://localhost',
        response_type: 'code',
        state: 'test',
        duration: 'permanent',
        scope: 'identity read mysubreddits'
      };

      const authUrl = `https://www.reddit.com/api/v1/authorize.compact?${qs.stringify(urlParams)}`;
      const authWindow = new remote.BrowserWindow({
        parent: remote.getCurrentWindow(),
        modal: true,
        show: false,
        alwaysOnTop: true,
        autoHideMenuBar: true
      });

      const handleRedirect = url => {
        const { query } = parse(url, true);
        const { error, code } = query || {};

        authWindow.removeAllListeners('closed');
        setImmediate(() => authWindow.close());

        if (code) {
          resolve(code);
        } else {
          reject(new Error(error || 'Something went terribly wrong'));
        }
      };

      authWindow.on('closed', () => reject(new Error('Auth window was closed by user')));
      authWindow.webContents.on('will-redirect', (event, newUrl) => handleRedirect(newUrl));
      authWindow.webContents.on('will-navigate', (event, newUrl) => handleRedirect(newUrl));

      authWindow.loadURL(authUrl);
      authWindow.show();
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      error: null,
      success: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit() {
    this.setState({ fetching: true });

    try {
      // TODO: do something with token
      await this.constructor.showOauthModal();
      this.setState({ fetching: false, success: true });
    } catch (error) {
      this.setState({ error, fetching: false });
    }
  }

  render() {
    const { classes } = this.props;
    const { fetching, error, success } = this.state;

    if (success) {
      return <Redirect to="/gallery" />;
    }

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Authorize using OAuth2
          </Typography>
          {error && <Typography align="center" color="error" />}
          <div className={classes.wrapper}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={fetching}
              onClick={this.handleSubmit}
            >
              Authorize
            </Button>
            {fetching && <CircularProgress size={24} className={classes.progress} />}
          </div>
        </Paper>
      </main>
    );
  }
}

OAuth.defaultProps = {
  classes: {}
};

OAuth.propTypes = {
  classes: PropTypes.shape({})
};

const mapStateToProps = createStructuredSelector({
  // TODO
});

const mapDispatchToProps = {
  login: authActions.login
};

export default compose(
  WithErrors,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(withStyles(styles)(OAuth));
