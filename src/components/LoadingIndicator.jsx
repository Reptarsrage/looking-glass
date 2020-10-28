import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  wrapper: {
    margin: '0',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100px',
    minHeight: '100px',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
})

const LoadingIndicator = ({ classes, className, size }) => (
  <div className={className || classes.wrapper}>
    <CircularProgress size={size} />
  </div>
)

LoadingIndicator.defaultProps = {
  size: 100,
  className: null,
}

LoadingIndicator.propTypes = {
  // optional
  size: PropTypes.number,
  className: PropTypes.string,

  // withStyles
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(LoadingIndicator)
