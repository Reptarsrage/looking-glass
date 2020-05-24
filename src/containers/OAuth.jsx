import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { compose } from 'redux';
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

import { moduleIdSelector, galleryIdSelector } from '../selectors/appSelectors';
import * as authActions from '../actions/authActions';
import {
  successSelector,
  fetchingSelector,
  errorSelector,
  oauthURLSelector,
  oauthURLFetchingSelector,
  oauthURLErrorSelector,
  oauthURLSuccessSelector,
} from '../selectors/authSelectors';

const styles = (theme) => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  wrapper: {
    margin: theme.spacing(1),
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

const OAuth = ({
  fetching,
  success,
  moduleId,
  fetchOAuthURL,
  authorize,
  oauthURL,
  classes,
  oauthURLSuccess,
  oauthURLFetching,
  oauthURLError,
  error,
  galleryId,
}) => {
  const [modalFetching, setModalFetching] = useState(false);

  useEffect(() => {
    if (!oauthURLFetching && !oauthURLSuccess) {
      fetchOAuthURL(moduleId);
    }
  });

  const showOauthModal = (authUrl) => {
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

      const handleRedirect = (url) => {
        const { query } = parse(url, true);
        const { state, code, error: qError } = query || {};

        if (qError) {
          reject(new Error(qError));
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
  };

  const handleSubmit = async () => {
    setModalFetching(true);

    try {
      const accessToken = await showOauthModal(oauthURL);
      authorize(moduleId, accessToken);
      setModalFetching(false);
    } catch (e) {
      setModalFetching(false);
    }
  };

  if (success) {
    // Redirect to whatever gallery the user was on before
    return <Redirect to={`/gallery/${moduleId}/${galleryId}/`} />;
  }

  const isFetching = oauthURLFetching || modalFetching || fetching;
  const isError = (oauthURLError || error) !== null; // TODO: get message out of error object

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Authorize using OAuth2
        </Typography>
        {isError && (
          <Typography align="center" color="error">
            {JSON.stringify(oauthURLError || error)}
          </Typography>
        )}
        <div className={classes.wrapper}>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={fetching}
            onClick={handleSubmit}
          >
            Authorize
          </Button>
          {isFetching && <CircularProgress size={24} className={classes.progress} />}
        </div>
      </Paper>
    </main>
  );
};

OAuth.defaultProps = {
  error: null,
  oauthURLError: null,
  oauthURL: null,
};

OAuth.propTypes = {
  authorize: PropTypes.func.isRequired,
  fetchOAuthURL: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  oauthURL: PropTypes.string,
  oauthURLSuccess: PropTypes.bool.isRequired,
  oauthURLFetching: PropTypes.bool.isRequired,
  oauthURLError: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  oauthURL: oauthURLSelector,
  success: successSelector,
  fetching: fetchingSelector,
  error: errorSelector,
  oauthURLFetching: oauthURLFetchingSelector,
  oauthURLError: oauthURLErrorSelector,
  oauthURLSuccess: oauthURLSuccessSelector,
  moduleId: moduleIdSelector,
  galleryId: galleryIdSelector,
});

const mapDispatchToProps = {
  authorize: authActions.authorize,
  fetchOAuthURL: authActions.fetchOAuthURL,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(OAuth);
