import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const styles = (theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
  info: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.text.light,
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
})

const EndOfScrollToast = ({ classes, message, onClose, open }) => (
  <Snackbar
    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
  >
    <SnackbarContent
      className={classes.info}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <InfoIcon className={clsx(classes.icon, classes.iconVariant)} />
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

EndOfScrollToast.defaultProps = {
  message: "You've reached the end!",
}

EndOfScrollToast.propTypes = {
  // required
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,

  // optional
  message: PropTypes.string,

  // withStyles
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(EndOfScrollToast)
