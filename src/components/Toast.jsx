import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import PropTypes from 'prop-types'

const Toast = ({ message, onClose, open, severity }) => (
  <Snackbar
    anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
  >
    <Alert variant="outlined" severity={severity} onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
)

Toast.defaultProps = {
  severity: 'info',
}

Toast.propTypes = {
  // required
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,

  // optional
  severity: PropTypes.string,
}

export default Toast
