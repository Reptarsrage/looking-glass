import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import { parse } from 'url'
import { BrowserWindow, getCurrentWindow } from '@electron/remote'
import qs from 'qs'

import { authorize } from 'actions/authActions'
import { fetchedSelector, fetchingSelector, errorSelector } from 'selectors/authSelectors'
import { moduleOAuthUrlSelector } from 'selectors/moduleSelectors'
import LoadingIndicator from 'components/LoadingIndicator'

const useStyles = makeStyles((theme) => ({
  main: {
    width: 'auto',
    display: 'block', // fix IE 11 issue.
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
}))

export default function OAuth() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { moduleId, galleryId } = useParams()
  const [modalFetching, setModalFetching] = useState(false)
  const oAuthUrl = useSelector((state) => moduleOAuthUrlSelector(state, { moduleId }))
  const fetched = useSelector((state) => fetchedSelector(state, { moduleId }))
  const fetching = useSelector((state) => fetchingSelector(state, { moduleId }))
  const error = useSelector((state) => errorSelector(state, { moduleId }))

  const showOauthModal = (authUrl) => {
    return new Promise((resolve, reject) => {
      // TODO: load these values from service
      const { state: expectedState } = qs.parse(authUrl)
      const authWindow = new BrowserWindow({
        parent: getCurrentWindow(),
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

  const handleSubmit = useCallback(async () => {
    setModalFetching(true)

    try {
      const accessToken = await showOauthModal(oAuthUrl)
      dispatch(authorize(moduleId, accessToken))
      setModalFetching(false)
    } catch (e) {
      setModalFetching(false)
    }
  }, [moduleId, oAuthUrl])

  if (fetched) {
    // redirect to whatever gallery the user was on before
    return <Navigate to={`/gallery/${moduleId}/${galleryId}`} />
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
