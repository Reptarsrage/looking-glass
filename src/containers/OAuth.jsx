import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { compose } from 'redux'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import { parse } from 'url'
import { remote } from 'electron'
import qs from 'qs'

import * as authActions from 'actions/authActions'
import { fetchedSelector, fetchingSelector, errorSelector } from 'selectors/authSelectors'
import { moduleOAuthUrlSelector } from 'selectors/moduleSelectors'
import LoadingIndicator from 'components/LoadingIndicator'

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
})

const OAuth = ({ galleryId, fetching, fetched, moduleId, oAuthUrl, authorize, classes, error }) => {
  const [modalFetching, setModalFetching] = useState(false)

  const showOauthModal = (authUrl) => {
    return new Promise((resolve, reject) => {
      // TODO: load these values from service
      const { state: expectedState } = qs.parse(authUrl)
      const authWindow = new remote.BrowserWindow({
        parent: remote.getCurrentWindow(),
        modal: true,
        show: false,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
          devTools: false,
        },
      })

      const handleRedirect = (url) => {
        const { query } = parse(url, true)
        const { state, code, error: qError } = query || {}

        if (qError) {
          reject(new Error(qError))
        }

        if (state === expectedState && code) {
          authWindow.removeAllListeners('closed')
          setImmediate(() => authWindow.close())
          resolve(code)
        }
      }

      authWindow.on('closed', () => reject(new Error('Auth window was closed by user')))
      authWindow.webContents.on('will-redirect', (_, newUrl) => handleRedirect(newUrl))
      authWindow.webContents.on('will-navigate', (_, newUrl) => handleRedirect(newUrl))

      authWindow.loadURL(authUrl)
      authWindow.show()
    })
  }

  const handleSubmit = async () => {
    setModalFetching(true)

    try {
      const accessToken = await showOauthModal(oAuthUrl)
      authorize(moduleId, accessToken)
      setModalFetching(false)
    } catch (e) {
      setModalFetching(false)
    }
  }

  if (fetched) {
    // Redirect to whatever gallery the user was on before
    return <Redirect to={`/gallery/${moduleId}/${galleryId}/`} />
  }

  const isFetching = modalFetching || fetching

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Authorize using OAuth2
        </Typography>

        {error && (
          <Typography align="center" color="error">
            {JSON.stringify(error)}
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

          {isFetching && <LoadingIndicator size={24} className={classes.progress} />}
        </div>
      </Paper>
    </main>
  )
}

OAuth.defaultProps = {
  error: null,
}

OAuth.propTypes = {
  // Route params
  moduleId: PropTypes.string.isRequired,
  galleryId: PropTypes.string.isRequired,

  // withStyles
  classes: PropTypes.object.isRequired,

  // Selectors
  fetched: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  oAuthUrl: PropTypes.string.isRequired,
  error: PropTypes.object,

  // Actions
  authorize: PropTypes.func.isRequired,
}

const mapStateToProps = createStructuredSelector({
  oAuthUrl: moduleOAuthUrlSelector,
  fetched: fetchedSelector,
  fetching: fetchingSelector,
  error: errorSelector,
})

const mapDispatchToProps = {
  authorize: authActions.authorize,
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(OAuth)
