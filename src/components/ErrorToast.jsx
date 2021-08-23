import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import { makeStyles } from '@material-ui/styles'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    marginRight: theme.spacing(1),
    opacity: 0.9,
  },
  message: {
    alignItems: 'center',
    display: 'flex',
  },
}))

export default function ErrorToast({ message, onClose, open }) {
  const classes = useStyles()

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <SnackbarContent
        className={classes.error}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  )
}

ErrorToast.defaultProps = {
  message: 'An error occurred',
}

ErrorToast.propTypes = {
  // required
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,

  // optional
  message: PropTypes.string,
}
