import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useParams } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { makeStyles } from '@mui/styles'

import { fetchedSelector, fetchingSelector, errorSelector } from 'selectors/authSelectors'
import { login } from 'actions/authActions'
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
  form: {
    width: '100%', // fix IE 11 issue.
    marginTop: theme.spacing(1),
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

export default function Login() {
  const { moduleId, galleryId } = useParams()
  const classes = useStyles()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const fetched = useSelector((state) => fetchedSelector(state, { moduleId }))
  const fetching = useSelector((state) => fetchingSelector(state, { moduleId }))
  const error = useSelector((state) => errorSelector(state, { moduleId }))
  const dispatch = useDispatch()

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleRememberMeChange = useCallback((event) => {
    setRememberMe(event.target.checked)
  }, [])

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value)
  }, [])

  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    (event) => {
      dispatch(login(moduleId, username, password))
      event.preventDefault()
    },
    [moduleId, username, password]
  )

  if (fetched) {
    // redirect to whatever gallery the user was on before
    return <Navigate to={`/gallery/${moduleId}/${galleryId}/`} />
  }

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Typography align="center" color="error" />}
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl margin="normal" required fullWidth disabled={fetching}>
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth disabled={fetching} error={error !== null}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete={showPassword ? 'off' : 'current-password'}
              aria-describedby="component-error-text"
              value={password}
              onChange={handlePasswordChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={handleClickShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText id="component-error-text">
              {error && 'An error occurred. Please check your username and password and try again.'}
            </FormHelperText>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                disabled={fetching}
              />
            }
            label="Remember me"
          />
          <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={fetching}
            >
              Sign in
            </Button>
            {fetching && <LoadingIndicator size={24} className={classes.progress} />}
          </div>
        </form>
      </Paper>
    </main>
  )
}
