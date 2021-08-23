import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/core/Alert'
import PropTypes from 'prop-types'

export default function EndOfScrollToast({ message, onClose, open }) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert severity="info" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  )
}

EndOfScrollToast.defaultProps = {
  message: "You've reached the end!",
}

EndOfScrollToast.propTypes = {
  // required
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,

  // optional
  message: PropTypes.string,
}
