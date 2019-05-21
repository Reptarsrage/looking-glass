import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { compose } from 'recompose';
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
import { successSelector, fetchingSelector, errorSelector, oauthURLSelector } from '../selectors/authSelectors';
import { moduleIdSelector } from '../selectors/appSelectors';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  progress: {
    top: '50%',
    left: '50%',
    color: 'white',
    position: 'absolute',
    marginLeft: '-12px',
  },
});

class OAuth extends React.Component {
  static showOauthModal(authUrl) {
    return new Promise((resolve, reject) => {
      // TODO: load these values from service
      const { state: expectedState } = qs.parse(authUrl);
      const authWindow = new remote.BrowserWindow({
        parent: remote.getCurrentWindow(),
        modal: true,
        show: false,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
          devTools: false,
        },
      });

      const handleRedirect = url => {
        const { query } = parse(url, true);
        const { state, code, error } = query || {};

        if (error) {
          reject(new Error(error));
        }

        if (state === expectedState && code) {
          authWindow.removeAllListeners('closed');
          setImmediate(() => authWindow.close());
          resolve(code);
        }
      };

      authWindow.on('closed', () => reject(new Error('Auth window was closed by user')));
      authWindow.webContents.on('will-redirect', (_, newUrl) => handleRedirect(newUrl));
      authWindow.webContents.on('will-navigate', (_, newUrl) => handleRedirect(newUrl));

      authWindow.loadURL(authUrl);
      authWindow.show();
    });
  }

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const { fetching, success, moduleId, fetchOAuthURL } = this.props;
    if (!fetching && !success) {
      fetchOAuthURL(moduleId);
    }
  }

  async handleSubmit() {
    const { authorize, moduleId, oauthURL } = this.props;

    this.setState({ fetching: true });

    try {
      const accessToken = await this.constructor.showOauthModal(oauthURL);
      authorize(moduleId, accessToken);
      this.setState({ fetching: false, success: true });
    } catch (error) {
      this.setState({ error, fetching: false });
    }
  }

  render() {
    const { classes, moduleId, fetching, error, success } = this.props;

    if (success) {
      return <Redirect to={`/gallery/${moduleId}/default`} />;
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
  error: null,
  oauthURL: null,
};

OAuth.propTypes = {
  moduleId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  oauthURL: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  oauthURL: oauthURLSelector(),
  success: successSelector(),
  fetching: fetchingSelector(),
  error: errorSelector(),
  moduleId: moduleIdSelector(),
});

const mapDispatchToProps = {
  authorize: authActions.authorize,
  fetchOAuthURL: authActions.fetchOAuthURL,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(OAuth);
